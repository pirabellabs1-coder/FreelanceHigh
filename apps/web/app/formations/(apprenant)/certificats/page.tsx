"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Download, Linkedin, ExternalLink, Share2 } from "lucide-react";

interface Certificate {
  id: string;
  code: string;
  score: number;
  issuedAt: string;
  pdfUrl: string | null;
  formation: { titleFr: string; titleEn: string; slug: string; thumbnail: string | null };
  enrollment: { formation: { instructeur: { user: { name: string } } } };
}

export default function MesCertificatsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    const saved = localStorage.getItem("formations_lang") as "fr" | "en" | null;
    if (saved) setLang(saved);

    fetch("/api/apprenant/certificats")
      .then((r) => r.json())
      .then((d) => { setCertificates(d.certificates ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  const shareLinkedIn = (cert: Certificate) => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${window.location.origin}/formations/verification/${cert.code}`)}&title=${encodeURIComponent(lang === "fr" ? cert.formation.titleFr : cert.formation.titleEn)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {t("Mes certifications", "My Certifications")}
            </h1>
            <p className="text-slate-400 text-sm">
              {certificates.length} {t("certification", "certification")}{certificates.length > 1 ? "s" : ""} {t("obtenue", "earned")}{certificates.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-neutral-800 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              {t("Vous n'avez pas encore de certification.", "You don't have any certifications yet.")}
            </p>
            <Link
              href="/formations/mes-formations"
              className="text-primary hover:underline text-sm"
            >
              {t("Voir mes formations en cours", "View my courses in progress")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 flex items-start gap-6"
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 bg-neutral-700 rounded-xl flex-shrink-0 overflow-hidden">
                  {cert.formation.thumbnail ? (
                    <img
                      src={cert.formation.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-yellow-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">
                    {lang === "fr" ? cert.formation.titleFr : cert.formation.titleEn}
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {cert.enrollment.formation.instructeur.user.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{t("Score :", "Score:")} <span className="text-white font-medium">{cert.score}%</span></span>
                    <span>{t("Obtenu le", "Earned on")} {new Date(cert.issuedAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="font-mono text-xs text-slate-600 mt-1">{cert.code}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link
                    href={`/formations/certificats/${cert.id}`}
                    className="flex items-center gap-1.5 text-xs text-white bg-primary hover:bg-primary/90 px-3 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t("Voir", "View")}
                  </Link>
                  {cert.pdfUrl && (
                    <a
                      href={cert.pdfUrl}
                      download
                      className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </a>
                  )}
                  <button
                    onClick={() => shareLinkedIn(cert)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
