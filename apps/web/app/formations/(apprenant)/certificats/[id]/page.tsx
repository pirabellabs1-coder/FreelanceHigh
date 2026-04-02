"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Award,
  Download,
  Linkedin,
  Share2,
  Printer,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

interface CertificateDetail {
  id: string;
  code: string;
  issuedAt: string;
  pdfUrl: string | null;
  formationId: string;
  enrolledAt: string;
  user: { name: string };
  formation: {
    title: string;
    slug: string;
    duration: number;
  };
  enrollment: {
    formation: {
      instructeur: { user: { name: string } };
    };
  };
}

export default function CertificatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const { status } = useSession();
  const router = useRouter();
  const fr = locale === "fr";

  const [cert, setCert] = useState<CertificateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/formations/connexion");
      return;
    }
    if (status !== "authenticated") return;

    fetch(`/api/apprenant/certificats/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        setCert(d.certificate ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, status, router]);

  const copyLink = () => {
    if (!cert) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/formations/verification/${cert.code}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    if (!cert) return;
    const title = cert.formation.title;
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      `${window.location.origin}/formations/verification/${cert.code}`
    )}&title=${encodeURIComponent(title)}`;
    window.open(url, "_blank", "noopener");
  };

  const downloadPdf = async () => {
    if (!cert) return;
    setDownloading(true);
    try {
      const res = await fetch(
        `/api/formations/${cert.formationId}/certificate`
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificat-${cert.code}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert(fr ? "Erreur lors du telechargement" : "Error downloading certificate");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/10 rounded-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48" />
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex items-center justify-center text-center py-20">
        <div>
          <Award className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">
            {fr ? "Certificat introuvable" : "Certificate not found"}
          </p>
          <Link href="/formations/certificats" className="text-primary hover:underline text-sm">
            {fr ? "Mes certifications" : "My Certifications"}
          </Link>
        </div>
      </div>
    );
  }

  const formation = cert.formation;
  const instructorName = cert.enrollment.formation.instructeur?.user?.name ?? "Instructeur";

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(fr ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const validUntil = new Date(cert.issuedAt);
  validUntil.setFullYear(validUntil.getFullYear() + 5);
  const fmtValidUntil = validUntil.toLocaleDateString(fr ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Back link */}
      <Link
        href="/formations/certificats"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors print:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        {fr ? "Mes certifications" : "My Certifications"}
      </Link>

      {/* ==================== SOVEREIGN GILT CERTIFICATE ==================== */}
      <div
        id="certificate-visual"
        className="relative bg-[#faf6ee] dark:bg-[#1e1e2a] overflow-hidden shadow-2xl"
        style={{ aspectRatio: "297 / 210" }}
      >
        {/* Outer gold border */}
        <div className="absolute inset-[8px] border-[2px] border-[#c9a84c]/60 dark:border-[#c9a84c]/30" />
        {/* Inner border */}
        <div className="absolute inset-[12px] border border-[#c9a84c]/30 dark:border-[#c9a84c]/20" />
        {/* Innermost frame */}
        <div className="absolute inset-[16px] border-[0.5px] border-[#c9a84c]/20 dark:border-[#c9a84c]/15" />

        {/* Top accent strip */}
        <div className="absolute top-0 left-[14px] right-[14px] h-[3px] bg-gradient-to-r from-[#c9a84c] via-[#5b3d8f] to-[#c9a84c]" />
        {/* Bottom accent strip */}
        <div className="absolute bottom-0 left-[14px] right-[14px] h-[3px] bg-gradient-to-r from-[#c9a84c] via-[#5b3d8f] to-[#c9a84c]" />

        {/* Corner ornaments */}
        {[
          "top-[12px] left-[12px] border-t-2 border-l-2",
          "top-[12px] right-[12px] border-t-2 border-r-2",
          "bottom-[12px] left-[12px] border-b-2 border-l-2",
          "bottom-[12px] right-[12px] border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-[30px] h-[30px] ${cls} border-[#c9a84c]/50 dark:border-[#c9a84c]/30`} />
        ))}
        {/* Inner corner accents */}
        {[
          "top-[16px] left-[16px] border-t border-l",
          "top-[16px] right-[16px] border-t border-r",
          "bottom-[16px] left-[16px] border-b border-l",
          "bottom-[16px] right-[16px] border-b border-r",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-[18px] h-[18px] ${cls} border-[#c9a84c]/30 dark:border-[#c9a84c]/20`} />
        ))}

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle, #c9a84c 0.3px, transparent 0.3px)`,
          backgroundSize: "12px 12px",
        }} />

        {/* Side decorative dots */}
        <div className="absolute left-[18px] top-[40px] bottom-[40px] flex flex-col justify-between opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#c9a84c]" />
          ))}
        </div>
        <div className="absolute right-[18px] top-[40px] bottom-[40px] flex flex-col justify-between opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#c9a84c]" />
          ))}
        </div>

        {/* ── Content ── */}
        <div className="relative h-full flex flex-col items-center justify-between px-[10%] py-[5%]">

          {/* Brand */}
          <div className="text-center">
            <h2 className="text-[clamp(14px,2.2vw,22px)] font-bold tracking-[0.1em] text-[#5b3d8f] dark:text-[#a78bfa]">
              FreelanceHigh
            </h2>
            <p className="text-[clamp(6px,0.8vw,8px)] tracking-[0.25em] uppercase text-[#c9a84c] dark:text-[#c9a84c]/70 mt-0.5 font-medium">
              {fr ? "Formations & Certifications Professionnelles" : "Professional Training & Certifications"}
            </p>
            {/* Divider */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="h-px w-[clamp(30px,6vw,60px)] bg-gradient-to-r from-transparent to-[#c9a84c]/40" />
              <div className="w-1 h-1 bg-[#c9a84c]/50 rotate-45" />
              <div className="w-1.5 h-1.5 bg-[#c9a84c]/70 rotate-45" />
              <div className="w-1 h-1 bg-[#c9a84c]/50 rotate-45" />
              <div className="h-px w-[clamp(30px,6vw,60px)] bg-gradient-to-l from-transparent to-[#c9a84c]/40" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center -mt-1">
            <h1 className="text-[clamp(16px,3vw,32px)] font-bold tracking-[0.2em] text-[#1a1f3a] dark:text-[#e8e4dc] uppercase">
              {fr ? "Certificat de Reussite" : "Certificate of Completion"}
            </h1>
            <div className="mt-1.5 flex flex-col items-center gap-0.5">
              <div className="h-[2px] w-[clamp(80px,18vw,140px)] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
              <div className="h-px w-[clamp(60px,12vw,100px)] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
            </div>
          </div>

          {/* Subtitle + Name */}
          <div className="text-center -mt-1">
            <p className="text-[clamp(8px,1.1vw,12px)] italic text-[#8c877d] dark:text-[#8c877d]">
              {fr ? "Ce certificat atteste que" : "This certifies that"}
            </p>
            <h3 className="text-[clamp(20px,3.8vw,42px)] font-bold text-[#1a1f3a] dark:text-[#e8e4dc] mt-1 font-serif leading-tight">
              {cert.user.name}
            </h3>
            <div className="mt-1 flex items-center justify-center gap-1">
              <div className="w-1 h-1 rounded-full bg-[#c9a84c]/50" />
              <div className="h-px w-[clamp(60px,16vw,200px)] bg-[#c9a84c]/30" />
              <div className="w-1 h-1 rounded-full bg-[#c9a84c]/50" />
            </div>
          </div>

          {/* "Has completed" + Formation */}
          <div className="text-center -mt-1">
            <p className="text-[clamp(8px,1.1vw,12px)] italic text-[#8c877d]">
              {fr ? "a complete avec succes la formation" : "has successfully completed the course"}
            </p>
            <h4 className="text-[clamp(12px,2vw,20px)] font-bold text-[#1a1f3a] dark:text-[#e8e4dc] mt-1 max-w-[80%] mx-auto leading-snug">
              {formation.title}
            </h4>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-1.5 -mt-1">
            <div className="h-px w-[clamp(25px,5vw,50px)] bg-gradient-to-r from-transparent to-[#c9a84c]/30" />
            <div className="w-1 h-1 bg-[#c9a84c]/40 rotate-45" />
            <div className="w-1.5 h-1.5 bg-[#c9a84c]/60 rotate-45" />
            <div className="w-1 h-1 bg-[#c9a84c]/40 rotate-45" />
            <div className="h-px w-[clamp(25px,5vw,50px)] bg-gradient-to-l from-transparent to-[#c9a84c]/30" />
          </div>

          {/* Dates: Start | Completion | Valid Until */}
          <div className="flex items-center justify-center gap-[clamp(12px,4vw,40px)] -mt-1">
            {[
              { label: fr ? "DATE DE DEBUT" : "START DATE", value: fmtDate(cert.enrolledAt) },
              { label: fr ? "DATE DE FIN" : "COMPLETION DATE", value: fmtDate(cert.issuedAt) },
              { label: fr ? "VALIDE JUSQU'AU" : "VALID UNTIL", value: fmtValidUntil },
            ].map((col, i, arr) => (
              <div key={i} className="flex items-center gap-[clamp(12px,4vw,40px)]">
                <div className="text-center">
                  <p className="text-[clamp(5px,0.7vw,7px)] tracking-[0.15em] uppercase text-[#a0966c] dark:text-[#a0966c]/70 font-medium">
                    {col.label}
                  </p>
                  <p className="text-[clamp(9px,1.2vw,13px)] font-semibold text-[#1a1f3a] dark:text-[#e8e4dc] mt-0.5">
                    {col.value}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px h-[clamp(16px,3vw,30px)] bg-[#c9a84c]/20" />
                )}
              </div>
            ))}
          </div>

          {/* Instructor + Signature + Seal */}
          <div className="w-full flex items-end justify-between -mt-1">
            {/* QR code area (left) */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-[clamp(40px,6vw,56px)] h-[clamp(40px,6vw,56px)] border border-[#c9a84c]/30 dark:border-[#c9a84c]/20 rounded-sm flex items-center justify-center bg-white dark:bg-[#2a2a3a] p-1">
                <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[1px]">
                  {/* Simplified QR pattern */}
                  {[1,1,1,0,1, 1,0,1,1,0, 1,1,1,0,1, 0,1,0,1,0, 1,0,1,1,1].map((v, i) => (
                    <div key={i} className={`${v ? "bg-[#1a1f3a] dark:bg-[#e8e4dc]" : "bg-transparent"} rounded-[0.5px]`} />
                  ))}
                </div>
              </div>
              <p className="text-[clamp(4px,0.5vw,5px)] tracking-[0.1em] uppercase text-[#b4afa5] dark:text-[#b4afa5]/60">
                {fr ? "Scanner pour verifier" : "Scan to verify"}
              </p>
            </div>

            {/* Center: Instructor signature */}
            <div className="text-center flex-1 px-4">
              <p className="text-[clamp(5px,0.7vw,7px)] tracking-[0.15em] uppercase text-[#a0966c] dark:text-[#a0966c]/70 font-medium">
                {fr ? "Delivre par l'instructeur" : "Issued by instructor"}
              </p>
              <p className="text-[clamp(10px,1.4vw,15px)] font-semibold text-[#1a1f3a] dark:text-[#e8e4dc] mt-1">
                {instructorName}
              </p>
              <div className="border-b border-[#c8c3b5] dark:border-[#4a4a5a] w-[clamp(80px,14vw,140px)] mx-auto mt-1" />
            </div>

            {/* Official seal (right) */}
            <div className="relative w-[clamp(44px,7vw,64px)] h-[clamp(44px,7vw,64px)]">
              <div className="absolute inset-0 rounded-full border-2 border-[#c9a84c]/50 dark:border-[#c9a84c]/30" />
              <div className="absolute inset-[3px] rounded-full border border-[#c9a84c]/30 dark:border-[#c9a84c]/20" />
              <div className="absolute inset-[6px] rounded-full border-[0.5px] border-[#c9a84c]/20 dark:border-[#c9a84c]/15" />
              {/* Notch marks */}
              <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(from 0deg, ${Array.from({ length: 48 }).map((_, i) => `${i % 2 === 0 ? "transparent" : "rgba(201,168,76,0.1)"} ${(i / 48) * 100}% ${((i + 1) / 48) * 100}%`).join(", ")})`,
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ShieldCheck className="w-[clamp(12px,1.8vw,18px)] h-[clamp(12px,1.8vw,18px)] text-[#c9a84c] dark:text-[#c9a84c]/80" />
                <span className="text-[clamp(4px,0.5vw,6px)] font-bold text-[#c9a84c] dark:text-[#c9a84c]/80 tracking-wider uppercase mt-[1px]">
                  {fr ? "Certifie" : "Certified"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer: Code + Platform */}
          <div className="text-center -mt-1">
            <p className="text-[clamp(4px,0.6vw,6px)] tracking-[0.15em] uppercase text-[#b4afa5]/70 dark:text-[#b4afa5]/40">
              {fr ? "Identifiant unique du certificat" : "Unique certificate identifier"}
            </p>
            <p className="font-mono text-[clamp(8px,1.1vw,12px)] font-semibold tracking-[0.15em] text-[#1a1f3a] dark:text-[#e8e4dc] mt-0.5">
              {cert.code}
            </p>
            <div className="h-px w-[clamp(80px,14vw,160px)] mx-auto mt-1 bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
            <p className="text-[clamp(4px,0.5vw,5.5px)] text-[#b4afa5]/50 dark:text-[#b4afa5]/30 mt-1">
              FreelanceHigh &mdash; {fr
                ? "La plateforme freelance qui eleve votre carriere au plus haut niveau"
                : "The freelance platform that elevates your career to the highest level"
              }
            </p>
            <p className="text-[clamp(3.5px,0.45vw,5px)] text-[#b4afa5]/40 dark:text-[#b4afa5]/25 mt-0.5">
              &copy; {new Date().getFullYear()} FreelanceHigh. {fr
                ? "Ce certificat est valide 5 ans a compter de la date de delivrance."
                : "This certificate is valid for 5 years from the date of issuance."
              }
            </p>
          </div>
        </div>
      </div>

      {/* ==================== ACTION BUTTONS ==================== */}
      <div className="mt-8 print:hidden">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1a1f3a] to-[#2a2f4a] hover:from-[#0f1328] hover:to-[#1a1f3a] disabled:opacity-50 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-[#1a1f3a]/20 text-sm"
          >
            <Download className="w-4 h-4" />
            {downloading
              ? fr ? "Telechargement..." : "Downloading..."
              : fr ? "Telecharger le PDF" : "Download PDF"}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8963f] text-white font-medium px-6 py-3.5 rounded-xl transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            {fr ? "Imprimer" : "Print"}
          </button>

          <button
            onClick={shareLinkedIn}
            className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#006699] text-white font-medium px-6 py-3.5 rounded-xl transition-colors text-sm"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium px-6 py-3.5 rounded-xl transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            {copied
              ? fr ? "Lien copie !" : "Link Copied!"
              : fr ? "Copier le lien" : "Copy Link"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/formations/verification/${cert.code}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-[#c9a84c] hover:text-[#b8963f] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            {fr ? "Page de verification publique" : "Public verification page"}
          </Link>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-visual, #certificate-visual * { visibility: visible; }
          #certificate-visual {
            position: fixed;
            top: 0; left: 0;
            width: 297mm; height: 210mm;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
