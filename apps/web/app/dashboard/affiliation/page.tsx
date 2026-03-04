"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const REFERRAL_LINK = "https://freelancehigh.com/ref/lissanon-gildas";

const TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    range: "0-10 parrainages",
    icon: "emoji_events",
    gradient: "from-amber-700 to-amber-900",
    status: "unlocked" as const,
    statusLabel: "Debloque",
    benefits: ["Commission standard", "Acces communaute"],
  },
  {
    id: "argent",
    name: "Argent",
    range: "11-50 parrainages",
    icon: "military_tech",
    gradient: "from-slate-300 to-slate-500",
    status: "current" as const,
    statusLabel: "Actuel",
    benefits: ["Commission +2%", "Support prioritaire"],
  },
  {
    id: "or",
    name: "Or",
    range: "51-100 parrainages",
    icon: "workspace_premium",
    gradient: "from-yellow-400 to-amber-600",
    status: "locked" as const,
    statusLabel: "Verrouille",
    benefits: ["Commission +5%", "Badge profil exclusif", "Webinaires VIP"],
  },
  {
    id: "ambassadeur",
    name: "Ambassadeur",
    range: "100+ parrainages",
    icon: "diamond",
    gradient: "from-cyan-300 to-blue-500",
    status: "locked" as const,
    statusLabel: "Verrouille",
    benefits: [
      "Recompenses Cash VIP",
      "Evenements physiques",
      "Conseil consultatif",
    ],
  },
];

