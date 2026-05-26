"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface KycRequest {
  id: string;
  level: number;
  documentType: string;
  status: "en_attente" | "approuve" | "refuse";
  reason: string;
  createdAt: string;
}

interface KycUploadCardProps {
  currentLevel: number;
  requests: KycRequest[];
  onRefresh: () => void;
}

const LEVELS = [
  {
    level: 1,
    title: "Email verifie",
    description: "Votre email a ete verifie lors de l'inscription.",
    icon: "email",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    level: 3,
    title: "Piece d'identite",
    description: "Soumettez une piece d'identite (CNI ou passeport) pour retirer des fonds et publier des services.",
    icon: "badge",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    level: 4,
    title: "Verification professionnelle",
    description: "Soumettez un document professionnel (diplome, certificat, SIRET) pour obtenir le badge Elite.",
    icon: "workspace_premium",
    color: "text-fh-700",
    bg: "bg-fh-50",
    border: "border-fh-200",
  },
];

const DOC_TYPES_BY_LEVEL: Record<number, { value: string; label: string }[]> = {
  3: [
    { value: "cni", label: "Carte nationale d'identite" },
    { value: "passeport", label: "Passeport" },
    { value: "permis", label: "Permis de conduire" },
  ],
  4: [
    { value: "diplome", label: "Diplome" },
    { value: "certificat", label: "Certificat professionnel" },
    { value: "siret", label: "Numero SIRET / registre commerce" },
    { value: "registre_commerce", label: "Registre de commerce / immatriculation" },
  ],
};

export function KycUploadCard({ currentLevel, requests, onRefresh }: KycUploadCardProps) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"], "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  function getStatusForLevel(level: number): KycRequest | undefined {
    return requests.find((r) => r.level === level);
  }

  function isLevelCompleted(level: number): boolean {
    if (level === 1) return true;
    // Level 2 (phone) removed — skip directly to level 3
    if (level === 2) return currentLevel >= 2;
    return currentLevel >= level;
  }

  function isPending(level: number): boolean {
    const req = getStatusForLevel(level);
    return req?.status === "en_attente";
  }

  function isRefused(level: number): boolean {
    const req = getStatusForLevel(level);
    return req?.status === "refuse";
  }

  async function handleSubmit(level: number) {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const docType = selectedDocType;
      if (!docType) {
        setError("Selectionnez un type de document");
        setSubmitting(false);
        return;
      }

      if (!fileName) {
        setError("Veuillez charger un document");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          documentType: docType,
          documentUrl: `/uploads/kyc/${fileName}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la soumission");
        setSubmitting(false);
        return;
      }

      setSuccess("Demande soumise avec succes !");
      setExpandedLevel(null);
      setSelectedDocType("");
      setFileName("");
      onRefresh();
    } catch {
      setError("Erreur reseau");
    } finally {
      setSubmitting(false);
    }
  }

  // Map actual KYC levels to display progress (1→1, 3→2, 4→3)
  const displayLevel = currentLevel >= 4 ? 3 : currentLevel >= 3 ? 2 : 1;
  const progressPercent = (displayLevel / 3) * 100;
  const nextLevel = currentLevel < 3 ? 3 : currentLevel < 4 ? 4 : null;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Niveau de verification</h3>
          <span className="text-sm font-semibold text-fh-600">Etape {displayLevel}/3</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-fh-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {currentLevel >= 4
            ? "Verification complete — vous avez le badge Elite !"
            : nextLevel
              ? "Completez la prochaine etape pour debloquer plus de fonctionnalites."
              : "Verification en cours."}
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Level cards */}
      <div className="space-y-4">
        {LEVELS.map((lvl) => {
          const completed = isLevelCompleted(lvl.level);
          const pending = isPending(lvl.level);
          const refused = isRefused(lvl.level);
          const refusedReq = refused ? getStatusForLevel(lvl.level) : null;
          const isExpanded = expandedLevel === lvl.level;
          // Allow level 3 when level 1 is complete (skip removed level 2)
          const nextAllowedLevel = currentLevel < 3 ? 3 : currentLevel + 1;
          const canAction = !completed && !pending && lvl.level <= nextAllowedLevel;

          return (
            <div
              key={lvl.level}
              className={`bg-white rounded-2xl border ${
                completed
                  ? "border-emerald-300"
                  : pending
                    ? "border-amber-300"
                    : refused
                      ? "border-red-300"
                      : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${lvl.bg} flex items-center justify-center flex-shrink-0`}>
                  {completed ? (
                    <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
                  ) : (
                    <span className={`material-symbols-outlined text-2xl ${lvl.color}`}>{lvl.icon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">Niveau {lvl.level} — {lvl.title}</h4>
                    {completed && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Valide
                      </span>
                    )}
                    {pending && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        En attente
                      </span>
                    )}
                    {refused && (
                      <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                        Refuse
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{lvl.description}</p>
                  {refusedReq?.reason && (
                    <p className="text-sm text-red-700 mt-1">Motif : {refusedReq.reason}</p>
                  )}
                </div>
                {canAction && (
                  <button
                    onClick={() => setExpandedLevel(isExpanded ? null : lvl.level)}
                    className="flex-shrink-0 px-4 py-2 bg-fh-50 text-fh-700 text-sm font-semibold rounded-xl hover:bg-fh-100 transition-colors"
                  >
                    {isExpanded ? "Annuler" : refused ? "Reessayer" : "Verifier"}
                  </button>
                )}
              </div>

              {/* Expanded form */}
              {isExpanded && canAction && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Type de document
                    </label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-fh-600"
                    >
                      <option value="">-- Selectionnez --</option>
                      {DOC_TYPES_BY_LEVEL[lvl.level]?.map((dt) => (
                        <option key={dt.value} value={dt.value}>
                          {dt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Document
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-fh-600 bg-fh-50"
                          : "border-gray-300 hover:border-fh-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <span className="material-symbols-outlined text-3xl text-gray-400 mb-2 block">
                        cloud_upload
                      </span>
                      {fileName ? (
                        <p className="text-sm text-emerald-700 font-semibold">{fileName}</p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Glissez un fichier ici ou cliquez pour selectionner
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG ou PDF — 10 Mo max
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubmit(lvl.level)}
                    disabled={submitting}
                    className="w-full bg-fh-600 text-white font-bold py-3 rounded-xl hover:bg-fh-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Envoi en cours..." : "Soumettre la demande"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
