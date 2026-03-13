import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { projectStore } from "@/lib/dev/data-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const project = projectStore.getById(params.id);
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await req.json();
    const project = projectStore.update(params.id, body);
    if (!project) {
      return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[API /projects/[id] PATCH]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const deleted = projectStore.delete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /projects/[id] DELETE]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
