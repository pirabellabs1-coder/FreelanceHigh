"use client";

import { useState, useRef } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const ORDERS = [
  { id: "ORD-7829", service: "Design UI/UX Mobile", client: "Digital-Nexus Agency", freelance: "Thomas Weber", status: "en_cours", amount: 1200, progress: 80 },
  { id: "ORD-7815", service: "Développement API REST", client: "TechNova SAS", freelance: "Jean-Luc S.", status: "livre", amount: 2500, progress: 100 },
  { id: "ORD-7801", service: "Audit SEO Complet", client: "GreenLeaf Bio", freelance: "Marie Koffi", status: "termine", amount: 800, progress: 100 },
  { id: "ORD-7790", service: "Logo & Branding", client: "StartupFlow", freelance: "Sophie D.", status: "en_cours", amount: 450, progress: 45 },
];

const FILTERS = [
  { key: "toutes", label: "Toutes" },
  { key: "en_cours", label: "En cours" },
  { key: "livre", label: "Livrées" },
  { key: "termine", label: "Terminées" },
  { key: "litige", label: "Litige" },
];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  livre: { label: "Livré", cls: "bg-primary/20 text-primary" },
  termine: { label: "Terminé", cls: "bg-slate-500/20 text-slate-400" },
  litige: { label: "Litige", cls: "bg-red-500/20 text-red-400" },
};

const INIT_MESSAGES = [
  { from: "them", text: "Bonjour Marc ! Est-ce que tu penses pouvoir m'envoyer les premières maquettes ce soir ?", time: "14:20" },
  { from: "me", text: "Oui, absolument. Je termine l'écran de profil et je t'envoie un ZIP de prévisualisation.", time: "14:25" },
  { from: "them", text: "Super, merci ! Le client est impatient de voir le résultat.", time: "09:15", dayLabel: "AUJOURD'HUI" },
  { from: "me", text: "C'est noté. Je prépare le pack de livraison finale maintenant.", time: "il y a 10 min" },
];

