import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma, IS_DEV } from "@/lib/prisma";
import { projectStore } from "@/lib/dev/data-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;

    if (IS_DEV) {
      const project = projectStore.getById(id);
      if (!project) {
        return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
      }

      return NextResponse.json({ project });
    }

    // Production: Prisma
    const project = await prisma.bid.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!project) {
      return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[API /projects/[id] GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (IS_DEV) {
      const project = projectStore.update(id, body);
      if (!project) {
        return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
      }

      return NextResponse.json({ project });
    }

    // Production: Prisma
    const project = await prisma.bid.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[API /projects/[id] PATCH]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;

    if (IS_DEV) {
      const deleted = projectStore.delete(id);
      if (!deleted) {
        return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    // Production: Prisma
    await prisma.bid.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /projects/[id] DELETE]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
