// POST /api/admin/formations/finances/withdrawal/[id] — Approuver ou refuser un retrait

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const { action } = await req.json() as { action: "approve" | "reject" };

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const withdrawal = await prisma.instructorWithdrawal.findUnique({ where: { id } });
    if (!withdrawal) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    await prisma.instructorWithdrawal.update({
      where: { id },
      data: {
        status: action === "approve" ? "TRAITE" : "REFUSE",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/admin/formations/finances/withdrawal/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