const STATS = [
  {
    label: "Total parrainages",
    value: 35,
    icon: "group_add",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Gains cumules",
    value: 875,
    prefix: "\u20AC",
    icon: "payments",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Taux de conversion",
    value: 23,
    suffix: "%",
    icon: "trending_up",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const REWARDS_HISTORY = [
  {
    id: "r1",
    reward: "Bonus Palier Argent",
    date: "2026-01-15",
    status: "verse" as const,
    value: "\u20AC50",
  },
  {
    id: "r2",
    reward: 'Badge "Pionnier Freelance"',
    date: "2026-01-20",
    status: "active" as const,
    value: "Badge",
  },
  {
    id: "r3",
    reward: "Bonus de Bienvenue",
    date: "2025-12-01",
    status: "verse" as const,
    value: "\u20AC5",
  },
  {
    id: "r4",
    reward: "Commission parrainage",
    date: "2026-02-10",
    status: "verse" as const,
    value: "\u20AC15",
  },
  {
    id: "r5",
    reward: "Commission parrainage",
    date: "2026-02-25",
    status: "en_attente" as const,
    value: "\u20AC10",
  },
];

const REWARD_STATUS_STYLES: Record<
  string,
  { label: string; color: string }
> = {
  verse: { label: "Verse", color: "text-emerald-400 bg-emerald-500/10" },
  active: { label: "Active", color: "text-blue-400 bg-blue-500/10" },
  en_attente: { label: "En attente", color: "text-amber-400 bg-amber-500/10" },
};

const INVITED_FRIENDS = [
  {
    id: "f1",
    name: "Marie Kouassi",
    date: "15/01/2026",
    gender: "f",
    status: "active" as const,
  },
  {
    id: "f2",
    name: "Ibrahim Sow",
    date: "20/01/2026",
    gender: "m",
    status: "active" as const,
  },
  {
    id: "f3",
    name: "Fatou Diop",
    date: "05/02/2026",
    gender: "f",
    status: "active" as const,
  },
  {
    id: "f4",
    name: "Jean-Paul Mbaye",
    date: "10/02/2026",
    gender: "m",
    status: "pending" as const,
  },
  {
    id: "f5",
    name: "Amina Toure",
    date: "25/02/2026",
    gender: "f",
    status: "active" as const,
  },
];

// ---------------------------------------------------------------------------
// Invite Modal component
// ---------------------------------------------------------------------------

function InviteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addToast = useToastStore((s) => s.addToast);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function handleSend() {
    if (!email.trim() || !email.includes("@")) {
      addToast("error", "Veuillez entrer une adresse email valide.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      addToast("success", `Invitation envoyee a ${email} !`);
      setEmail("");
      setMessage("");
      onClose();
    }, 800);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-neutral-dark border border-border-dark rounded-xl w-full max-w-md p-6 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              person_add
            </span>
            Inviter un ami
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-border-dark transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ami@exemple.com"
            className="w-full px-4 py-3 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-600"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Message personnel (optionnel)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Rejoins FreelanceHigh, la plateforme freelance qui monte !"
            rows={3}
            className="w-full px-4 py-3 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-600 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
          >
            {sending && (
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
            )}
            {sending ? "Envoi..." : "Envoyer l'invitation"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function AffiliationPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [showInviteModal, setShowInviteModal] = useState(false);

  function handleCopyLink() {
    navigator.clipboard
      .writeText(REFERRAL_LINK)
      .then(() => {
        addToast("success", "Lien de parrainage copie dans le presse-papier !");
      })
      .catch(() => {
        addToast("error", "Impossible de copier le lien.");
      });
  }

  function handleShare(platform: string) {
    const text = encodeURIComponent(
      "Rejoins FreelanceHigh, la plateforme freelance qui eleve ta carriere au plus haut niveau !"
    );
    const url = encodeURIComponent(REFERRAL_LINK);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${encodeURIComponent("Rejoins FreelanceHigh")}&body=${text}%20${url}`,
    };

    const target = urls[platform];
    if (target) {
      window.open(target, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="max-w-full space-y-8">
      <InviteModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      {/* ================================================================= */}
      {/* Hero Section                                                      */}
      {/* ================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-accent text-lg">
              auto_awesome
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Programme d&apos;Affiliation
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Programme de Recompenses par Paliers
          </h2>
          <p className="text-slate-400 mt-1 max-w-xl">
            Parrainez des amis et debloquez des recompenses exclusives a chaque
            palier atteint. Plus vous parrainez, plus vos avantages augmentent.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:border-primary/50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">share</span>
            Partager mon lien
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Inviter un ami
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Progress Card                                                     */}
      {/* ================================================================= */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl p-6 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <div className="relative">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">
              trending_up
            </span>
            <h3 className="font-bold text-lg">Votre Progression Actuelle</h3>
          </div>

          {/* Progress percentage */}
          <div className="flex items-end gap-3 mb-1">
            <span className="text-5xl font-extrabold">65%</span>
            <span className="text-slate-400 text-sm font-semibold mb-2">
              Vers le niveau Or
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-background-dark/80 rounded-full overflow-hidden mt-3 mb-5">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: "65%",
                background: "linear-gradient(90deg, #0e7c66, #F2B705)",
                boxShadow: "0 0 12px rgba(242, 183, 5, 0.4)",
              }}
            />
          </div>

          {/* Status row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-background-dark/50 rounded-lg px-4 py-3">
              <span className="material-symbols-outlined text-primary text-lg">
                verified
              </span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Niveau actuel
                </p>
                <p className="text-sm font-bold">Argent (35 parrainages)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-background-dark/50 rounded-lg px-4 py-3">
              <span className="material-symbols-outlined text-accent text-lg">
                arrow_forward
              </span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Distance
                </p>
                <p className="text-sm font-bold">
                  Plus que 15 parrainages pour atteindre Or
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-background-dark/50 rounded-lg px-4 py-3">
              <span className="material-symbols-outlined text-slate-500 text-lg">
                lock
              </span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Prochain palier
                </p>
                <p className="text-sm font-bold">Or (50 parrainages)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Referral Link Section                                             */}
      {/* ================================================================= */}
      <div className="bg-background-dark/50 border border-border-dark rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">link</span>
          Votre lien de parrainage
        </h3>

        {/* Link input + copy */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={REFERRAL_LINK}
            className="flex-1 px-4 py-3 bg-neutral-dark border border-border-dark rounded-lg text-sm text-slate-300 font-mono outline-none select-all"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex-shrink-0"
          >
            <span className="material-symbols-outlined text-lg">
              content_copy
            </span>
            Copier
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold mr-1">
            Partager via :
          </span>
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600/10 border border-green-600/20 rounded-lg text-xs font-semibold text-green-400 hover:bg-green-600/20 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter / X
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/10 border border-blue-600/20 rounded-lg text-xs font-semibold text-blue-400 hover:bg-blue-600/20 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </button>
          <button
            onClick={() => handleShare("email")}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-500/10 border border-slate-500/20 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-500/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">email</span>
            Email
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Tiers Grid                                                        */}
      {/* ================================================================= */}
      <div>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-accent">
            emoji_events
          </span>
          Paliers de Recompenses
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {TIERS.map((tier) => {
            const isLocked = tier.status === "locked";
            const isCurrent = tier.status === "current";

            return (
              <div
                key={tier.id}
                className={cn(
                  "bg-background-dark/50 rounded-xl border-2 p-6 relative transition-all",
                  isCurrent
                    ? "border-primary"
                    : isLocked
                      ? "border-border-dark opacity-70"
                      : "border-border-dark",
                  !isLocked && "hover:border-primary/30"
                )}
              >
                {/* Status badge */}
                <div className="absolute -top-3 right-4">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full",
                      isCurrent
                        ? "bg-primary text-white"
                        : isLocked
                          ? "bg-slate-700 text-slate-400"
                          : "bg-emerald-500/10 text-emerald-400"
                    )}
                  >
                    {tier.statusLabel}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                    tier.gradient,
                    isLocked && "grayscale"
                  )}
                >
                  <span className="material-symbols-outlined text-2xl text-white">
                    {tier.icon}
                  </span>
                </div>

                {/* Name + range */}
                <h4 className="text-lg font-extrabold mb-0.5">{tier.name}</h4>
                <p className="text-xs text-slate-500 mb-4">{tier.range}</p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined text-sm flex-shrink-0 mt-0.5",
                          isLocked ? "text-slate-600" : "text-emerald-400"
                        )}
                      >
                        {isLocked ? "lock" : "check"}
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* Stats Cards                                                       */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-background-dark/50 border border-border-dark rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  stat.bg
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-lg",
                    stat.color
                  )}
                >
                  {stat.icon}
                </span>
              </div>
            </div>
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix || ""}
              suffix={stat.suffix || ""}
              className="text-3xl font-extrabold block"
            />
          </div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* Rewards History Table                                             */}
      {/* ================================================================= */}
      <div className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-500">
              history
            </span>
            <h3 className="font-bold">Historique des Recompenses</h3>
          </div>
          <span className="text-xs text-slate-500">
            {REWARDS_HISTORY.length} recompense(s)
          </span>
        </div>

        {/* Table header - desktop */}
        <div className="hidden sm:grid grid-cols-4 gap-4 px-6 py-3 border-b border-border-dark text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Recompense</span>
          <span>Date</span>
          <span>Statut</span>
          <span className="text-right">Valeur</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border-dark">
          {REWARDS_HISTORY.map((reward) => {
            const status = REWARD_STATUS_STYLES[reward.status];
            return (
              <div
                key={reward.id}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 px-6 py-4 hover:bg-primary/5 transition-colors"
              >
                <p className="text-sm font-semibold">{reward.reward}</p>
                <p className="text-sm text-slate-400">
                  {new Date(reward.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div>
                  <span
                    className={cn(
                      "text-xs font-bold px-2.5 py-1 rounded-full",
                      status?.color
                    )}
                  >
                    {status?.label}
                  </span>
                </div>
                <p className="text-sm font-bold sm:text-right">
                  {reward.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* Invited Friends List                                              */}
      {/* ================================================================= */}
      <div className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-500">
              group
            </span>
            <h3 className="font-bold">Amis Invites</h3>
          </div>
          <span className="text-xs text-slate-500">
            {INVITED_FRIENDS.length} parrainage(s)
          </span>
        </div>

        <div className="divide-y divide-border-dark">
          {INVITED_FRIENDS.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                {friend.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{friend.name}</p>
                <p className="text-xs text-slate-500">
                  {friend.gender === "f" ? "Inscrite" : "Inscrit"} le{" "}
                  {friend.date}
                </p>
              </div>

              {/* Status */}
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0",
                  friend.status === "active"
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-amber-400 bg-amber-500/10"
                )}
              >
                {friend.status === "active"
                  ? friend.gender === "f"
                    ? "Active"
                    : "Actif"
                  : "En attente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
