"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const CONTACTS = [
  { id: "1", name: "Jean-Luc S.", lastMessage: "Le code a été déployé sur le serveur...", time: "14:20", status: "online", unread: true },
  { id: "2", name: "Marie Koffi", lastMessage: "J'ai envoyé les maquettes Figma.", time: "Hier", status: "online", unread: false },
  { id: "3", name: "Ahmadou Traoré", lastMessage: "On se voit à 15h pour le point ?", time: "Mar", status: "away", unread: false },
];

const INIT_MESSAGES: Record<string, Array<{ from: string; text: string; time: string; dayLabel?: string; file?: { name: string; size: string } }>> = {
  "1": [
    { from: "them", text: "Salut ! J'ai terminé les modifications demandées sur l'API de paiement. J'ai également optimisé les requêtes vers la base de données.", time: "14:15" },
    { from: "me", text: "Super travail ! Est-ce que tu peux m'envoyer le rapport de performance s'il te plaît ?", time: "14:18" },
    { from: "them", text: "Bien sûr, le voici :", time: "14:20", file: { name: "PERFORMANCE_REPORT_V2.PDF", size: "2.4 MB" } },
  ],
  "2": [
    { from: "them", text: "Bonjour ! Voici les maquettes finales pour l'application mobile.", time: "Hier" },
    { from: "me", text: "Merci Marie, je regarde ça dans l'après-midi !", time: "Hier" },
  ],
  "3": [
    { from: "them", text: "Salut, on se voit à 15h pour le point projet ?", time: "Mar" },
  ],
};

const MILESTONES = [
  { label: "Définition du cahier des charges", done: true },
  { label: "Architecture API", done: true },
  { label: "Implémentation Frontend", active: true },
  { label: "Tests unitaires et QA", pending: true },
];

