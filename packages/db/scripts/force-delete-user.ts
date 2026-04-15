/**
 * Force-delete a user by nulling all FK refs manually before the final delete.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const EMAIL = "lechamanpro@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: { id: true, email: true, role: true, name: true },
  });

  if (!user) { console.log("  User not found"); return; }

  console.log(`\n  Force delete ${user.email} (${user.id})`);

  // Try to delete — full error trace
  try {
    await prisma.user.delete({ where: { id: user.id } });
    console.log("  ✓ Deleted");
  } catch (err) {
    console.error("\n  FULL ERROR:\n");
    console.error(err);
  }

  const remaining = await prisma.user.count();
  console.log(`\n  Total remaining: ${remaining}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
