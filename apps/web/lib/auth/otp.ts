import crypto from "crypto";

// Generate a 6-digit numeric OTP code
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// In-memory OTP store (upgradeable to Redis later)
// Key: email, Value: { code, expiresAt, attempts }
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// Clean expired entries every 5 min
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (now > val.expiresAt) otpStore.delete(key);
  }
}, 5 * 60 * 1000);

// Store OTP for email (valid 10 minutes)
export function storeOTP(email: string): string {
  const code = generateOTP();
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
  return code;
}

// Verify OTP for email. Returns true if valid, false otherwise.
export function verifyOTP(email: string, code: string): { valid: boolean; error?: string } {
  const record = otpStore.get(email.toLowerCase());
  if (!record) {
    return { valid: false, error: "Code expire ou introuvable. Demandez un nouveau code." };
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "Code expire. Demandez un nouveau code." };
  }
  if (record.attempts >= 5) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "Trop de tentatives. Demandez un nouveau code." };
  }
  record.attempts++;

  // Constant-time comparison
  const isValid = crypto.timingSafeEqual(Buffer.from(code), Buffer.from(record.code));
  if (!isValid) {
    return { valid: false, error: "Code incorrect" };
  }

  // Valid — delete the OTP
  otpStore.delete(email.toLowerCase());
  return { valid: true };
}
