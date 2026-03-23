import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // Verify user is participant
    const membership = await prisma.conversationUser.findUnique({
      where: { conversationId_userId: { conversationId: id, userId } },
    });

    if (!membership) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    const now = new Date();

    // Mark all unread messages from others as read
    const updated = await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    // Update lastReadAt
    await prisma.conversationUser.update({
      where: { conversationId_userId: { conversationId: id, userId } },
      data: { lastReadAt: now },
    });

    return NextResponse.json({
      success: true,
      markedCount: updated.count,
      readAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[API /conversations/[id]/read POST]", error);
    return NextResponse.json(
      { error: "Erreur lors du marquage comme lu" },
      { status: 500 }
    );
  }
}
