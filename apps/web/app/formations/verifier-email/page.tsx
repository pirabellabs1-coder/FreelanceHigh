"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const OTP_EXPIRY_SECONDS = 10 * 60;

export default function FormationsVerifierEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect") || "/formations/mes-formations";
  const formationsRole = searchParams.get("role") || "apprenant";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function formatTime(s: number) {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  function handleDigitChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setError("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (char && index === 5) {
      const code = newDigits.join("");
      if (code.length === 6) {
        handleVerify(code);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);
    setError("");

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  }

  const handleVerify = useCallback(
    async (code?: string) => {
      const otp = code || digits.join("");
      if (otp.length !== 6) {
        setError("Veuillez entrer les 6 chiffres du code.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otp }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur de verification");
          setLoading(false);
          return;
        }

        if (data.verified) {
          setSuccess(true);
          // Redirect to login page with verified flag
          router.push(`/formations/connexion?verified=1&role=${formationsRole}`);
        }
      } catch {
        setError("Une erreur est survenue. Veuillez reessayer.");
      } finally {
        setLoading(false);
      }
    },
    [digits, email, router, formationsRole]
  );

  async function handleResend() {
    setResendLoading(true);
    setResendMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors du renvoi");
      } else {
        setResendMessage("Un nouveau code a ete envoye a votre adresse email.");
        setSecondsLeft(OTP_EXPIRY_SECONDS);
        setDigits(["", "", "", "", "", ""]);
      }
    } catch {
      setError("Erreur reseau");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">
                {success ? "check_circle" : "mail"}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {success ? "Email verifie !" : "Verifiez votre email"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {success
              ? "Votre adresse email a ete verifiee. Vous allez etre redirige..."
              : `Un code de verification a 6 chiffres a ete envoye a ${email || "votre adresse email"}.`}
          </p>
        </div>

        {!success && (
          <>
            {/* Timer */}
            <div className="text-center">
              <p className={`text-sm font-mono ${secondsLeft < 60 ? "text-red-400" : "text-slate-400"}`}>
                Code valide pendant : {formatTime(secondsLeft)}
              </p>
            </div>

            {/* Error / Messages */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            {resendMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm">
                {resendMessage}
              </div>
            )}

            {/* OTP Input */}
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || digits.join("").length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Verification...
                </span>
              ) : (
                "Verifier le code"
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
              >
                {resendLoading ? "Renvoi en cours..." : "Renvoyer le code"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
