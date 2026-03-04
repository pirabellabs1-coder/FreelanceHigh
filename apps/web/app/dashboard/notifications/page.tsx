"use client";

import { useState } from "react";
import { Mail, Wallet, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Toggle component
// ---------------------------------------------------------------------------

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  id: string;
}

function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      )}
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7c66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11211e]",
          checked ? "bg-[#0e7c66]" : "bg-[#293835]"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="rounded-xl border border-[#293835] bg-[#11211e]/50 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-[#293835] px-6 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0e7c66]/20 text-[#0e7c66]">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      </div>
      {/* Section rows */}
      <div className="divide-y divide-[#293835]">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notification row — single toggle
// ---------------------------------------------------------------------------

interface SingleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function SingleRow({ id, label, description, checked, onChange }: SingleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="mt-0.5 text-sm text-slate-400">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notification row — double toggle (SMS + EMAIL)
// ---------------------------------------------------------------------------

interface DoubleRowProps {
  label: string;
  description: string;
  smsChecked: boolean;
  emailChecked: boolean;
  onSmsChange: (value: boolean) => void;
  onEmailChange: (value: boolean) => void;
}

function DoubleRow({
  label,
  description,
  smsChecked,
  emailChecked,
  onSmsChange,
  onEmailChange,
}: DoubleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="mt-0.5 text-sm text-slate-400">{description}</p>
      </div>
      <div className="flex items-center gap-6">
        <Toggle
          id="finances-sms"
          checked={smsChecked}
          onChange={onSmsChange}
          label="SMS"
        />
        <Toggle
          id="finances-email"
          checked={emailChecked}
          onChange={onEmailChange}
          label="EMAIL"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  // Messages section
  const [emailMessages, setEmailMessages] = useState(true);
  const [pushMessages, setPushMessages] = useState(true);

  // Finances section
  const [financeSms, setFinanceSms] = useState(true);
  const [financeEmail, setFinanceEmail] = useState(true);

  // Projects section
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [newProjects, setNewProjects] = useState(false);

  function handleCancel() {
    // Reset to default values
    setEmailMessages(true);
    setPushMessages(true);
    setFinanceSms(true);
    setFinanceEmail(true);
    setOrderUpdates(true);
    setNewProjects(false);
  }

  function handleSave() {
    const preferences = {
      messages: { email: emailMessages, push: pushMessages },
      finances: { sms: financeSms, email: financeEmail },
      projects: { orderUpdates, newProjects },
    };
    // TODO: persist preferences via API
    console.log("Saving preferences:", preferences);
  }

  return (
    <div className="min-h-screen bg-[#11211e] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <a
            href="/dashboard/parametres"
            className="font-medium text-[#0e7c66] hover:underline"
          >
            Paramètres
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400">Centre de Notifications</span>
        </nav>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">
            Centre de Notifications Personnalisées
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Gérez comment et quand vous souhaitez être informé de vos activités
            professionnelles.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* Messages et Communications */}
          <Section
            icon={<Mail className="h-4 w-4" />}
            title="Messages et Communications"
          >
            <SingleRow
              id="email-messages"
              label="Emails de nouveaux messages"
              description="Recevoir un résumé par email pour chaque nouveau message non lu."
              checked={emailMessages}
              onChange={setEmailMessages}
            />
            <SingleRow
              id="push-messages"
              label="Notifications Push (Navigateur)"
              description="Alertes en temps réel sur votre bureau lorsque vous êtes connecté."
              checked={pushMessages}
              onChange={setPushMessages}
            />
          </Section>

          {/* Finances et Paiements */}
          <Section
            icon={<Wallet className="h-4 w-4" />}
            title="Finances et Paiements"
          >
            <DoubleRow
              label="Paiements reçus"
              description="Alerte immédiate par SMS et Email dès qu'un virement est confirmé."
              smsChecked={financeSms}
              emailChecked={financeEmail}
              onSmsChange={setFinanceSms}
              onEmailChange={setFinanceEmail}
            />
          </Section>

          {/* Projets et Missions */}
          <Section
            icon={<FolderOpen className="h-4 w-4" />}
            title="Projets et Missions"
          >
            <SingleRow
              id="order-updates"
              label="Mises à jour de commandes"
              description="Changements de statut, validations d'étapes et retours clients."
              checked={orderUpdates}
              onChange={setOrderUpdates}
            />
            <SingleRow
              id="new-projects"
              label="Alertes de nouveaux projets"
              description="Soyez informé dès qu'une mission correspondant à vos compétences est publiée."
              checked={newProjects}
              onChange={setNewProjects}
            />
          </Section>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#0e7c66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0b6a57] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7c66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11211e] transition-colors"
          >
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
}
