"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Award, Download, Linkedin, QrCode, CheckCircle, Share2 } from "lucide-react";

interface CertificateDetail {
  id: string;
  code: string;
  score: number;
  issuedAt: string;
  pdfUrl: string | null;
  user: { name: string };
  formation: { titleFr: string; titleEn: string; slug: string; duration: number };
  enrollment: {
    formation: {
      instructeur: { user: { name: string } };
    };
  };
}

export default function CertificatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cert, setCert] = useState<CertificateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("formations_lang") as "fr" | "en" | null;
    if (saved) setLang(saved);

    fetch(`/api/apprenant/certificats/${id}`)
      .then((r) => r.json())
      .then((d) => { setCert(d.certificate ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  const copyLink = () => {
    if (!cert) return;
    navigator.clipboard.writeText(`${window.location.origin}/formations/verification/${cert.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    if (!cert) return;
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${window.location.origin}/formations/verification/${cert.code}`)}&title=${encodeURIComponent(lang === "fr" ? cert.formation.titleFr : cert.formation.titleEn)}`;
    window.open(url, "_blank", "noopener");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 bg-neutral-800 rounded-full" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-center p-4">
        <div>
          <p className="text-slate-400 mb-4">{t("Certificat introuvable", "Certificate not found")}</p>
          <Link href="/formations/certificats" className="text-primary hover:underline text-sm">
            {t("Mes certifications", "My Certifications")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Certificate card */}
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/5">
          {/* Top band */}
          <div className="bg-gradient-to-r from-primary to-purple-500 h-2" />

          <div className="p-8">
            {/* Logo + title */}
            <div className="text-center mb-8">
              <div className="text-2xl font-bold text-white mb-1">FreelanceHigh</div>
              <div className="text-xs text-slate-400 tracking-widest uppercase">
                {t("Certificat d'accomplissement", "Certificate of Completion")}
              </div>
            </div>

            {/* Main content */}
            <div className="text-center space-y-4 mb-8">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-10 h-10 text-yellow-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm">{t("Délivré à", "Issued to")}</p>
                <p className="text-2xl font-bold text-white mt-1">{cert.user.name}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">{t("Pour avoir complété avec succès", "For successfully completing")}</p>
                <p className="text-lg font-semibold text-white mt-1">
                  {lang === "fr" ? cert.formation.titleFr : cert.formation.titleEn}
                </p>
              </div>

              <div className="text-slate-400 text-sm">
                {t("Instructeur", "Instructor")}: <span className="text-white">{cert.enrollment.formation.instructeur.user.name}</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-3 gap-4 bg-neutral-800/50 rounded-2xl p-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{cert.score}%</p>
                <p className="text-xs text-slate-400">{t("Score", "Score")}</p>
              </div>
              <div className="text-center border-x border-neutral-700">
                <p className="text-2xl font-bold text-white">{Math.round(cert.formation.duration / 60)}h</p>
                <p className="text-xs text-slate-400">{t("Durée", "Duration")}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">{new Date(cert.issuedAt).toLocaleDateString("fr-FR")}</p>
                <p className="text-xs text-slate-400">{t("Date", "Date")}</p>
              </div>
            </div>

            {/* Code */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="font-mono text-sm text-slate-300">{cert.code}</span>
              </div>
              <Link
                href={`/formations/verification/${cert.code}`}
                target="_blank"
                className="text-xs text-primary hover:underline mt-1 block"
              >
                {t("Vérifier l'authenticité", "Verify Authenticity")}
              </Link>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {cert.pdfUrl && (
            <a
              href={cert.pdfUrl}
              download
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              {t("Télécharger PDF", "Download PDF")}
            </a>
          )}
          <button
            onClick={shareLinkedIn}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-slate-300 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            {copied ? t("Lien copié !", "Link Copied!") : t("Copier le lien", "Copy Link")}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/formations/certificats" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← {t("Toutes mes certifications", "All my certifications")}
          </Link>
        </div>
      </div>
    </div>
  );
}
