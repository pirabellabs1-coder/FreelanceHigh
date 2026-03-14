/**
 * Password Reset Token Store
 * In-memory store for password reset tokens (upgradeable to Redis).
 * Shared between request and confirm API routes.
 */

import crypto from "crypto";

// In-memory store (upgradeable to Redis)
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

// Cleanup expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of resetTokens.entries()) {
    if (now > val.expiresAt) resetTokens.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Generate a secure reset token and store it with a 1-hour expiry.
 */
export function generateResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  resetTokens.set(token, {
    email: email.toLowerCase(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  return token;
}

/**
 * Validate a reset token without consuming it.
 */
export function validateResetToken(
  token: string
): { valid: boolean; email?: string; error?: string } {
  const record = resetTokens.get(token);
  if (!record) {
    return { valid: false, error: "Lien invalide ou expire." };
  }
  if (Date.now() > record.expiresAt) {
    resetTokens.delete(token);
    return { valid: false, error: "Lien expire. Demandez un nouveau lien." };
  }
  return { valid: true, email: record.email };
}

/**
 * Consume (delete) a reset token after successful password change.
 */
export function consumeResetToken(token: string): void {
  resetTokens.delete(token);
}
