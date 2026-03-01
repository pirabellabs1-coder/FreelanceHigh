"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, Zap, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Shield illustration ─────────────────────────────────────────────────
function ShieldIllustration() {
  return (
    <div className="flex justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <div className="absolute inset-4 rounded-full bg-white/10" />
        <svg viewBox="0 0 100 112" fill="none" className="w-16 h-16 relative z-10">
          <path
            d="M50 6 L90 24 L90 62 C90 86 50 106 50 106 C50 106 10 86 10 62 L10 24 Z"
            fill="white" fillOpacity="0.18"
            stroke="white" strokeOpacity="0.35" strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M32 57 L45 70 L70 42"
            stroke="white" strokeOpacity="0.9"
            strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Password strength ───────────────────────────────────────────────────
type Strength = { label: string; score: number; color: string; bar: string };

function getStrength(pwd: string): Strength {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { label: "Faible", score, color: "text-red-500", bar: "bg-red-500" };
  if (score === 2) return { label: "Moyen", score, color: "text-orange-500", bar: "bg-orange-400" };
  return { label: "Fort", score, color: "text-emerald-500", bar: "bg-emerald-500" };
}

const TIPS = [
  "Au moins 8 caractères recommandés",
  "Mélangez lettres, chiffres et symboles",
  "N'utilisez pas le même mot de passe ailleurs",
];

// ─── Left panel ─────────────────────────────────────────────────────────
function LeftPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
      style={{ background: "linear-gradient(145deg, #6C2BD9 0%, #4A1B9E 55%, #2D1060 100%)" }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="reset-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reset-grid)" />
        </svg>
      </div>
      {/* Glow blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="bg-white/15 p-2 rounded-xl">
            <Zap className="h-6 w-6 text-white fill-white" />
          </div>
          <span className="text-white text-xl font-extrabold tracking-tight">FreelanceHigh</span>
        </Link>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-10 gap-6">
        <ShieldIllustration />
        <div>
          <h2 className="text-white text-3xl font-black leading-tight mb-3">
            Choisissez un mot de passe{" "}
            <span className="text-yellow-300">fort et unique.</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Un bon mot de passe protège votre compte, vos finances et vos données professionnelles.
          </p>
        </div>
        <ul className="space-y-3.5">
          {TIPS.map((t) => (
            <li key={t} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-white/80 text-sm leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom */}
      <div className="relative z-10 border-t border-white/15 pt-6">
        <p className="text-white/40 text-xs">
          Vos données sont chiffrées · Connexion sécurisée SSL
        </p>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────
export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = password ? getStrength(password) : null;
  const mismatch = confirm.length > 0 && password !== confirm;
  const confirmOk = confirm.length > 0 && password === confirm;

  // Redirect after success
  useEffect(() => {
    if (!success) return;
    const id = setTimeout(() => router.push("/connexion?reset=1"), 2500);
    return () => clearTimeout(id);
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setError("");
    setLoading(true);
    // TODO: await supabase.auth.updateUser({ password })
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <LeftPanel />

      {/* ── Right panel ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-6 py-12 sm:px-10 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 self-start">
          <Link href="/" className="inline-flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600 fill-purple-600" />
            <span className="text-xl font-extrabold text-gray-900">FreelanceHigh</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {!success ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-1.5">Nouveau mot de passe</h1>
                <p className="text-gray-500 text-sm">
                  Choisissez un mot de passe sécurisé pour votre compte.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </span>
                    <input
                      type={showPwd ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength indicator */}
                  {password && strength && (
                    <div className="mt-2.5">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score ? strength.bar : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${strength.color}`}>
                        {strength.label}
                        {strength.score < 3 && (
                          <span className="text-gray-400 font-normal">
                            {" "}— ajoutez des majuscules, chiffres ou symboles
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-11 py-3 border rounded-xl bg-gray-50 focus:bg-white outline-none text-sm transition-all ${
                        mismatch
                          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                          : confirmOk
                          ? "border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mismatch && (
                    <p className="text-xs text-red-500 font-semibold mt-1.5">
                      Les mots de passe ne correspondent pas.
                    </p>
                  )}
                  {confirmOk && (
                    <p className="text-xs text-emerald-500 font-semibold mt-1.5">
                      Les mots de passe correspondent.
                    </p>
                  )}
                </div>

                {/* Global error */}
                {error && (
                  <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || mismatch || !password || !confirm}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Réinitialisation…
                    </>
                  ) : (
                    "Réinitialiser mon mot de passe"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/connexion"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                Mot de passe modifié !
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Votre mot de passe a été mis à jour avec succès.
                <br />
                Vous allez être redirigé vers la connexion…
              </p>
              {/* Redirect progress bar */}
              <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-[2500ms] ease-linear"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">Redirection en cours…</p>
            </div>
          )}

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 mt-12 text-xs text-gray-400">
            <Link href="/cgu" className="hover:text-gray-600 transition-colors">CGU</Link>
            <span>·</span>
            <Link href="/confidentialite" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-600 transition-colors">Aide</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
