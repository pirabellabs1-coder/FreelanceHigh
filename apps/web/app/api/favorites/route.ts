import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

// In-memory store — will be replaced by Supabase DB in production
const favorites: Array<{
  id: string;
  userId: string;
  targetId: string;
  type: "freelance" | "service" | "agence";
  name: string;
  avatar: string;
  rating: number;
  specialty: string;
  addedAt: string;
}> = [];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const userFavorites = favorites.filter((f) => f.userId === userId);
  return NextResponse.json({ favorites: userFavorites });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const { action, targetId, type, name, avatar, rating, specialty } = body;

  if (action === "remove") {
    const idx = favorites.findIndex((f) => f.targetId === targetId && f.type === type && f.userId === userId);
    if (idx !== -1) {
      favorites.splice(idx, 1);
    }
    return NextResponse.json({ success: true });
  }

  // Add favorite
  const existing = favorites.find((f) => f.targetId === targetId && f.type === type && f.userId === userId);
  if (existing) {
    return NextResponse.json({ success: true, favorite: existing });
  }

  const fav = {
    id: `fav-${Date.now()}`,
    userId,
    targetId,
    type,
    name: name || "",
    avatar: avatar || "",
    rating: rating || 0,
    specialty: specialty || "",
    addedAt: new Date().toISOString(),
  };
  favorites.push(fav);
  return NextResponse.json({ success: true, favorite: fav });
}
