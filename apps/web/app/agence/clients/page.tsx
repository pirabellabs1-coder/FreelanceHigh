"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const PIPELINE = [
  { key: "prospect", label: "Prospect", color: "bg-blue-500", count: 4 },
  { key: "devis", label: "Devis envoyé", color: "bg-amber-500", count: 3 },
  { key: "commande", label: "Commande active", color: "bg-primary", count: 5 },
  { key: "livre", label: "Livré", color: "bg-emerald-500", count: 8 },
];

const CLIENTS = [
  { id: "1", name: "Marc Dupont", company: "Dakar Shop SARL", ca: 28500, lastContact: "2026-03-02", stage: "commande", email: "marc@dakarshop.sn", phone: "+221 77 123 4567", notes: ["Client fidèle, 3ème commande", "Préfère les appels le matin"] },
  { id: "2", name: "Aminata Touré", company: "FashionAfrik", ca: 15200, lastContact: "2026-03-01", stage: "commande", email: "aminata@fashionafrik.com", phone: "+225 07 654 3210", notes: ["Intéressée par le SEO"] },
  { id: "3", name: "Pierre Legrand", company: "FinTech CI", ca: 42000, lastContact: "2026-02-28", stage: "devis", email: "pierre@fintechci.com", phone: "+33 6 12 34 56 78", notes: ["Devis envoyé le 28/02"] },
  { id: "4", name: "Fatima Benali", company: "HealthApp", ca: 9500, lastContact: "2026-02-25", stage: "prospect", email: "fatima@healthapp.ma", phone: "+212 6 12 34 56 78", notes: ["Premier contact LinkedIn"] },
  { id: "5", name: "Jean Kouamé", company: "QuickDeliver", ca: 35000, lastContact: "2026-03-03", stage: "commande", email: "jean@quickdeliver.ci", phone: "+225 05 987 6543", notes: ["App mobile en cours"] },
  { id: "6", name: "Sophie Diallo", company: "EduTech SN", ca: 18000, lastContact: "2026-02-20", stage: "livre", email: "sophie@edutech.sn", phone: "+221 78 456 7890", notes: ["Projet terminé avec succès"] },
  { id: "7", name: "Omar Sy", company: "MediaGroup CI", ca: 0, lastContact: "2026-03-01", stage: "prospect", email: "omar@mediagroup.ci", phone: "+225 01 234 5678", notes: [] },
  { id: "8", name: "Claire Martin", company: "TourAfrique", ca: 22000, lastContact: "2026-02-27", stage: "devis", email: "claire@tourafrique.com", phone: "+33 7 98 76 54 32", notes: ["Devis refonte envoyé"] },
];

export default function AgenceClients() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { addToast } = useToastStore();
  const client = CLIENTS.find(c => c.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Clients</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos relations clients et suivez le pipeline commercial.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Ajouter un client
        </button>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-4 gap-3">
        {PIPELINE.map(s => (
          <div key={s.key} className="bg-neutral-dark rounded-xl border border-border-dark p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-3 h-3 rounded-full", s.color)} />
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
            <p className="text-2xl font-black text-white">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Client list */}
        <div className="lg:col-span-2 space-y-2">
          {CLIENTS.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)} className={cn("w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all", selected === c.id ? "bg-primary/10 border border-primary/20" : "bg-neutral-dark border border-border-dark hover:border-primary/20")}>
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">{c.name.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white text-sm truncate">{c.name}</p>
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", PIPELINE.find(s => s.key === c.stage)?.color)} />
                </div>
                <p className="text-xs text-slate-500 truncate">{c.company}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-white">€{c.ca.toLocaleString("fr-FR")}</p>
                <p className="text-[10px] text-slate-500">CA total</p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          {client ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">{client.name.split(" ").map(n => n[0]).join("")}</div>
                <div><p className="font-bold text-white">{client.name}</p><p className="text-xs text-slate-500">{client.company}</p></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-lg">email</span>{client.email}</div>
                <div className="flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-lg">phone</span>{client.phone}</div>
                <div className="flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-lg">calendar_today</span>Dernier contact : {new Date(client.lastContact).toLocaleDateString("fr-FR")}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark"><p className="text-lg font-black text-white">€{client.ca.toLocaleString("fr-FR")}</p><p className="text-[10px] text-slate-500 uppercase font-semibold">CA Total</p></div>
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark"><p className="text-lg font-black text-primary capitalize">{PIPELINE.find(s => s.key === client.stage)?.label}</p><p className="text-[10px] text-slate-500 uppercase font-semibold">Statut</p></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Notes internes</p>
                <div className="space-y-2">
                  {client.notes.map((n, i) => (<div key={i} className="bg-background-dark rounded-lg p-2.5 border border-border-dark text-xs text-slate-400">{n}</div>))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Ajouter une note..." className="flex-1 px-3 py-2 bg-background-dark border border-border-dark rounded-lg text-xs text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
                  <button onClick={() => { if (newNote.trim()) { addToast("success", "Note ajoutée"); setNewNote(""); } }} className="px-3 py-2 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110">Ajouter</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addToast("info", "Message envoyé")} className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors">Contacter</button>
                <button onClick={() => addToast("info", "Relance programmée")} className="flex-1 py-2 bg-neutral-dark border border-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:text-white transition-colors">Relancer</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16"><span className="material-symbols-outlined text-5xl text-slate-600 mb-3">people</span><p className="text-slate-500 font-semibold">Sélectionnez un client</p></div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Ajouter un client</h3>
            <div className="space-y-4">
              <input placeholder="Nom complet" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <input placeholder="Entreprise" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <input placeholder="Email" type="email" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <input placeholder="Téléphone" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
                <button onClick={() => { addToast("success", "Client ajouté !"); setShowAdd(false); }} className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
