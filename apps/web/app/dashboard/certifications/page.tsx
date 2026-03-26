"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboardStore, useToastStore } from "@/store/dashboard";
import { normalizePlanName, canTakeCertification, PLAN_RULES } from "@/lib/plans";
import { certificationsApi, type ApiCertificationQuestion } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Quiz Modal Component
// ---------------------------------------------------------------------------
function QuizModal({
  certName,
  certId,
  open,
  onClose,
  onComplete,
}: {
  certName: string;
  certId: string;
  open: boolean;
  onClose: () => void;
  onComplete: (certId: string, answers: number[]) => Promise<void>;
}) {
  const [questions, setQuestions] = useState<ApiCertificationQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    certificationsApi.getQuestions(certId).then((data) => {
      setQuestions(data.questions);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [open, certId]);

  if (!open) return null;

  const total = questions.length;
  const progress = total > 0 ? Math.round(((currentQ + (selectedOption !== null ? 1 : 0)) / total) * 100) : 0;
  const question = questions[currentQ];

  function handleSelectOption(idx: number) {
    setSelectedOption(idx);
  }

  function handleNext() {
    if (selectedOption === null) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Submit
      setSubmitting(true);
      onComplete(certId, newAnswers).finally(() => {
        setSubmitting(false);
        onClose();
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-dark border border-border-dark rounded-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{certName}</h3>
            <p className="text-xs text-slate-500">Question {currentQ + 1} sur {total}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-border-dark transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-background-dark">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            </div>
          ) : question ? (
            <div>
              <p className="text-base font-semibold mb-6 leading-relaxed">{question.question}</p>
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button key={idx} onClick={() => handleSelectOption(idx)}
                    className={cn("w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium",
                      selectedOption === idx
                        ? "border-primary bg-primary/10 text-white"
                        : "border-border-dark hover:border-primary/30 text-slate-300 hover:bg-primary/5")}>
                    <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3",
                      selectedOption === idx ? "bg-primary text-white" : "bg-border-dark text-slate-400")}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500">Aucune question disponible.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-dark flex items-center justify-between">
          <p className="text-xs text-slate-500">{answers.length}/{total} reponses</p>
          <button onClick={handleNext} disabled={selectedOption === null || submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-primary/20">
            {submitting ? (
              <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Envoi...</>
            ) : currentQ < total - 1 ? (
              <>Suivant <span className="material-symbols-outlined text-sm">arrow_forward</span></>
            ) : (
              <>Terminer <span className="material-symbols-outlined text-sm">check</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Modal Component (with detailed results + certificate)
// ---------------------------------------------------------------------------
interface QuestionResult {
  questionId: string;
  question: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

function ResultModal({
  open,
  onClose,
  score,
  passed,
  certName,
  correctCount,
  totalQuestions,
  questionResults,
  certificateId,
}: {
  open: boolean;
  onClose: () => void;
  score: number;
  passed: boolean;
  certName: string;
  correctCount: number;
  totalQuestions: number;
  questionResults: QuestionResult[];
  certificateId: string | null;
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-dark border border-border-dark rounded-2xl w-full max-w-lg my-8 animate-scale-in overflow-hidden">
        {/* Header with score */}
        <div className="p-8 text-center">
          <div className={cn("w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
            passed ? "bg-emerald-500/20" : "bg-red-500/20")}>
            <span className={cn("material-symbols-outlined text-4xl", passed ? "text-emerald-400" : "text-red-400")}>
              {passed ? "emoji_events" : "close"}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold mb-2">{passed ? "Felicitations !" : "Pas encore..."}</h3>
          <p className="text-slate-400 mb-4">{certName}</p>
          <div className="text-5xl font-black mb-2">
            <span className={passed ? "text-emerald-400" : "text-red-400"}>{score}%</span>
          </div>
          <p className="text-sm text-slate-500 mb-2">
            {correctCount} / {totalQuestions} reponses correctes
          </p>
          <p className="text-sm text-slate-500 mb-6">
            {passed
              ? "Vous avez obtenu la certification ! Le badge est visible sur votre profil."
              : "Score minimum requis : 70%. Reessayez pour obtenir la certification."}
          </p>

          {/* Certificate display */}
          {passed && certificateId && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border-2 border-emerald-500/30 rounded-xl p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-2xl text-emerald-400">workspace_premium</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Certificat FreelanceHigh</p>
                  <p className="text-lg font-extrabold">{certName}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Numero de certificat</span>
                  <span className="font-mono font-bold text-emerald-400">{certificateId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Score obtenu</span>
                  <span className="font-bold">{score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date d&apos;obtention</span>
                  <span className="font-bold">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Valide
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Toggle details */}
          <button onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-semibold text-primary flex items-center gap-1 mx-auto mb-4 hover:opacity-80">
            <span className="material-symbols-outlined text-sm">
              {showDetails ? "expand_less" : "expand_more"}
            </span>
            {showDetails ? "Masquer les details" : "Voir les reponses detaillees"}
          </button>
        </div>

        {/* Detailed answers */}
        {showDetails && questionResults.length > 0 && (
          <div className="px-6 pb-4 max-h-[40vh] overflow-y-auto">
            <div className="space-y-3">
              {questionResults.map((qr, idx) => (
                <div key={qr.questionId} className={cn("p-4 rounded-xl border",
                  qr.isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5")}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={cn("material-symbols-outlined text-lg mt-0.5",
                      qr.isCorrect ? "text-emerald-400" : "text-red-400")}>
                      {qr.isCorrect ? "check_circle" : "cancel"}
                    </span>
                    <p className="text-sm font-semibold flex-1">Q{idx + 1}. {qr.question}</p>
                  </div>
                  {!qr.isCorrect && (
                    <div className="ml-7 space-y-1 text-xs">
                      <p className="text-red-400">
                        <span className="font-bold">Votre reponse :</span> {qr.options[qr.userAnswer]}
                      </p>
                      <p className="text-emerald-400">
                        <span className="font-bold">Bonne reponse :</span> {qr.options[qr.correctAnswer]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-border-dark">
          <button onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            {passed ? "Voir mes certifications" : "Fermer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function CertificationsPage() {
  const {
    currentPlan,
    certifications,
    certificationResults,
    certificationsLoading,
    syncCertifications,
    submitCertificationResult,
  } = useDashboardStore();
  const addToast = useToastStore((s) => s.addToast);

  const plan = normalizePlanName(currentPlan);
  const planRules = PLAN_RULES[plan];

  const [quizCertId, setQuizCertId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [resultModal, setResultModal] = useState<{
    open: boolean; score: number; passed: boolean; certName: string;
    correctCount: number; totalQuestions: number;
    questionResults: QuestionResult[]; certificateId: string | null;
  }>({
    open: false, score: 0, passed: false, certName: "",
    correctCount: 0, totalQuestions: 0, questionResults: [], certificateId: null,
  });

  useEffect(() => {
    syncCertifications();
  }, [syncCertifications]);

  // Count certifications taken this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thisMonthResults = certificationResults.filter((r) => r.date >= monthStart);

  // Extract unique categories
  const categories = Array.from(new Set(certifications.map((c) => c.category))).sort();

  // Filter certifications
  const filteredCerts = certifications.filter((cert) => {
    const matchesSearch = !searchQuery ||
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || cert.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Plan gate
  if (planRules.certificationLimit === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <div className="max-w-md text-center">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">lock</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Certifications IA</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Passez en Pro ou Business pour acceder aux certifications et valider vos competences aupres des clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/abonnement"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Passer Pro - 15 EUR/mois
            </Link>
            <Link href="/dashboard/abonnement"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all">
              Voir tous les plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleStartQuiz(certId: string) {
    if (!canTakeCertification(plan, thisMonthResults.length)) {
      addToast("error", `Limite mensuelle atteinte (${thisMonthResults.length}/${isFinite(planRules.certificationLimit) ? planRules.certificationLimit : "Illimite"}). Passez au plan superieur.`);
      return;
    }
    setQuizCertId(certId);
  }

  async function handleQuizComplete(certId: string, answers: number[]) {
    const result = await submitCertificationResult(certId, answers);
    if (result) {
      const cert = certifications.find((c) => c.id === certId);
      setResultModal({
        open: true,
        score: result.score,
        passed: result.passed,
        certName: cert?.name || "Certification",
        correctCount: result.correctCount ?? Math.round((result.score / 100) * answers.length),
        totalQuestions: result.totalQuestions ?? answers.length,
        questionResults: result.questionResults ?? [],
        certificateId: result.certificateId ?? null,
      });
      if (result.passed) addToast("success", `Certification obtenue ! Score: ${result.score}%`);
      else addToast("info", `Score: ${result.score}%. Minimum requis: 70%`);
    } else {
      addToast("error", "Erreur lors de l'envoi des reponses. Reessayez.");
    }
  }

  function getBestResult(certId: string) {
    const results = certificationResults.filter((r) => r.certificationId === certId);
    if (results.length === 0) return null;
    return results.reduce((best, r) => r.score > best.score ? r : best, results[0]);
  }

  const certLimitLabel = isFinite(planRules.certificationLimit)
    ? `${thisMonthResults.length}/${planRules.certificationLimit} ce mois`
    : `${thisMonthResults.length} ce mois`;

  const quizCert = certifications.find((c) => c.id === quizCertId);

  return (
    <div className="max-w-full space-y-6">
      <QuizModal
        certName={quizCert?.name || ""}
        certId={quizCertId || ""}
        open={!!quizCertId}
        onClose={() => setQuizCertId(null)}
        onComplete={handleQuizComplete}
      />
      <ResultModal
        open={resultModal.open}
        onClose={() => setResultModal((s) => ({ ...s, open: false }))}
        score={resultModal.score}
        passed={resultModal.passed}
        certName={resultModal.certName}
        correctCount={resultModal.correctCount}
        totalQuestions={resultModal.totalQuestions}
        questionResults={resultModal.questionResults}
        certificateId={resultModal.certificateId}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="hover:text-primary cursor-pointer">Dashboard</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-medium">Certifications</span>
          </nav>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">Certifications FreelanceHigh</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {certifications.length} domaines de competences — Validez vos acquis et obtenez des badges verifies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-background-dark/50 border border-border-dark rounded-lg px-3 py-2 font-semibold">
            <span className="material-symbols-outlined text-sm align-middle mr-1">school</span>
            {certLimitLabel}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Domaines</p>
          <p className="text-3xl font-extrabold text-slate-300">{certifications.length}</p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Certifications obtenues</p>
          <p className="text-3xl font-extrabold text-primary">
            {new Set(certificationResults.filter((r) => r.passed).map((r) => r.certificationId)).size}
          </p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Tests passes</p>
          <p className="text-3xl font-extrabold">{certificationResults.length}</p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Score moyen</p>
          <p className="text-3xl font-extrabold">
            {certificationResults.length > 0
              ? Math.round(certificationResults.reduce((a, r) => a + r.score, 0) / certificationResults.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Search + Category Filter */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            type="text"
            placeholder="Rechercher une certification par nom, categorie ou mot-cle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-background-dark/50 border border-border-dark rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-600 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveCategory("all")}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeCategory === "all" ? "bg-primary text-white" : "bg-background-dark/50 border border-border-dark text-slate-400 hover:text-white hover:border-primary/30")}>
            Tous ({certifications.length})
          </button>
          {categories.map((cat) => {
            const count = certifications.filter((c) => c.category === cat).length;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  activeCategory === cat ? "bg-primary text-white" : "bg-background-dark/50 border border-border-dark text-slate-400 hover:text-white hover:border-primary/30")}>
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Result count */}
        {(searchQuery || activeCategory !== "all") && (
          <p className="text-xs text-slate-500">
            {filteredCerts.length} certification{filteredCerts.length !== 1 ? "s" : ""} trouvee{filteredCerts.length !== 1 ? "s" : ""}
            {searchQuery && <> pour &quot;{searchQuery}&quot;</>}
            {activeCategory !== "all" && <> dans {activeCategory}</>}
          </p>
        )}
      </div>

      {/* Certifications Grid */}
      {certificationsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-background-dark/50 border border-border-dark rounded-xl p-5 animate-pulse">
              <div className="w-12 h-12 bg-slate-700 rounded-xl mb-3" />
              <div className="h-4 w-32 bg-slate-700 rounded mb-2" />
              <div className="h-3 w-full bg-slate-700/50 rounded mb-1" />
              <div className="h-3 w-3/4 bg-slate-700/50 rounded mb-3" />
              <div className="h-9 w-full bg-slate-700/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-4 block">search_off</span>
          <p className="text-lg font-bold text-slate-400 mb-2">Aucune certification trouvee</p>
          <p className="text-sm text-slate-500">Essayez de modifier votre recherche ou changez de categorie.</p>
          <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
            className="mt-4 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors">
            Reinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCerts.map((cert) => {
            const bestResult = getBestResult(cert.id);
            const passed = bestResult?.passed;
            return (
              <div key={cert.id} className={cn("bg-background-dark/50 border rounded-xl p-5 relative transition-all hover:border-primary/30",
                passed ? "border-emerald-500/30" : "border-border-dark")}>
                {passed && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-emerald-500 text-white rounded-full p-1.5">
                      <span className="material-symbols-outlined text-sm">verified</span>
                    </div>
                  </div>
                )}

                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                  passed ? "bg-emerald-500/10" : "bg-primary/10")}>
                  <span className={cn("material-symbols-outlined text-xl", passed ? "text-emerald-400" : "text-primary")}>
                    {cert.icon}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{cert.category}</span>
                <h3 className="text-sm font-extrabold mt-0.5 mb-1.5 leading-tight">{cert.name}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">{cert.description}</p>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">quiz</span>
                    {cert.questionCount}q
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">timer</span>
                    {cert.durationMinutes}min
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">target</span>
                    {cert.passingScore}%
                  </span>
                </div>

                {bestResult && (
                  <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mb-3 text-[10px] font-bold",
                    passed ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>
                    <span className="material-symbols-outlined text-xs">{passed ? "emoji_events" : "trending_up"}</span>
                    {bestResult.score}% — {new Date(bestResult.date).toLocaleDateString("fr-FR")}
                  </div>
                )}

                <button onClick={() => handleStartQuiz(cert.id)}
                  className={cn("w-full flex items-center justify-center gap-1.5 px-3 py-2.5 font-bold rounded-xl text-xs transition-all",
                    passed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20")}>
                  <span className="material-symbols-outlined text-sm">{passed ? "refresh" : "play_arrow"}</span>
                  {passed ? "Repasser" : bestResult ? "Reessayer" : "Passer le test"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
