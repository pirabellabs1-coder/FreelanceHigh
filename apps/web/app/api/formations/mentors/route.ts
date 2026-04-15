import { NextResponse } from "next/server";

// MentorSession is not yet available in the current schema migration.
// This endpoint returns an empty list until mentor sessions are enabled.
export async function GET() {
  return NextResponse.json({ data: [] });
}
