"use client";

import { useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDashboardStore, useToastStore } from "@/store/dashboard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DisputeTimelineEvent {
  id: string;
  type: "opened" | "message" | "evidence" | "jury_assigned" | "verdict" | "escalated";
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
}

interface DisputeMessage {
  id: string;
  sender: "freelance" | "client" | "mediateur" | "system";
  senderName: string;
  content: string;
  timestamp: string;
}

interface DisputeEvidence {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: "freelance" | "client";
  uploadedAt: string;
}

interface Dispute {
  id: string;
  clientName: string;
  clientAvatar: string;
  serviceTitle: string;
  amount: number;
  status: "en_cours" | "resolu" | "en_attente";
  openedAt: string;
  resolvedAt?: string;
  reason: string;
  verdict: "en_faveur_freelance" | "en_faveur_client" | "partage" | null;
  verdictNote?: string;
  orderId: string;
  timeline: DisputeTimelineEvent[];
  messages: DisputeMessage[];
  evidence: DisputeEvidence[];
}

// ---------------------------------------------------------------------------
// Demo Data
// ---------------------------------------------------------------------------

const DEMO_DISPUTES: Dispute[] = [];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { label: "Tous", filter: null },
  { label: "En cours", filter: "en_cours" },
  { label: "Resolus", filter: "resolu" },
  { label: "En ma faveur", filter: "en_faveur" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  en_cours: {
    label: "En cours",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: "pending",
  },
  resolu: {
    label: "Resolu",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "check_circle",
  },
  en_attente: {
    label: "En attente",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "schedule",
  },
};

const VERDICT_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  en_faveur_freelance: {
    label: "En votre faveur",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "thumb_up",
  },
  en_faveur_client: {
    label: "En faveur du client",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: "thumb_down",
  },
  partage: {
    label: "Partage",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: "balance",
  },
};

const TIMELINE_ICON: Record<string, { icon: string; color: string }> = {
  opened: { icon: "flag", color: "text-red-400 bg-red-500/10" },
  message: { icon: "chat", color: "text-blue-400 bg-blue-500/10" },
  evidence: { icon: "attach_file", color: "text-amber-400 bg-amber-500/10" },
  jury_assigned: { icon: "groups", color: "text-primary bg-primary/10" },
  verdict: { icon: "gavel", color: "text-emerald-400 bg-emerald-500/10" },
  escalated: { icon: "priority_high", color: "text-red-400 bg-red-500/10" },
};

