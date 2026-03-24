import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// Signaling via Postgres — works across Vercel serverless instances
// Signals are ephemeral (TTL 60s, cleaned on every request)

const SIGNAL_TTL_MS = 60_000; // 60 seconds

async function ensureTable() {
  // Create table if not exists (no Prisma migration needed)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "signaling_signals" (
      "id" SERIAL PRIMARY KEY,
      "type" TEXT NOT NULL,
      "from_user" TEXT NOT NULL,
      "to_user" TEXT NOT NULL,
      "payload" JSONB NOT NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "idx_signaling_to_user" ON "signaling_signals" ("to_user")
  `);
}

let tableReady = false;

async function getTable() {
  if (!tableReady) {
    await ensureTable();
    tableReady = true;
  }
}

async function cleanup() {
  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM "signaling_signals" WHERE "created_at" < NOW() - INTERVAL '60 seconds'`
    );
  } catch {
    // Table might not exist yet
  }
}

interface SignalRow {
  id: number;
  type: string;
  from_user: string;
  to_user: string;
  payload: unknown;
  created_at: Date;
}

// POST — Send a signal to another user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = await req.json();
    const { type, from, to, payload } = body;

    if (!type || !from || !to || !payload) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await getTable();
    await cleanup();

    await prisma.$executeRawUnsafe(
      `INSERT INTO "signaling_signals" ("type", "from_user", "to_user", "payload") VALUES ($1, $2, $3, $4)`,
      type,
      from,
      to,
      JSON.stringify(payload)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Signaling POST]", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET — Poll for signals addressed to a user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await getTable();
    await cleanup();

    // Fetch signals for this user
    const rows = await prisma.$queryRawUnsafe<SignalRow[]>(
      `SELECT "id", "type", "from_user", "to_user", "payload", "created_at"
       FROM "signaling_signals"
       WHERE "to_user" = $1
       ORDER BY "id" ASC`,
      userId
    );

    if (rows.length > 0) {
      // Delete consumed signals
      const ids = rows.map((r) => r.id);
      await prisma.$executeRawUnsafe(
        `DELETE FROM "signaling_signals" WHERE "id" = ANY($1::int[])`,
        ids
      );
    }

    return NextResponse.json({
      signals: rows.map((r) => ({
        id: r.id,
        type: r.type,
        from: r.from_user,
        payload: typeof r.payload === "string" ? JSON.parse(r.payload) : r.payload,
      })),
    });
  } catch (err) {
    console.error("[Signaling GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
