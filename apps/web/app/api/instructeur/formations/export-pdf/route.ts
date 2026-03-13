// GET /api/instructeur/formations/export-pdf?formationId=xxx — Export PDF rapport instructeur

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { generateInstructorReportPDF, type InstructorReportData } from "@/lib/pdf/formation-report-template";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formationId = req.nextUrl.searchParams.get("formationId");
    if (!formationId) {
      return NextResponse.json({ error: "formationId requis" }, { status: 400 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructeur) {
      return NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 403 });
    }

    const formation = await prisma.formation.findFirst({
      where: { id: formationId, instructeurId: instructeur.id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: { progress: true },
            },
          },
        },
        enrollments: true,
        reviews: true,
      },
    });

    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    // Compute stats
    const totalStudents = formation.studentsCount;
    const totalRevenue = formation.enrollments.reduce(
      (sum: number, e: { paidAmount: number }) => sum + e.paidAmount,
      0
    );
    const completedCount = formation.enrollments.filter(
      (e: { completedAt: Date | null }) => e.completedAt !== null
    ).length;
    const completionRate = totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0;

    // Revenue by month
    const revenueMap = new Map<string, number>();
    for (const e of formation.enrollments) {
      const month = new Date(e.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
      revenueMap.set(month, (revenueMap.get(month) ?? 0) + e.paidAmount);
    }
    const revenueByMonth = Array.from(revenueMap.entries()).map(([month, revenue]) => ({ month, revenue }));

    // Lesson completion
    const allLessons = formation.sections.flatMap((s) => s.lessons);
    const lessonCompletion = allLessons.map((lesson) => {
      const completed = lesson.progress.filter((p) => p.completed).length;
      return {
        title: lesson.titleFr,
        completedPct: totalStudents > 0 ? (completed / totalStudents) * 100 : 0,
      };
    });

    // Avg quiz score from LessonProgress.score
    let totalScore = 0;
    let scoreCount = 0;
    for (const lesson of allLessons) {
      for (const p of lesson.progress) {
        if (p.score !== null && p.score !== undefined) {
          totalScore += p.score;
          scoreCount++;
        }
      }
    }

    const reportData: InstructorReportData = {
      formationTitle: formation.titleFr,
      instructorName: session.user.name ?? "Instructeur",
      generatedAt: new Date().toISOString(),
      studentsCount: totalStudents,
      rating: formation.rating,
      reviewsCount: formation.reviewsCount,
      completionRate,
      totalRevenue,
      netRevenue: totalRevenue * 0.7,
      revenueByMonth,
      lessonCompletion,
      avgQuizScore: scoreCount > 0 ? totalScore / scoreCount : 0,
    };

    const pdfBuffer = generateInstructorReportPDF(reportData);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rapport-${formation.slug ?? formationId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/instructeur/formations/export-pdf]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
