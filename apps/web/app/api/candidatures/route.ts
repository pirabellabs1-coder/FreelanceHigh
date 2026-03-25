import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { candidatureStore, projectStore } from "@/lib/dev/data-store";
import { canApply, normalizePlanName, getPlanLimits, formatLimit } from "@/lib/plans";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const userRole = (session.user.role || "").toLowerCase();
      if (userRole === "client") {
        // Client sees candidatures on their projects
        const { projectStore: ps } = await import("@/lib/dev/data-store");
        const projects = ps.getAll().filter((p) => p.clientId === session.user.id);
        const projectIds = new Set(projects.map((p) => p.id));
        const allCandidatures = candidatureStore.getAll().filter((c) => projectIds.has(c.projectId));
        // Enrich with freelance info
        const { devStore: ds } = await import("@/lib/dev/dev-store");
        const enriched = allCandidatures.map((c) => {
          const freelancer = ds.findById(c.freelanceId);
          const fName = freelancer?.name || "Freelance";
          const initials = fName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
          return {
            ...c,
            freelanceName: fName,
            freelanceAvatar: initials,
            freelanceCountry: freelancer?.country || "",
          };
        });
        return NextResponse.json({ candidatures: enriched });
      }
      const candidatures = candidatureStore.getByFreelance(session.user.id);
      return NextResponse.json({ candidatures });
    }

    // Prisma — use ProjectBid which has relation to Project
    const candidatures = await prisma.projectBid.findMany({
      where: { freelanceId: session.user.id },
      include: { project: { select: { title: true, clientId: true, category: true, budgetMin: true, budgetMax: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      candidatures: candidatures.map((c) => ({
        id: c.id,
        projectId: c.projectId,
        projectTitle: c.project?.title || "",
        clientName: "",
        freelanceId: c.freelanceId,
        motivation: c.coverLetter || "",
        proposedPrice: c.amount,
        deliveryDays: c.deliveryDays,
        status: c.status,
        submittedAt: c.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[API /candidatures GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des candidatures" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, motivation, proposedPrice, deliveryDays } = body;

    if (!projectId || !motivation || !proposedPrice || !deliveryDays) {
      return NextResponse.json(
        { error: "Champs requis manquants: projectId, motivation, proposedPrice, deliveryDays" },
        { status: 400 }
      );
    }

    // --- Plan enforcement: check application limit ---
    const userPlan = normalizePlanName(session.user.plan);
    const planLimits = getPlanLimits(userPlan);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const allCandidatures = candidatureStore.getByFreelance(session.user.id);
      const monthlyCount = allCandidatures.filter(
        (c) => new Date(c.submittedAt) >= monthStart
      ).length;
      if (!canApply(userPlan, monthlyCount)) {
        return NextResponse.json(
          {
            error: `Limite de candidatures atteinte pour ce mois (${formatLimit(planLimits.applicationLimit)}/mois pour le plan ${planLimits.name}). Passez à un plan supérieur pour envoyer plus de candidatures.`,
            code: "APPLICATION_LIMIT_REACHED",
            limit: planLimits.applicationLimit,
            used: monthlyCount,
          },
          { status: 403 }
        );
      }

      const project = projectStore.getById(projectId);
      if (!project) {
        return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
      }

      const candidature = candidatureStore.create({
        projectId,
        projectTitle: project.title,
        clientName: project.clientName,
        freelanceId: session.user.id,
        motivation,
        proposedPrice: Number(proposedPrice),
        deliveryDays: Number(deliveryDays),
      });

      projectStore.incrementProposals(projectId);
      return NextResponse.json({ candidature }, { status: 201 });
    }

    // Prisma — use ProjectBid
    const monthlyCount = await prisma.projectBid.count({
      where: {
        freelanceId: session.user.id,
        createdAt: { gte: monthStart },
      },
    });
    if (!canApply(userPlan, monthlyCount)) {
      return NextResponse.json(
        {
          error: `Limite de candidatures atteinte pour ce mois (${formatLimit(planLimits.applicationLimit)}/mois pour le plan ${planLimits.name}). Passez à un plan supérieur.`,
          code: "APPLICATION_LIMIT_REACHED",
          limit: planLimits.applicationLimit,
          used: monthlyCount,
        },
        { status: 403 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    const candidature = await prisma.projectBid.create({
      data: {
        projectId,
        freelanceId: session.user.id,
        amount: Number(proposedPrice),
        deliveryDays: Number(deliveryDays),
        coverLetter: motivation,
        status: "en_attente",
      },
    });

    return NextResponse.json({ candidature }, { status: 201 });
  } catch (error) {
    console.error("[API /candidatures POST]", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la candidature" },
      { status: 500 }
    );
  }
}
