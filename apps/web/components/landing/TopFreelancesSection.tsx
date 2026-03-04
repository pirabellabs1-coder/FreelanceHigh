"use client";

import Link from "next/link";
import { useCurrencyStore } from "@/store/currency";

const TOP_FREELANCES = [
  {
    username: "marie-dupont",
    name: "Marie Dupont",
    title: "UX/UI Designer Senior",
    rating: 4.9,
    location: "PARIS",
    badge: "ELITE",
    skills: ["Figma Expert", "Design System"],
    dailyRateEur: 450,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLv44ydP9Gqtu7C2nKIZEieUgN3ekgdqkBDhVkdMzn-cviN6ywqo7KXWT2t-uxj7JxDyMkhxzeOXQrnbNls9gRuC4Vkqjyoyn0UeXasHNSYczHoAMVCPG47twQ895bpq1Lcqc0t8wfXMRtfywGDySsR6d52DkFL-8CrxGPuA0XhmGU7zNG5GuSRe3ofPdLTHa58Owlu2XRLwVLUP7SnBJTGqu3IyfzUAUNHfxuptnhbaZ7dzkZI1vP15L57iRIwltUby7RF_lgOAWk",
  },
  {
    username: "alex-chen",
    name: "Alex Chen",
    title: "Full Stack Developer",
    rating: 5.0,
    location: "BERLIN",
    badge: "ELITE",
    skills: ["React / Next.js", "Node.js"],
    dailyRateEur: 550,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiUy7Mw-mqyJfD8QdZyDGMlioBIaCakT0iGOM1V2Ijtzn62PDDTRGJNG5Ij492qe98ZMVZukxRwH3XcvC8DPcQRHcwHXcGppQ-sMI_T9oLr-56xAk4i9WWGZ0W8SyPqTVANlJwsKMgSeqdlx49H10y5-X19MLTcp_6euGoeYM2BAMyTy7rHRqiclhwofheOZqE9tjD8-xuOrRzUr1jDgh45hAPBS5Bmar_WdvahsdmgOtP4m8BvxK2fJrglQ4fbNSYtC1wewPt2AB1",
  },
  {
    username: "sarah-miller",
    name: "Sarah Miller",
    title: "Growth Marketing Expert",
    rating: 4.8,
    location: "LONDON",
    badge: "ELITE",
    skills: ["SEO / SEA", "Analytics"],
    dailyRateEur: 480,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARuzMQnOfvbDE1doc2bcGvGcXfFvqwgqrSAq3wql5N32-6E3lbqKLpz1_S2ZJzhssuLXvXfipxkmFle0W2ijXv3FE5fOzjgP8odO1Xy9iAIfn3gpyqlvvb0cfN-7ZYatMMPMZybMFLlwWSF9Q80_P6FG2Zn_LV6zRg_ykeUyBK_K9gmtT3CDae33VcGXlC_TRkC6dsrmZD3rQQk1Idgjz6mDMgEsDZ9X-jG6ZY0wsLKQ4fAEmJImqOM7MLoEM9xLH6ueCiOfIoXBGS",
  },
];

export function TopFreelancesSection() {
  const { format } = useCurrencyStore();

  return (
    <section className="bg-primary/5 dark:bg-primary/5 py-32 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header centré */}
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Nos freelances les mieux notés
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Des experts triés sur le volet, sélectionnés pour leur excellence et la satisfaction de leurs clients.
          </p>
        </div>

        {/* Grid cards verticales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOP_FREELANCES.map((f) => (
            <Link
              key={f.username}
              href={`/freelances/${f.username}`}
              className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-primary/5 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56">
                <img
                  alt={f.name}
                  className="w-full h-full object-cover"
                  src={f.image}
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {f.location}
                </div>
                <div className="absolute top-4 right-4 bg-accent text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {f.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-1">{f.name}</h4>
                    <p className="text-sm text-primary font-bold uppercase tracking-wider">{f.title}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-xl">
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-base font-extrabold">{f.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {f.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-100 dark:bg-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">TJM indicatif</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {format(f.dailyRateEur)} <span className="text-sm font-normal text-slate-500">/ jour</span>
                    </span>
                  </div>
                  <span className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-3 rounded-xl transition-all">
                    <span className="material-symbols-outlined">visibility</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
