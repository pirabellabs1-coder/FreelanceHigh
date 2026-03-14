import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma, IS_DEV } from "@/lib/prisma";
import { kycRequestStore } from "@/lib/dev/data-store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (IS_DEV) {
      const requests = kycRequestStore.getByUser(session.user.id);
      const currentLevel = kycRequestStore.getUserLevel(session.user.id);

      return NextResponse.json({ requests, currentLevel });
    }

    // Production: Prisma
    const requests = await prisma.kycRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { kyc: true },
    });

    return NextResponse.json({ requests, currentLevel: user?.kyc ?? 1 });
  } catch (error) {
    console.error("[API /kyc GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const { level, documentType, documentUrl } = body;

    if (!level || !documentType) {
      return NextResponse.json(
        { error: "Champs requis : level, documentType" },
        { status: 400 }
      );
    }

    if (![2, 3, 4].includes(level)) {
      return NextResponse.json(
        { error: "Niveau invalide (2, 3 ou 4)" },
        { status: 400 }
      );
    }

    if (IS_DEV) {
      // Check if there's already a pending request for this level
      const existing = kycRequestStore.getByUser(session.user.id);
      const pendingForLevel = existing.find(
        (r) => r.level === level && r.status === "en_attente"
      );
      if (pendingForLevel) {
        return NextResponse.json(
          { error: "Une demande est deja en attente pour ce niveau" },
          { status: 409 }
        );
      }

      const req = kycRequestStore.create({
        userId: session.user.id,
        level,
        documentType,
        documentUrl: documentUrl || "",
      });

      return NextResponse.json({ request: req }, { status: 201 });
    }

    // Production: Prisma
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { kyc: true },
    });

    // Check if there's already a pending request for this level
    const pendingForLevel = await prisma.kycRequest.findFirst({
      where: {
        userId: session.user.id,
        requestedLevel: level,
        status: "EN_ATTENTE",
      },
    });
    if (pendingForLevel) {
      return NextResponse.json(
        { error: "Une demande est deja en attente pour ce niveau" },
        { status: 409 }
      );
    }

    const req = await prisma.kycRequest.create({
      data: {
        userId: session.user.id,
        requestedLevel: level,
        currentLevel: user?.kyc ?? 1,
        documentType,
        documentUrl: documentUrl || "",
        status: "EN_ATTENTE",
      },
    });

    return NextResponse.json({ request: req }, { status: 201 });
  } catch (error) {
    console.error("[API /kyc POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
