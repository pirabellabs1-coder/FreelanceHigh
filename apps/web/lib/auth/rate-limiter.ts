// Rate limiter en memoire — upgradeable Redis plus tard
// 5 tentatives par email / 15 minutes de lockout

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const LOCKOUT_MS = 15 * 60 * 1000; // 15 min

export function checkRateLimit(key: string): { allowed: boolean; remainingAttempts: number; lockedUntil: number | null } {
  const now = Date.now();
  const record = attempts.get(key);

  // Pas de record — premiere tentative
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Verifier le lockout
  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remainingAttempts: 0, lockedUntil: record.lockedUntil };
  }

  // Lockout expire — reset
  if (record.lockedUntil && now >= record.lockedUntil) {
    attempts.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Fenetre expiree — reset
  if (now - record.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  const remaining = MAX_ATTEMPTS - record.count;
  return { allowed: remaining > 0, remainingAttempts: Math.max(0, remaining), lockedUntil: null };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now, lockedUntil: null });
    return;
  }

  record.count++;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
}

export function resetAttempts(key: string): void {
  attempts.delete(key);
}

// Nettoyage periodique des entrees expirees (toutes les 5 min)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of attempts.entries()) {
      if (record.lockedUntil && now >= record.lockedUntil) {
        attempts.delete(key);
      } else if (now - record.firstAttemptAt > WINDOW_MS) {
        attempts.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
