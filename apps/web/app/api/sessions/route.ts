import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";

// In-memory store (dev only) — replaced by Supabase Auth sessions in production
const devSessions: Array<{
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

  if (IS_DEV && !USE_PRISMA_FOR_DATA) {
    const userSessions = devSessions.filter((s) => s.userId === userId);
    return NextResponse.json({ sessions: userSessions });
  }

  // Production: Prisma — query the Session table for non-expired sessions
  const { prisma } = await import("@/lib/prisma");
  const dbSessions = await prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  const mapped = dbSessions.map((s, idx) => ({
    id: s.id,
    userId: s.userId,
    device: s.userAgent?.includes("Mobile") ? "Mobile" : "Desktop",
    browser: s.userAgent ?? "Unknown",
    os: "Unknown",
    ip: s.ipAddress ?? "Unknown",
    location: "Unknown",
    isCurrent: idx === 0, // most recent session treated as current
    lastActive: s.createdAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }));

  return NextResponse.json({ sessions: mapped });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();

  if (IS_DEV && !USE_PRISMA_FOR_DATA) {
    if (body.action === "revoke") {
      const idx = devSessions.findIndex((s) => s.id === body.sessionId && s.userId === userId && !s.isCurrent);
      if (idx !== -1) {
        devSessions.splice(idx, 1);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Impossible de revoquer cette session" }, { status: 400 });
    }

    if (body.action === "revoke-all") {
      const toRemove = devSessions.filter((s) => s.userId === userId && !s.isCurrent);
      toRemove.forEach((s) => {
        const idx = devSessions.indexOf(s);
        if (idx !== -1) devSessions.splice(idx, 1);
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  }

  // Production: Prisma
  const { prisma } = await import("@/lib/prisma");

  if (body.action === "revoke") {
    await prisma.session.deleteMany({
      where: { id: String(body.sessionId), userId },
    });
    return NextResponse.json({ success: true });
  }

  if (body.action === "revoke-all") {
    // Delete all sessions except the one matching the current token (not stored here — delete all for now)
    await prisma.session.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
}
