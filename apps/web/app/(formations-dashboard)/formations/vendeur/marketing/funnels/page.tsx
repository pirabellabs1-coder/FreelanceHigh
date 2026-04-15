"use client";

export default function FunnelsPage() {
  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#5c647a] mb-2">
          <a href="/formations/vendeur/marketing" className="hover:text-[#006e2f] transition-colors">Marketing</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#191c1e] font-medium">Funnels de Vente</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e]">Funnels de Vente</h1>
        <p className="text-sm text-[#5c647a] mt-1">Créez des tunnels de vente avec upsells et downsells</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px] text-violet-500" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
        </div>
        <h2 className="text-xl font-extrabold text-[#191c1e] mb-2">Funnels de Vente</h2>
        <p className="text-sm text-[#5c647a] max-w-md mx-auto mb-6">
          Le builder de funnels visuels arrive bientôt. Créez des séquences landing → checkout → upsell → confirmation avec tracking en temps réel.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-xl">
          <span className="material-symbols-outlined text-[16px] text-violet-600">schedule</span>
          <span className="text-sm font-semibold text-violet-700">Disponible dans la V1</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg mx-auto">
          {[
            { icon: "ads_click", label: "Landing Page", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: "shopping_cart", label: "Checkout + Upsell", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: "verified", label: "Page de confirmation", color: "text-[#006e2f]", bg: "bg-[#006e2f]/10" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.bg}`}>
                <span className={`material-symbols-outlined text-[22px] ${step.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
              </div>
              <p className="text-[11px] font-semibold text-[#191c1e] text-center">{step.label}</p>
              {i < 2 && <span className="material-symbols-outlined text-[16px] text-gray-300 -mt-1">arrow_downward</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
