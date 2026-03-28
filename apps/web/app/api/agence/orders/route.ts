import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore } from "@/lib/dev/data-store";
import { z } from "zod";

const createAgencyProjectSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  client: z.string().optional(),
  description: z.string().max(5000).optional(),
  deadline: z.string().optional(),
  budget: z.number().positive().optional(),
  priority: z.enum(["urgent", "normal", "faible"]).optional(),
});

// POST /api/agence/orders — Create an internal agency project (manual, not from a service order)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const result = createAgencyProjectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, client, description, deadline, budget, priority } = result.data;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      // Dev mode: create a synthetic order in the dev store
      const deadlineDate = deadline
        ? new Date(deadline).toISOString().slice(0, 10)
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      const order = orderStore.create({
        serviceId: `agency-project-${Date.now()}`,
        serviceTitle: title,
        category: "Projet agence",
        clientId: session.user.id,
        clientName: client || "Client interne",
        clientAvatar: (client || "CI").slice(0, 2).toUpperCase(),
        clientCountry: "",
        freelanceId: session.user.id,
        freelanceName: session.user.name || "Agence",
        status: "en_attente",
        amount: budget ?? 0,
        commission: 0,
        packageType: "standard",
        requirements: description || undefined,
        deadline: deadlineDate,
        deliveredAt: null,
        completedAt: null,
        progress: 0,
        revisionsLeft: 0,
        messages: [],
        timeline: [
          {
            id: `t${Date.now()}`,
            type: "created" as const,
            title: "Projet créé",
            description: `${title} — priorité ${priority ?? "normal"}`,
            timestamp: new Date().toISOString(),
          },
        ],
        files: [],
      });

      return NextResponse.json({ order }, { status: 201 });
    }

    // Production: Prisma — create an Order record linked to the agency
    const agencyProfile = await prisma.agencyProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!agencyProfile) {
      return NextResponse.json({ error: "Profil agence introuvable" }, { status: 404 });
    }

    const deadlineDate = deadline ? new Date(deadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        agencyId: agencyProfile.id,
        clientId: session.user.id,
        freelanceId: session.user.id,
        // serviceId is required — use a placeholder for manual agency projects
        title,
        description: description || null,
        status: "EN_ATTENTE",
        amount: budget ?? 0,
        currency: "EUR",
        commission: 0,
        platformFee: 0,
        freelancerPayout: budget ?? 0,
        packageType: "standard",
        requirements: [
          client ? `Client: ${client}` : null,
          priority ? `Priorité: ${priority}` : null,
          description || null,
        ]
          .filter(Boolean)
          .join("\n") || null,
        deliveryDays: Math.max(1, Math.round((deadlineDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))),
        deadline: deadlineDate,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[API /agence/orders POST]", error);
    return NextResponse.json({ error: "Erreur lors de la création du projet" }, { status: 500 });
  }
}
