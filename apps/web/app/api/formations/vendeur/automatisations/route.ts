import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import { AutomationTriggerType, WorkflowStatus } from "@prisma/client";

async function getProfileId(userId: string) {
  const p = await prisma.instructeurProfile.findUnique({ where: { userId }, select: { id: true } });
  return p?.id ?? null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-instructeur-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const pid = await getProfileId(userId);
    if (!pid) return NextResponse.json({ data: { workflows: [], sequences: [] } });

    const [workflows, sequences] = await Promise.all([
      prisma.automationWorkflow.findMany({
        where: { instructeurId: pid },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { logs: true } } },
      }),
      prisma.emailSequence.findMany({
        where: { instructeurId: pid },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { steps: true, enrollments: true } } },
      }),
    ]);

    return NextResponse.json({ data: { workflows, sequences } });
  } catch (err) {
    console.error("[automatisations GET]", err);
    return NextResponse.json({ data: { workflows: [], sequences: [] } });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-instructeur-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const pid = await getProfileId(userId);
    if (!pid) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const body = await request.json();
    const { name, description, triggerType, actions, conditions } = body;

    if (!name || !triggerType) {
      return NextResponse.json({ error: "Nom et déclencheur requis" }, { status: 400 });
    }

    const workflow = await prisma.automationWorkflow.create({
      data: {
        instructeurId: pid,
        name: name.trim(),
        description: description?.trim() || null,
        triggerType: triggerType as AutomationTriggerType,
        actions: actions ?? [],
        conditions: conditions ?? null,
        status: "DRAFT" as WorkflowStatus,
      },
    });

    return NextResponse.json({ data: workflow });
  } catch (err) {
    console.error("[automatisations POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
