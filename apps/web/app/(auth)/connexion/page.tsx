"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"freelance" | "client">("freelance");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to Supabase Auth
    console.log(form);
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Left Section: Visual Inspiration */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: "linear-gradient(135deg, #0e7c66 0%, #1a2e2a 100%)" }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100" width="100"></rect>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-accent p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#11211e] font-bold text-3xl">work</span>
            </div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">FreelanceHigh</h1>
          </div>

          <h2 className="text-white text-5xl font-black leading-tight mb-6">
            Rejoignez la révolution du freelancing en Afrique
          </h2>

          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Connectez-vous à la plus grande plateforme de talents en Afrique. Trouvez des opportunités mondiales ou engagez les meilleurs experts locaux.
          </p>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-accent text-3xl font-bold">50k+</span>
              <span className="text-white/60 text-sm">Freelances actifs</span>
            </div>
            <div className="w-px h-12 bg-white/20 mx-4"></div>
            <div className="flex flex-col gap-1">
              <span className="text-accent text-3xl font-bold">12k+</span>
              <span className="text-white/60 text-sm">Projets terminés</span>
            </div>
          </div>
        </div>

        {/* Decorative blob */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">work</span>
            <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold">FreelanceHigh</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Bienvenue</h2>
            <p className="text-slate-600 dark:text-slate-400">Veuillez entrer vos coordonnées pour continuer.</p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 mb-8 rounded-xl bg-primary/10 dark:bg-neutral-dark border border-primary/20">
            <button
              type="button"
              onClick={() => setRole("freelance")}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                role === "freelance"
                  ? "bg-primary text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-400 font-medium hover:text-primary"
              }`}
            >
              Je suis un Freelance
            </button>
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                role === "client"
                  ? "bg-primary text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-400 font-medium hover:text-primary"
              }`}
            >
              Je suis un Client
            </button>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-primary/20 rounded-xl hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-primary/20 rounded-xl hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="#0077b5" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
              <span className="text-sm font-semibold">LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-slate-200 dark:border-primary/10"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-widest font-bold">Ou avec email</span>
            <div className="flex-grow border-t border-slate-200 dark:border-primary/10"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nom@exemple.com"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-dark border border-slate-200 dark:border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Mot de passe</label>
                <Link href="/mot-de-passe-oublie" className="text-xs font-bold text-primary hover:text-primary/80">Oublié ?</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-neutral-dark border border-slate-200 dark:border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all mt-4"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Vous n&apos;avez pas encore de compte ?{" "}
              <Link href="/inscription" className="text-primary font-bold hover:underline ml-1">
                Inscrivez-vous gratuitement
              </Link>
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 opacity-60">
            <Link href="/cgu" className="text-xs hover:text-primary transition-colors">Conditions d&apos;utilisation</Link>
            <Link href="/confidentialite" className="text-xs hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link href="/contact" className="text-xs hover:text-primary transition-colors">Aide</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
