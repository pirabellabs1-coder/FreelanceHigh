/**
 * Delete user with statement_timeout disabled for this session.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const EMAIL = "lechamanpro@gmail.com";

  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) { console.log("not found"); return; }

  console.log(`  Nuking ${user.email} (${user.id})`);

  // Disable statement timeout for this session
  await prisma.$executeRawUnsafe(`SET statement_timeout = 0`);

  // Now do the delete
  const r = await prisma.$executeRawUnsafe(
    `DELETE FROM "User" WHERE id = $1`,
    user.id
  );
  console.log(`  ✓ Deleted (${r} row)`);

  const remaining = await prisma.user.count();
  console.log(`  Total restant: ${remaining}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
