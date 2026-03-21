"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToastStore } from "@/store/toast";
import { useCurrencyStore } from "@/store/currency";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

interface FreelancerAgencyView {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  country: string;
  countryFlag: string;
  online: boolean;
  available: boolean;
  memberSince: string;
  responseTime: string;
  responseRate: string;
  bio: string;
  badges: string[];
  skills: { name: string; level: string; percent: number }[];
  tags: string[];
  languages: { name: string; level: string; flag: string }[];
  formations: { title: string; school: string; year: string; type: "diploma" | "certification" }[];
  services: { id: string; title: string; price: number; rating: number; reviews: number; delivery: string }[];
  portfolio: { id: string; title: string; image: string; tags: string[] }[];
  reviews: { id: string; author: string; avatar: string; rating: number; text: string; date: string; service: string }[];
  stats: { completedOrders: number; satisfiedClients: number; satisfaction: number; avgDelivery: string; totalEarnings: number; rating: number };
  availability: { monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; saturday: string; sunday: string };
  hourlyRate: number;
  inTeam: boolean;
}

// ============================================================
// Config
// ============================================================

const BADGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  verified: { label: "Vérifié", icon: "verified", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  top_rated: { label: "Top Rated", icon: "workspace_premium", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  pro: { label: "Pro", icon: "star", color: "bg-primary/10 text-primary border-primary/20" },
  rising_talent: { label: "Rising", icon: "trending_up", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  elite: { label: "Elite", icon: "diamond", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
};

const DAY_LABELS: Record<string, string> = {
  monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi",
  friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn("material-symbols-outlined text-sm", i < Math.floor(rating) ? "fill-icon text-primary" : i < rating ? "fill-icon text-primary" : "text-slate-400")}>
          {i < Math.floor(rating) ? "star" : i + 0.5 <= rating ? "star_half" : "star"}
        </span>
      ))}
    </div>
  );
}

// ============================================================
// Page Component
// ============================================================

