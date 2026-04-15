/**
 * Nuke a specific user by deleting all their related rows one table at a time
 * via raw SQL to avoid Prisma's massive cascade timeout.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const EMAIL = "lechamanpro@gmail.com";

  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) { console.log("not found"); return; }

  const id = user.id;
  console.log(`\n  Nuking user ${EMAIL} (${id})\n`);

  // Tables that reference User.id directly — delete children first
  // Use raw SQL with explicit userId filter to keep it fast
  const tables = [
    "Message",
    "Conversation",
    "ConversationUser",
    "Notification",
    "Order",
    "Service",
    "Review",
    "Portfolio",
    "CustomOffer",
    "AgencyProfile",
    "AgencyMember",
    "UserBadge",
    "FreelanceProfile",
    "ClientProfile",
    "Certification",
    "Skill",
    "Education",
    "Experience",
    "KycDocument",
    "Transaction",
    "Invoice",
    "Favorite",
    "Proposal",
    "Dispute",
    "WithdrawalRequest",
    "PaymentMethod",
    "ActivityLog",
    "Session",
    "Account",
    "VerificationToken",
    "OtpCode",
    "AnalyticsEvent",
    "PasswordResetToken",
  ];

  for (const t of tables) {
    try {
      const r = await prisma.$executeRawUnsafe(
        `DELETE FROM "${t}" WHERE "userId" = $1`,
        id
      );
      if (r > 0) console.log(`  ✓ ${t}: ${r}`);
    } catch {
      // Table doesn't exist or doesn't have userId — skip silently
    }
  }

  // Finally delete the user
  try {
    const r = await prisma.$executeRawUnsafe(
      `DELETE FROM "User" WHERE id = $1`,
      id
    );
    console.log(`\n  ✓ User deleted: ${r} row(s)`);
  } catch (e) {
    console.error("\n  ✗ User delete failed:", e);
  }

  const remaining = await prisma.user.count();
  console.log(`\n  Total remaining: ${remaining}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
