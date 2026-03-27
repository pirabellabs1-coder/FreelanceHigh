import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore, serviceStore, transactionStore, conversationStore, notificationStore } from "@/lib/dev/data-store";
import { propositionStore } from "@/lib/dev/proposition-store";
import { calculateCommissionEur, normalizePlanName } from "@/lib/plans";

// GET /api/propositions/[id] — Get single proposition
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
      const proposition = propositionStore.getById(id);
      if (!proposition) {
        return NextResponse.json({ error: "Proposition introuvable" }, { status: 404 });
      }
      return NextResponse.json({ proposition });
    }

    const proposition = await prisma.proposition.findUnique({
      where: { id },
      include: {
        service: { select: { id: true, title: true, slug: true, images: true } },
        freelance: { select: { id: true, name: true, image: true } },
        client: { select: { id: true, name: true, image: true } },
        order: { select: { id: true, status: true } },
      },
    });

    if (!proposition) {
      return NextResponse.json({ error: "Proposition introuvable" }, { status: 404 });
    }

    // Mark as viewed if client sees it for the first time
    if (proposition.clientId === session.user.id && proposition.status === "SENT") {
      await prisma.proposition.update({
        where: { id },
        data: { status: "VIEWED", viewedAt: new Date() },
      });
    }

    return NextResponse.json({ proposition });
  } catch (error) {
    console.error("[API /propositions/[id] GET]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// PATCH /api/propositions/[id] — Accept or reject proposition
export async function PATCH(
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
    const { action } = body; // "accept" or "reject"

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Action invalide (accept ou reject)" }, { status: 400 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const proposition = propositionStore.getById(id);
      if (!proposition) {
        return NextResponse.json({ error: "Proposition introuvable" }, { status: 404 });
      }
      if (proposition.clientId !== session.user.id) {
        return NextResponse.json({ error: "Non autorise" }, { status: 403 });
      }
      if (proposition.status !== "SENT" && proposition.status !== "VIEWED") {
        return NextResponse.json({ error: "Proposition n'est plus disponible" }, { status: 400 });
      }

      if (action === "reject") {
        propositionStore.update(id, { status: "REJECTED", rejectedAt: new Date().toISOString() });
        notificationStore.add({
          userId: proposition.freelanceId,
          title: "Proposition refusee",
          message: `Votre proposition "${proposition.title}" a ete refusee`,
          type: "offer",
          read: false,
          link: "/dashboard/propositions",
        });
        return NextResponse.json({ success: true, action: "rejected" });
      }

      // action === "accept" → create Order + Escrow + Admin commission
      const service = serviceStore.getById(proposition.serviceId);
      const vendorPlan = normalizePlanName(service?.vendorPlan || "gratuit");
      const commission = calculateCommissionEur(vendorPlan, proposition.amount);
      const platformFee = commission;
      const freelancerPayout = proposition.amount - commission;

      const now = new Date();
      const deadline = new Date(now.getTime() + proposition.deliveryDays * 24 * 60 * 60 * 1000);

      const order = orderStore.create({
        serviceId: proposition.serviceId,
        serviceTitle: proposition.title,
        category: service?.categoryName || "",
        clientId: proposition.clientId,
        clientName: session.user.name || "Client",
        clientAvatar: "",
        clientCountry: "FR",
        freelanceId: proposition.freelanceId,
        freelanceName: service?.vendorName || "Freelance",
        status: "en_attente",
        amount: proposition.amount,
        commission: platformFee,
        packageType: "custom",
        requirements: proposition.description,
        deadline: deadline.toISOString().slice(0, 10),
        deliveredAt: null,
        completedAt: null,
        progress: 0,
        revisionsLeft: proposition.revisions,
        messages: [],
        timeline: [
          {
            id: `t${Date.now()}`,
            type: "created" as const,
            title: "Commande creee depuis proposition",
            description: proposition.title,
            timestamp: now.toISOString(),
          },
        ],
        files: [],
      });

      // Create escrow transaction
      transactionStore.add({
        userId: proposition.freelanceId,
        type: "vente",
        description: `Commande ${order.id} - ${proposition.title} (proposition)`,
        amount: freelancerPayout,
        status: "en_attente",
        date: now.toISOString().slice(0, 10),
        orderId: order.id,
      });

      transactionStore.add({
        userId: proposition.freelanceId,
        type: "commission",
        description: `Commission plateforme sur commande ${order.id}`,
        amount: -platformFee,
        status: "en_attente",
        date: now.toISOString().slice(0, 10),
        orderId: order.id,
      });

      // Update proposition
      propositionStore.update(id, {
        status: "ACCEPTED",
        acceptedAt: now.toISOString(),
        orderId: order.id,
      });

      // Update service stats
      if (service) {
        serviceStore.update(proposition.serviceId, {
          orderCount: (service.orderCount || 0) + 1,
        });
      }

      // Create conversation
      conversationStore.create({
        participants: [session.user.id, proposition.freelanceId],
        contactName: service?.vendorName || "Freelance",
        contactAvatar: service?.vendorAvatar || "FL",
        contactRole: "client",
        orderId: order.id,
      });

      // Notify freelance
      notificationStore.add({
        userId: proposition.freelanceId,
        title: "Proposition acceptee!",
        message: `Votre proposition "${proposition.title}" a ete acceptee. Commande #${order.id.slice(0, 8)} creee.`,
        type: "order",
        read: false,
        link: `/dashboard/commandes/${order.id}`,
      });

      return NextResponse.json({ success: true, action: "accepted", orderId: order.id });
    }

    // Production: Prisma
    const proposition = await prisma.proposition.findUnique({
      where: { id },
      include: { service: { include: { user: true } } },
    });

    if (!proposition) {
      return NextResponse.json({ error: "Proposition introuvable" }, { status: 404 });
    }
    if (proposition.clientId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }
    if (proposition.status !== "SENT" && proposition.status !== "VIEWED") {
      return NextResponse.json({ error: "Proposition n'est plus disponible" }, { status: 400 });
    }

    if (action === "reject") {
      await prisma.proposition.update({
        where: { id },
        data: { status: "REJECTED", rejectedAt: new Date() },
      });

      try {
        await prisma.notification.create({
          data: {
            userId: proposition.freelanceId,
            title: "Proposition refusee",
            message: `Votre proposition "${proposition.title}" a ete refusee`,
            type: "OFFER",
            link: "/dashboard/propositions",
          },
        });
      } catch (e) {
        console.error("[Proposition reject] notification failed:", e);
      }

      return NextResponse.json({ success: true, action: "rejected" });
    }

    // action === "accept" → Prisma transaction
    const freelancePlan = normalizePlanName(proposition.service.user.plan);
    const commission = calculateCommissionEur(freelancePlan, proposition.amount);
    const platformFee = commission;
    const freelancerPayout = proposition.amount - commission;
    const deadlineDate = new Date(Date.now() + proposition.deliveryDays * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      // Create order (include agencyId if proposition is from an agency)
      const order = await tx.order.create({
        data: {
          serviceId: proposition.serviceId,
          clientId: proposition.clientId,
          freelanceId: proposition.freelanceId,
          ...(proposition.agencyId ? { agencyId: proposition.agencyId } : {}),
          status: "EN_ATTENTE",
          escrowStatus: "HELD",
          amount: proposition.amount,
          commission: platformFee,
          platformFee,
          freelancerPayout,
          title: proposition.title,
          description: proposition.description,
          deliveryDays: proposition.deliveryDays,
          packageType: "custom",
          deadline: deadlineDate,
        },
      });

      // Create Escrow
      await tx.escrow.create({
        data: {
          orderId: order.id,
          amount: proposition.amount,
          currency: "EUR",
          reason: "ORDER_PAYMENT",
          status: "HELD",
        },
      });

      // Admin Wallet + Transaction
      let adminWallet = await tx.adminWallet.findFirst();
      if (!adminWallet) {
        adminWallet = await tx.adminWallet.create({ data: {} });
      }
      await tx.adminWallet.update({
        where: { id: adminWallet.id },
        data: { totalFeesHeld: { increment: platformFee } },
      });
      await tx.adminTransaction.create({
        data: {
          adminWalletId: adminWallet.id,
          type: "SERVICE_FEE",
          amount: platformFee,
          description: `Commission proposition "${proposition.title}" (Commande #${order.id.slice(0, 8)})`,
          orderId: order.id,
          status: "PENDING",
        },
      });

      // Update proposition
      await tx.proposition.update({
        where: { id },
        data: { status: "ACCEPTED", acceptedAt: new Date(), orderId: order.id },
      });

      // Update service orderCount
      await tx.service.update({
        where: { id: proposition.serviceId },
        data: { orderCount: { increment: 1 } },
      });

      // Create conversation
      const conversation = await tx.conversation.create({
        data: {
          type: "ORDER",
          orderId: order.id,
          users: {
            create: [
              { userId: proposition.clientId },
              { userId: proposition.freelanceId },
            ],
          },
        },
      });

      // Notify freelance
      await tx.notification.create({
        data: {
          userId: proposition.freelanceId,
          title: "Proposition acceptee!",
          message: `Votre proposition "${proposition.title}" a ete acceptee. Commande creee.`,
          type: "ORDER",
          link: `/dashboard/commandes/${order.id}`,
        },
      });

      return { orderId: order.id, conversationId: conversation.id };
    });

    return NextResponse.json({ success: true, action: "accepted", orderId: result.orderId });
  } catch (error) {
    console.error("[API /propositions/[id] PATCH]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
