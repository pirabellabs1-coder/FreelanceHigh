// PATCH /api/agence/equipe/[memberId] — Update member role
// DELETE /api/agence/equipe/[memberId] — Remove member

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["PROPRIETAIRE", "MANAGER", "FREELANCE_MEMBRE", "COMMERCIAL"]),
});

type RouteContext = { params: Promise<{ memberId: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { memberId } = await context.params;
    const body = await req.json();
    const { role } = roleSchema.parse(body);

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      return NextResponse.json({ success: true, memberId, role });
    }

    // Verify ownership
    const agencyProfile = await prisma.agencyProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!agencyProfile) {
      return NextResponse.json({ error: "Profil agence introuvable" }, { status: 404 });
    }

    const member = await prisma.teamMember.findFirst({
      where: { id: memberId, agencyId: agencyProfile.id },
    });
    if (!member) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: role as "PROPRIETAIRE" | "MANAGER" | "FREELANCE_MEMBRE" | "COMMERCIAL" },
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
    }
    console.error("[PATCH /agence/equipe/[memberId]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { memberId } = await context.params;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      return NextResponse.json({ success: true, memberId });
    }

    const agencyProfile = await prisma.agencyProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!agencyProfile) {
      return NextResponse.json({ error: "Profil agence introuvable" }, { status: 404 });
    }

    const member = await prisma.teamMember.findFirst({
      where: { id: memberId, agencyId: agencyProfile.id },
    });
    if (!member) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    // Soft delete — set status to REMOVED
    await prisma.teamMember.update({
      where: { id: memberId },
      data: { status: "REMOVED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /agence/equipe/[memberId]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
