import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";

// In-memory store (dev only) — will be replaced by DB in production
const devTickets: Array<{
  id: string;
  userId: string;
  subject: string;
  category: string;
  message: string;
  priority: "basse" | "normale" | "haute" | "urgente";
  status: "ouvert" | "en_cours" | "resolu" | "ferme";
  responses: { id: string; from: "support" | "user"; message: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: "ticket-1",
    userId: "u6",
    subject: "Probleme de paiement",
    category: "paiement",
    message: "Ma commande #ORD-001 n'a pas ete debitee correctement.",
    priority: "haute",
    status: "resolu",
    responses: [
      { id: "resp-1", from: "support", message: "Bonjour, nous avons verifie votre transaction. Le paiement a bien ete traite. Vous pouvez verifier votre releve bancaire dans 24-48h.", createdAt: "2026-02-16T14:00:00Z" },
      { id: "resp-2", from: "user", message: "Merci, c'est bien apparu sur mon releve.", createdAt: "2026-02-17T10:00:00Z" },
    ],
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-17T10:00:00Z",
  },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  if (IS_DEV && !USE_PRISMA_FOR_DATA) {
    const userTickets = devTickets.filter((t) => t.userId === userId);
    return NextResponse.json({ tickets: userTickets });
  }

  // Production: no SupportTicket model in schema yet — return empty list
  // TODO: add SupportTicket model to schema (subject, category, message, priority, status, responses)
  return NextResponse.json({ tickets: [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const { action } = body;

  if (IS_DEV && !USE_PRISMA_FOR_DATA) {
    if (action === "reply") {
      const ticket = devTickets.find((t) => t.id === body.ticketId && t.userId === userId);
      if (!ticket) return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
      ticket.responses.push({
        id: `resp-${Date.now()}`,
        from: "user",
        message: body.message,
        createdAt: new Date().toISOString(),
      });
      ticket.updatedAt = new Date().toISOString();
      return NextResponse.json({ success: true, ticket });
    }

    // Create new ticket
    const ticket = {
      id: `ticket-${Date.now()}`,
      userId,
      subject: body.subject || "",
      category: body.category || "general",
      message: body.message || "",
      priority: body.priority || "normale",
      status: "ouvert" as const,
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    devTickets.push(ticket);
    return NextResponse.json({ success: true, ticket });
  }

  // Production: no SupportTicket model in schema yet
  // TODO: add SupportTicket model to schema for persistent ticket tracking
  return NextResponse.json({ error: "Fonctionnalite non disponible en production pour le moment" }, { status: 501 });
}
