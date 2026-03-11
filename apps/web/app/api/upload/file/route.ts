import { NextRequest, NextResponse } from "next/server";

// File upload handler — In production: upload to Supabase Storage
// For now: simulates upload and returns a fake URL

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const context = formData.get("context") as string | null; // "project-brief", "dispute-proof", "profile-photo", etc.

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
    }

    // In production: upload to Supabase Storage bucket based on context
    // const bucket = context === "dispute-proof" ? "dispute-proofs" : context === "project-brief" ? "project-briefs" : "uploads";
    // const { data, error } = await supabase.storage.from(bucket).upload(path, file);

    const fileData = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${context || "general"}/${file.name}`,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, file: fileData });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
