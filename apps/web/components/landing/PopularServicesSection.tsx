"use client";

import Link from "next/link";
import { useCurrencyStore } from "@/store/currency";

const POPULAR_SERVICES = [
  {
    slug: "creation-logo-professionnel",
    title: "Création de logo professionnel",
    freelancer: "Studio Graphik",
    rating: 4.9,
    reviews: 342,
    priceEur: 150,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5tMHn3iXlo2UtTqG_QRtJGsnV4ET7fnFrLu0XlMcU90NZ99up3ByX460k3LW_SbjobCS6735ENKRx5dGqoQyMGc9cHqhU5ECaRvcQZvwSGtPPSve4qWKdyvJUzPqpggU4E26MLMSveuv0GqEPWknI9QP3skKFhA8SLreffd4xpnLhNUpKr0iSWF4X8rlLrb33Y6sS9HG_qhIx0WnoDBeVM5fUXQ6H-OpS7Nxg_QM99l2ExKE1vo9wYdJKqUwdp4eAD9yHp2V-pewj",
    category: "Design",
  },
  {
    slug: "site-wordpress-complet",
    title: "Site WordPress complet & responsive",
    freelancer: "WebPro Dev",
    rating: 4.8,
    reviews: 218,
    priceEur: 500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDU-wjNmvoaekii1VavUXeH1NsSrY4IxYrzNNkTbCP8yKbfy1k_TDeZhsNcFxkTJeixI5PfZ3lPN3DXitH98toGdsHGA3QEPVNUMsRJcTEZ1kPA67JZrE1WYBDQl1BF91GUVn7T07qLGjcz-eSWPFRr4Lo2feTVSi1k3mcwpO1UW0P_ceWrYmdf9frG9yLFLjlNPDfwX5xUJiKodovaeyIgF_XnSDmuGO0-n1_rgYfJbv8OihuopGfISoad4bbM3SBwAkfp6yFhKD9o",
    category: "Développement",
  },
  {
    slug: "montage-video-youtube",
    title: "Montage vidéo YouTube professionnel",
    freelancer: "CinéEdit Pro",
    rating: 5.0,
    reviews: 156,
    priceEur: 200,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLv44ydP9Gqtu7C2nKIZEieUgN3ekgdqkBDhVkdMzn-cviN6ywqo7KXWT2t-uxj7JxDyMkhxzeOXQrnbNls9gRuC4Vkqjyoyn0UeXasHNSYczHoAMVCPG47twQ895bpq1Lcqc0t8wfXMRtfywGDySsR6d52DkFL-8CrxGPuA0XhmGU7zNG5GuSRe3ofPdLTHa58Owlu2XRLwVLUP7SnBJTGqu3IyfzUAUNHfxuptnhbaZ7dzkZI1vP15L57iRIwltUby7RF_lgOAWk",
    category: "Vidéo",
  },
  {
    slug: "strategie-seo-complete",
    title: "Stratégie SEO complète + audit",
    freelancer: "SEO Master",
    rating: 4.7,
    reviews: 289,
    priceEur: 350,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiUy7Mw-mqyJfD8QdZyDGMlioBIaCakT0iGOM1V2Ijtzn62PDDTRGJNG5Ij492qe98ZMVZukxRwH3XcvC8DPcQRHcwHXcGppQ-sMI_T9oLr-56xAk4i9WWGZ0W8SyPqTVANlJwsKMgSeqdlx49H10y5-X19MLTcp_6euGoeYM2BAMyTy7rHRqiclhwofheOZqE9tjD8-xuOrRzUr1jDgh45hAPBS5Bmar_WdvahsdmgOtP4m8BvxK2fJrglQ4fbNSYtC1wewPt2AB1",
    category: "Marketing",
  },
  {
    slug: "application-mobile-react-native",
    title: "Application mobile React Native",
    freelancer: "AppForge Studio",
    rating: 4.9,
    reviews: 127,
    priceEur: 2000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARuzMQnOfvbDE1doc2bcGvGcXfFvqwgqrSAq3wql5N32-6E3lbqKLpz1_S2ZJzhssuLXvXfipxkmFle0W2ijXv3FE5fOzjgP8odO1Xy9iAIfn3gpyqlvvb0cfN-7ZYatMMPMZybMFLlwWSF9Q80_P6FG2Zn_LV6zRg_ykeUyBK_K9gmtT3CDae33VcGXlC_TRkC6dsrmZD3rQQk1Idgjz6mDMgEsDZ9X-jG6ZY0wsLKQ4fAEmJImqOM7MLoEM9xLH6ueCiOfIoXBGS",
    category: "Développement",
  },
  {
    slug: "identite-visuelle-complete",
    title: "Identité visuelle complète",
    freelancer: "BrandCraft",
    rating: 4.8,
    reviews: 203,
    priceEur: 800,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5tMHn3iXlo2UtTqG_QRtJGsnV4ET7fnFrLu0XlMcU90NZ99up3ByX460k3LW_SbjobCS6735ENKRx5dGqoQyMGc9cHqhU5ECaRvcQZvwSGtPPSve4qWKdyvJUzPqpggU4E26MLMSveuv0GqEPWknI9QP3skKFhA8SLreffd4xpnLhNUpKr0iSWF4X8rlLrb33Y6sS9HG_qhIx0WnoDBeVM5fUXQ6H-OpS7Nxg_QM99l2ExKE1vo9wYdJKqUwdp4eAD9yHp2V-pewj",
    category: "Design",
  },
];

export function PopularServicesSection() {
  const { format } = useCurrencyStore();

  return (
    <section className="py-32 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Services les plus demandés</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Les services qui cartonnent en ce moment sur la plateforme.
            </p>
          </div>
          <Link
            href="/explorer"
            className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all flex-shrink-0"
          >
            Voir tous les services <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {POPULAR_SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={service.image}
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {service.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{service.freelancer}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-accent text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-sm font-bold">{service.rating}</span>
                    <span className="text-xs text-slate-400">({service.reviews})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">À partir de</span>
                    <span className="text-lg font-extrabold text-primary">{format(service.priceEur)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
