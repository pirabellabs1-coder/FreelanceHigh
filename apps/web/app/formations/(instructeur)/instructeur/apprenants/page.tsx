"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, Download } from "lucide-react";

interface InstructeurApprenant {
  id: string;
  createdAt: string;
  progress: number;
  completedAt: string | null;
  paidAmount: number;
  user: { name: string; email: string; avatar: string | null; image: string | null };
  formation: { titleFr: string; slug: string };
}

export default function InstructeurApprenantsPage() {
  const [apprenants, setApprenants] = useState<InstructeurApprenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/instructeur/apprenants")
      .then((r) => r.json())
      .then((d) => { setApprenants(d.apprenants ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = apprenants.filter((a) =>
    !search ||
    a.user.name.toLowerCase().includes(search.toLowerCase()) ||
    a.user.email.toLowerCase().includes(search.toLowerCase()) ||
    a.formation.titleFr.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["Nom", "Email", "Formation", "Progression (%)", "Paiement (€)", "Date inscription", "Complété"],
      ...filtered.map((a) => [
        a.user.name,
        a.user.email,
        a.formation.titleFr,
        Math.round(a.progress * 100).toString(),
        a.paidAmount.toFixed(2),
        new Date(a.createdAt).toLocaleDateString("fr-FR"),
        a.completedAt ? "Oui" : "Non",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apprenants.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const INSTRUCTOR_NAV = [
    ["/formations/instructeur/dashboard", "Dashboard"],
    ["/formations/instructeur/mes-formations", "Formations"],
    ["/formations/instructeur/apprenants", "Apprenants"],
    ["/formations/instructeur/revenus", "Revenus"],
    ["/formations/instructeur/avis", "Avis"],
    ["/formations/instructeur/statistiques", "Statistiques"],
  ] as [string, string][];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Mes apprenants</h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white border border-border-dark hover:bg-border-dark/50 px-3 py-2 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1 bg-border-dark/30 rounded-xl p-1 w-fit overflow-x-auto">
        {INSTRUCTOR_NAV.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              href.includes("apprenants") ? "bg-primary text-white" : "text-slate-400 hover:text-white hover:bg-border-dark/50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Search + count */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou formation..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Users className="w-4 h-4" />
          {filtered.length} apprenant{filtered.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border-dark">
            <tr className="text-slate-400 text-xs uppercase">
              <th className="p-4 text-left">Apprenant</th>
              <th className="p-4 text-left">Formation</th>
              <th className="p-4 text-left">Progression</th>
              <th className="p-4 text-left">Paiement</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Aucun apprenant trouvé</td></tr>
            ) : (
              filtered.map((a) => {
                const avatar = a.user.avatar || a.user.image;
                return (
                  <tr key={a.id} className="hover:bg-border-dark/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {avatar ? (
                            <img src={avatar} alt={a.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-xs">{a.user.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm">{a.user.name}</p>
                          <p className="text-xs text-slate-500">{a.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300 text-sm line-clamp-1 max-w-xs">{a.formation.titleFr}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-border-dark rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.round(a.progress * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{Math.round(a.progress * 100)}%</span>
                      </div>
                      {a.completedAt && <span className="text-xs text-green-400">✓ Terminé</span>}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white">
                        {a.paidAmount === 0 ? "Gratuit" : `${a.paidAmount.toFixed(0)}€`}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString("fr-FR")}</p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
