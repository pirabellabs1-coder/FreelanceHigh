"use client";

import { useState } from "react";
import { useCurrencyStore } from "@/store/currency";
import { cn } from "@/lib/utils";

const PLANS = [
  { name: "Gratuit", price: 0, commission: "20%", services: "3", candidatures: "5/mois", boost: "Non", certif: false, api: false, color: "border-slate-600" },
  { name: "Pro", price: 15, commission: "15%", services: "15", candidatures: "20/mois", boost: "1/mois", certif: true, api: false, color: "border-primary", popular: true },
  { name: "Business", price: 45, commission: "10%", services: "Illimité", candidatures: "Illimité", boost: "5/mois", certif: true, api: true, color: "border-blue-500" },
  { name: "Agence", price: 99, commission: "8%", services: "Illimité", candidatures: "Illimité", boost: "10/mois", certif: true, api: true, color: "border-emerald-500" },
];

const FAQ = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement prend effet immédiatement, avec un prorata sur la facturation." },
  { q: "Quelles méthodes de paiement acceptez-vous ?", a: "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, Orange Money, Wave, MTN Mobile Money et les virements SEPA." },
  { q: "Y a-t-il un engagement minimum ?", a: "Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment." },
  { q: "Qu'est-ce que la commission ?", a: "La commission est prélevée sur chaque transaction réussie. Plus votre plan est élevé, plus la commission est réduite." },
  { q: "Le plan Agence inclut-il des membres d'équipe ?", a: "Oui, le plan Agence permet jusqu'à 20 membres d'équipe avec gestion des rôles et permissions." },
];

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);
  const { format } = useCurrencyStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Des tarifs simples et transparents
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos ambitions. Évoluez à votre rythme.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm font-semibold", !annual ? "text-white" : "text-slate-500")}>Mensuel</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn("w-14 h-7 rounded-full transition-colors relative", annual ? "bg-primary" : "bg-slate-600")}
            >
              <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all", annual ? "left-8" : "left-1")} />
            </button>
            <span className={cn("text-sm font-semibold", annual ? "text-white" : "text-slate-500")}>
              Annuel <span className="text-primary text-xs font-bold ml-1">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
          {PLANS.map(plan => {
            const price = annual ? Math.round(plan.price * 0.8 * 12) : plan.price;
            return (
              <div key={plan.name} className={cn("relative bg-neutral-dark rounded-2xl border-2 p-6 flex flex-col", plan.color, plan.popular && "ring-2 ring-primary/30")}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{format(price)}</span>
                  <span className="text-slate-500 text-sm">/{annual ? "an" : "mois"}</span>
                </div>
                <p className="text-sm text-primary font-bold mb-6">Commission : {plan.commission}</p>
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span>{plan.services} services actifs</li>
                  <li className="flex items-center gap-2 text-sm text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span>{plan.candidatures} candidatures</li>
                  <li className="flex items-center gap-2 text-sm text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span>Boost : {plan.boost}</li>
                  <li className={cn("flex items-center gap-2 text-sm", plan.certif ? "text-slate-300" : "text-slate-600")}><span className="material-symbols-outlined text-sm">{plan.certif ? "check" : "close"}</span>Certification IA</li>
                  <li className={cn("flex items-center gap-2 text-sm", plan.api ? "text-slate-300" : "text-slate-600")}><span className="material-symbols-outlined text-sm">{plan.api ? "check" : "close"}</span>Clés API</li>
                </ul>
                <button className={cn("w-full py-3 rounded-xl text-sm font-bold transition-colors", plan.popular ? "bg-primary text-white hover:bg-primary/90" : "bg-border-dark text-white hover:bg-border-dark/80")}>
                  {plan.price === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-semibold text-white text-sm">{item.q}</span>
                  <span className="material-symbols-outlined text-slate-400">{openFaq === i ? "expand_less" : "expand_more"}</span>
                </button>
                {openFaq === i && <p className="px-5 pb-5 text-sm text-slate-400">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
