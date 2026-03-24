import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function CommentCaMarchePage() {
  const t = await getTranslations("how_it_works_page");

  const STEPS_FREELANCE = [
    { icon: "person_add", title: t("freelance_step1_title"), desc: t("freelance_step1_desc") },
    { icon: "sell", title: t("freelance_step2_title"), desc: t("freelance_step2_desc") },
    { icon: "work", title: t("freelance_step3_title"), desc: t("freelance_step3_desc") },
    { icon: "payments", title: t("freelance_step4_title"), desc: t("freelance_step4_desc") },
  ];

  const STEPS_CLIENT = [
    { icon: "search", title: t("client_step1_title"), desc: t("client_step1_desc") },
    { icon: "shopping_cart", title: t("client_step2_title"), desc: t("client_step2_desc") },
    { icon: "chat", title: t("client_step3_title"), desc: t("client_step3_desc") },
    { icon: "verified", title: t("client_step4_title"), desc: t("client_step4_desc") },
  ];

  const STEPS_AGENCE = [
    { icon: "business", title: t("agency_step1_title"), desc: t("agency_step1_desc") },
    { icon: "group_add", title: t("agency_step2_title"), desc: t("agency_step2_desc") },
    { icon: "folder_shared", title: t("agency_step3_title"), desc: t("agency_step3_desc") },
    { icon: "account_balance", title: t("agency_step4_title"), desc: t("agency_step4_desc") },
  ];

  const sections = [
    { titleKey: "section_freelances", steps: STEPS_FREELANCE, color: "text-primary", bg: "bg-primary/10" },
    { titleKey: "section_clients", steps: STEPS_CLIENT, color: "text-blue-400", bg: "bg-blue-500/10" },
    { titleKey: "section_agencies", steps: STEPS_AGENCE, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-[1440px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t("title")}</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {sections.map(section => (
          <div key={section.titleKey} className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 ${section.color}`}>{t(section.titleKey)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.steps.map((step, i) => (
                <div key={step.title} className="bg-neutral-dark rounded-2xl border border-border-dark p-6">
                  <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined ${section.color}`}>{step.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-bold ${section.color}`}>{t("step", { number: i + 1 })}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link href="/inscription" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            {t("cta_start")}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
