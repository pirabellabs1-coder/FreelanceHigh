"use client";

import { useState, useMemo } from "react";
import { usePlatformDataStore } from "@/store/platform-data";
import type { PlatformNotification } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const TYPE_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  annonce: { label: "Annonce", cls: "bg-primary/20 text-primary", icon: "campaign" },
  maintenance: { label: "Maintenance", cls: "bg-amber-500/20 text-amber-400", icon: "build" },
  fonctionnalite: { label: "Fonctionnalité", cls: "bg-blue-500/20 text-blue-400", icon: "new_releases" },
  promotion: { label: "Promotion", cls: "bg-emerald-500/20 text-emerald-400", icon: "local_offer" },
};

const TARGET_MAP: Record<string, string> = {
  tous: "Tous les utilisateurs",
  freelance: "Freelances",
  client: "Clients",
  agence: "Agences",
  pro: "Abonnés Pro",
  business: "Abonnés Business",
};

const CHANNEL_MAP: Record<string, { label: string; icon: string }> = {
  "in-app": { label: "In-app", icon: "notifications" },
  email: { label: "Email", icon: "mail" },
  "les-deux": { label: "Email + In-app", icon: "all_inclusive" },
};

export default function AdminNotifications() {
  const { notifications, sendNotification, users } = usePlatformDataStore();

  const [form, setForm] = useState<{
    title: string;
    message: string;
    type: PlatformNotification["type"];
    target: PlatformNotification["target"];
    channel: PlatformNotification["channel"];
  }>({
    title: "",
    message: "",
    type: "annonce",
    target: "tous",
    channel: "les-deux",
  });

  const [filterType, setFilterType] = useState("");
  const [sent, setSent] = useState(false);

  const sortedNotifications = useMemo(() => {
    let list = [...notifications];
    if (filterType) list = list.filter(n => n.type === filterType);
    return list.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  }, [notifications, filterType]);

  // Count recipients based on target
  const recipientCount = useMemo(() => {
    if (form.target === "tous") return users.length;
    if (form.target === "pro") return users.filter(u => u.plan === "pro").length;
    if (form.target === "business") return users.filter(u => u.plan === "business").length;
    return users.filter(u => u.role === form.target).length;
  }, [users, form.target]);

  function handleSend() {
    if (!form.title.trim() || !form.message.trim()) return;
    sendNotification({
      title: form.title,
      message: form.message,
      type: form.type,
      target: form.target,
      channel: form.channel,
    });
    setForm({ title: "", message: "", type: "annonce", target: "tous", channel: "les-deux" });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span>
            Notifications & Emails
          </h1>
          <p className="text-slate-400 text-sm mt-1">Envoyer des notifications ciblées et consulter l&apos;historique.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-primary text-lg">send</span>
          <span className="text-slate-400"><span className="font-bold text-white">{notifications.length}</span> notifications envoyées</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Total envoyées", value: notifications.length, icon: "send", color: "text-primary" },
          { label: "Annonces", value: notifications.filter(n => n.type === "annonce").length, icon: "campaign", color: "text-primary" },
          { label: "Promotions", value: notifications.filter(n => n.type === "promotion").length, icon: "local_offer", color: "text-emerald-400" },
          { label: "Utilisateurs", value: users.length, icon: "people", color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send form */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            Nouvelle notification
          </h2>

          {sent && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">check_circle</span>
              <p className="text-sm text-emerald-400 font-semibold">Notification envoyée avec succès !</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
              <div className="flex gap-2 flex-wrap">
                {(["annonce", "fonctionnalite", "promotion", "maintenance"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1",
                      form.type === t ? cn(TYPE_MAP[t].cls, "border-current") : "border-border-dark text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">{TYPE_MAP[t].icon}</span>
                    {TYPE_MAP[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Cible</label>
              <select
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value as PlatformNotification["target"] }))}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none focus:border-primary"
              >
                {Object.entries(TARGET_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">{recipientCount} destinataire{recipientCount > 1 ? "s" : ""}</p>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Canal</label>
              <div className="flex gap-2">
                {(["in-app", "email", "les-deux"] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, channel: c }))}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1",
                      form.channel === c ? "border-primary bg-primary/10 text-primary" : "border-border-dark text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">{CHANNEL_MAP[c].icon}</span>
                    {CHANNEL_MAP[c].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Titre</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Titre de la notification..."
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none focus:border-primary placeholder:text-slate-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={4}
                placeholder="Contenu du message..."
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none resize-none focus:border-primary placeholder:text-slate-500"
              />
            </div>

            {/* Preview */}
            {form.title && (
              <div className="p-4 rounded-lg border border-border-dark bg-background-dark/50">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Aperçu</p>
                <div className="flex items-start gap-3">
                  <span className={cn("material-symbols-outlined text-lg mt-0.5", TYPE_MAP[form.type]?.cls.split(" ")[1])}>{TYPE_MAP[form.type]?.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{form.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{form.message || "(pas de message)"}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", TYPE_MAP[form.type]?.cls)}>{TYPE_MAP[form.type]?.label}</span>
                      <span className="text-[10px] text-slate-500">{TARGET_MAP[form.target]}</span>
                      <span className="text-[10px] text-slate-500">{CHANNEL_MAP[form.channel]?.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!form.title.trim() || !form.message.trim()}
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              Envoyer ({recipientCount} destinataire{recipientCount > 1 ? "s" : ""})
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Historique
            </h2>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border-dark bg-background-dark text-white text-xs outline-none"
            >
              <option value="">Tous les types</option>
              {Object.entries(TYPE_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {sortedNotifications.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-slate-600">notifications_off</span>
              <p className="text-sm text-slate-500 mt-2">Aucune notification envoyée</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {sortedNotifications.map(n => (
                <div key={n.id} className="p-4 bg-background-dark/50 rounded-lg border border-border-dark hover:border-border-dark/80 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("material-symbols-outlined text-lg", TYPE_MAP[n.type]?.cls.split(" ")[1])}>{TYPE_MAP[n.type]?.icon}</span>
                      <h3 className="font-semibold text-sm text-white">{n.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(n.sentAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", TYPE_MAP[n.type]?.cls)}>{TYPE_MAP[n.type]?.label}</span>
                    <span className="text-[10px] bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded-full font-semibold">{TARGET_MAP[n.target] || n.target}</span>
                    <span className="text-[10px] bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">{CHANNEL_MAP[n.channel]?.icon}</span>
                      {CHANNEL_MAP[n.channel]?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
