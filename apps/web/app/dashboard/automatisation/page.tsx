"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// Types & Demo Data
// ============================================================

interface AutomationRule {
  id: string;
  name: string;
  active: boolean;
  event: { icon: string; label: string };
  action: { icon: string; label: string };
}

const DEMO_RULES: AutomationRule[] = [
  {
    id: "1",
    name: "Accueil des nouveaux clients",
    active: true,
    event: { icon: "chat_bubble", label: 'Premier message recu d\'un prospect' },
    action: { icon: "forward_to_inbox", label: 'Envoyer "Merci de m\'avoir contacte..."' },
  },
  {
    id: "2",
    name: "Notification de livraison",
    active: true,
    event: { icon: "check_circle", label: 'Statut du projet passe a "Livre"' },
    action: { icon: "notifications_active", label: 'Email + Push "Votre travail est pret"' },
  },
];

const EVENT_OPTIONS = [
  "Le projet est paye",
  "Retard de 24h",
  "Nouvelle demande",
  "Premier message recu",
];

const ACTION_OPTIONS = [
  "Envoyer un recu",
  "Relancer le client",
  "Archiver la discussion",
  "Envoyer un message",
];

type SideTab = "workflows" | "historique" | "modeles";

// ============================================================
// Page Component
// ============================================================

export default function AutomationPage() {
  const [rules, setRules] = useState(DEMO_RULES);
  const [sideTab, setSideTab] = useState<SideTab>("workflows");
  const [newEvent, setNewEvent] = useState(EVENT_OPTIONS[0]);
  const [newAction, setNewAction] = useState(ACTION_OPTIONS[0]);

  function handleDelete(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function handleToggle(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }

  function handleAddRule() {
    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: `Regle: ${newEvent}`,
      active: true,
      event: { icon: "bolt", label: newEvent },
      action: { icon: "send", label: newAction },
    };
    setRules((prev) => [...prev, newRule]);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 p-6 border-r border-border-dark shrink-0">
        <div className="sticky top-24">
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Menu Automation
            </h3>
            <nav className="space-y-1">
              {([
                { key: "workflows" as SideTab, icon: "settings_suggest", label: "Workflows actifs" },
                { key: "historique" as SideTab, icon: "history", label: "Historique" },
                { key: "modeles" as SideTab, icon: "class", label: "Modeles" },
              ]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSideTab(item.key)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg font-semibold w-full text-left transition-colors",
                    sideTab === item.key
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:bg-primary/5"
                  )}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="text-xs font-bold uppercase">Conseil</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Les reponses automatiques peuvent augmenter votre taux de conversion de 25% en
              repondant instantanement aux nouveaux clients.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="hover:text-primary cursor-pointer">Gestion</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-medium">Automatisation</span>
            </nav>
            <h1 className="text-3xl font-extrabold mb-2">Automatisation des Messages</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configurez vos workflows et notifications automatiques.
            </p>
          </div>
          <button
            onClick={handleAddRule}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add</span>
            Nouvelle Regle
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_tree</span>
            Vos regles configurees
          </h3>

          {rules.map((rule) => (
            <div
              key={rule.id}
              className="relative bg-white dark:bg-primary/5 p-6 rounded-xl border border-primary/10 shadow-sm border-l-4 border-l-primary"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider",
                        rule.active
                          ? "bg-green-900/30 text-green-400"
                          : "bg-slate-700 text-slate-400"
                      )}
                    >
                      {rule.active ? "Actif" : "Inactif"}
                    </span>
                    <h4 className="font-bold">{rule.name}</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 rounded-lg border border-primary/5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                        SI [EVENEMENT]
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="material-symbols-outlined text-primary text-lg">
                          {rule.event.icon}
                        </span>
                        {rule.event.label}
                      </div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-primary/5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                        ALORS [ACTION]
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="material-symbols-outlined text-primary text-lg">
                          {rule.action.icon}
                        </span>
                        {rule.action.label}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className="p-2 hover:bg-primary/10 rounded-lg text-slate-400 transition-colors"
                    title={rule.active ? "Desactiver" : "Activer"}
                  >
                    <span className="material-symbols-outlined">
                      {rule.active ? "pause_circle" : "play_circle"}
                    </span>
                  </button>
                  <button className="p-2 hover:bg-primary/10 rounded-lg text-slate-400 transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-2 hover:bg-red-900/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-4">
                settings_suggest
              </span>
              <p>Aucune regle configuree. Creez votre premiere regle ci-dessous.</p>
            </div>
          )}
        </div>

        {/* Add Rule Builder */}
        <div className="mt-12 bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="size-16 bg-background-dark rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-primary">
                magic_button
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Ajouter une logique intelligente</h3>
            <p className="text-slate-500 mb-8">
              Creez des chaines d&apos;actions automatisees pour gagner du temps et
              professionnaliser votre relation client.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-full md:w-auto flex items-center gap-3 bg-background-dark px-4 py-3 rounded-xl border border-primary/20">
                <span className="text-xs font-bold text-slate-400">SI</span>
                <select
                  className="bg-transparent border-none text-sm font-bold focus:ring-0 p-0 pr-8 outline-none"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                >
                  {EVENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <span className="material-symbols-outlined text-slate-400">arrow_forward</span>

              <div className="w-full md:w-auto flex items-center gap-3 bg-background-dark px-4 py-3 rounded-xl border border-primary/20">
                <span className="text-xs font-bold text-slate-400">ALORS</span>
                <select
                  className="bg-transparent border-none text-sm font-bold focus:ring-0 p-0 pr-8 text-primary outline-none"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                >
                  {ACTION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddRule}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