const FILE_ICON: Record<string, string> = {
  pdf: "picture_as_pdf",
  image: "image",
  archive: "folder_zip",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DisputeStatusProgress({ status, verdict }: { status: Dispute["status"]; verdict: Dispute["verdict"] }) {
  const steps = [
    { label: "Ouvert", done: true },
    { label: "En examen", done: status !== "en_attente" },
    { label: "Mediateur", done: status === "en_cours" || status === "resolu" },
    { label: "Verdict", done: status === "resolu" && verdict !== null },
  ];

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                step.done
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-neutral-dark border-border-dark text-slate-600"
              )}
            >
              {step.done ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                i + 1
              )}
            </div>
            <span className={cn("text-[10px] mt-1 font-semibold", step.done ? "text-primary" : "text-slate-600")}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-1 rounded-full transition-all",
                step.done ? "bg-primary/40" : "bg-border-dark"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function TimelineSection({ events }: { events: DisputeTimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const config = TIMELINE_ICON[event.type] ?? { icon: "circle", color: "text-slate-400 bg-slate-500/10" };
        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  config.color
                )}
              >
                <span className="material-symbols-outlined text-sm">{config.icon}</span>
              </div>
              {i < events.length - 1 && <div className="w-0.5 flex-1 bg-border-dark my-1" />}
            </div>
            <div className="pb-6 flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200">{event.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{event.description}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600">
                {event.actor && <span className="font-semibold text-slate-500">{event.actor}</span>}
                <span>{formatDateTime(event.timestamp)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChatSection({
  messages,
  onSend,
}: {
  messages: DisputeMessage[];
  onSend: (content: string) => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleSend() {
    if (!newMessage.trim()) return;
    onSend(newMessage.trim());
    setNewMessage("");
  }

  const senderColors: Record<string, string> = {
    freelance: "bg-primary/10 border-primary/20",
    client: "bg-blue-500/10 border-blue-500/20",
    mediateur: "bg-amber-500/10 border-amber-500/20",
    system: "bg-slate-500/10 border-slate-500/20",
  };

  const senderNameColors: Record<string, string> = {
    freelance: "text-primary",
    client: "text-blue-400",
    mediateur: "text-amber-400",
    system: "text-slate-500",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 max-h-72 pr-1 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-xl p-3 border",
              senderColors[msg.sender] ?? "bg-slate-500/10 border-slate-500/20"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "text-xs font-bold",
                  senderNameColors[msg.sender] ?? "text-slate-400"
                )}
              >
                {msg.senderName}
              </span>
              <span className="text-[10px] text-slate-600">{formatDateTime(msg.timestamp)}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-border-dark">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Votre message..."
          className="flex-1 bg-neutral-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-600"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
}

function EvidenceSection({ evidence }: { evidence: DisputeEvidence[] }) {
  return (
    <div className="space-y-2">
      {evidence.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">Aucune preuve soumise.</p>
      ) : (
        evidence.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-3 bg-neutral-dark border border-border-dark rounded-lg hover:border-primary/20 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-sm">
                {FILE_ICON[file.type] ?? "description"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span>{file.size}</span>
                <span>·</span>
                <span className={file.uploadedBy === "freelance" ? "text-primary" : "text-blue-400"}>
                  {file.uploadedBy === "freelance" ? "Vous" : "Client"}
                </span>
                <span>·</span>
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all">
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail Slide-Over
// ---------------------------------------------------------------------------

function DisputeDetail({
  dispute,
  onClose,
  onSendMessage,
}: {
  dispute: Dispute;
  onClose: () => void;
  onSendMessage: (disputeId: string, content: string) => void;
}) {
  const [activeDetailTab, setActiveDetailTab] = useState<"timeline" | "discussion" | "preuves">("timeline");
  const sc = STATUS_CONFIG[dispute.status];
  const vc = dispute.verdict ? VERDICT_CONFIG[dispute.verdict] : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-background-dark border-l border-border-dark overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-sm border-b border-border-dark px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {dispute.clientAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-100">Litige #{dispute.id}</h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      sc?.color
                    )}
                  >
                    <span className="material-symbols-outlined text-xs">{sc?.icon}</span>
                    {sc?.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {dispute.clientName} · {dispute.serviceTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-neutral-dark transition-all"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status progress */}
          <div className="bg-neutral-dark border border-border-dark rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Progression du litige</p>
            <DisputeStatusProgress status={dispute.status} verdict={dispute.verdict} />
          </div>

          {/* Summary card */}
          <div className="bg-neutral-dark border border-border-dark rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Montant en jeu</p>
                <p className="text-lg font-black text-slate-100">{(dispute.amount ?? 0).toLocaleString("fr-FR")} EUR</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Commande</p>
                <p className="text-sm font-bold text-primary">{dispute.orderId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Ouvert le</p>
                <p className="text-sm font-semibold text-slate-300">{formatDate(dispute.openedAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">
                  {dispute.resolvedAt ? "Resolu le" : "Statut"}
                </p>
                <p className="text-sm font-semibold text-slate-300">
                  {dispute.resolvedAt ? formatDate(dispute.resolvedAt) : "En cours d'examen"}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border-dark">
              <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Motif du litige</p>
              <p className="text-sm text-slate-300">{dispute.reason}</p>
            </div>
          </div>

          {/* Verdict (if resolved) */}
          {vc && dispute.verdictNote && (
            <div className={cn("rounded-xl p-4 border", vc.color)}>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-lg">{vc.icon}</span>
                <p className="text-sm font-black">{vc.label}</p>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">{dispute.verdictNote}</p>
            </div>
          )}

          {/* Detail tabs */}
          <div className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
            <div className="flex border-b border-border-dark">
              {(["timeline", "discussion", "preuves"] as const).map((tab) => {
                const labels = { timeline: "Chronologie", discussion: "Discussion", preuves: "Preuves" };
                const icons = { timeline: "timeline", discussion: "forum", preuves: "attach_file" };
                const counts = {
                  timeline: dispute.timeline.length,
                  discussion: dispute.messages.length,
                  preuves: dispute.evidence.length,
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-bold transition-all",
                      activeDetailTab === tab
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">{icons[tab]}</span>
                    {labels[tab]}
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        activeDetailTab === tab ? "bg-primary/20 text-primary" : "bg-border-dark text-slate-500"
                      )}
                    >
                      {counts[tab]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-4">
              {activeDetailTab === "timeline" && <TimelineSection events={dispute.timeline} />}
              {activeDetailTab === "discussion" && (
                <ChatSection
                  messages={dispute.messages}
                  onSend={(content) => onSendMessage(dispute.id, content)}
                />
              )}
              {activeDetailTab === "preuves" && <EvidenceSection evidence={dispute.evidence} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// New Report Modal
// ---------------------------------------------------------------------------

function NewReportModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: { orderId: string; reason: string }) => void;
}) {
  const { orders } = useDashboardStore();
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const eligibleOrders = orders.filter((o) =>
    ["en_cours", "livre", "revision"].includes(o.status)
  );

  function handleSubmit() {
    if (!selectedOrder || !reason.trim()) return;
    onSubmit({ orderId: selectedOrder, reason: reason.trim() });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">report</span>
            <h3 className="text-base font-black text-slate-100">Nouveau signalement</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-neutral-dark transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Commande concernee *
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full bg-neutral-dark border border-border-dark rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selectionnez une commande</option>
              {eligibleOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} — {o.serviceTitle} ({(o.amount ?? 0).toLocaleString("fr-FR")} EUR)
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Motif du signalement *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Decrivez precisement le probleme rencontre, les echanges avec le client et ce que vous attendez comme resolution..."
              rows={4}
              className="w-full bg-neutral-dark border border-border-dark rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-slate-600"
            />
          </div>

          {/* Evidence upload */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Preuves (optionnel)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border-dark hover:border-primary/30"
              )}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.onchange = () => {
                  if (input.files) {
                    setUploadedFiles((prev) => [
                      ...prev,
                      ...Array.from(input.files!).map((f) => f.name),
                    ]);
                  }
                };
                input.click();
              }}
            >
              <span className="material-symbols-outlined text-3xl text-slate-600 mb-2 block">
                cloud_upload
              </span>
              <p className="text-sm text-slate-400">
                Glissez-deposez vos fichiers ici ou{" "}
                <span className="text-primary font-semibold">parcourir</span>
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                PDF, images, archives (max 10 MB par fichier)
              </p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-dark rounded-lg text-xs"
                  >
                    <span className="material-symbols-outlined text-primary text-sm">
                      attach_file
                    </span>
                    <span className="text-slate-300 flex-1 truncate">{name}</span>
                    <button
                      onClick={() =>
                        setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-border-dark">
          <button
            onClick={handleSubmit}
            disabled={!selectedOrder || !reason.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Soumettre le signalement
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-border-dark rounded-xl text-sm font-bold text-slate-400 hover:bg-primary/5 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LitigesPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [disputes, setDisputes] = useState<Dispute[]>(DEMO_DISPUTES);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);

  // Computed stats
  const stats = useMemo(
    () => ({
      total: disputes.length,
      enCours: disputes.filter((d) => d.status === "en_cours").length,
      resolus: disputes.filter((d) => d.status === "resolu").length,
      enFaveur: disputes.filter(
        (d) => d.verdict === "en_faveur_freelance"
      ).length,
    }),
    [disputes]
  );

  // Filtered disputes
  const filtered = useMemo(() => {
    if (!activeTab) return disputes;
    if (activeTab === "en_cours") return disputes.filter((d) => d.status === "en_cours");
    if (activeTab === "resolu") return disputes.filter((d) => d.status === "resolu");
    if (activeTab === "en_faveur")
      return disputes.filter((d) => d.verdict === "en_faveur_freelance");
    return disputes;
  }, [disputes, activeTab]);

  function handleSendMessage(disputeId: string, content: string) {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id !== disputeId) return d;
        const newMsg: DisputeMessage = {
          id: "dm" + Date.now(),
          sender: "freelance",
          senderName: "Vous",
          content,
          timestamp: new Date().toISOString(),
        };
        return { ...d, messages: [...d.messages, newMsg] };
      })
    );

    // Also update selected dispute if it's open
    setSelectedDispute((prev) => {
      if (!prev || prev.id !== disputeId) return prev;
      const newMsg: DisputeMessage = {
        id: "dm" + Date.now(),
        sender: "freelance",
        senderName: "Vous",
        content,
        timestamp: new Date().toISOString(),
      };
      return { ...prev, messages: [...prev.messages, newMsg] };
    });

    addToast("success", "Message envoye");
  }

  function handleNewReport(data: { orderId: string; reason: string }) {
    addToast("success", `Signalement soumis pour la commande ${data.orderId}`);
    setShowNewReport(false);
  }

  return (
    <div className="max-w-full space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Inline animation style for slide-in */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #293835;
          border-radius: 4px;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">gavel</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Mes Litiges</h2>
          </div>
          <p className="text-slate-400 mt-1">
            Suivez vos litiges, consultez les decisions et soumettez des signalements.
          </p>
        </div>
        <button
          onClick={() => setShowNewReport(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-primary/20"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nouveau signalement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg text-slate-500">gavel</span>
            <p className="text-xs font-bold text-slate-500 uppercase">Total litiges</p>
          </div>
          <p className="text-2xl font-extrabold">{stats.total}</p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg text-amber-400">pending</span>
            <p className="text-xs font-bold text-amber-400 uppercase">En cours</p>
          </div>
          <p className="text-2xl font-extrabold">{stats.enCours}</p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg text-emerald-400">check_circle</span>
            <p className="text-xs font-bold text-emerald-400 uppercase">Resolus</p>
          </div>
          <p className="text-2xl font-extrabold">{stats.resolus}</p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg text-primary">thumb_up</span>
            <p className="text-xs font-bold text-primary uppercase">En ma faveur</p>
          </div>
          <p className="text-2xl font-extrabold">{stats.enFaveur}</p>
        </div>
      </div>

      {/* Tabs - Select on mobile, pills on desktop */}
      <div className="sm:hidden">
        <select
          value={activeTab ?? ""}
          onChange={(e) => setActiveTab(e.target.value || null)}
          className="w-full px-4 py-3 bg-neutral-dark border border-border-dark rounded-xl text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-primary/30"
        >
          {TABS.map((tab) => {
            let count: number;
            if (!tab.filter) count = disputes.length;
            else if (tab.filter === "en_cours") count = stats.enCours;
            else if (tab.filter === "resolu") count = stats.resolus;
            else count = stats.enFaveur;
            return (
              <option key={tab.label} value={tab.filter ?? ""}>
                {tab.label} ({count})
              </option>
            );
          })}
        </select>
      </div>
      <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => {
          let count: number;
          if (!tab.filter) count = disputes.length;
          else if (tab.filter === "en_cours") count = stats.enCours;
          else if (tab.filter === "resolu") count = stats.resolus;
          else count = stats.enFaveur;

          const isActive = activeTab === tab.filter;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.filter)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all",
                isActive
                  ? "bg-primary text-white"
                  : "bg-background-dark/50 border border-border-dark text-slate-400 hover:border-primary/50"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded",
                  isActive ? "bg-white/20" : "bg-border-dark"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Disputes list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-background-dark/50 border border-border-dark rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3 block">
              gavel
            </span>
            {disputes.length === 0 ? (
              <>
                <p className="text-lg font-bold text-slate-400">Aucun litige</p>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Vous n&apos;avez aucun litige en cours ou passe. Si vous rencontrez un probleme avec une commande, vous pouvez soumettre un signalement.
                </p>
              </>
            ) : (
              <p className="text-slate-500 font-semibold">Aucun litige dans cette categorie.</p>
            )}
          </div>
        )}
        {filtered.map((dispute) => {
          const sc = STATUS_CONFIG[dispute.status];
          const vc = dispute.verdict ? VERDICT_CONFIG[dispute.verdict] : null;

          return (
            <div
              key={dispute.id}
              className="bg-background-dark/50 border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {dispute.clientAvatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm truncate">{dispute.serviceTitle}</p>
                      <span className="text-xs text-slate-500">#{dispute.id}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      <span>{dispute.clientName}</span>
                      <span>·</span>
                      <span>{formatDate(dispute.openedAt)}</span>
                      <span>·</span>
                      <span className="text-slate-500 truncate max-w-[200px]">{dispute.reason}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                  {/* Amount */}
                  <p className="text-sm font-bold">{(dispute.amount ?? 0).toLocaleString("fr-FR")} EUR</p>

                  {/* Verdict badge (if resolved) */}
                  {vc && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        vc.color
                      )}
                    >
                      <span className="material-symbols-outlined text-xs">{vc.icon}</span>
                      {vc.label}
                    </span>
                  )}

                  {/* Status badge */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                      sc?.color
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">{sc?.icon}</span>
                    {sc?.label}
                  </span>

                  {/* Detail button */}
                  <button
                    onClick={() => setSelectedDispute(dispute)}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all"
                  >
                    Voir details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail slide-over */}
      {selectedDispute && (
        <DisputeDetail
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* New report modal */}
      {showNewReport && (
        <NewReportModal
          onClose={() => setShowNewReport(false)}
          onSubmit={handleNewReport}
        />
      )}
    </div>
  );
}
