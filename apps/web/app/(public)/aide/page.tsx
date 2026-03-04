"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/dashboard";

// ============================================================
// Data
// ============================================================

const CATEGORIES = [
  { id: "start", title: "Premiers pas", icon: "rocket_launch", count: 12, description: "Guide de demarrage rapide" },
  { id: "orders", title: "Commandes", icon: "shopping_cart", count: 15, description: "Gestion des commandes et livraisons" },
  { id: "payments", title: "Paiements", icon: "payments", count: 10, description: "Methodes de paiement et retraits" },
  { id: "disputes", title: "Litiges", icon: "gavel", count: 8, description: "Resolution des conflits" },
  { id: "account", title: "Compte", icon: "person", count: 9, description: "Profil et parametres" },
  { id: "security", title: "Securite", icon: "shield", count: 7, description: "Protection et 2FA" },
];

const POPULAR_ARTICLES = [
  { title: "Comment creer un compte FreelanceHigh", icon: "person_add", category: "Premiers pas" },
  { title: "Publier votre premier service en 5 minutes", icon: "add_circle", category: "Premiers pas" },
  { title: "Comprendre le systeme d'escrow (sequestre)", icon: "account_balance", category: "Paiements" },
  { title: "Comment retirer vos gains (SEPA, Mobile Money)", icon: "account_balance_wallet", category: "Paiements" },
  { title: "Que faire en cas de litige avec un client", icon: "gavel", category: "Litiges" },
  { title: "Configurer l'authentification a deux facteurs", icon: "verified_user", category: "Securite" },
  { title: "Suivre l'avancement de vos commandes", icon: "local_shipping", category: "Commandes" },
  { title: "Optimiser votre profil pour attirer plus de clients", icon: "trending_up", category: "Compte" },
];

const FAQ_ITEMS = [
  {
    question: "Comment m'inscrire sur FreelanceHigh ?",
    answer:
      "L'inscription est gratuite et ne prend que quelques minutes. Rendez-vous sur la page d'inscription, choisissez votre role (Freelance, Client ou Agence), remplissez vos informations et verifiez votre adresse email via le code OTP que nous vous envoyons. Vous pouvez aussi vous inscrire avec Google, LinkedIn, Facebook ou Apple.",
    category: "start",
  },
  {
    question: "Quels moyens de paiement sont acceptes ?",
    answer:
      "FreelanceHigh accepte les cartes bancaires (Visa, Mastercard) via Stripe, les paiements Mobile Money (Orange Money, Wave, MTN MoMo) via CinetPay, PayPal, les virements SEPA, et les stablecoins USDC/USDT. La devise par defaut est l'Euro (EUR) avec conversion automatique en FCFA, USD, GBP et MAD.",
    category: "payments",
  },
  {
    question: "Comment fonctionne la livraison d'une commande ?",
    answer:
      "Une fois la commande acceptee, le freelance travaille sur le projet et livre les fichiers directement dans l'espace de commande. Le client recoit une notification et dispose d'un delai pour valider la livraison ou demander une revision. Les fonds ne sont liberes qu'apres validation.",
    category: "orders",
  },
  {
    question: "Comment ouvrir un litige ?",
    answer:
      "Si vous n'etes pas satisfait d'une livraison et que vous ne parvenez pas a trouver un accord avec le prestataire, vous pouvez ouvrir un litige depuis la page de detail de votre commande. Un mediateur FreelanceHigh examinera les preuves fournies par les deux parties et rendra un verdict equitable.",
    category: "disputes",
  },
  {
    question: "Quelles sont les commissions de FreelanceHigh ?",
    answer:
      "Les commissions varient selon votre plan d'abonnement : Gratuit (20%), Pro a 15 EUR/mois (15%), Business a 45 EUR/mois (10%), Agence a 99 EUR/mois (8%). Chaque plan offre des avantages supplementaires comme des boosts publicitaires, des certifications IA et des cles API.",
    category: "payments",
  },
  {
    question: "Comment retirer mes gains ?",
    answer:
      "Rendez-vous dans la section Gains & Finances de votre dashboard. Vous pouvez retirer vos fonds par virement SEPA (Europe), Mobile Money via Orange Money, Wave ou MTN MoMo (Afrique), PayPal, Wise, ou en crypto (USDC/USDT). Le delai de traitement varie de 1 a 5 jours ouvrables selon la methode choisie.",
    category: "payments",
  },
  {
    question: "Puis-je annuler une commande en cours ?",
    answer:
      "Oui, sous certaines conditions. Si le freelance n'a pas encore commence le travail, l'annulation est automatique avec remboursement integral. Si le travail est en cours, une demande d'annulation est soumise et les deux parties doivent trouver un accord. En cas de desaccord, un litige peut etre ouvert.",
    category: "orders",
  },
  {
    question: "Comment activer l'authentification a deux facteurs (2FA) ?",
    answer:
      "Allez dans Parametres > Securite de votre dashboard. Activez la 2FA et choisissez entre Google Authenticator (application TOTP) ou l'envoi d'un code par SMS. Scannez le QR code avec votre application d'authentification ou entrez votre numero de telephone. Confirmez avec le code de verification.",
    category: "security",
  },
  {
    question: "Comment fonctionne le systeme d'agences ?",
    answer:
      "Les agences disposent d'un espace dedie pour gerer une equipe de freelances. En tant qu'agence, vous pouvez inviter des membres, publier des services sous votre marque, gerer des projets multi-membres avec vue Kanban, et centraliser la facturation. Le plan Agence (99 EUR/mois) permet jusqu'a 20 membres et offre 50 Go de stockage partage.",
    category: "start",
  },
  {
    question: "Comment contacter le support FreelanceHigh ?",
    answer:
      "Vous pouvez nous contacter de plusieurs manieres : via le chat en direct disponible sur cette page (lundi au vendredi, 9h-18h CET), par email a support@freelancehigh.com, ou en creant un ticket de support depuis le formulaire ci-dessous. Notre equipe s'engage a repondre sous 24 heures.",
    category: "account",
  },
  {
    question: "Qu'est-ce que le KYC et pourquoi est-il necessaire ?",
    answer:
      "Le KYC (Know Your Customer) est un processus de verification d'identite obligatoire pour certaines actions. Niveau 1 (email) donne l'acces de base. Niveau 2 (telephone) permet de commander et postuler. Niveau 3 (piece d'identite) debloque les retraits et la publication de services. Niveau 4 (verification pro) donne acces au badge Elite et aux limites elevees.",
    category: "security",
  },
  {
    question: "Comment booster la visibilite de mes services ?",
    answer:
      "Plusieurs strategies s'offrent a vous : completez votre profil a 100%, obtenez des avis positifs, utilisez des mots-cles pertinents dans vos titres et descriptions, ajoutez des images de qualite a vos services, et utilisez les boosts publicitaires inclus dans les plans Pro, Business et Agence pour apparaitre en tete des resultats de recherche.",
    category: "account",
  },
];