export default function ClientMessages() {
  const [activeContact, setActiveContact] = useState("1");
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [contactTab, setContactTab] = useState<"direct" | "teams">("direct");

  const contact = CONTACTS.find(c => c.id === activeContact)!;
  const chatMessages = messages[activeContact] || [];

  function sendMessage() {
    if (!newMessage.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), { from: "me", text: newMessage, time: "maintenant" }],
    }));
    setNewMessage("");
  }

  return (
    <div className="-m-6 lg:-m-8 flex h-[calc(100vh-64px)]">
      {/* Left: Contacts */}
      <div className="w-80 flex-shrink-0 border-r border-border-dark bg-background-dark flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Discussions</h2>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 flex gap-2 mb-3">
          <button onClick={() => setContactTab("direct")} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors", contactTab === "direct" ? "bg-primary/20 text-primary" : "text-slate-500 hover:text-white")}>
            <span className="material-symbols-outlined text-sm">chat</span>
            Direct Messages
          </button>
          <button onClick={() => setContactTab("teams")} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors", contactTab === "teams" ? "bg-primary/20 text-primary" : "text-slate-500 hover:text-white")}>
            <span className="material-symbols-outlined text-sm">group</span>
            Équipes & Canaux
          </button>
        </div>

        <p className="px-4 text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Récent</p>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {CONTACTS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveContact(c.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left",
                activeContact === c.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold", activeContact === c.id ? "bg-white/20 text-white" : "bg-primary/20 text-primary")}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2", activeContact === c.id ? "border-primary" : "border-background-dark", c.status === "online" ? "bg-green-500" : c.status === "away" ? "bg-orange-500" : "bg-slate-400")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn("font-semibold text-sm truncate", activeContact === c.id ? "text-white" : "text-slate-200")}>{c.name}</p>
                  <span className={cn("text-[10px]", activeContact === c.id ? "text-white/60" : "text-slate-500")}>{c.time}</span>
                </div>
                <p className={cn("text-xs truncate", activeContact === c.id ? "text-white/70" : "text-slate-500")}>{c.lastMessage}</p>
              </div>
              {c.unread && activeContact !== c.id && <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />}
            </button>
          ))}
        </div>

        <div className="p-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            Nouveau Message
          </button>
        </div>
      </div>

      {/* Center: Chat */}
      <div className="flex-1 flex flex-col bg-background-dark">
        {/* Chat header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{contact.name.split(" ").map(n => n[0]).join("")}</div>
            <div>
              <p className="font-bold text-white text-sm">{contact.name}</p>
              <p className="text-xs text-primary flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full animate-pulse" />En ligne maintenant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">call</span></button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">videocam</span></button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">info</span></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex justify-center"><span className="text-[10px] text-slate-500 uppercase tracking-wider bg-background-dark px-3 py-1 rounded-full border border-border-dark">Aujourd&apos;hui</span></div>
          {chatMessages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.from === "me" ? "justify-end" : "justify-start")}>
              {m.from === "them" && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-1">
                  {contact.name.split(" ").map(n => n[0]).join("")}
                </div>
              )}
              <div className="max-w-[65%]">
                {m.from === "them" && <p className="text-xs text-slate-500 mb-1">{contact.name} <span className="ml-2">{m.time}</span></p>}
                {m.from === "me" && <p className="text-xs text-slate-500 mb-1 text-right">{m.time}  Vous</p>}
                <div className={cn(
                  "px-4 py-3 text-sm leading-relaxed",
                  m.from === "me" ? "bg-primary text-background-dark rounded-2xl rounded-tr-none" : "bg-neutral-dark text-slate-200 rounded-2xl rounded-tl-none border border-border-dark"
                )}>
                  <p>{m.text}</p>
                  {m.file && (
                    <div className="mt-2 flex items-center gap-3 bg-background-dark/30 rounded-lg p-3 border border-border-dark/50">
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center"><span className="text-red-500 text-xs font-bold">PDF</span></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{m.file.name}</p>
                        <p className="text-[10px] opacity-60">{m.file.size} · Terminé</p>
                      </div>
                      <button><span className="material-symbols-outlined text-lg">download</span></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-primary/60 italic flex items-center gap-1 pl-11"><span className="material-symbols-outlined text-xs">edit</span>{contact.name} est en train d&apos;écrire...</p>
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">add</span></button>
            <button className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">image</span></button>
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Tapez votre message ici..."
              className="flex-1 px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
            />
            <button className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">sentiment_satisfied</span></button>
            <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-background-dark hover:scale-105 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-1.5">Shift + Enter pour une nouvelle ligne</p>
        </div>
      </div>

      {/* Right: Mission Details */}
      <div className="w-80 flex-shrink-0 border-l border-border-dark bg-background-dark hidden xl:flex flex-col overflow-y-auto">
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs text-slate-500">Détails de la mission</p>
            <p className="text-xs text-slate-500 mt-0.5">ID Contrat: #AF-92384</p>
          </div>

          <div>
            <p className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">description</span>
              Projet actif
            </p>
            <h3 className="font-bold text-white text-sm">Refonte de l&apos;interface E-commerce Mobile</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Statut</span><span className="text-primary font-semibold">En cours</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Budget</span><span className="text-white font-bold">1 500 €</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Échéance</span><span className="text-white">15 Oct. 2023</span></div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Jalons</p>
              <span className="text-primary text-xs font-bold">60% complété</span>
            </div>
            <div className="h-2 bg-border-dark rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
            </div>
            <div className="space-y-3">
              {MILESTONES.map(m => (
                <div key={m.label} className="flex items-center gap-2.5">
                  <span className={cn(
                    "material-symbols-outlined text-sm",
                    m.done ? "text-primary" : m.active ? "text-primary" : "text-slate-600"
                  )} style={{ fontVariationSettings: m.done ? "'FILL' 1" : "'FILL' 0" }}>
                    {m.done ? "check_circle" : m.active ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                  <span className={cn("text-xs", m.done ? "text-slate-500 line-through" : m.active ? "text-white font-medium" : "text-slate-500")}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared files */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Fichiers partagés</p>
              <button className="text-primary text-xs font-semibold hover:underline">Tout voir</button>
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-16 rounded-lg bg-neutral-dark border border-border-dark flex items-center justify-center text-2xl">📱</div>
              <div className="w-16 h-16 rounded-lg bg-neutral-dark border border-border-dark flex items-center justify-center text-2xl">🌿</div>
              <button className="w-16 h-16 rounded-lg border-2 border-dashed border-border-dark flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/40 transition-colors">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-3">
            <button className="w-full py-2.5 border border-border-dark text-white text-sm font-semibold rounded-lg hover:bg-neutral-dark transition-colors">
              Créer une facture
            </button>
            <button className="w-full py-2.5 text-red-400 text-sm font-semibold hover:text-red-300 transition-colors">
              Signaler un litige
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
