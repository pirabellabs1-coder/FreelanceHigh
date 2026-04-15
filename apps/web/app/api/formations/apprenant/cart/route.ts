import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import { z } from "zod";

const addSchema = z.object({
  formationId: z.string().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-apprenant-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        formation: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnail: true,
            level: true,
            instructeurId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = items.reduce((s, item) => s + (item.formation?.price ?? 0), 0);

    return NextResponse.json({ data: items, total, count: items.length });
  } catch {
    return NextResponse.json({ data: [], total: 0, count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-apprenant-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const parsed = addSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

    const { formationId } = parsed.data;

    // Check not already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_formationId: { userId, formationId } },
    }).catch(() => null);
    if (existing) return NextResponse.json({ error: "Vous êtes déjà inscrit à cette formation" }, { status: 409 });

    const item = await prisma.cartItem.upsert({
      where: { userId_formationId: { userId, formationId } },
      update: {},
      create: { userId, formationId },
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err) {
    console.error("[cart POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-apprenant-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

    await prisma.cartItem.deleteMany({ where: { id, userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
