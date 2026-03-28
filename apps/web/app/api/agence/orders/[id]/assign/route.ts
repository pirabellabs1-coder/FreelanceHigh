import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore } from "@/lib/dev/data-store";

// PATCH /api/agence/orders/[id]/assign — Assign a team member to an order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { memberId, memberName } = body;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const order = orderStore.getById(id);
      if (!order) {
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
      }
      // Store assignment in the order's metadata-like field
      orderStore.update(id, {
        assignedTo: memberId || null,
        assignedToName: memberName || null,
      } as Record<string, unknown>);
      return NextResponse.json({ success: true });
    }

    // Production: Prisma
    // Verify the user owns the agency
    const agencyProfile = await prisma.agencyProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!agencyProfile) {
      return NextResponse.json({ error: "Profil agence introuvable" }, { status: 404 });
    }

    // Verify the order belongs to this agency
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, agencyId: true, freelanceId: true },
    });
    if (!order || order.agencyId !== agencyProfile.id) {
      return NextResponse.json({ error: "Commande non trouvee ou non autorisee" }, { status: 404 });
    }

    // Verify the member belongs to this agency (if assigning)
    if (memberId) {
      const member = await prisma.teamMember.findFirst({
        where: { agencyId: agencyProfile.id, userId: memberId, status: "ACTIVE" },
      });
      if (!member) {
        return NextResponse.json({ error: "Membre introuvable dans l'equipe" }, { status: 404 });
      }
    }

    // Update order: assign the freelanceId to the member
    await prisma.order.update({
      where: { id },
      data: {
        freelanceId: memberId || order.freelanceId,
        requirements: memberId
          ? `Assigne a ${memberName || memberId} le ${new Date().toISOString().slice(0, 10)}`
          : null,
      },
    });

    // Notify the assigned member
    if (memberId) {
      await prisma.notification.create({
        data: {
          userId: memberId,
          title: "Commande assignee",
          message: `Une commande vous a ete assignee par votre agence.`,
          type: "ORDER",
          read: false,
          link: `/dashboard/commandes/${id}`,
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /agence/orders/[id]/assign PATCH]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
