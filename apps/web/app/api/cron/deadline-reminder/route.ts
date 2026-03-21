import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/dev/data-store";
import { emitEvent } from "@/lib/events/dispatcher";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel cron or manual trigger)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
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
    console.error("[CRON deadline-reminder]", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification des deadlines" },
      { status: 500 }
    );
  }
}
