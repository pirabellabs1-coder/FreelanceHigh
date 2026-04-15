import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import { EmailSequenceTrigger } from "@prisma/client";

import { getInstructeurId as _gii } from "@/lib/formations/instructeur";
async function getProfileId(userId: string) { return _gii(userId); }

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-instructeur-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const pid = await getProfileId(userId);
    if (!pid) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const body = await request.json();
    const { name, description, trigger } = body;

    if (!name || !trigger) return NextResponse.json({ error: "Nom et déclencheur requis" }, { status: 400 });

    const sequence = await prisma.emailSequence.create({
      data: {
        instructeurId: pid,
        name: name.trim(),
        description: description?.trim() || null,
        trigger: trigger as EmailSequenceTrigger,
        isActive: false,
      },
    });

    return NextResponse.json({ data: sequence });
  } catch (err) {
    console.error("[sequences POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
