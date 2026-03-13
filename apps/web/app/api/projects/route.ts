import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { projectStore } from "@/lib/dev/data-store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const projects = projectStore.getAll();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[API /projects GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des projets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, budgetMin, budgetMax, deadline, urgency, contractType, skills } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Titre et description requis" }, { status: 400 });
    }

    const project = projectStore.create({
      clientId: session.user.id,
      clientName: session.user.name || "Client",
      clientCountry: "FR",
      clientRating: 0,
      title,
      description,
      category: category || "general",
      budgetMin: budgetMin || 0,
      budgetMax: budgetMax || 0,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      urgency: urgency || "normale",
      contractType: contractType || "ponctuel",
      skills: skills || [],
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("[API /projects POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
