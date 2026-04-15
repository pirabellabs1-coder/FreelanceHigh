import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import { resolveVendorContext } from "@/lib/formations/active-user";
import { EmailSequenceTrigger } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

async function ensureOwnership(session: Awaited<ReturnType<typeof getServerSession>>, sequenceId: string) {
  const ctx = await resolveVendorContext(session, {
    devFallback: IS_DEV ? "dev-instructeur-001" : undefined,
  });
  if (!ctx) return null;
  const seq = await prisma.emailSequence.findFirst({
    where: { id: sequenceId, instructeurId: ctx.instructeurId },
    include: {
      steps: { orderBy: { stepOrder: "asc" } },
    },
  });
  if (!seq) return null;
  return { ctx, sequence: seq };
}

/** GET /api/formations/vendeur/marketing/sequences/[id] */
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const owned = await ensureOwnership(session, id);
    if (!owned) return NextResponse.json({ error: "Séquence introuvable" }, { status: 404 });

    return NextResponse.json({ data: owned.sequence });
  } catch (err) {
    console.error("[sequence GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/** PATCH /api/formations/vendeur/marketing/sequences/[id]
 *  Body: { name?, description?, trigger?, isActive? }
 */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const owned = await ensureOwnership(session, id);
    if (!owned) return NextResponse.json({ error: "Séquence introuvable" }, { status: 404 });

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name === "string") data.name = body.name.trim();
    if (typeof body.description === "string") data.description = body.description.trim() || null;
    if (typeof body.trigger === "string") data.trigger = body.trigger as EmailSequenceTrigger;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    const updated = await prisma.emailSequence.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[sequence PATCH]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

/** DELETE /api/formations/vendeur/marketing/sequences/[id] */
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const owned = await ensureOwnership(session, id);
    if (!owned) return NextResponse.json({ error: "Séquence introuvable" }, { status: 404 });

    await prisma.emailSequence.delete({ where: { id } });
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[sequence DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
