import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { projectStore } from "@/lib/dev/data-store";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(3, "Titre trop court").max(200),
  description: z.string().min(10, "Description trop courte").max(5000),
  category: z.string().optional(),
  budgetMin: z.number().min(0).max(1000000).optional(),
  budgetMax: z.number().min(0).max(1000000).optional(),
  deadline: z.string().optional(),
  urgency: z.string().optional(),
  contractType: z.string().optional(),
  skills: z.array(z.string()).max(20).optional(),
  status: z.string().optional(),
  visibility: z.string().optional(),
  subcategories: z.array(z.string()).optional(),
  budget: z.object({ type: z.string(), min: z.number(), max: z.number() }).optional(),
}).refine(
  (data) => !data.budgetMin || !data.budgetMax || data.budgetMin <= data.budgetMax,
  { message: "Le budget min doit être inférieur au budget max", path: ["budgetMax"] }
);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const projects = projectStore.getAll().filter((p) => p.clientId === session.user.id);
      return NextResponse.json({ projects });
    }

    // Prisma
    const projects = await prisma.project.findMany({
      where: { clientId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[API /projects GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();

    // Le formulaire client envoie budget: { type, min, max } — normaliser en budgetMin/budgetMax
    const normalized = {
      ...body,
      budgetMin: body.budgetMin ?? body.budget?.min ?? 0,
      budgetMax: body.budgetMax ?? body.budget?.max ?? 0,
    };

    const result = createProjectSchema.safeParse(normalized);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      );
    }
    const { title, description, category, budgetMin, budgetMax, deadline, urgency, contractType, skills } = result.data;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
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
        urgency: (urgency || "normale") as "normale" | "urgente" | "tres_urgente",
        contractType: (contractType || "ponctuel") as "ponctuel" | "long_terme" | "recurrent",
        skills: skills || [],
      });
      return NextResponse.json({ project }, { status: 201 });
    }

    // Prisma
    const project = await prisma.project.create({
      data: {
        clientId: session.user.id,
        title,
        description,
        category: category || "general",
        budgetMin: budgetMin || 0,
        budgetMax: budgetMax || 0,
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 86400000),
        urgency: (urgency || "normale") as string,
        contractType: (contractType || "ponctuel") as string,
        skills: skills || [],
        status: "ouvert" as string,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("[API /projects POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
