"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const DISPUTES = [
  { id: "LIT-84291", title: "Retard de livraison - Dashboard React", freelance: "Thomas Weber", date: "2026-02-28", status: "en_cours", amount: 1200, description: "Le freelance n'a pas respecté le délai convenu de 15 jours. La livraison a 10 jours de retard sans communication.", category: "retard" },
  { id: "LIT-84285", title: "Qualité non conforme - Logo & Branding", freelance: "Sophie Design", date: "2026-02-20", status: "resolu", amount: 450, description: "Le logo livré ne correspondait pas au brief initial. Résolution : remboursement partiel de 50%.", category: "qualite", resolution: "Remboursement partiel de 225 €" },
  { id: "LIT-84270", title: "Non-livraison - Application Mobile", freelance: "Dev Studio", date: "2026-02-10", status: "en_attente", amount: 2500, description: "Aucune livraison reçue après paiement complet. Le freelance ne répond plus aux messages.", category: "non_livraison" },
];

const STATUS_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  en_cours: { label: "En cours d'examen", cls: "bg-blue-500/20 text-blue-400", icon: "pending" },
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400", icon: "schedule" },
  resolu: { label: "Résolu", cls: "bg-primary/20 text-primary", icon: "check_circle" },
  rejete: { label: "Rejeté", cls: "bg-red-500/20 text-red-400", icon: "cancel" },
};

const CATEGORIES = [
  { key: "retard", label: "Retard de livraison", icon: "schedule" },
  { key: "qualite", label: "Qualité non conforme", icon: "report_problem" },
  { key: "non_livraison", label: "Non-livraison", icon: "block" },
  { key: "communication", label: "Problème de communication", icon: "chat_error" },
  { key: "autre", label: "Autre", icon: "more_horiz" },
];

const TIMELINE_STEPS = [
  { label: "Litige ouvert", detail: "28 Fév 2026, 14:30", icon: "flag", done: true },
  { label: "Preuves soumises", detail: "28 Fév 2026, 15:00", icon: "upload_file", done: true },
  { label: "Examen en cours", detail: "En cours par l'équipe support", icon: "gavel", active: true },
  { label: "Décision rendue", detail: "En attente", icon: "verified", pending: true },
];

