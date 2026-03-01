"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, Zap, Check } from "lucide-react";

// ─── Lock illustration ──────────────────────────────────────────────────
function LockIllustration() {
  return (
    <div className="flex justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <div className="absolute inset-4 rounded-full bg-white/10" />
        <svg viewBox="0 0 80 90" fill="none" className="w-14 h-14 relative z-10">
          {/* Lock body */}
          <rect
            x="8" y="38" width="64" height="50" rx="12"
            fill="white" fillOpacity="0.18"
            stroke="white" strokeOpacity="0.35" strokeWidth="1.5"
          />
          {/* Lock shackle */}
          <path
            d="M22 38V28C22 14 58 14 58 28V38"
            stroke="white" strokeOpacity="0.75" strokeWidth="7"
            strokeLinecap="round" fill="none"
          />
          {/* Keyhole */}
          <circle cx="40" cy="58" r="7" fill="white" fillOpacity="0.5" />
          <rect x="37" y="62" width="6" height="12" rx="3" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

const REASSURANCES = [
  "Lien sécurisé valable 15 minutes",
  "Vérifiez vos spams si nécessaire",
  "Votre compte et vos données restent intacts",
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
            <pattern id="fpwd-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fpwd-grid)" />
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
        <LockIllustration />
        <div>
          <h2 className="text-white text-3xl font-black leading-tight mb-3">
            Pas de panique,{" "}
            <br />
            <span className="text-yellow-300">ça arrive à tout le monde.</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Vous recevrez un lien de réinitialisation dans votre boîte mail en moins de 2 minutes.
          </p>
        </div>
        <ul className="space-y-3.5">
          {REASSURANCES.map((t) => (
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
          Besoin d&apos;aide ? Contactez-nous à{" "}
          <a
            href="mailto:support@freelancehigh.com"
            className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
          >
            support@freelancehigh.com
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: await supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
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
          {!sent ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-1.5">Mot de passe oublié</h1>
                <p className="text-gray-500 text-sm">
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer le lien"
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
              <h1 className="text-2xl font-black text-gray-900 mb-3">Email envoyé !</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-1.5">
                Un lien de réinitialisation a été envoyé à
              </p>
              <p className="text-gray-800 font-bold text-sm mb-6">{email}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-8">
                Vérifiez votre boîte mail et vos dossiers spams.
                <br />
                Le lien est valable 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2 mb-4 block mx-auto"
              >
                Renvoyer un lien
              </button>
              <Link
                href="/connexion"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour à la connexion
              </Link>
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
