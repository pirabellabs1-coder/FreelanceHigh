import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { conversationStore } from "@/lib/dev/data-store";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { emitEvent } from "@/lib/events/dispatcher";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const conversation = conversationStore.getById(id);
      if (!conversation) {
        return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
      }
      if (!conversation.participants.includes(session.user.id)) {
        return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
      }
      return NextResponse.json({ messages: conversation.messages });
    }

    // Prisma mode
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    const isParticipant = conversation.users.some((u) => u.userId === session.user!.id);
    if (!isParticipant) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: { sender: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    const mappedMessages = messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      sender: m.senderId === session.user!.id ? "me" : "them",
      senderName: m.sender?.name || "Utilisateur",
      senderAvatar: m.sender?.image || "",
      content: m.content,
      type: m.type?.toLowerCase() || "text",
      timestamp: m.createdAt.toISOString(),
      read: m.read,
    }));

    // Mark as read
    await prisma.message.updateMany({
      where: { conversationId: id, senderId: { not: session.user.id }, read: false },
      data: { read: true },
    });

    return NextResponse.json({ messages: mappedMessages });
  } catch (error) {
    console.error("[API /conversations/[id]/messages GET]", error);
    return NextResponse.json({ error: "Erreur lors de la recuperation des messages" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { content, type, fileName, fileSize, fileUrl, fileType } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Le contenu du message est requis" }, { status: 400 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const conversation = conversationStore.getById(id);
      if (!conversation) {
        return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
      }
      if (!conversation.participants.includes(session.user.id)) {
        return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
      }

      const updatedConversation = conversationStore.sendMessage(
        id, session.user.id, content.trim(), type || "text",
        fileName, fileSize, undefined, fileUrl, fileType
      );

      if (!updatedConversation) {
        return NextResponse.json({ error: "Impossible d'envoyer le message" }, { status: 400 });
      }

      // Notifications
      const senderName = session.user.name || "Utilisateur";
      const otherParticipants = updatedConversation.participants.filter((pid) => pid !== session.user!.id);
      for (const participantId of otherParticipants) {
        emitEvent("message.received", {
          conversationId: id,
          senderId: session.user!.id,
          senderName,
          recipientId: participantId,
          recipientName: "",
          recipientEmail: "",
          messagePreview: `${senderName} : ${content.trim().slice(0, 50)}`,
        }).catch(() => {});
      }

      return NextResponse.json({ conversation: updatedConversation, messages: updatedConversation.messages });
    }

    // Prisma mode
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    const isParticipant = conversation.users.some((u) => u.userId === session.user!.id);
    if (!isParticipant) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: session.user.id,
        content: content.trim(),
        type: (type || "TEXT").toUpperCase(),
      },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Notifications for other participants
    const senderName = session.user.name || "Utilisateur";
    const otherUsers = conversation.users.filter((u) => u.userId !== session.user!.id);
    for (const u of otherUsers) {
      emitEvent("message.received", {
        conversationId: id,
        senderId: session.user!.id,
        senderName,
        recipientId: u.userId,
        recipientName: "",
        recipientEmail: "",
        messagePreview: `${senderName} : ${content.trim().slice(0, 50)}`,
      }).catch(() => {});
    }

    return NextResponse.json({
      message: {
        id: message.id,
        senderId: message.senderId,
        sender: "me",
        senderName: message.sender?.name || senderName,
        content: message.content,
        type: (message.type || "TEXT").toLowerCase(),
        timestamp: message.createdAt.toISOString(),
        read: false,
      },
    });
  } catch (error) {
    console.error("[API /conversations/[id]/messages POST]", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 });
  }
}
