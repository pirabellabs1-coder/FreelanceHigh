"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  type: "client" | "interne" | "freelance";
  lastMessage: string;
  time: string;
  unread: number;
  project?: string;
  online?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Marie Dupont", type: "client", lastMessage: "Merci pour la maquette, c'est exactement ce que je voulais !", time: "10:32", unread: 2, project: "Site vitrine", online: true },
  { id: "2", name: "#projet-ecommerce", type: "interne", lastMessage: "Amadou: J'ai fini le module panier", time: "09:45", unread: 5, project: "E-commerce StartupTech" },
  { id: "3", name: "StartupTech SAS", type: "client", lastMessage: "On peut prévoir un call demain ?", time: "Hier", unread: 0, project: "E-commerce StartupTech", online: false },
  { id: "4", name: "#design-review", type: "interne", lastMessage: "Fatou: Les maquettes V2 sont prêtes", time: "Hier", unread: 0, project: "App FinTech" },
  { id: "5", name: "Kofi A.", type: "freelance", lastMessage: "L'API est déployée en staging", time: "Lun", unread: 0, project: "API REST", online: true },
  { id: "6", name: "Awa Consulting", type: "client", lastMessage: "Pouvez-vous envoyer le rapport ?", time: "Lun", unread: 1, project: "Marketing Digital", online: false },
  { id: "7", name: "#general", type: "interne", lastMessage: "Thomas: Réunion d'équipe vendredi 14h", time: "Dim", unread: 0 },
];

const MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "1", sender: "Marie Dupont", content: "Bonjour ! J'ai regardé les premières maquettes.", time: "10:15", isMe: false },
    { id: "2", sender: "Vous", content: "Bonjour Marie ! Oui, nous avons suivi votre brief pour la page d'accueil et les pages produits.", time: "10:20", isMe: true },
    { id: "3", sender: "Marie Dupont", content: "J'aime beaucoup la direction artistique. Un petit ajustement sur les couleurs ?", time: "10:25", isMe: false },
    { id: "4", sender: "Vous", content: "Bien sûr, nous pouvons ajuster. Je transmets à Fatou qui gère le design.", time: "10:28", isMe: true },
    { id: "5", sender: "Marie Dupont", content: "Merci pour la maquette, c'est exactement ce que je voulais !", time: "10:32", isMe: false },
  ],
  "2": [
    { id: "1", sender: "Ibrahim M.", content: "Le module de recherche est prêt pour review.", time: "09:00", isMe: false },
    { id: "2", sender: "Vous", content: "Super, je regarde ça ce matin.", time: "09:10", isMe: true },
    { id: "3", sender: "Amadou D.", content: "J'ai fini le module panier", time: "09:45", isMe: false },
  ],
};

const TYPE_LABELS: Record<string, { label: string; cls: string; icon: string }> = {
  client: { label: "Client", cls: "bg-blue-500/20 text-blue-400", icon: "person" },
  interne: { label: "Interne", cls: "bg-primary/10 text-primary", icon: "group" },
  freelance: { label: "Externe", cls: "bg-amber-500/20 text-amber-400", icon: "work" },
};

export default function AgenceMessages() {
  const [selectedConv, setSelectedConv] = useState("1");
  const [newMessage, setNewMessage] = useState("");
  const [filterType, setFilterType] = useState("tous");
  const { addToast } = useToastStore();

  const filteredConvs = CONVERSATIONS.filter(c => filterType === "tous" || c.type === filterType);
  const messages = MESSAGES[selectedConv] || [];
  const activeConv = CONVERSATIONS.find(c => c.id === selectedConv);

  const totalUnread = CONVERSATIONS.reduce((s, c) => s + c.unread, 0);

  function sendMessage() {
    if (!newMessage.trim()) return;
    addToast("success", "Message envoyé");
    setNewMessage("");
  }

  return (
    <div className="flex gap-0 h-[calc(100vh-7rem)] bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
      {/* Sidebar conversations */}
      <div className="w-80 border-r border-border-dark flex flex-col shrink-0">
        <div className="p-4 border-b border-border-dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Messages</h2>
            {totalUnread > 0 && <span className="text-[10px] bg-primary text-background-dark px-2 py-0.5 rounded-full font-bold">{totalUnread} non lus</span>}
          </div>
          <div className="flex gap-1">
            {[
              { key: "tous", label: "Tous" },
              { key: "client", label: "Clients" },
              { key: "interne", label: "Interne" },
              { key: "freelance", label: "Externes" },
            ].map(t => (
              <button key={t.key} onClick={() => setFilterType(t.key)} className={cn("px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors", filterType === t.key ? "bg-primary text-background-dark" : "text-slate-500 hover:text-white hover:bg-border-dark")}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map(c => (
            <button key={c.id} onClick={() => setSelectedConv(c.id)} className={cn("w-full text-left p-4 border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors", selectedConv === c.id && "bg-background-dark/50 border-l-2 border-l-primary")}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">{TYPE_LABELS[c.type]?.icon}</span>
                    </div>
                    {c.online !== undefined && (
                      <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-dark", c.online ? "bg-emerald-400" : "bg-slate-500")} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white truncate">{c.name}</p>
                    {c.project && <p className="text-[10px] text-primary truncate">{c.project}</p>}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{c.time}</span>
              </div>
              <div className="flex items-center justify-between pl-10">
                <p className="text-xs text-slate-500 truncate max-w-[170px]">{c.lastMessage}</p>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-background-dark text-[10px] flex items-center justify-center font-bold shrink-0">{c.unread}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="p-4 border-b border-border-dark flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">{activeConv ? TYPE_LABELS[activeConv.type]?.icon : "chat"}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white">{activeConv?.name}</p>
                {activeConv && <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", TYPE_LABELS[activeConv.type]?.cls)}>{TYPE_LABELS[activeConv.type]?.label}</span>}
              </div>
              {activeConv?.project && <p className="text-xs text-slate-500">{activeConv.project}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => addToast("info", "Appel vidéo bientôt disponible")} className="p-2 text-slate-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined text-lg">videocam</span></button>
            <button onClick={() => addToast("info", "Recherche dans la conversation")} className="p-2 text-slate-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined text-lg">search</span></button>
            <button onClick={() => addToast("info", "Infos de la conversation")} className="p-2 text-slate-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined text-lg">info</span></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? messages.map(m => (
            <div key={m.id} className={cn("flex", m.isMe ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5", m.isMe ? "bg-primary text-background-dark rounded-br-md" : "bg-border-dark text-white rounded-bl-md")}>
                {!m.isMe && <p className="text-[10px] font-bold mb-1 text-primary">{m.sender}</p>}
                <p className="text-sm">{m.content}</p>
                <p className={cn("text-[10px] mt-1", m.isMe ? "text-background-dark/60" : "text-slate-500")}>{m.time}</p>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2">chat_bubble_outline</span>
              <p className="text-sm">Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border-dark shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => addToast("info", "Envoi de fichier bientôt disponible")} className="p-2 text-slate-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined">attach_file</span></button>
            <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Écrire un message..." className="flex-1 px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
            <button onClick={sendMessage} disabled={!newMessage.trim()} className={cn("p-2.5 rounded-xl transition-all", newMessage.trim() ? "bg-primary text-background-dark hover:brightness-110" : "bg-border-dark text-slate-500")}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
