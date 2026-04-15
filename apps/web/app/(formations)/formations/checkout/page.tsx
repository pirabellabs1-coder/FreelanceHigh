"use client";

import Link from "next/link";
import { useState } from "react";

const orderItem = {
  title: "Masterclass Facebook & Instagram Ads",
  seller: "Éric Mensah",
  type: "Formation vidéo",
  price: 75000,
  icon: "ads_click",
  gradient: "from-blue-500 to-purple-600",
};

function formatFCFA(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function toEur(fcfa: number) {
  return Math.round(fcfa / 655.957);
}

type PaymentMethod = "card" | "orange_money" | "wave" | "mtn";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("orange_money");
  const [step, setStep] = useState<"form" | "success">("form");

  const commission = 0;
  const total = orderItem.price + commission;

  const paymentMethods: { id: PaymentMethod; label: string; icon: string; available: boolean }[] = [
    { id: "orange_money", label: "Orange Money", icon: "smartphone", available: true },
    { id: "wave", label: "Wave", icon: "waves", available: true },
    { id: "mtn", label: "MTN MoMo", icon: "phone_android", available: true },
    { id: "card", label: "Carte bancaire", icon: "credit_card", available: true },
  ];

  if (step === "success") {
    return (
      <div
        className="min-h-screen bg-[#f7f9fb] flex items-center justify-center px-4"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[#006e2f] text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#191c1e] mb-2">Paiement réussi !</h1>
          <p className="text-[#5c647a] mb-6">
            Votre accès à <strong>{orderItem.title}</strong> a été activé. Vous pouvez commencer à apprendre dès maintenant.
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${orderItem.gradient} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-white text-[18px]">{orderItem.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-[#191c1e] text-sm">{orderItem.title}</p>
                <p className="text-xs text-[#5c647a]">{formatFCFA(total)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/formations/apprenant/mes-formations"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #006e2f, #22c55e)" }}
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              Accéder à ma formation
            </Link>
            <Link
              href="/formations/explorer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-[#5c647a] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Continuer à explorer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f7f9fb] py-8 px-4 md:px-8"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs text-[#5c647a]">
          <Link href="/formations" className="hover:text-[#006e2f] transition-colors">Accueil</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <Link href="/formations/explorer" className="hover:text-[#006e2f] transition-colors">Explorer</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-[#191c1e] font-medium">Commande</span>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#006e2f" }}
          >
            <span className="material-symbols-outlined text-white text-[20px]">lock</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#191c1e] tracking-tight">
              Finaliser votre commande
            </h1>
            <p className="text-xs text-[#5c647a]">Paiement sécurisé SSL · Garantie 30 jours</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left — Payment form */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#191c1e] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006e2f] text-white text-xs flex items-center justify-center font-bold">1</span>
              Informations de contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">Prénom</label>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">Nom</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">
                  Adresse email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                />
                <p className="text-[10px] text-[#5c647a] mt-1">
                  Votre reçu et accès seront envoyés à cette adresse.
                </p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#191c1e] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#006e2f] text-white text-xs flex items-center justify-center font-bold">2</span>
              Moyen de paiement
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    paymentMethod === method.id
                      ? "border-[#006e2f] bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      paymentMethod === method.id ? "text-[#006e2f]" : "text-[#5c647a]"
                    }`}
                  >
                    {method.icon}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      paymentMethod === method.id ? "text-[#006e2f]" : "text-[#191c1e]"
                    }`}
                  >
                    {method.label}
                  </span>
                  {paymentMethod === method.id && (
                    <span
                      className="material-symbols-outlined text-[#006e2f] text-[16px] ml-auto"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Dynamic payment fields */}
            {(paymentMethod === "orange_money" ||
              paymentMethod === "wave" ||
              paymentMethod === "mtn") && (
              <div>
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">
                  Numéro de téléphone Mobile Money
                </label>
                <div className="flex gap-3">
                  <div className="w-20 px-3 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-base">🇨🇮</span>
                    <span className="font-semibold">+225</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="07 XX XX XX XX"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                  />
                </div>
                <p className="text-[10px] text-[#5c647a] mt-1.5">
                  Vous recevrez une notification de confirmation sur ce numéro.
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">
                      Expiration
                    </label>
                    <input
                      type="text"
                      placeholder="MM / AA"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5c647a] mb-1.5">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    placeholder="PRENOM NOM"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f7f9fb] text-sm text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded accent-[#006e2f]"
                defaultChecked
              />
              <span className="text-sm text-[#5c647a] leading-relaxed">
                J&apos;accepte les{" "}
                <a href="#" className="text-[#006e2f] hover:underline font-semibold">
                  Conditions Générales de Vente
                </a>{" "}
                et la{" "}
                <a href="#" className="text-[#006e2f] hover:underline font-semibold">
                  Politique de confidentialité
                </a>{" "}
                de FreelanceHigh.
              </span>
            </label>
          </div>
        </div>

        {/* Right — Order summary */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sticky top-24">
            <h2 className="font-bold text-[#191c1e] mb-5">Récapitulatif</h2>

            {/* Product */}
            <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gray-100">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${orderItem.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="material-symbols-outlined text-white text-[22px]">
                  {orderItem.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#191c1e] text-sm leading-snug">{orderItem.title}</p>
                <p className="text-xs text-[#5c647a] mt-0.5">par {orderItem.seller}</p>
                <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {orderItem.type}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#5c647a]">Prix</span>
                <span className="font-semibold text-[#191c1e]">{formatFCFA(orderItem.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5c647a]">Frais de traitement</span>
                <span className="font-semibold text-green-600">Gratuit</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-5">
              <span className="font-bold text-[#191c1e]">Total</span>
              <div className="text-right">
                <p className="text-xl font-extrabold text-[#006e2f] tracking-tight">
                  {formatFCFA(total)}
                </p>
                <p className="text-xs text-[#5c647a]">≈ {toEur(total)} €</p>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={() => setStep("success")}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold text-base shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #006e2f, #22c55e)" }}
            >
              <span className="material-symbols-outlined text-[20px]">lock</span>
              Payer {formatFCFA(total)}
            </button>

            {/* Security */}
            <div className="mt-4 flex items-center justify-center gap-4">
              {[
                { icon: "lock", label: "SSL" },
                { icon: "verified_user", label: "Sécurisé" },
                { icon: "replay_30", label: "30j remboursé" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-0.5">
                  <span className="material-symbols-outlined text-[#5c647a] text-[16px]">
                    {item.icon}
                  </span>
                  <span className="text-[9px] text-[#5c647a] font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="mt-5 p-3 rounded-xl bg-green-50 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#006e2f] text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <p className="text-[11px] font-semibold text-[#006e2f] leading-snug">
                Garantie satisfait ou remboursé sous 30 jours, sans questions posées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
