import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

// In-memory store — will be replaced by Supabase Auth sessions in production
const sessions: Array<{
  id: string;
  userId: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
  createdAt: string;
}> = [
  {
    id: "sess-1",
    userId: "u6",
    device: "Desktop",
    browser: "Chrome 122",
    os: "Windows 11",
    ip: "192.168.1.***",
    location: "Paris, France",
    isCurrent: true,
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sess-2",
    userId: "u6",
    device: "Mobile",
    browser: "Safari 17",
    os: "iOS 18",
    ip: "10.0.0.***",
    location: "Dakar, Senegal",
    isCurrent: false,
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const userSessions = sessions.filter((s) => s.userId === userId);
  return NextResponse.json({ sessions: userSessions });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();

  if (body.action === "revoke") {
    const idx = sessions.findIndex((s) => s.id === body.sessionId && s.userId === userId && !s.isCurrent);
    if (idx !== -1) {
      sessions.splice(idx, 1);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Impossible de revoquer cette session" }, { status: 400 });
  }

  if (body.action === "revoke-all") {
    const toRemove = sessions.filter((s) => s.userId === userId && !s.isCurrent);
    toRemove.forEach((s) => {
      const idx = sessions.indexOf(s);
      if (idx !== -1) sessions.splice(idx, 1);
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
}
