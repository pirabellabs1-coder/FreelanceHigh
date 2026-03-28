"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast";

interface InlineOfferFormProps {
  recipientName: string;
  conversationId: string;
  onSubmit: (data: {
    title: string;
    amount: number;
    delay: string;
    revisions: number;
    description: string;
    validityDays: number;
  }) => Promise<boolean>;
  onCancel: () => void;
}

const DELAY_OPTIONS = [
  "1 jour", "2 jours", "3 jours", "5 jours", "7 jours",
  "10 jours", "14 jours", "21 jours", "30 jours", "60 jours",
];

export function InlineOfferForm({ recipientName, onSubmit, onCancel }: InlineOfferFormProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    delay: "7 jours",
    revisions: "2",
    description: "",
    validityDays: "14",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.title.trim()) { addToast("error", "Titre requis"); return; }
    if (!form.amount || Number(form.amount) <= 0) { addToast("error", "Montant invalide"); return; }
    if (!form.description.trim()) { addToast("error", "Description requise"); return; }

    setSending(true);
    const ok = await onSubmit({
      title: form.title.trim(),
      amount: Number(form.amount),
      delay: form.delay,
      revisions: Number(form.revisions) || 2,
      description: form.description.trim(),
      validityDays: Number(form.validityDays) || 14,
    });
    setSending(false);

    if (ok) {
      addToast("success", `Offre envoyee a ${recipientName}`);
    }
  }

  return (
    <div className="bg-neutral-dark border-2 border-primary/30 rounded-xl p-3 md:p-5 space-y-3 md:space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">local_offer</span>
          <h3 className="font-bold text-sm">Nouvelle offre pour {recipientName}</h3>
        </div>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-border-dark text-slate-400 hover:text-slate-200 transition-colors">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Form fields */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-400 mb-1 block">Titre de l&apos;offre *</label>
          <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)}
            placeholder="Ex: Creation site vitrine responsive"
            className="w-full px-3 py-2.5 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1 block">Montant (EUR) *</label>
            <input type="number" value={form.amount} onChange={(e) => updateField("amount", e.target.value)}
              placeholder="500" min={1}
              className="w-full px-3 py-2.5 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1 block">Delai de livraison</label>
            <select value={form.delay} onChange={(e) => updateField("delay", e.target.value)}
              className="w-full px-3 py-2.5 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary">
              {DELAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1 block">Revisions incluses</label>
            <select value={form.revisions} onChange={(e) => updateField("revisions", e.target.value)}
              className="w-full px-3 py-2.5 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary">
              {[0, 1, 2, 3, 5, 10].map((n) => <option key={n} value={n}>{n} revision{n !== 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1 block">Validite de l&apos;offre</label>
            <select value={form.validityDays} onChange={(e) => updateField("validityDays", e.target.value)}
              className="w-full px-3 py-2.5 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary">
              {[3, 7, 14, 30].map((d) => <option key={d} value={d}>{d} jours</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 mb-1 block">Description detaillee *</label>
          <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)}
            placeholder="Decrivez en detail ce qui est inclus dans cette offre..."
            rows={3}
            className="w-full px-3 py-2.5 bg-background-dark/50 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} disabled={sending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all">
          {sending ? (
            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-sm">send</span>
          )}
          {sending ? "Envoi..." : "Envoyer l'offre"}
        </button>
        <button onClick={onCancel}
          className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  );
}
