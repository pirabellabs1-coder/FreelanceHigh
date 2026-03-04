"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientInvoicesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/client/paiements");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-400 text-sm">Redirection vers Paiements...</p>
    </div>
  );
}