const TICKET_CATEGORIES = [
  "Probleme technique",
  "Question sur un paiement",
  "Litige en cours",
  "Probleme de compte",
  "Signalement d'un utilisateur",
  "Suggestion d'amelioration",
  "Autre",
];

const TICKET_PRIORITIES = [
  { value: "basse", label: "Basse" },
  { value: "moyenne", label: "Moyenne" },
  { value: "haute", label: "Haute" },
];

// ============================================================
// Chat message type
// ============================================================

interface ChatMsg {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

function timeNow() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// ============================================================
// Component
// ============================================================

export default function AidePage() {
  const addToast = useToastStore((s) => s.addToast);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Live chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: "1", sender: "bot", text: "Bonjour ! Comment puis-je vous aider ?", time: timeNow() },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Ticket modal
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: TICKET_CATEGORIES[0],
    description: "",
    priority: "moyenne",
  });

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Filter FAQ by search and category
  const filteredFaq = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Send chat message
  const handleSendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: timeNow(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulated bot response
    setTimeout(() => {
      const botMsg: ChatMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Merci pour votre message. Un membre de notre equipe vous repondra dans les plus brefs delais. En attendant, consultez notre FAQ ci-dessus pour une reponse rapide.",
        time: timeNow(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  }, [chatInput]);

  // Submit ticket
  function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      addToast("error", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    addToast("success", "Votre ticket a ete cree avec succes. Nous vous repondrons sous 24h.");
    setTicketModalOpen(false);
    setTicketForm({ subject: "", category: TICKET_CATEGORIES[0], description: "", priority: "moyenne" });
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* ================================================================ */}
      {/* Hero + Search */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden px-6 lg:px-20 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/25">
            <span className="material-symbols-outlined text-base">support_agent</span>
            Centre d&apos;aide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Comment pouvons-nous{" "}
            <span className="text-primary">vous aider</span> ?
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Trouvez des reponses a vos questions, explorez nos guides ou contactez notre equipe de support.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-neutral-dark border border-border-dark rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <span className="material-symbols-outlined text-slate-400 px-4 text-xl">search</span>
              <input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-base py-4 pr-4"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Categories Grid */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            Explorer par categorie
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={cn(
                  "group text-left p-6 rounded-xl border transition-all duration-200",
                  activeCategory === cat.id
                    ? "bg-primary/15 border-primary/40 shadow-lg shadow-primary/10"
                    : "bg-neutral-dark border-border-dark hover:border-primary/30 hover:bg-neutral-dark/80"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      activeCategory === cat.id
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    )}
                  >
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">{cat.description}</p>
                    <span className="text-xs text-primary font-semibold">{cat.count} articles</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {activeCategory && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setActiveCategory(null)}
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
                Effacer le filtre
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* Popular Articles */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            Articles populaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_ARTICLES.map((article) => (
              <div
                key={article.title}
                className="group bg-neutral-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-xl">{article.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <span className="text-xs text-slate-500">{article.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FAQ Accordion */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            Questions frequentes
          </h2>

          {filteredFaq.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-500 mb-4 block">search_off</span>
              <p className="text-slate-400 text-lg">Aucune question ne correspond a votre recherche.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(null);
                }}
                className="mt-4 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
              >
                Reinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "border rounded-xl overflow-hidden transition-all duration-200",
                      isOpen
                        ? "bg-neutral-dark border-primary/30"
                        : "bg-neutral-dark/60 border-border-dark hover:border-border-dark/80"
                    )}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-semibold text-base leading-snug">{item.question}</span>
                      <span
                        className={cn(
                          "material-symbols-outlined text-xl text-slate-400 shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180 text-primary"
                        )}
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* Support Tickets Section */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-dark border border-border-dark rounded-xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">confirmation_number</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Vous n&apos;avez pas trouve votre reponse ?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Creez un ticket de support et notre equipe vous repondra sous 24 heures.
              Vous pouvez aussi nous contacter par email a{" "}
              <a href="mailto:support@freelancehigh.com" className="text-primary hover:underline font-semibold">
                support@freelancehigh.com
              </a>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setTicketModalOpen(true)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-4 font-bold transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Creer un ticket
              </button>
              <a
                href="mailto:support@freelancehigh.com"
                className="inline-flex items-center gap-2 bg-border-dark hover:bg-border-dark/80 text-slate-300 rounded-xl px-8 py-4 font-semibold transition-all"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
                Envoyer un email
              </a>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">schedule</span>
                Lundi - Vendredi, 9h - 18h CET
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mail</span>
                support@freelancehigh.com
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">avg_pace</span>
                Reponse sous 24h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Ticket Modal */}
      {/* ================================================================ */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setTicketModalOpen(false)}
          />
          <div className="relative bg-background-dark border border-border-dark rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <h3 className="text-lg font-bold">Creer un ticket de support</h3>
              </div>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Sujet <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Decrivez brievement votre probleme"
                  className="w-full bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Categorie
                </label>
                <div className="relative">
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full appearance-none bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 pr-10 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                  >
                    {TICKET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-slate-400 text-sm absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Priorite
                </label>
                <div className="flex gap-3">
                  {TICKET_PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setTicketForm({ ...ticketForm, priority: p.value })}
                      className={cn(
                        "flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all",
                        ticketForm.priority === p.value
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "bg-neutral-dark border-border-dark text-slate-400 hover:border-border-dark/80"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Decrivez votre probleme en detail..."
                  rows={5}
                  className="w-full bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 bg-border-dark rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors shadow-lg shadow-primary/20"
                >
                  Envoyer le ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* Live Chat Widget */}
      {/* ================================================================ */}

      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-[80] w-[360px] max-w-[calc(100vw-2rem)] bg-background-dark border border-border-dark rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-primary text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">support_agent</span>
              </div>
              <div>
                <p className="font-bold text-sm">Support FreelanceHigh</p>
                <p className="text-xs text-white/70">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed",
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-neutral-dark border border-border-dark text-slate-300 rounded-bl-sm"
                  )}
                >
                  <p>{msg.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      msg.sender === "user" ? "text-white/60" : "text-slate-500"
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3 border-t border-border-dark">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Ecrivez votre message..."
                className="flex-1 bg-neutral-dark border border-border-dark rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  chatInput.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-border-dark text-slate-500 cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating chat button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all",
          chatOpen
            ? "bg-border-dark text-slate-300 hover:bg-border-dark/80"
            : "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
        )}
        title="Chat en direct"
      >
        <span className="material-symbols-outlined text-2xl">
          {chatOpen ? "close" : "chat"}
        </span>
      </button>
    </div>
  );
}