export default function ClientOrders() {
  const [filter, setFilter] = useState("toutes");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(INIT_MESSAGES);
  const [draftFiles, setDraftFiles] = useState([{ name: "mobile_v2_final_preview.pdf", size: "12.4 MB", modified: "Modifié il y a 2h" }]);
  const { addToast } = useToastStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = filter === "toutes" ? ORDERS : ORDERS.filter(o => o.status === filter);
  const selected = ORDERS.find(o => o.id === selectedOrder);

  function sendMessage() {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { from: "me", text: newMessage, time: "maintenant" }]);
    setNewMessage("");
  }

  // --- DETAIL VIEW ---
  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setSelectedOrder(null)} className="text-primary hover:underline">Commandes</button>
          <span className="text-slate-500">›</span>
          <span className="text-primary">En cours</span>
          <span className="text-slate-500">›</span>
          <span className="text-slate-400">Détails Commande</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">timeline</span>
                État d&apos;avancement
              </h3>
              <div className="flex items-center justify-between mb-8 relative">
                {/* Connection lines */}
                <div className="absolute top-6 left-[16.67%] right-[16.67%] h-0.5 bg-border-dark" />
                <div className="absolute top-6 left-[16.67%] h-0.5 bg-primary" style={{ width: "33%" }} />

                {[
                  { label: "Commande passée", sub: "12 Oct 2023, 14:30", icon: "check", done: true },
                  { label: "En cours de réalisation", sub: "Active - 80% réalisé", icon: "group", active: true },
                  { label: "Livraison effectuée", sub: "En attente des fichiers", icon: "inventory", pending: true },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center text-center flex-1 relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                      s.done ? "bg-primary text-background-dark ring-4 ring-primary/20" :
                      s.active ? "bg-primary/20 text-primary ring-4 ring-primary/10" :
                      "bg-border-dark text-slate-500"
                    )}>
                      <span className="material-symbols-outlined">{s.icon}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{s.label}</p>
                    <p className={cn("text-xs mt-0.5", s.active ? "text-primary" : "text-slate-500")}>{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[{ v: "02", l: "JOURS" }, { v: "14", l: "HEURES" }, { v: "35", l: "MIN" }, { v: "00", l: "SEC" }].map(t => (
                  <div key={t.l} className="bg-background-dark rounded-lg p-4 text-center border border-border-dark">
                    <p className="text-3xl font-bold text-white">{t.v}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{t.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* File Delivery */}
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">cloud_upload</span>
                  Livraison des fichiers finaux
                </h3>
                <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-semibold uppercase">Prêt pour envoi</span>
              </div>
              <div
                className="border-2 border-dashed border-primary/20 rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" className="hidden" onChange={() => addToast("success", "Fichier ajouté")} />
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                </div>
                <p className="font-semibold text-white">Glissez-déposez vos fichiers ici</p>
                <p className="text-xs text-slate-500 mt-1">Format ZIP, FIG, PSD ou PDF (Max 500MB).</p>
                <button className="mt-4 px-4 py-2 border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary/10 transition-colors">
                  Parcourir les fichiers
                </button>
              </div>
              {draftFiles.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3">Fichiers récents (brouillons)</p>
                  {draftFiles.map(f => (
                    <div key={f.name} className="flex items-center gap-3 p-3 bg-background-dark rounded-lg border border-border-dark">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary">description</span></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{f.name}</p>
                        <p className="text-xs text-slate-500">{f.size} · {f.modified}</p>
                      </div>
                      <button onClick={() => { setDraftFiles([]); addToast("success", "Fichier supprimé"); }} className="text-slate-500 hover:text-red-400 transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark flex flex-col h-[700px]">
            <div className="p-4 border-b border-border-dark flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">TW</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Thomas Weber</p>
                <p className="text-xs text-primary flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full animate-pulse" />En ligne</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i}>
                  {m.dayLabel && (
                    <div className="flex justify-center my-3">
                      <span className="text-[10px] text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">{m.dayLabel}</span>
                    </div>
                  )}
                  <div className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed",
                      m.from === "me" ? "bg-primary text-background-dark rounded-2xl rounded-tr-none" : "bg-background-dark text-slate-200 rounded-2xl rounded-tl-none border border-border-dark"
                    )}>
                      <p>{m.text}</p>
                      <p className={cn("text-[10px] mt-1 text-right", m.from === "me" ? "text-background-dark/60" : "text-slate-500")}>{m.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-primary/60 italic flex items-center gap-1"><span className="material-symbols-outlined text-xs">edit</span>Thomas est en train d&apos;écrire...</p>
            </div>
            <div className="p-3 border-t border-border-dark flex items-center gap-2">
              <button className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined">attach_file</span></button>
              <button className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined">sentiment_satisfied</span></button>
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Votre message..." className="flex-1 px-3 py-2 bg-background-dark border border-border-dark rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-background-dark hover:scale-105 active:scale-95 transition-transform"><span className="material-symbols-outlined text-lg">send</span></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mes Commandes</h1>
        <p className="text-slate-400 text-sm mt-1">Suivez l&apos;avancement de vos commandes</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", filter === f.key ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>{f.label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(o => (
          <button key={o.id} onClick={() => setSelectedOrder(o.id)} className="w-full bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/30 transition-all text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary">shopping_bag</span></div>
                <div>
                  <p className="font-bold text-white">{o.service}</p>
                  <p className="text-xs text-slate-500">{o.id} · {o.client} · Freelance: {o.freelance}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_LABELS[o.status]?.cls)}>{STATUS_LABELS[o.status]?.label}</span>
                <span className="text-lg font-bold text-white">{o.amount}€</span>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
              </div>
            </div>
            {o.status === "en_cours" && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${o.progress}%` }} /></div>
                <span className="text-xs font-semibold text-primary">{o.progress}%</span>
              </div>
            )}
          </button>
        ))}
        {filtered.length === 0 && <div className="text-center py-16"><span className="material-symbols-outlined text-5xl text-slate-600 mb-3">inbox</span><p className="text-slate-500 font-semibold">Aucune commande dans cette catégorie</p></div>}
      </div>
    </div>
  );
}
