import { NextRequest, NextResponse } from "next/server";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { emitEvent } from "@/lib/events/dispatcher";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel cron or manual trigger)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // --- DEV mode: use in-memory store ---
  if (IS_DEV && !USE_PRISMA_FOR_DATA) {
    try {
      const { orderStore } = await import("@/lib/dev/data-store");

      const now = Date.now();
      const TWO_HOURS = 2 * 60 * 60 * 1000;
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      const orders = orderStore.getAll();
      const activeOrders = orders.filter((o) => o.status === "en_cours");

      let reminders24h = 0;
      let remindersOverdue = 0;

      for (const order of activeOrders) {
        const deadlineTime = new Date(order.deadline).getTime();
        const timeLeft = deadlineTime - now;

        // Deadline in less than 24h (but not overdue) — within 2h detection window
        if (timeLeft > 0 && timeLeft <= TWENTY_FOUR_HOURS && timeLeft > TWENTY_FOUR_HOURS - TWO_HOURS) {
          emitEvent("order.deadline_24h", {
            orderId: order.id,
            serviceTitle: order.serviceTitle,
            amount: order.amount,
            freelanceId: order.freelanceId,
            freelanceName: "",
            freelanceEmail: "",
            clientId: order.clientId,
            clientName: order.clientName,
            clientEmail: "",
            deadline: order.deadline,
          }).catch((err) => console.error("[CRON] deadline_24h emitEvent error:", err));
          reminders24h++;
        }

        // Deadline overdue — within 2h detection window
        if (timeLeft <= 0 && timeLeft > -TWO_HOURS) {
          emitEvent("order.deadline_overdue", {
            orderId: order.id,
            serviceTitle: order.serviceTitle,
            amount: order.amount,
            freelanceId: order.freelanceId,
            freelanceName: "",
            freelanceEmail: "",
            clientId: order.clientId,
            clientName: order.clientName,
            clientEmail: "",
            deadline: order.deadline,
          }).catch((err) => console.error("[CRON] deadline_overdue emitEvent error:", err));
          remindersOverdue++;
        }
      }

      return NextResponse.json({
        success: true,
        checked: activeOrders.length,
        reminders24h,
        remindersOverdue,
      });
    } catch (error) {
      console.error("[CRON deadline-reminder] dev store error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la verification des deadlines" },
        { status: 500 }
      );
    }
  }

  // --- Production: use Prisma ---
  try {
    const { prisma } = await import("@/lib/prisma");

    const now = new Date();
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    const twoHoursFromNow = new Date(now.getTime() + TWO_HOURS_MS);
    const twentyFourHoursFromNow = new Date(now.getTime() + TWENTY_FOUR_HOURS_MS);
    const twoHoursAgo = new Date(now.getTime() - TWO_HOURS_MS);
    // Window for 24h reminder: deadline is between (24h - 2h) and 24h from now
    const twentyTwoHoursFromNow = new Date(now.getTime() + TWENTY_FOUR_HOURS_MS - TWO_HOURS_MS);

    // Find orders with deadlines approaching within 24h (not yet overdue)
    const orders24h = await prisma.order.findMany({
      where: {
        status: "EN_COURS",
        deadline: {
          gt: twentyTwoHoursFromNow,
          lte: twentyFourHoursFromNow,
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        freelanceId: true,
        clientId: true,
        deadline: true,
        freelance: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
      },
    });

    // Find orders that just became overdue (deadline passed within last 2h)
    const ordersOverdue = await prisma.order.findMany({
      where: {
        status: "EN_COURS",
        deadline: {
          gt: twoHoursAgo,
          lte: now,
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        freelanceId: true,
        clientId: true,
        deadline: true,
        freelance: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
      },
    });

    let reminders24h = 0;
    let remindersOverdue = 0;

    for (const order of orders24h) {
      emitEvent("order.deadline_24h", {
        orderId: order.id,
        serviceTitle: order.title ?? "",
        amount: order.amount,
        freelanceId: order.freelanceId,
        freelanceName: order.freelance?.name ?? "",
        freelanceEmail: order.freelance?.email ?? "",
        clientId: order.clientId,
        clientName: order.client?.name ?? "",
        clientEmail: order.client?.email ?? "",
        deadline: order.deadline.toISOString(),
      }).catch((err) => console.error("[CRON] deadline_24h emitEvent error:", err));
      reminders24h++;
    }

    for (const order of ordersOverdue) {
      emitEvent("order.deadline_overdue", {
        orderId: order.id,
        serviceTitle: order.title ?? "",
        amount: order.amount,
        freelanceId: order.freelanceId,
        freelanceName: order.freelance?.name ?? "",
        freelanceEmail: order.freelance?.email ?? "",
        clientId: order.clientId,
        clientName: order.client?.name ?? "",
        clientEmail: order.client?.email ?? "",
        deadline: order.deadline.toISOString(),
      }).catch((err) => console.error("[CRON] deadline_overdue emitEvent error:", err));
      remindersOverdue++;
    }

    return NextResponse.json({
      success: true,
      checked: orders24h.length + ordersOverdue.length,
      reminders24h,
      remindersOverdue,
    });
  } catch (error) {
    console.error("[CRON deadline-reminder]", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification des deadlines" },
      { status: 500 }
    );
  }
}
