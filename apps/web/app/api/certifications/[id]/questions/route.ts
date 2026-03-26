import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import fs from "fs";
import path from "path";

const IS_DEV = process.env.DEV_MODE === "true";

type QuestionDef = { id: string; question: string; options: string[]; correctIndex: number };
let _cache: Record<string, QuestionDef[]> | null = null;

function loadQuestions(): Record<string, QuestionDef[]> {
  if (_cache) return _cache;
  const libDir = path.join(process.cwd(), "lib");
  const p1 = path.join(libDir, "certifications-questions.json");
  const p2 = path.join(libDir, "certifications-questions-part2.json");
  try {
    const q1 = fs.existsSync(p1) ? JSON.parse(fs.readFileSync(p1, "utf-8")) : {};
    const q2 = fs.existsSync(p2) ? JSON.parse(fs.readFileSync(p2, "utf-8")) : {};
    _cache = { ...q1, ...q2 };
  } catch (err) {
    console.error("[Questions] Failed to load JSON:", err);
    _cache = {};
  }
  return _cache;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !IS_DEV) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const { id } = await params;
  const allQ = loadQuestions();
  const questions = allQ[id];

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "Certification introuvable ou pas de questions" }, { status: 404 });
  }

  // Return questions without correctIndex (scoring is server-side)
  const safeQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));

  return NextResponse.json({ questions: safeQuestions });
}
