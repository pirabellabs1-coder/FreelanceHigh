// POST /api/instructeur/formations/import-csv — Importer un curriculum depuis CSV

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import Papa from "papaparse";

interface CsvRow {
  section_title: string;
  lesson_title: string;
  lesson_type: string;
  video_url: string;
  duration_minutes: string;
  is_free: string;
}

interface ParsedSection {
  title: string;
  lessons: {
    title: string;
    type: string;
    videoUrl: string;
    duration: number;
    isFree: boolean;
  }[];
}

const VALID_TYPES = ["VIDEO", "PDF", "TEXTE", "AUDIO", "QUIZ"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fichier CSV requis" }, { status: 400 });
    }

    const text = await file.text();

    const result = Papa.parse<CsvRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    if (result.errors.length > 0) {
      return NextResponse.json({
        error: "Erreurs de parsing CSV",
        details: result.errors.slice(0, 5).map((e) => `Ligne ${e.row}: ${e.message}`),
      }, { status: 400 });
    }

    const rows = result.data;
    const errors: string[] = [];
    const sectionsMap = new Map<string, ParsedSection>();

    rows.forEach((row, i) => {
      const lineNum = i + 2; // +1 for 0-index, +1 for header

      if (!row.section_title?.trim()) {
        errors.push(`Ligne ${lineNum}: section_title manquant`);
        return;
      }
      if (!row.lesson_title?.trim()) {
        errors.push(`Ligne ${lineNum}: lesson_title manquant`);
        return;
      }

      const type = (row.lesson_type ?? "VIDEO").toUpperCase().trim();
      if (!VALID_TYPES.includes(type)) {
        errors.push(`Ligne ${lineNum}: type "${row.lesson_type}" invalide (attendu: ${VALID_TYPES.join(", ")})`);
        return;
      }

      const sectionKey = row.section_title.trim();
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          title: row.section_title.trim(),
          lessons: [],
        });
      }

      sectionsMap.get(sectionKey)!.lessons.push({
        title: row.lesson_title.trim(),
        type,
        videoUrl: (row.video_url ?? "").trim(),
        duration: parseInt(row.duration_minutes ?? "0", 10) || 0,
        isFree: row.is_free?.toLowerCase() === "true",
      });
    });

    if (errors.length > 0) {
      return NextResponse.json({
        error: "Erreurs de validation",
        details: errors,
        validRows: rows.length - errors.length,
        totalRows: rows.length,
      }, { status: 422 });
    }

    // Build sections array with order
    const sections = Array.from(sectionsMap.values()).map((section, sIdx) => ({
      ...section,
      order: sIdx,
      lessons: section.lessons.map((lesson, lIdx) => ({
        ...lesson,
        order: lIdx,
      })),
    }));

    return NextResponse.json({
      sections,
      stats: {
        sectionsCount: sections.length,
        lessonsCount: sections.reduce((sum, s) => sum + s.lessons.length, 0),
      },
    });
  } catch (error) {
    console.error("[POST /api/instructeur/formations/import-csv]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
