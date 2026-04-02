/**
 * Ensures the session user exists in the Prisma DB.
 * In DEV_MODE, the auth uses a local JSON store with IDs like "dev-admin-1"
 * that don't exist in the Prisma User table. This helper creates a minimal
 * user record so that FK constraints on CartItem, Enrollment, etc. don't fail.
 */
import prisma from "@freelancehigh/db";

const IS_DEV = process.env.DEV_MODE === "true";

export async function ensureUserInDb(session: {
  user: { id: string; email: string; name: string; role?: string };
}): Promise<void> {
  if (!IS_DEV) return; // In production, user always exists via proper auth flow

  try {
    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (existing) return;

    // Check by email to avoid duplicate email constraint
    const byEmail = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (byEmail) {
      // User exists with different ID (seed created user with cuid, but dev store uses "dev-admin-1").
      // In DEV_MODE: free up the email by appending old ID, then create the dev user with correct ID.
      await prisma.user.update({
        where: { id: byEmail.id },
        data: { email: `${byEmail.id}@migrated.dev` },
      });
    }

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
    // The route will fail with a more specific error if the user truly doesn't exist.
    console.error("[ensureUserInDb] Error:", err);
  }
}
