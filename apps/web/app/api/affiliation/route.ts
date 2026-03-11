import { NextResponse } from "next/server";

// Demo affiliation data
const DEMO_AFFILIATION = {
  referralLink: "https://freelancehigh.com/ref/lissanon-gildas",
  currentTier: "argent",
  totalReferrals: 35,
  totalEarnings: 875,
  conversionRate: 23,
  progressToNext: 65,
  nextTier: "or",
  nextTierThreshold: 50,
  tiers: [
    {
      id: "bronze", name: "Bronze", range: "0-10 parrainages", icon: "emoji_events",
      gradient: "from-amber-700 to-amber-900", status: "unlocked" as const, statusLabel: "Debloque",
      benefits: ["Commission standard", "Acces communaute"],
    },
    {
      id: "argent", name: "Argent", range: "11-50 parrainages", icon: "military_tech",
      gradient: "from-slate-300 to-slate-500", status: "current" as const, statusLabel: "Actuel",
      benefits: ["Commission +2%", "Support prioritaire"],
    },
    {
      id: "or", name: "Or", range: "51-100 parrainages", icon: "workspace_premium",
      gradient: "from-yellow-400 to-amber-600", status: "locked" as const, statusLabel: "Verrouille",
      benefits: ["Commission +5%", "Badge profil exclusif", "Webinaires VIP"],
    },
    {
      id: "ambassadeur", name: "Ambassadeur", range: "100+ parrainages", icon: "diamond",
      gradient: "from-cyan-300 to-blue-500", status: "locked" as const, statusLabel: "Verrouille",
      benefits: ["Recompenses Cash VIP", "Evenements physiques", "Conseil consultatif"],
    },
  ],
  rewards: [
    { id: "r1", reward: "Bonus Palier Argent", date: "2026-01-15", status: "verse" as const, value: "\u20AC50" },
    { id: "r2", reward: 'Badge "Pionnier Freelance"', date: "2026-01-20", status: "active" as const, value: "Badge" },
    { id: "r3", reward: "Bonus de Bienvenue", date: "2025-12-01", status: "verse" as const, value: "\u20AC5" },
    { id: "r4", reward: "Commission parrainage", date: "2026-02-10", status: "verse" as const, value: "\u20AC15" },
    { id: "r5", reward: "Commission parrainage", date: "2026-02-25", status: "en_attente" as const, value: "\u20AC10" },
  ],
  invitedFriends: [
    { id: "f1", name: "Marie Kouassi", date: "15/01/2026", gender: "f", status: "active" as const },
    { id: "f2", name: "Ibrahim Sow", date: "20/01/2026", gender: "m", status: "active" as const },
    { id: "f3", name: "Fatou Diop", date: "05/02/2026", gender: "f", status: "active" as const },
    { id: "f4", name: "Jean-Paul Mbaye", date: "10/02/2026", gender: "m", status: "pending" as const },
    { id: "f5", name: "Amina Toure", date: "25/02/2026", gender: "f", status: "active" as const },
  ],
};

export async function GET() {
  return NextResponse.json(DEMO_AFFILIATION);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "invite") {
    return NextResponse.json({ success: true, message: `Invitation envoyee a ${body.email}` });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
