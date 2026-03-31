import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import * as fs from "fs";
import * as path from "path";

export async function POST() {
  try {
    const summary: Record<string, number> = {};

    // ── Dev store: delete all JSON files ──
    if (IS_DEV) {
      const devDir = path.join(process.cwd(), "lib", "dev");
      if (fs.existsSync(devDir)) {
        const jsonFiles = fs.readdirSync(devDir).filter((f) => f.endsWith(".json"));
        for (const file of jsonFiles) {
          fs.unlinkSync(path.join(devDir, file));
        }
        summary.devJsonFilesDeleted = jsonFiles.length;
      }
    }

    // ── Prisma: delete in FK order ──
    try {
      const reviews = await prisma.review.deleteMany({});
      summary.reviews = reviews.count;
    } catch { summary.reviews = 0; }

    try {
      const escrows = await prisma.escrow.deleteMany({});
      summary.escrows = escrows.count;
    } catch { summary.escrows = 0; }

    try {
      const adminTx = await prisma.adminTransaction.deleteMany({});
      summary.adminTransactions = adminTx.count;
    } catch { summary.adminTransactions = 0; }

    try {
      const adminPayouts = await prisma.adminPayout.deleteMany({});
      summary.adminPayouts = adminPayouts.count;
    } catch { summary.adminPayouts = 0; }

    try {
      const walletTx = await prisma.walletTransaction.deleteMany({});
      summary.walletTransactions = walletTx.count;
    } catch { summary.walletTransactions = 0; }

    try {
      const orders = await prisma.order.deleteMany({});
      summary.orders = orders.count;
    } catch { summary.orders = 0; }

    try {
      const boosts = await prisma.boost.deleteMany({});
      summary.boosts = boosts.count;
    } catch { summary.boosts = 0; }

    try {
      const serviceViews = await prisma.serviceView.deleteMany({});
      summary.serviceViews = serviceViews.count;
    } catch { summary.serviceViews = 0; }

    try {
      const serviceClicks = await prisma.serviceClick.deleteMany({});
      summary.serviceClicks = serviceClicks.count;
    } catch { summary.serviceClicks = 0; }

    try {
      const propositions = await prisma.proposition.deleteMany({});
      summary.propositions = propositions.count;
    } catch { summary.propositions = 0; }

    try {
      const services = await prisma.service.deleteMany({});
      summary.services = services.count;
    } catch { summary.services = 0; }

    try {
      const profiles = await prisma.freelancerProfile.deleteMany({});
      summary.freelancerProfiles = profiles.count;
    } catch { summary.freelancerProfiles = 0; }

    // Delete all users except admins
    try {
      const users = await prisma.user.deleteMany({
        where: { role: { not: "ADMIN" } },
      });
      summary.users = users.count;
    } catch { summary.users = 0; }

    // Reset AdminWallet balance
    try {
      const wallets = await prisma.adminWallet.updateMany({
        data: { balance: 0, totalCommissions: 0, totalPayouts: 0 },
      });
      summary.adminWalletsReset = wallets.count;
    } catch { summary.adminWalletsReset = 0; }

    return NextResponse.json({
      success: true,
      message: "Toutes les donnees ont ete supprimees. Seuls les comptes admin sont conserves.",
      summary,
    });
  } catch (error) {
    console.error("[API /admin/reset-data POST]", error);
    return NextResponse.json(
      { error: "Erreur lors du reset des donnees" },
      { status: 500 }
    );
  }
}