export default function AgenceFreelanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useToastStore(s => s.addToast);
  const { format } = useCurrencyStore();

  const [freelancer, setFreelancer] = useState<FreelancerAgencyView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "services" | "portfolio" | "reviews" | "availability">("overview");
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState("freelance_member");
  const [subcontractModal, setSubcontractModal] = useState(false);
  const [subcontractData, setSubcontractData] = useState({ project: "", description: "", budget: "", deadline: "" });
  const [contractModal, setContractModal] = useState(false);
  const [contractData, setContractData] = useState({ type: "prestation", duration: "6", rate: "", description: "" });
  const [messageModal, setMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isInTeam, setIsInTeam] = useState(false);

  useEffect(() => {
    const fetchFreelancer = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/profiles/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setFreelancer(data);
        setIsInTeam(data.inTeam ?? false);
        setContractData(d => ({ ...d, rate: String(data.hourlyRate ?? "") }));
      } catch {
        setError(true);
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchFreelancer();
    }
  }, [params.id]);

  const avgRating = freelancer && freelancer.reviews.length > 0
    ? (freelancer.reviews.reduce((a, r) => a + r.rating, 0) / freelancer.reviews.length).toFixed(1)
    : "0.0";

  const handleInvite = () => {
    if (!freelancer) return;
    setIsInTeam(true);
    setInviteModal(false);
    addToast("success", `${freelancer.name} a été invité dans votre équipe en tant que ${inviteRole === "freelance_member" ? "Membre freelance" : inviteRole === "manager" ? "Manager" : "Commercial"}`);
  };

  const handleSubcontract = () => {
    if (!freelancer) return;
    setSubcontractModal(false);
    setSubcontractData({ project: "", description: "", budget: "", deadline: "" });
    addToast("success", `Commande de sous-traitance envoyée à ${freelancer.name}`);
  };

  const handleContract = () => {
    if (!freelancer) return;
    setContractModal(false);
    addToast("success", `Proposition de contrat long terme envoyée à ${freelancer.name}`);
  };

  const handleMessage = () => {
    setMessageModal(false);
    setMessageText("");
    addToast("success", "Message envoyé");
  };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Retour
          </button>
          <span>/</span>
          <span className="text-slate-400">Profil freelance</span>
        </div>
        <div className="bg-neutral-dark rounded-2xl border border-border-dark p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-28 h-28 rounded-2xl bg-border-dark" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-48 bg-border-dark rounded" />
              <div className="h-5 w-72 bg-border-dark rounded" />
              <div className="h-4 w-64 bg-border-dark rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-border-dark">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-background-dark rounded-xl p-3 h-20" />
            ))}
          </div>
        </div>
        <div className="h-12 bg-neutral-dark rounded-xl border border-border-dark" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-neutral-dark rounded-xl border border-border-dark p-6 h-40 animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-neutral-dark rounded-xl border border-border-dark p-6 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error / Not Found State ──
  if (error || !freelancer) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Retour
          </button>
          <span>/</span>
          <span className="text-slate-400">Profil freelance</span>
        </div>
        <div className="bg-neutral-dark rounded-2xl border border-border-dark p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">person_off</span>
          <h2 className="text-xl font-bold text-white mb-2">Freelance non trouvé</h2>
          <p className="text-sm text-slate-400 mb-6">Le profil demandé n&apos;existe pas ou n&apos;est plus disponible.</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Retour
          </button>
        </div>
      </div>
    );
  }

  // ── Main Content ──
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Retour
        </button>
        <span>/</span>
        <span className="text-slate-400">Profil freelance</span>
      </div>

      {/* Header Card */}
      <div className="bg-neutral-dark rounded-2xl border border-border-dark p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-cover bg-center border-4 border-border-dark shadow-xl" style={{ backgroundImage: `url("${freelancer.avatar}")` }} />
            {freelancer.online && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-3 border-neutral-dark rounded-full" />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">{freelancer.name}</h1>
              <span className="text-lg">{freelancer.countryFlag}</span>
              {freelancer.badges.map(b => {
                const cfg = BADGE_CONFIG[b];
                return cfg ? (
                  <span key={b} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", cfg.color)}>
                    <span className="material-symbols-outlined text-[10px] fill-icon">{cfg.icon}</span>{cfg.label}
                  </span>
                ) : null;
              })}
              {isInTeam && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <span className="material-symbols-outlined text-[10px] fill-icon">group</span> Dans votre équipe
                </span>
              )}
            </div>
            <p className="text-primary font-semibold">{freelancer.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{freelancer.location}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span>Membre depuis {freelancer.memberSince}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">speed</span>Rép. {freelancer.responseTime} · {freelancer.responseRate}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">payments</span>{format(freelancer.hourlyRate)}/h</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              {freelancer.available && (
                <div className="flex h-6 items-center gap-1 rounded-full bg-primary/20 px-2.5 border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-xs fill-icon">check_circle</span>
                  <p className="text-primary text-[10px] font-bold uppercase">Disponible</p>
                </div>
              )}
              {freelancer.online && (
                <div className="flex h-6 items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-emerald-400 text-[10px] font-bold">En ligne</p>
                </div>
              )}
              <div className="flex items-center gap-1">
                <StarRating rating={freelancer.stats.rating} />
                <span className="text-xs text-slate-400">{freelancer.stats.rating} ({freelancer.reviews.length} avis)</span>
              </div>
            </div>
          </div>

          {/* Agency-specific Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <button onClick={() => setMessageModal(true)} className="h-10 px-4 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-sm hover:bg-primary/20 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">chat</span> Contacter
            </button>
            {!isInTeam ? (
              <button onClick={() => setInviteModal(true)} className="h-10 px-4 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                <span className="material-symbols-outlined text-sm">person_add</span> Inviter dans l&apos;équipe
              </button>
            ) : (
              <button className="h-10 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm cursor-default flex items-center gap-2">
                <span className="material-symbols-outlined text-sm fill-icon">group</span> Membre de l&apos;équipe
              </button>
            )}
            <button onClick={() => setSubcontractModal(true)} className="h-10 px-4 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
              <span className="material-symbols-outlined text-sm">assignment</span> Sous-traiter
            </button>
            <button onClick={() => setContractModal(true)} className="h-10 px-4 rounded-lg bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20">
              <span className="material-symbols-outlined text-sm">handshake</span> Contrat long terme
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-border-dark">
          {[
            { label: "Commandes", value: freelancer.stats.completedOrders, icon: "task_alt", color: "text-primary" },
            { label: "Clients", value: freelancer.stats.satisfiedClients, icon: "group", color: "text-blue-400" },
            { label: "Satisfaction", value: `${freelancer.stats.satisfaction}%`, icon: "thumb_up", color: "text-emerald-400" },
            { label: "Délai moyen", value: freelancer.stats.avgDelivery, icon: "schedule", color: "text-amber-400" },
            { label: "CA total", value: format(freelancer.stats.totalEarnings), icon: "payments", color: "text-green-400" },
            { label: "Note", value: freelancer.stats.rating, icon: "star", color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="bg-background-dark rounded-xl p-3 text-center">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
              <p className="text-lg font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-dark rounded-xl border border-border-dark p-1">
        {(["overview", "services", "portfolio", "reviews", "availability"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn("flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all", activeTab === tab ? "bg-primary text-white" : "text-slate-400 hover:text-white hover:bg-border-dark")}
          >
            {tab === "overview" && "Vue d'ensemble"}
            {tab === "services" && `Services (${freelancer.services.length})`}
            {tab === "portfolio" && `Portfolio (${freelancer.portfolio.length})`}
            {tab === "reviews" && `Avis (${freelancer.reviews.length})`}
            {tab === "availability" && "Disponibilité"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">person</span> À propos
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{freelancer.bio}</p>
            </div>

            {/* Top Skills */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">psychology</span> Compétences
              </h3>
              <div className="space-y-4">
                {freelancer.skills.map(s => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 font-medium">{s.name}</span>
                      <span className="text-primary font-bold text-xs">{s.level}</span>
                    </div>
                    <div className="w-full bg-border-dark h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${s.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {freelancer.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border-dark">
                  {freelancer.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            {freelancer.reviews.length > 0 && (
              <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">reviews</span> Derniers avis
                </h3>
                <div className="space-y-3">
                  {freelancer.reviews.slice(0, 3).map(r => (
                    <div key={r.id} className="bg-background-dark rounded-lg p-4 border border-border-dark">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{r.avatar}</div>
                          <div><p className="text-sm font-bold text-white">{r.author}</p><p className="text-[10px] text-slate-500">{r.date}</p></div>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="text-sm text-slate-400">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Languages */}
            {freelancer.languages.length > 0 && (
              <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">translate</span> Langues
                </h3>
                <div className="space-y-3">
                  {freelancer.languages.map(l => (
                    <div key={l.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-slate-300"><span className="text-lg">{l.flag}</span>{l.name}</span>
                      <span className="text-xs text-slate-500 bg-background-dark px-2 py-0.5 rounded-full">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formations */}
            {freelancer.formations.length > 0 && (
              <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">school</span> Formation
                </h3>
                <div className="space-y-3">
                  {freelancer.formations.map((f, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", f.type === "diploma" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400")}>
                        <span className="material-symbols-outlined text-base">{f.type === "diploma" ? "school" : "workspace_premium"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{f.title}</p>
                        <p className="text-xs text-slate-500">{f.school} · {f.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Availability */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span> Horaires
              </h3>
              <div className="space-y-2">
                {Object.entries(freelancer.availability).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{DAY_LABELS[day]}</span>
                    <span className={cn("font-mono text-xs", hours === "—" ? "text-slate-600" : "text-emerald-400")}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "services" && (
        <div>
          {freelancer.services.length === 0 ? (
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">inventory_2</span>
              <p className="text-white font-bold mb-1">Aucun service</p>
              <p className="text-sm text-slate-500">Ce freelance n&apos;a pas encore publié de services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {freelancer.services.map(s => (
                <div key={s.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/30 transition-colors">
                  <h4 className="font-bold text-white mb-2">{s.title}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={s.rating} />
                    <span className="text-xs text-slate-500">{s.rating} ({s.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>{s.delivery}
                    </span>
                    <span className="text-lg font-black text-primary">{format(s.price)}</span>
                  </div>
                  <button onClick={() => { setSubcontractData(d => ({ ...d, project: s.title, budget: s.price.toString() })); setSubcontractModal(true); }} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">assignment</span> Sous-traiter ce service
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "portfolio" && (
        <div>
          {freelancer.portfolio.length === 0 ? (
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">photo_library</span>
              <p className="text-white font-bold mb-1">Aucun projet</p>
              <p className="text-sm text-slate-500">Ce freelance n&apos;a pas encore ajouté de projets à son portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {freelancer.portfolio.map(p => (
                <div key={p.id} className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-10" />
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.image} alt={p.title} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white font-bold text-sm">{p.title}</p>
                    <div className="flex gap-1 mt-1">
                      {p.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded">{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {freelancer.reviews.length === 0 ? (
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">rate_review</span>
              <p className="text-white font-bold mb-1">Aucun avis</p>
              <p className="text-sm text-slate-500">Ce freelance n&apos;a pas encore reçu d&apos;avis.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 bg-neutral-dark rounded-xl border border-border-dark">
                <div className="text-center">
                  <p className="text-3xl font-black text-primary">{avgRating}</p>
                  <StarRating rating={parseFloat(avgRating)} />
                  <p className="text-xs text-slate-500 mt-1">{freelancer.reviews.length} avis</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = freelancer.reviews.filter(r => Math.floor(r.rating) === star).length;
                    const pct = freelancer.reviews.length > 0 ? (count / freelancer.reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-slate-500">{star}</span>
                        <span className="material-symbols-outlined text-xs fill-icon text-amber-400">star</span>
                        <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-4 text-right text-slate-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {freelancer.reviews.map(r => (
                <div key={r.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{r.avatar}</div>
                      <div><p className="text-sm font-bold text-white">{r.author}</p><p className="text-[10px] text-slate-500">{r.date}</p></div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-xs text-primary/50 font-semibold mb-1">{r.service}</p>
                  <p className="text-sm text-slate-400">{r.text}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === "availability" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_month</span> Calendrier hebdomadaire
            </h3>
            <div className="space-y-3">
              {Object.entries(freelancer.availability).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between bg-background-dark rounded-lg px-4 py-3">
                  <span className="font-medium text-sm text-white">{DAY_LABELS[day]}</span>
                  <span className={cn("font-mono text-sm px-3 py-1 rounded-lg", hours === "—" ? "bg-slate-700/50 text-slate-600" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20")}>{hours}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span> Tarification
              </h3>
              <div className="bg-background-dark rounded-lg p-4 text-center">
                <p className="text-3xl font-black text-primary">{format(freelancer.hourlyRate)}<span className="text-sm text-slate-500 font-normal">/heure</span></p>
                <p className="text-xs text-slate-500 mt-2">Négociable pour les contrats longs</p>
              </div>
            </div>
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span> Infos pratiques
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Fuseau horaire</span><span className="text-white font-medium">UTC+1 (Paris)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Temps de réponse</span><span className="text-white font-medium">{freelancer.responseTime}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Taux de réponse</span><span className="text-white font-medium">{freelancer.responseRate}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Missions urgentes</span><span className="text-emerald-400 font-bold">Oui</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}

      {/* Invite to Team Modal */}
      {inviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setInviteModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-md border border-border-dark shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">person_add</span>
              Inviter dans l&apos;équipe
            </h3>
            <p className="text-sm text-slate-400 mb-6">Inviter {freelancer.name} à rejoindre votre agence</p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Rôle dans l&apos;agence</label>
              <div className="space-y-2">
                {[
                  { value: "freelance_member", label: "Membre freelance", desc: "Peut travailler sur les projets assignés" },
                  { value: "manager", label: "Manager", desc: "Peut assigner des projets et gérer les membres" },
                  { value: "commercial", label: "Commercial", desc: "Peut gérer les clients et le pipeline" },
                ].map(r => (
                  <label key={r.value} className={cn("flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors", inviteRole === r.value ? "border-emerald-500/50 bg-emerald-500/5" : "border-border-dark hover:border-slate-500")}>
                    <input type="radio" name="role" value={r.value} checked={inviteRole === r.value} onChange={e => setInviteRole(e.target.value)} className="mt-1 accent-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-white">{r.label}</p>
                      <p className="text-xs text-slate-500">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setInviteModal(false)} className="flex-1 py-2.5 border border-border-dark text-slate-400 rounded-xl text-sm font-semibold hover:bg-border-dark transition-colors">Annuler</button>
              <button onClick={handleInvite} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">Envoyer l&apos;invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* Subcontract Modal */}
      {subcontractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSubcontractModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-lg border border-border-dark shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">assignment</span>
              Sous-traiter un projet
            </h3>
            <p className="text-sm text-slate-400 mb-6">Envoyer une commande de sous-traitance à {freelancer.name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Nom du projet *</label>
                <input type="text" value={subcontractData.project} onChange={e => setSubcontractData(d => ({ ...d, project: e.target.value }))} placeholder="Ex: Refonte site client ABC" className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Description *</label>
                <textarea value={subcontractData.description} onChange={e => setSubcontractData(d => ({ ...d, description: e.target.value }))} rows={3} placeholder="Décrivez la mission..." className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Budget (€) *</label>
                  <input type="number" value={subcontractData.budget} onChange={e => setSubcontractData(d => ({ ...d, budget: e.target.value }))} placeholder="500" className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Délai *</label>
                  <select value={subcontractData.deadline} onChange={e => setSubcontractData(d => ({ ...d, deadline: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option value="">Sélectionner...</option>
                    <option value="1 semaine">1 semaine</option>
                    <option value="2 semaines">2 semaines</option>
                    <option value="1 mois">1 mois</option>
                    <option value="2 mois">2 mois</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSubcontractModal(false)} className="flex-1 py-2.5 border border-border-dark text-slate-400 rounded-xl text-sm font-semibold hover:bg-border-dark transition-colors">Annuler</button>
              <button onClick={handleSubcontract} disabled={!subcontractData.project || !subcontractData.description || !subcontractData.budget || !subcontractData.deadline} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Envoyer la commande</button>
            </div>
          </div>
        </div>
      )}

      {/* Long-term Contract Modal */}
      {contractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setContractModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-lg border border-border-dark shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">handshake</span>
              Proposer un contrat long terme
            </h3>
            <p className="text-sm text-slate-400 mb-6">Proposer un contrat à durée déterminée à {freelancer.name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Type de contrat</label>
                <select value={contractData.type} onChange={e => setContractData(d => ({ ...d, type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/30">
                  <option value="prestation">Contrat de prestation</option>
                  <option value="mission">Contrat de mission</option>
                  <option value="nda">NDA (confidentialité)</option>
                  <option value="retainer">Retainer mensuel</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Durée (mois)</label>
                  <select value={contractData.duration} onChange={e => setContractData(d => ({ ...d, duration: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/30">
                    <option value="3">3 mois</option>
                    <option value="6">6 mois</option>
                    <option value="12">12 mois</option>
                    <option value="24">24 mois</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Taux horaire (€/h)</label>
                  <input type="number" value={contractData.rate} onChange={e => setContractData(d => ({ ...d, rate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Description du contrat</label>
                <textarea value={contractData.description} onChange={e => setContractData(d => ({ ...d, description: e.target.value }))} rows={3} placeholder="Décrivez les termes et conditions..." className="w-full px-4 py-2.5 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setContractModal(false)} className="flex-1 py-2.5 border border-border-dark text-slate-400 rounded-xl text-sm font-semibold hover:bg-border-dark transition-colors">Annuler</button>
              <button onClick={handleContract} className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors">Envoyer la proposition</button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setMessageModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-md border border-border-dark shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">chat</span>
              Message à {freelancer.name}
            </h3>
            <textarea value={messageText} onChange={e => setMessageText(e.target.value)} rows={4} placeholder="Écrivez votre message..." className="w-full px-4 py-3 rounded-xl bg-background-dark border border-border-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setMessageModal(false)} className="flex-1 py-2.5 border border-border-dark text-slate-400 rounded-xl text-sm font-semibold hover:bg-border-dark transition-colors">Annuler</button>
              <button onClick={handleMessage} disabled={!messageText.trim()} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">send</span> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
