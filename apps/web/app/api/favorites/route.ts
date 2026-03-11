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
}> = [
  {
    id: "fav-1",
    userId: "u6",
    targetId: "u1",
    type: "freelance",
    name: "Amadou Diallo",
    avatar: "",
    rating: 4.9,
    specialty: "Developpeur Full-Stack",
    addedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "fav-2",
    userId: "u6",
    targetId: "s3",
    type: "service",
    name: "Design UI/UX Complet",
    avatar: "",
    rating: 4.8,
    specialty: "Design & UI/UX",
    addedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "fav-3",
    userId: "u6",
    targetId: "a1",
    type: "agence",
    name: "TechCorp Agency",
    avatar: "",
    rating: 4.7,
    specialty: "Developpement Web & Mobile",
    addedAt: "2026-03-01T09:00:00Z",
  },
];

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
