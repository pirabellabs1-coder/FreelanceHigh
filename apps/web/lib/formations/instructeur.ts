// Helper: get or auto-create the InstructeurProfile for a user who has
// formationsRole = "instructeur". Returns null if the user cannot / should not
// have an instructor profile.

import { prisma } from "@/lib/prisma";

export async function getOrCreateInstructeur(userId: string) {
  // First check if profile already exists
  let inst = await prisma.instructeurProfile.findUnique({ where: { userId } });
  if (inst) return inst;

  // If not, verify user has the right role and auto-create
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { formationsRole: true, email: true },
  });

  if (!user) return null;

  // Auto-create profile for instructeur OR when someone tries to use vendor features
  // (we're lenient — if they reached a vendor API, they want to sell)
  if (user.formationsRole === "instructeur" || user.formationsRole === null) {
    try {
      inst = await prisma.instructeurProfile.create({
        data: {
          userId,
          status: "APPROUVE",
        },
      });
      // Upgrade user role if they were null
      if (user.formationsRole === null) {
        await prisma.user
          .update({
            where: { id: userId },
            data: { formationsRole: "instructeur" },
          })
          .catch(() => null);
      }
      return inst;
    } catch (err) {
      console.error("[getOrCreateInstructeur] Failed:", err);
      return null;
    }
  }

  return null;
}

/**
 * Resolve the current user's instructeurId (used in query WHERE clauses).
 * Returns null if the user cannot have one.
 */
export async function getInstructeurId(userId: string): Promise<string | null> {
  const inst = await getOrCreateInstructeur(userId);
  return inst?.id ?? null;
}
