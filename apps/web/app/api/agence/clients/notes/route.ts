import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";

// GET /api/agence/clients/notes — Get all client notes for this agency
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      return NextResponse.json({ notes: {} });
    }

    const profile = await prisma.agencyProfile.findUnique({
      where: { userId: session.user.id },
      select: { settings: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil agence introuvable" }, { status: 404 });
    }

    const settings = (profile.settings as Record<string, unknown>) || {};
    const notes = (settings.clientNotes as Record<string, string>) || {};

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[API /agence/clients/notes GET]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// POST /api/agence/clients/notes — Save a client note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, note } = body;

    if (!clientId) {
      return NextResponse.json({ error: "clientId requis" }, { status: 400 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      return NextResponse.json({ success: true });
    }

    const profile = await prisma.agencyProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, settings: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil agence introuvable" }, { status: 404 });
    }

    const settings = (profile.settings as Record<string, unknown>) || {};
    const clientNotes = (settings.clientNotes as Record<string, string>) || {};

    // Update or remove the note
    if (note && note.trim()) {
      clientNotes[clientId] = note.trim();
    } else {
      delete clientNotes[clientId];
    }

    await prisma.agencyProfile.update({
      where: { id: profile.id },
      data: {
        settings: { ...settings, clientNotes },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /agence/clients/notes POST]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
