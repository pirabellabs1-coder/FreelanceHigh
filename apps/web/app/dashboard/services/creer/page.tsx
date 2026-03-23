"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ServiceWizard } from "@/components/services/wizard/ServiceWizard";

function CreateServiceContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") || undefined;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ServiceWizard role="freelance" editServiceId={editId} />
    </div>
  );
}

export default function CreateServicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Chargement...</div>}>
      <CreateServiceContent />
    </Suspense>
  );
}