export default function ClientDisputes() {
  const [view, setView] = useState<"list" | "detail" | "new">("list");
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [filter, setFilter] = useState("tous");
  const { addToast } = useToastStore();

  // New dispute form
  const [newDispute, setNewDispute] = useState({
    orderId: "",
    category: "",
    title: "",
    description: "",
  });

  const selected = DISPUTES.find(d => d.id === selectedDispute);
  const filtered = filter === "tous" ? DISPUTES : DISPUTES.filter(d => d.status === filter);

  function submitDispute() {
    if (!newDispute.title.trim() || !newDispute.category || !newDispute.description.trim()) {
      addToast("error", "Veuillez remplir tous les champs obligatoires");
      return;
    }
    addToast("success", "Litige soumis avec succès. Notre équipe l'examinera sous 48h.");
    setView("list");
    setNewDispute({ orderId: "", category: "", title: "", description: "" });
  }

  // ─── DETAIL VIEW ───
  if (view === "detail" && selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setView("list")} className="text-primary hover:underline">Litiges</button>
          <span className="text-slate-500">›</span>
          <span className="text-slate-400">Cas {selected.id}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">{selected.title}</h1>
            <p className="text-slate-400 text-sm mt-1">Cas {selected.id} · Freelance : {selected.freelance} · Montant : {selected.amount} €</p>
          </div>
          <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1", STATUS_MAP[selected.status]?.cls)}>
            <span className="material-symbols-outlined text-sm">{STATUS_MAP[selected.status]?.icon}</span>
            {STATUS_MAP[selected.status]?.label}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">description</span>
                Description du litige
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{selected.description}</p>
            </div>

            {/* Timeline */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">timeline</span>
                Suivi de la résolution
              </h3>
              <div className="space-y-6">
                {TIMELINE_STEPS.map((s, i) => (
                  <div key={s.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        s.done ? "bg-primary text-background-dark" :
                        s.active ? "bg-primary/20 text-primary ring-4 ring-primary/10" :
                        "bg-border-dark text-slate-500"
                      )}>
                        <span className="material-symbols-outlined text-lg">{s.icon}</span>
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={cn("w-0.5 flex-1 mt-2", s.done ? "bg-primary" : "bg-border-dark")} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={cn("font-semibold text-sm", s.active ? "text-primary" : s.done ? "text-white" : "text-slate-500")}>{s.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preuves */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">upload_file</span>
                Preuves soumises
              </h3>
              <div className="space-y-2">
                {[
                  { name: "capture_conversation.png", size: "1.2 MB" },
                  { name: "contrat_initial.pdf", size: "340 KB" },
                  { name: "livrable_incomplet.zip", size: "8.5 MB" },
                ].map(f => (
                  <div key={f.name} className="flex items-center gap-3 p-3 bg-background-dark rounded-lg border border-border-dark">
                    <span className="material-symbols-outlined text-primary">attach_file</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{f.name}</p>
                      <p className="text-xs text-slate-500">{f.size}</p>
                    </div>
                    <button className="text-slate-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addToast("info", "Upload de fichiers bientôt disponible")}
                className="mt-3 w-full py-2.5 border-2 border-dashed border-border-dark rounded-lg text-sm font-semibold text-slate-400 hover:border-primary/40 hover:text-primary transition-colors"
              >
                + Ajouter une preuve
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="space-y-4">
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Actions</h3>
              <button
                onClick={() => addToast("info", "Ouverture du chat avec le support...")}
                className="w-full py-2.5 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">support_agent</span>
                Contacter le support
              </button>
              <button className="w-full py-2.5 border border-border-dark text-white text-sm font-semibold rounded-lg hover:bg-neutral-dark transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">chat</span>
                Envoyer un message au freelance
              </button>
              <button className="w-full py-2.5 text-red-400 text-sm font-semibold hover:text-red-300 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">cancel</span>
                Annuler le litige
              </button>
            </div>

            {selected.status === "resolu" && selected.resolution && (
              <div className="bg-primary/5 rounded-xl border border-primary/10 p-5">
                <p className="text-xs text-primary uppercase tracking-wider font-bold mb-2">Résolution</p>
                <p className="text-sm text-white font-medium">{selected.resolution}</p>
              </div>
            )}

            <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Informations</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Référence</span><span className="text-white font-mono">{selected.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="text-white">{new Date(selected.date).toLocaleDateString("fr-FR")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Montant</span><span className="text-white font-bold">{selected.amount} €</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Freelance</span><span className="text-white">{selected.freelance}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── NEW DISPUTE FORM ───
  if (view === "new") {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setView("list")} className="text-primary hover:underline">Litiges</button>
          <span className="text-slate-500">›</span>
          <span className="text-slate-400">Nouveau signalement</span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Signaler un problème</h1>
          <p className="text-slate-400 text-sm mt-1">Décrivez votre problème en détail. Notre équipe examinera votre demande sous 48h.</p>
        </div>

        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 space-y-5">
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Numéro de commande</label>
            <input
              value={newDispute.orderId}
              onChange={e => setNewDispute(p => ({ ...p, orderId: e.target.value }))}
              placeholder="Ex: ORD-7829"
              className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Catégorie du problème *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setNewDispute(p => ({ ...p, category: c.key }))}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                    newDispute.category === c.key
                      ? "border-primary bg-primary/5"
                      : "border-border-dark hover:border-primary/30"
                  )}
                >
                  <span className={cn("material-symbols-outlined", newDispute.category === c.key ? "text-primary" : "text-slate-500")}>{c.icon}</span>
                  <span className={cn("text-sm font-medium", newDispute.category === c.key ? "text-white" : "text-slate-400")}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Titre du litige *</label>
            <input
              value={newDispute.title}
              onChange={e => setNewDispute(p => ({ ...p, title: e.target.value }))}
              placeholder="Décrivez brièvement le problème"
              className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Description détaillée *</label>
            <textarea
              value={newDispute.description}
              onChange={e => setNewDispute(p => ({ ...p, description: e.target.value }))}
              rows={5}
              placeholder="Expliquez en détail ce qui s'est passé, ce que vous attendiez et ce qui a été livré..."
              className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Pièces jointes</label>
            <button
              onClick={() => addToast("info", "Upload de fichiers bientôt disponible")}
              className="w-full py-8 border-2 border-dashed border-border-dark rounded-xl text-center hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl text-slate-500 mb-1">cloud_upload</span>
              <p className="text-sm text-slate-400 font-medium">Glissez vos fichiers ou cliquez pour parcourir</p>
              <p className="text-xs text-slate-500 mt-1">Captures d&apos;écran, documents, fichiers (max 50 MB)</p>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={submitDispute} className="px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">gavel</span>
            Soumettre le litige
          </button>
          <button onClick={() => setView("list")} className="px-6 py-2.5 border border-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-white transition-colors">
            Annuler
          </button>
        </div>

        <div className="bg-blue-500/5 rounded-xl border border-blue-500/10 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5">info</span>
          <div>
            <p className="text-sm text-white font-semibold">Avant de soumettre un litige</p>
            <p className="text-xs text-slate-400 mt-1">Nous vous recommandons d&apos;essayer de résoudre le problème directement avec le freelance via la messagerie. 80% des litiges sont résolus par la discussion.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ───
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Litiges & Signalements</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos réclamations et suivez la résolution de vos litiges.</p>
        </div>
        <button
          onClick={() => setView("new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-lg">flag</span>
          Signaler un problème
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: DISPUTES.length, icon: "gavel", color: "text-white" },
          { label: "En cours", value: DISPUTES.filter(d => d.status === "en_cours").length, icon: "pending", color: "text-blue-400" },
          { label: "En attente", value: DISPUTES.filter(d => d.status === "en_attente").length, icon: "schedule", color: "text-amber-400" },
          { label: "Résolus", value: DISPUTES.filter(d => d.status === "resolu").length, icon: "check_circle", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
            <span className={cn("material-symbols-outlined text-xl", s.color)}>{s.icon}</span>
            <div>
              <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: "tous", label: "Tous" },
          { key: "en_cours", label: "En cours" },
          { key: "en_attente", label: "En attente" },
          { key: "resolu", label: "Résolus" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              filter === f.key ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Dispute Cards */}
      <div className="space-y-3">
        {filtered.map(d => (
          <button
            key={d.id}
            onClick={() => { setSelectedDispute(d.id); setView("detail"); }}
            className="w-full bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  d.status === "en_cours" ? "bg-blue-500/10" : d.status === "resolu" ? "bg-primary/10" : "bg-amber-500/10"
                )}>
                  <span className={cn(
                    "material-symbols-outlined",
                    d.status === "en_cours" ? "text-blue-400" : d.status === "resolu" ? "text-primary" : "text-amber-400"
                  )}>gavel</span>
                </div>
                <div>
                  <p className="font-bold text-white">{d.title}</p>
                  <p className="text-xs text-slate-500">{d.id} · {d.freelance} · {new Date(d.date).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[d.status]?.cls)}>{STATUS_MAP[d.status]?.label}</span>
                <span className="text-lg font-bold text-white">{d.amount} €</span>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">gavel</span>
            <p className="text-slate-500 font-semibold">Aucun litige dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}
