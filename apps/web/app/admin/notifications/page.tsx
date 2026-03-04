"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const CAMPAIGNS = [
  { id: "1", title: "Bienvenue Q1 2026", target: "Nouveaux inscrits", sent: 2450, opened: 68, clicked: 32, date: "2026-03-01" },
  { id: "2", title: "Offre Pro -30%", target: "Freelances gratuits", sent: 4200, opened: 72, clicked: 45, date: "2026-02-15" },
  { id: "3", title: "Nouveautes fevrier", target: "Tous", sent: 12450, opened: 55, clicked: 18, date: "2026-02-01" },
  { id: "4", title: "Rappel KYC", target: "KYC incomplet", sent: 890, opened: 82, clicked: 61, date: "2026-01-20" },
];

export default function AdminNotifications() {
  const [form, setForm] = useState({ target: "tous", channel: "email", title: "", message: "", schedule: "now" });
  const { addToast } = useToastStore();

  function send() {
    if (!form.title || !form.message) { addToast("error", "Titre et message requis"); return; }
    addToast("success", form.schedule === "now" ? "Notification envoyee" : "Notification programmee");
    setForm({ target: "tous", channel: "email", title: "", message: "", schedule: "now" });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">notifications</span>
        Notifications &amp; Emails
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send form */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Envoyer une notification</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Cible</label>
              <select
                value={form.target}
                onChange={e => setForm(f => ({...f, target: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none"
              >
                <option value="tous">Tous les utilisateurs</option>
                <option value="freelances">Freelances</option>
                <option value="clients">Clients</option>
                <option value="agences">Agences</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Canal</label>
              <div className="flex gap-2">
                {["email", "in-app", "sms", "push"].map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({...f, channel: c}))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                      form.channel === c
                        ? "border-primary bg-red-500/10 text-red-400"
                        : "border-border-dark text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Titre</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({...f, title: e.target.value}))}
                placeholder="Titre de la notification..."
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({...f, message: e.target.value}))}
                rows={4}
                placeholder="Contenu du message..."
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none resize-none placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Programmation</label>
              <div className="flex gap-3">
                {[{ key: "now", label: "Maintenant" }, { key: "later", label: "Programmer" }].map(s => (
                  <button
                    key={s.key}
                    onClick={() => setForm(f => ({...f, schedule: s.key}))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors",
                      form.schedule === s.key
                        ? "border-primary bg-red-500/10 text-red-400"
                        : "border-border-dark text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={send}
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
            >
              {form.schedule === "now" ? "Envoyer" : "Programmer"}
            </button>
          </div>
        </div>

        {/* Campaign history */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Campagnes recentes</h2>
          <div className="space-y-4">
            {CAMPAIGNS.map(c => (
              <div key={c.id} className="p-4 bg-background-dark/50 rounded-lg border border-border-dark">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-white">{c.title}</h3>
                  <span className="text-xs text-slate-500">{new Date(c.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Cible : {c.target} &middot; {c.sent.toLocaleString()} envoyes</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{c.opened}%</p>
                    <p className="text-xs text-slate-500">Ouverture</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">{c.clicked}%</p>
                    <p className="text-xs text-slate-500">Clics</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{c.sent.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Envoyes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
