import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // 1. Check if @freelancehigh/db loads
  try {
    const mod = await import("@freelancehigh/db");
    checks.dbModuleLoaded = true;
    checks.dbModuleKeys = Object.keys(mod);
    checks.prismaType = typeof mod.prisma;
  } catch (err) {
    checks.dbModuleLoaded = false;
    checks.dbModuleError = err instanceof Error ? err.message : String(err);
    return NextResponse.json(checks);
  }

  // 2. Check if prisma can query
  try {
    const { prisma } = await import("@freelancehigh/db");
    const count = await prisma.user.count();
    checks.prismaQueryWorks = true;
    checks.userCount = count;
  } catch (err) {
    checks.prismaQueryWorks = false;
    checks.prismaQueryError = err instanceof Error ? err.message : String(err);
    checks.prismaQueryStack = err instanceof Error ? err.stack?.split("\n").slice(0, 5) : undefined;
  }

  // 3. Check require resolution
  try {
    const resolved = require.resolve("@prisma/client");
    checks.prismaClientPath = resolved;
  } catch (err) {
    checks.prismaClientResolveError = err instanceof Error ? err.message : String(err);
  }

  // 4. Check env
  checks.databaseUrlSet = !!process.env.DATABASE_URL;
  checks.databaseUrlPrefix = process.env.DATABASE_URL?.substring(0, 30) + "...";
  checks.nodeVersion = process.version;

  return NextResponse.json(checks, { status: 200 });
}
