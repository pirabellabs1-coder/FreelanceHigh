"use client";

import { useTranslations } from "next-intl";

const TESTIMONIAL_INDICES = [0, 1, 2];

export function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");

  return (
    <section className="py-32 px-6 lg:px-20 bg-primary/5 dark:bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIAL_INDICES.map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span
                    key={j}
                    className="material-symbols-outlined text-accent text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 italic">
                &ldquo;{t(`items.${i}.quote`)}&rdquo;
              </p>
              <div>
                <p className="font-bold text-lg">{t(`items.${i}.name`)}</p>
                <p className="text-sm text-slate-500">{t(`items.${i}.role`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
