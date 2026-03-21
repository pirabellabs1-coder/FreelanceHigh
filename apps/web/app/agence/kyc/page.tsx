"use client";

import { useState, useEffect } from "react";
import { useToastStore } from "@/store/dashboard";
import { KycUploadCard } from "@/components/kyc/KycUploadCard";
import { cn } from "@/lib/utils";

interface KycData {
  currentLevel: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    address: string;
    dateOfBirth: string;
  };
  requests: Array<{
    id: string;
    level: number;
    status: string;
    documentType: string;
    createdAt: string;
    refuseReason?: string;
  }>;
}

export default function AgenceKycPage() {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<KycData | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "", lastName: "", country: "", city: "", address: "", dateOfBirth: "",
  });

  useEffect(() => {
    fetch("/api/kyc")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.personalInfo) setPersonalInfo(d.personalInfo);
      })
      .catch(() => addToast("error", "Erreur lors du chargement KYC"))
      .finally(() => setLoading(false));
  }, [addToast]);

  async function savePersonalInfo() {
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.country || !personalInfo.dateOfBirth) {
      addToast("error", "Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/kyc", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalInfo }),
      });
      const result = await res.json();
      if (!res.ok) {
        addToast("error", result.error || "Erreur lors de la sauvegarde");
      } else {
        addToast("success", "Informations personnelles enregistrees");
      }
    } catch {
      addToast("error", "Erreur de connexion");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-border-dark rounded-lg" />
        <div className="h-4 w-96 bg-border-dark rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-neutral-dark rounded-xl border border-border-dark" />
          <div className="h-80 bg-neutral-dark rounded-xl border border-border-dark" />
        </div>
      </div>
    );
  }

  const level = data?.currentLevel ?? 1;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified_user</span>
          Verification d&apos;identite (KYC)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Completez votre verification pour pouvoir publier des services et recevoir des paiements.
        </p>
      </div>

      {/* Niveau actuel */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
            level >= 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
          )}>
            {level}
          </div>
          <div>
            <p className="text-white font-semibold">Niveau {level} / 4</p>
            <p className="text-xs text-slate-400">
              {level >= 3 ? "Identite verifiee — vous pouvez publier et recevoir des paiements" : "Completez les etapes ci-dessous pour debloquer toutes les fonctionnalites"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
            Informations personnelles
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Prenom *</label>
                <input value={personalInfo.firstName} onChange={(e) => setPersonalInfo((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nom *</label>
                <input value={personalInfo.lastName} onChange={(e) => setPersonalInfo((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:border-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Pays *</label>
              <input value={personalInfo.country} onChange={(e) => setPersonalInfo((p) => ({ ...p, country: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:border-primary/50" placeholder="ex: France, Senegal, Cameroun..." />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ville</label>
              <input value={personalInfo.city} onChange={(e) => setPersonalInfo((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Adresse</label>
              <input value={personalInfo.address} onChange={(e) => setPersonalInfo((p) => ({ ...p, address: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Date de naissance *</label>
              <input type="date" value={personalInfo.dateOfBirth} onChange={(e) => setPersonalInfo((p) => ({ ...p, dateOfBirth: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:border-primary/50" />
            </div>
            <button onClick={savePersonalInfo} disabled={saving}
              className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>

        {/* Upload KYC Document */}
        <KycUploadCard currentLevel={level} />
      </div>

      {/* Historique des demandes */}
      {data?.requests && data.requests.length > 0 && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Historique des verifications</h2>
          <div className="space-y-3">
            {data.requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-background-dark/50 border border-border-dark/50">
                <div>
                  <p className="text-sm font-semibold text-white">Niveau {req.level} — {req.documentType}</p>
                  <p className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString("fr-FR")}</p>
                  {req.refuseReason && <p className="text-xs text-red-400 mt-1">Motif : {req.refuseReason}</p>}
                </div>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full",
                  req.status === "approved" || req.status === "APPROUVE" ? "bg-emerald-500/20 text-emerald-400" :
                  req.status === "refused" || req.status === "REFUSE" ? "bg-red-500/20 text-red-400" :
                  "bg-amber-500/20 text-amber-400"
                )}>
                  {req.status === "approved" || req.status === "APPROUVE" ? "Approuve" :
                   req.status === "refused" || req.status === "REFUSE" ? "Refuse" : "En attente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
