"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { icon: "payments", title: "Paiements & Facturation", desc: "Retraits, dépôts, factures et litiges financiers.", count: 12 },
  { icon: "task_alt", title: "Gestion des Projets", desc: "Suivi des commandes, livraisons et révisions.", count: 8 },
  { icon: "shield_person", title: "Sécurité & Profil", desc: "Paramètres, vérification d'identité et sécurité.", count: 6 },
  { icon: "group", title: "Trouver un Freelance", desc: "Recherche, filtres, favoris et recommandations.", count: 10 },
  { icon: "gavel", title: "Litiges & Résolution", desc: "Ouverture, suivi et résolution de litiges.", count: 5 },
  { icon: "help", title: "Utiliser la Plateforme", desc: "Premiers pas, navigation et fonctionnalités.", count: 15 },
];

const FAQS = [
  { q: "Comment puis-je modifier mon adresse de paiement ?", a: "Rendez-vous dans Paramètres > Paiements & Facturation pour modifier vos informations de paiement. Les changements sont effectifs immédiatement." },
  { q: "Que faire si un freelance ne répond plus à mes messages ?", a: "Si un freelance ne répond pas dans les 48h, vous pouvez nous contacter via le support ou ouvrir un litige depuis la page Commandes." },
  { q: "Quels sont les frais de service de FreelanceHigh ?", a: "Les frais de service sont de 3% sur chaque transaction. Ce taux peut varier selon votre plan d'abonnement (Pro : 2%, Business : 1.5%)." },
  { q: "Comment devenir un client vérifié ?", a: "Complétez votre profil entreprise, vérifiez votre email et votre téléphone. La vérification KYC niveau 3 est optionnelle mais augmente votre crédibilité." },
  { q: "Comment fonctionne le système d'escrow ?", a: "Lorsque vous passez une commande, les fonds sont bloqués en escrow. Ils ne sont libérés au freelance qu'après votre validation de la livraison." },
  { q: "Puis-je demander un remboursement ?", a: "Oui, vous pouvez demander un remboursement en ouvrant un litige. Notre équipe examinera votre demande et rendra une décision sous 48h à 7 jours." },
];

export default function ClientHelp() {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });
  const { addToast } = useToastStore();

  const filteredFaqs = search.trim()
    ? FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : FAQS;

  function submitTicket() {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      addToast("error", "Veuillez remplir le sujet et le message");
      return;
    }
    addToast("success", "Ticket ouvert ! Nous vous répondrons sous 24h.");
    setTicketForm({ subject: "", message: "" });
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-8 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Centre d&apos;Aide et Support</h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-6">Comment pouvons-nous vous aider aujourd&apos;hui ? Recherchez dans notre base de connaissances ou parcourez les catégories ci-dessous.</p>

        <div className="max-w-2xl mx-auto relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ex : Comment retirer mes gains ?"
            className="w-full pl-12 pr-32 py-4 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-xl shadow-primary/5"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all">
            Rechercher
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Catégories d&apos;aide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(c => (
            <button key={c.title} className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-xl">{c.icon}</span>
              </div>
              <p className="font-bold text-white text-sm">{c.title}</p>
              <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
              <p className="text-xs text-primary/60 mt-2">{c.count} articles</p>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">quiz</span>
            Questions fréquentes
          </h2>
        </div>
        <div className="space-y-2">
          {filteredFaqs.map((f, i) => (
            <div key={i} className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-background-dark/30 transition-colors"
              >
                <span className="text-sm font-semibold text-white pr-4">{f.q}</span>
                <span className={cn("material-symbols-outlined text-slate-400 transition-transform flex-shrink-0", expandedFaq === i && "rotate-180")}>
                  expand_more
                </span>
              </button>
              {expandedFaq === i && (
                <div className="px-5 pb-4 border-t border-border-dark pt-3">
                  <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">Aucun résultat pour &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-neutral-dark rounded-2xl border border-border-dark p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white mb-2">Vous ne trouvez pas la réponse ?</h2>
          <p className="text-slate-400 text-sm">Nos experts sont disponibles 24/7 pour vous accompagner.</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex -space-x-2">
              {["SP", "AK", "JD"].map(initials => (
                <div key={initials} className="w-9 h-9 rounded-full bg-primary/20 border-2 border-neutral-dark flex items-center justify-center text-primary text-xs font-bold">
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-400">Temps de réponse moyen : <span className="text-primary font-bold">5 minutes</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => addToast("info", "Chat en direct bientôt disponible")}
            className="py-3 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">forum</span>
            Chat en direct
          </button>
          <button
            onClick={() => document.getElementById("ticket-form")?.scrollIntoView({ behavior: "smooth" })}
            className="py-3 border border-border-dark text-white text-sm font-bold rounded-xl hover:bg-background-dark transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">confirmation_number</span>
            Ouvrir un ticket
          </button>
        </div>

        {/* Ticket form */}
        <div id="ticket-form" className="bg-background-dark rounded-xl border border-border-dark p-5 space-y-4">
          <p className="font-bold text-white text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">mail</span>
            Envoyer un ticket
          </p>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Sujet</label>
            <input
              value={ticketForm.subject}
              onChange={e => setTicketForm(t => ({ ...t, subject: e.target.value }))}
              placeholder="Décrivez brièvement votre problème"
              className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Message</label>
            <textarea
              value={ticketForm.message}
              onChange={e => setTicketForm(t => ({ ...t, message: e.target.value }))}
              rows={4}
              placeholder="Expliquez votre problème en détail..."
              className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
            />
          </div>
          <button onClick={submitTicket} className="px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">
            Envoyer le ticket
          </button>
        </div>
      </div>
    </div>
  );
}
