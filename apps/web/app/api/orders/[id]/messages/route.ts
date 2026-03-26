import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore } from "@/lib/dev/data-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { content, type, fileName, fileSize } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le contenu du message est requis" },
        { status: 400 }
      );
    }

    // Dev mode (local only — not Vercel)
    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const order = orderStore.getById(id);
      if (!order) {
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
      }

      const userId = session?.user?.id || "dev-user";
      const sender = userId === order.freelanceId ? "freelance" : "client";
      const senderName = sender === "freelance" ? "Vous" : order.clientName;

      const updatedOrder = orderStore.addMessage(id, {
        sender,
        senderName,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        type: type || "text",
        fileName,
        fileSize,
      });

      if (!updatedOrder) {
        return NextResponse.json({ error: "Impossible d'envoyer le message" }, { status: 400 });
      }

      return NextResponse.json({ order: updatedOrder });
    }

    // Production / Vercel: use Prisma — send message via order's conversation
    const { prisma } = await import("@/lib/prisma");
    const userId = session!.user.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { conversation: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    if (order.clientId !== userId && order.freelanceId !== userId) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    // Find or create conversation for this order
    let conversationId = order.conversation?.id;
    if (!conversationId) {
      const conv = await prisma.conversation.create({
        data: {
          type: "ORDER",
          orderId: id,
          users: {
            createMany: {
              data: [{ userId: order.clientId }, { userId: order.freelanceId }],
              skipDuplicates: true,
            },
          },
        },
      });
      conversationId = conv.id;
    }

    // Create message in the conversation
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim(),
        type: (type || "TEXT").toUpperCase(),
        fileName: fileName || null,
      },
    });

    // Return updated order
    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { service: true, client: true, freelance: true },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("[API /orders/[id]/messages POST]", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
