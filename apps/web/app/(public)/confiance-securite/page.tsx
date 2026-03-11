import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ConfianceSecuritePage() {
  const t = await getTranslations("trust_page");

  const FEATURES = [
    { icon: "lock", titleKey: "feature_escrow_title", descKey: "feature_escrow_desc", color: "text-primary", bg: "bg-primary/10" },
    { icon: "verified_user", titleKey: "feature_kyc_title", descKey: "feature_kyc_desc", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: "gavel", titleKey: "feature_disputes_title", descKey: "feature_disputes_desc", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: "shield", titleKey: "feature_ssl_title", descKey: "feature_ssl_desc", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: "privacy_tip", titleKey: "feature_privacy_title", descKey: "feature_privacy_desc", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: "account_balance", titleKey: "feature_escrow_guaranteed_title", descKey: "feature_escrow_guaranteed_desc", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t("title")}</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map(f => (
            <div key={f.titleKey} className="bg-neutral-dark rounded-2xl border border-border-dark p-6">
              <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <span className={`material-symbols-outlined text-2xl ${f.color}`}>{f.icon}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{t(f.titleKey)}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>

        <div className="bg-neutral-dark rounded-2xl border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("support_title")}</h2>
          <p className="text-slate-400 mb-6">{t("support_desc")}</p>
          <Link href="/aide" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            {t("support_cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
