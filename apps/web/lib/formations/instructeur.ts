// Helper: get or auto-create the InstructeurProfile for the current user.
//
// Policy: if a user reaches any vendor API (funnels, sequences, products, etc.),
// they clearly want to sell. So we create the profile no matter what their
// formationsRole is. The only reason this returns null is if the user literally
// does not exist in the database.

import { prisma } from "@/lib/prisma";

export async function getOrCreateInstructeur(userId: string) {
  try {
    // First check if profile already exists
    const existing = await prisma.instructeurProfile.findUnique({ where: { userId } });
    if (existing) return existing;

    // Verify the user exists in the DB before trying to create a profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, formationsRole: true, email: true },
    });

    if (!user) {
      console.warn(
        `[getOrCreateInstructeur] User ${userId} not found in DB — cannot create profile`
      );
      return null;
    }

    // Create the profile — be permissive, the user is clearly trying to sell
    const inst = await prisma.instructeurProfile.create({
      data: {
        userId,
        status: "APPROUVE",
      },
    });

    // Align formationsRole to "instructeur" so future API calls don't re-check
    if (user.formationsRole !== "instructeur") {
      await prisma.user
        .update({
          where: { id: userId },
          data: { formationsRole: "instructeur" },
        })
        .catch((e) => console.warn("[getOrCreateInstructeur] role update failed:", e));
    }

    return inst;
  } catch (err) {
    // Could be a race condition (concurrent request created the profile first)
    // Retry a findUnique — if it now exists, return it
    try {
      const retry = await prisma.instructeurProfile.findUnique({ where: { userId } });
      if (retry) return retry;
    } catch {
      /* ignore */
    }
    console.error("[getOrCreateInstructeur] Fatal error:", err);
    return null;
  }
}

/**
 * Resolve the current user's instructeurId (used in query WHERE clauses).
 * Returns null only if the user doesn't exist in the DB at all.
 */
export async function getInstructeurId(userId: string): Promise<string | null> {
  const inst = await getOrCreateInstructeur(userId);
  return inst?.id ?? null;
}
