/**
 * Ensures the session user exists in the Prisma DB.
 * In DEV_MODE, the auth uses a local JSON store with IDs like "dev-admin-1"
 * that don't exist in the Prisma User table. This helper creates a minimal
 * user record so that FK constraints on CartItem, Enrollment, etc. don't fail.
 *
 * IMPORTANT: When a seeded user exists with the same email but different ID,
 * we UPDATE the existing user's ID to match the dev-store ID. This preserves
 * all existing enrollments, certificates, and progress (no data loss).
 */
import prisma from "@freelancehigh/db";

const IS_DEV = process.env.DEV_MODE === "true";

export async function ensureUserInDb(session: {
  user: { id: string; email: string; name: string; role?: string };
}): Promise<void> {
  if (!IS_DEV) return; // In production, user always exists via proper auth flow

  try {
    // 1. Check if user exists with this exact ID — fast path
    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (existing) return;

    // 2. Check if user exists by email (e.g., from seed data with a different cuid)
    const byEmail = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (byEmail) {
      // User exists with different ID (seed created user with cuid, but dev store uses "dev-admin-1").
      // Update the existing user's ID to match the dev-store ID so all FKs (enrollments,
      // certificates, progress) remain linked. We use raw SQL because Prisma doesn't
      // allow PK updates through the normal API.
      const oldId = byEmail.id;
      const newId = session.user.id;

      await prisma.$transaction(async (tx) => {
        // Manually update FK references in key tables that reference User.id
        // This ensures data integrity even if ON UPDATE CASCADE is not set.
        const fkUpdates = [
          `UPDATE "Enrollment" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "Certificate" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "LessonProgress" SET "enrollmentId" = "enrollmentId" WHERE "enrollmentId" IN (SELECT id FROM "Enrollment" WHERE "userId" = $2)`,
          `UPDATE "CartItem" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "Favorite" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "Review" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "Account" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "Session" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "InstructeurProfile" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "FreelancerProfile" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "ClientProfile" SET "userId" = $1 WHERE "userId" = $2`,
          `UPDATE "AgencyProfile" SET "userId" = $1 WHERE "userId" = $2`,
        ];

        for (const sql of fkUpdates) {
          try {
            await tx.$executeRawUnsafe(sql, newId, oldId);
          } catch {
            // Table may not exist or no rows to update — continue
          }
        }

        // Now update the User's primary key
        await tx.$executeRawUnsafe(
          `UPDATE "User" SET id = $1 WHERE id = $2`,
          newId,
          oldId
        );
      });

      console.log(`[ensureUserInDb] Remapped user ID: ${oldId} → ${newId} (email: ${session.user.email})`);
      return;
    }

    // 3. No user by ID or email — create new
    await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        passwordHash: "",
        role: (session.user.role || "CLIENT").toUpperCase() as "FREELANCE" | "CLIENT" | "AGENCE" | "ADMIN",
        status: "ACTIF",
        kyc: 1,
        plan: "GRATUIT",
      },
    });
  } catch (err) {
    // In DEV_MODE, log but don't crash — allow the request to continue.
    console.error("[ensureUserInDb] Error:", err);
  }
}
