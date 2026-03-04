"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "message" | "payment" | "project" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", type: "message", title: "Nouveau message de Jean-Luc S.", description: "Le code a été déployé sur le serveur de staging. Pouvez-vous vérifier ?", time: "Il y a 5 min", read: false, icon: "chat", iconColor: "text-blue-400 bg-blue-500/10" },
  { id: "2", type: "payment", title: "Paiement confirmé", description: "Votre paiement de 1 200 € pour la commande ORD-7829 a été confirmé.", time: "Il y a 1h", read: false, icon: "payments", iconColor: "text-primary bg-primary/10" },
  { id: "3", type: "project", title: "Nouvelle candidature reçue", description: "Amadou D. a postulé sur votre projet « Refonte site vitrine entreprise ».", time: "Il y a 3h", read: false, icon: "person_add", iconColor: "text-primary bg-primary/10" },
  { id: "4", type: "project", title: "Commande livrée", description: "Thomas Weber a livré la commande « Design UI/UX Mobile ». Vérifiez et validez.", time: "Il y a 6h", read: true, icon: "inventory", iconColor: "text-amber-400 bg-amber-500/10" },
  { id: "5", type: "system", title: "Profil complété à 75%", description: "Ajoutez une méthode de paiement pour compléter votre profil et débloquer toutes les fonctionnalités.", time: "Hier", read: true, icon: "trending_up", iconColor: "text-slate-400 bg-slate-500/10" },
  { id: "6", type: "message", title: "Marie Koffi a répondu", description: "J'ai envoyé les maquettes Figma. Dites-moi si tout est conforme.", time: "Hier", read: true, icon: "chat", iconColor: "text-blue-400 bg-blue-500/10" },
  { id: "7", type: "payment", title: "Facture disponible", description: "La facture TXN-4201 est disponible au téléchargement dans la section Paiements.", time: "Il y a 2 jours", read: true, icon: "receipt", iconColor: "text-primary bg-primary/10" },
  { id: "8", type: "project", title: "Rappel : deadline dans 3 jours", description: "Le projet « Application mobile de livraison » arrive à échéance le 8 mars.", time: "Il y a 2 jours", read: true, icon: "alarm", iconColor: "text-red-400 bg-red-500/10" },
];

const PREF_SECTIONS = [
  {
    title: "Messages et Communications",
    icon: "mail",
    prefs: [
      { id: "msg_email", label: "Emails de nouveaux messages", desc: "Recevoir un résumé par email pour chaque nouveau message non lu.", email: true, push: true },
      { id: "msg_push", label: "Notifications Push (Navigateur)", desc: "Alertes en temps réel sur votre bureau lorsque vous êtes connecté.", email: false, push: true },
    ],
  },
  {
    title: "Finances et Paiements",
    icon: "payments",
    prefs: [
      { id: "pay_confirm", label: "Paiements confirmés", desc: "Alerte immédiate par SMS et Email dès qu'un paiement est confirmé.", email: true, push: true },
      { id: "pay_invoice", label: "Nouvelles factures", desc: "Notification quand une facture est générée.", email: true, push: false },
    ],
  },
  {
    title: "Projets et Missions",
    icon: "assignment",
    prefs: [
      { id: "proj_update", label: "Mises à jour de commandes", desc: "Changements de statut, validations d'étapes et retours freelances.", email: true, push: true },
      { id: "proj_candidature", label: "Nouvelles candidatures", desc: "Quand un freelance postule sur un de vos projets.", email: true, push: true },
      { id: "proj_deadline", label: "Rappels de délais", desc: "Alertes quand une deadline approche (3 jours, 1 jour avant).", email: true, push: false },
    ],
  },
];

export default function ClientNotifications() {
  const [tab, setTab] = useState<"all" | "prefs">("all");
  const [filter, setFilter] = useState("tous");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [preferences, setPreferences] = useState(PREF_SECTIONS);
  const { addToast } = useToastStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === "tous"
    ? notifications
    : filter === "non_lus"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast("success", "Toutes les notifications marquées comme lues");
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function togglePref(sectionIndex: number, prefIndex: number, type: "email" | "push") {
    setPreferences(prev => prev.map((s, si) => si === sectionIndex ? {
      ...s,
      prefs: s.prefs.map((p, pi) => pi === prefIndex ? { ...p, [type]: !p[type] } : p),
    } : s));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos notifications et configurez vos préférences d&apos;alertes.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-neutral-dark border border-border-dark rounded-lg text-sm font-semibold text-white hover:bg-border-dark transition-colors">
            <span className="material-symbols-outlined text-lg">done_all</span>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("all")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2", tab === "all" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          <span className="material-symbols-outlined text-lg">notifications</span>
          Toutes
          {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </button>
        <button onClick={() => setTab("prefs")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2", tab === "prefs" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          <span className="material-symbols-outlined text-lg">tune</span>
          Préférences
        </button>
      </div>

      {/* Notifications List */}
      {tab === "all" && (
        <>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "tous", label: "Tous" },
              { key: "non_lus", label: "Non lus" },
              { key: "message", label: "Messages" },
              { key: "payment", label: "Paiements" },
              { key: "project", label: "Projets" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  filter === f.key ? "bg-primary/10 text-primary border border-primary/20" : "bg-neutral-dark text-slate-500 border border-border-dark hover:text-white"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {filtered.map(n => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all",
                  n.read ? "hover:bg-neutral-dark/50" : "bg-neutral-dark border border-border-dark hover:border-primary/20"
                )}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", n.iconColor)}>
                  <span className="material-symbols-outlined">{n.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-semibold truncate", n.read ? "text-slate-400" : "text-white")}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                  </div>
                  <p className={cn("text-xs mt-0.5 truncate", n.read ? "text-slate-500" : "text-slate-400")}>{n.description}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">notifications_off</span>
                <p className="text-slate-500 text-sm font-medium">Aucune notification</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Preferences */}
      {tab === "prefs" && (
        <div className="space-y-6">
          {preferences.map((section, si) => (
            <div key={section.title} className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="font-bold text-white flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-primary text-xl">{section.icon}</span>
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.prefs.map((pref, pi) => (
                  <div key={pref.id} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-background-dark/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-white">{pref.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Email</span>
                        <button
                          onClick={() => togglePref(si, pi, "email")}
                          className={cn("w-10 h-5 rounded-full transition-colors relative flex-shrink-0", pref.email ? "bg-primary" : "bg-slate-600")}
                        >
                          <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", pref.email ? "left-5" : "left-0.5")} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Push</span>
                        <button
                          onClick={() => togglePref(si, pi, "push")}
                          className={cn("w-10 h-5 rounded-full transition-colors relative flex-shrink-0", pref.push ? "bg-primary" : "bg-slate-600")}
                        >
                          <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", pref.push ? "left-5" : "left-0.5")} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-dark">
            <button className="px-5 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
            <button
              onClick={() => addToast("success", "Préférences enregistrées")}
              className="px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              Enregistrer les préférences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
