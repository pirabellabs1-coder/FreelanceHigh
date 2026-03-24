import { NextResponse } from "next/server";

// Fetch fresh TURN credentials from metered.ca REST API
// This keeps credentials always valid (they rotate automatically)
export async function GET() {
  const apiKey = process.env.METERED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ iceServers: [] });
  }

  try {
    const res = await fetch(
      `https://freelancehigh.metered.live/api/v1/turn/credentials?apiKey=${apiKey}`,
      { next: { revalidate: 300 } } // Cache 5 min
    );

    if (!res.ok) {
      console.error("[TURN] metered.ca API error:", res.status);
      return NextResponse.json({ iceServers: [] });
    }

    const iceServers = await res.json();
    return NextResponse.json({ iceServers });
  } catch (e) {
    console.error("[TURN] Failed to fetch credentials:", e);
    return NextResponse.json({ iceServers: [] });
  }
}
