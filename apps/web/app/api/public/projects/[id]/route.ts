import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { projectStore } from "@/lib/dev/data-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const project = projectStore.getById(id);
      if (!project || project.status === "brouillon") {
        return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
      }
      return NextResponse.json({ project });
    }

    // Production: Prisma
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, image: true, country: true },
        },
        _count: { select: { bids: true } },
      },
    });

    if (!project || project.status === "brouillon") {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      project: {
        id: project.id,
        clientId: project.clientId,
        clientName: project.client?.name || "Client",
        clientCountry: project.client?.country || "",
        clientAvatar: project.client?.image || "",
        title: project.title,
        description: project.description,
        category: project.category,
        budgetMin: project.budgetMin,
        budgetMax: project.budgetMax,
        deadline: project.deadline.toISOString(),
        urgency: project.urgency,
        contractType: project.contractType,
        skills: project.skills,
        status: project.status,
        visibility: project.visibility,
        proposals: project._count.bids,
        postedAt: project.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[API /public/projects/[id] GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
