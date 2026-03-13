// GET /api/instructeur/formations/csv-template — Télécharger le modèle CSV

import { NextResponse } from "next/server";

const CSV_HEADER = "section_title_fr,section_title_en,lesson_title_fr,lesson_title_en,lesson_type,video_url,duration_minutes,is_free";
const CSV_EXAMPLE_ROWS = [
  "Introduction,Introduction,Bienvenue dans la formation,Welcome to the course,VIDEO,https://youtube.com/watch?v=xxx,5,true",
  "Introduction,Introduction,Les fondamentaux,The fundamentals,VIDEO,https://vimeo.com/xxx,10,false",
  "Introduction,Introduction,Quiz d'introduction,Introduction Quiz,QUIZ,,5,false",
  "Chapitre 1,Chapter 1,Leçon théorique,Theory Lesson,TEXTE,,15,false",
  "Chapitre 1,Chapter 1,Ressources PDF,PDF Resources,PDF,,10,false",
];

export async function GET() {
  const csv = [CSV_HEADER, ...CSV_EXAMPLE_ROWS].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"template-curriculum.csv\"",
    },
  });
}
