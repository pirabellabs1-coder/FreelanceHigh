// GET /api/apprenant/export-pdf — Export PDF rapport de progression apprenant

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { generateLearnerReportPDF, type LearnerReportData } from "@/lib/pdf/formation-report-template";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        formation: {
          include: {
            instructeur: { include: { user: { select: { name: true } } } },
          },
        },
        certificate: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      inProgress: enrollments.filter((e) => !e.completedAt).length,
      completed: enrollments.filter((e) => !!e.completedAt).length,
      certificates: enrollments.filter((e) => !!e.certificate).length,
      totalHours: Math.round(enrollments.reduce((sum, e) => sum + (e.formation.duration ?? 0), 0) / 60),
    };

    const reportData: LearnerReportData = {
      learnerName: session.user.name ?? "Apprenant",
      generatedAt: new Date().toISOString(),
      enrollments: enrollments.map((e) => ({
        title: e.formation.title,
        instructor: e.formation.instructeur?.user?.name ?? "Instructeur",
        progress: e.progress,
        enrolledAt: e.createdAt.toISOString(),
        completedAt: e.completedAt?.toISOString() ?? null,
        certificate: !!e.certificate,
        totalHours: Math.round((e.formation.duration ?? 0) / 60),
      })),
      stats,
    };

    const pdfBuffer = generateLearnerReportPDF(reportData);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rapport-progression.pdf"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/apprenant/export-pdf]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
