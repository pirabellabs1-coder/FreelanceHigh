"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/store/toast";

type ShopProfile = {
  id: string;
  shopSlug: string | null;
  shopName: string | null;
  customDomain: string | null;
  customDomainVerifiedAt: string | null;
  customDomainTxt: string | null;
  shopPrimaryColor: string | null;
  shopLogoUrl: string | null;
};

type ShopData = {
  vendor: ShopProfile | null;
  mentor: ShopProfile | null;
};

type Tab = "general" | "domain";

// ─────────────────────────────────────────────────────────────────────────────
// Onglet "Généraux" — identité boutique (nom, slug, couleur, logo)
// ─────────────────────────────────────────────────────────────────────────────
function GeneralTab({ role, profile, onSaved }: { role: "vendor" | "mentor"; profile: ShopProfile; onSaved: () => void }) {
  const [shopSlug, setShopSlug] = useState(profile.shopSlug ?? "");
  const [shopName, setShopName] = useState(profile.shopName ?? "");
  const [shopPrimaryColor, setShopPrimaryColor] = useState(profile.shopPrimaryColor ?? "#006e2f");
  const [shopLogoUrl, setShopLogoUrl] = useState(profile.shopLogoUrl ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/formations/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          shopSlug: shopSlug || null,
          shopName: shopName || null,
          shopPrimaryColor: shopPrimaryColor || null,
          shopLogoUrl: shopLogoUrl || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erreur");
      return res.json();
    },
    onSuccess: () => {
      useToastStore.getState().addToast("success", "Boutique mise à jour");
      onSaved();
    },
    onError: (e) => useToastStore.getState().addToast("error", e instanceof Error ? e.message : "Erreur"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#191c1e]">Identité de la boutique</h2>
        <p className="text-sm text-[#5c647a] mt-0.5">Nom, slug public et apparence visible sur votre page boutique.</p>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase text-[#5c647a] block mb-2">Nom de la boutique</label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Ex: Aminata Coaching"
          maxLength={80}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#006e2f]/40 focus:ring-2 focus:ring-[#006e2f]/10"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase text-[#5c647a] block mb-2">Slug de boutique</label>
        <div className="flex items-stretch">
          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm text-[#5c647a]">
            novakou.com/boutique/
          </span>
          <input
            type="text"
            value={shopSlug}
            onChange={(e) => setShopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="aminata-coaching"
            maxLength={40}
            className="flex-1 rounded-r-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#006e2f]/40 focus:ring-2 focus:ring-[#006e2f]/10"
          />
        </div>
        <p className="text-[11px] text-[#5c647a] mt-1.5">3 à 40 caractères, lettres minuscules, chiffres, tirets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold uppercase text-[#5c647a] block mb-2">Couleur principale</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={shopPrimaryColor}
              onChange={(e) => setShopPrimaryColor(e.target.value)}
              className="h-11 w-16 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={shopPrimaryColor}
              onChange={(e) => setShopPrimaryColor(e.target.value)}
              placeholder="#006e2f"
              className="flex-1 rounded-xl border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-[#006e2f]/40"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase text-[#5c647a] block mb-2">URL du logo</label>
          <input
            type="url"
            value={shopLogoUrl}
            onChange={(e) => setShopLogoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#006e2f]/40"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {save.isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Onglet "Nom de domaine" — état vide (connecter) + état configuré (DNS + vérifier)
// ─────────────────────────────────────────────────────────────────────────────
function DomainTab({ role, profile, onSaved }: { role: "vendor" | "mentor"; profile: ShopProfile; onSaved: () => void }) {
  const [domainInput, setDomainInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const hasDomain = !!profile.customDomain;
  const verified = !!profile.customDomainVerifiedAt;

  const connect = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/formations/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, customDomain: domainInput.toLowerCase().trim() || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erreur");
      return res.json();
    },
    onSuccess: () => {
      useToastStore.getState().addToast("success", "Domaine enregistré — configurez les DNS puis vérifiez.");
      setDomainInput("");
      onSaved();
    },
    onError: (e) => useToastStore.getState().addToast("error", e instanceof Error ? e.message : "Erreur"),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/formations/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, customDomain: null }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erreur");
      return res.json();
    },
    onSuccess: () => {
      useToastStore.getState().addToast("success", "Domaine supprimé");
      onSaved();
    },
    onError: (e) => useToastStore.getState().addToast("error", e instanceof Error ? e.message : "Erreur"),
  });

  const verify = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/formations/shop/verify-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Vérification échouée");
      return res.json();
    },
    onSuccess: () => {
      useToastStore.getState().addToast("success", "Domaine vérifié ✓ — votre boutique est en ligne.");
      onSaved();
    },
    onError: (e) => useToastStore.getState().addToast("error", e instanceof Error ? e.message : "Erreur"),
  });

  async function copy(txt: string, key: string) {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // silent
    }
  }

  // ───── État VIDE : input + bouton Connecter ─────
  if (!hasDomain) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#191c1e]">Connecter un nom de domaine</h2>
          <p className="text-sm text-[#5c647a] mt-0.5">Définissez un nom de domaine personnalisé pour votre boutique</p>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-[#5c647a] block mb-2">Nom de domaine</label>
          <div className="flex items-stretch gap-3">
            <div className="flex-1 flex items-stretch">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm text-[#5c647a]">
                https://
              </span>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value.toLowerCase().trim())}
                placeholder="example.com"
                className="flex-1 rounded-r-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#4f46e5]/40 focus:ring-2 focus:ring-[#4f46e5]/10"
              />
            </div>
            <button
              onClick={() => connect.mutate()}
              disabled={!domainInput || connect.isPending}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white text-sm font-bold bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 shrink-0"
            >
              {connect.isPending ? "…" : "Connecter"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───── État CONFIGURÉ : domaine + DNS + vérifier ─────
  const subdomain = profile.customDomain!.split(".").length > 2 ? profile.customDomain!.split(".")[0] : "@";
  const dnsRows = [
    { type: "A", name: "@", value: "76.76.21.21", key: "a1" },
    { type: "CNAME", name: subdomain, value: "cname.novakou.com", key: "cname" },
    { type: "TXT", name: "_novakou", value: profile.customDomainTxt ?? "", key: "txt" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#191c1e]">Connecter un nom de domaine</h2>
        <p className="text-sm text-[#5c647a] mt-0.5">Définissez un nom de domaine personnalisé pour votre boutique</p>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase text-[#5c647a] block mb-2">Nom de domaine</label>
        <div className="flex items-stretch gap-3">
          <div className="flex-1 flex items-stretch">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm text-[#5c647a]">
              https://
            </span>
            <input
              type="text"
              value={profile.customDomain ?? ""}
              readOnly
              className="flex-1 rounded-r-xl border border-gray-200 p-3 text-sm bg-gray-50 text-[#191c1e]"
            />
          </div>
          <button
            onClick={() => {
              if (confirm(`Supprimer le domaine ${profile.customDomain} ?`)) remove.mutate();
            }}
            disabled={remove.isPending}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white text-sm font-bold bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-50 shrink-0"
          >
            {remove.isPending ? "…" : "Supprimer"}
          </button>
        </div>
        {verified && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Domaine vérifié
          </div>
        )}
      </div>

      {/* Info bleue + tableau DNS — seulement si pas encore vérifié */}
      {!verified && (
        <>
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
            <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0">info</span>
            <p className="text-xs text-[#1e3a8a] leading-relaxed">
              Assurez-vous d&apos;avoir correctement configuré les enregistrements DNS auprès de votre fournisseur de nom de domaine. La propagation DNS peut prendre jusqu&apos;à une heure.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-[100px_1fr_2fr] bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase text-[#5c647a]">
              <div className="px-4 py-2.5">Type</div>
              <div className="px-4 py-2.5">Nom</div>
              <div className="px-4 py-2.5">Valeur</div>
            </div>
            {dnsRows.map((row) => (
              <div key={row.key} className="grid grid-cols-[100px_1fr_2fr] border-b border-gray-100 last:border-0 items-center text-sm">
                <div className="px-4 py-2.5">
                  <DnsCell value={row.type} copied={copied === `${row.key}-type`} onCopy={() => copy(row.type, `${row.key}-type`)} mono />
                </div>
                <div className="px-4 py-2.5">
                  <DnsCell value={row.name} copied={copied === `${row.key}-name`} onCopy={() => copy(row.name, `${row.key}-name`)} mono />
                </div>
                <div className="px-4 py-2.5">
                  <DnsCell value={row.value} copied={copied === `${row.key}-val`} onCopy={() => copy(row.value, `${row.key}-val`)} mono />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => verify.mutate()}
              disabled={verify.isPending}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">{verify.isPending ? "progress_activity" : "play_arrow"}</span>
              {verify.isPending ? "Vérification…" : "Lancer une vérification"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DnsCell({ value, copied, onCopy, mono }: { value: string; copied: boolean; onCopy: () => void; mono?: boolean }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="flex items-center gap-2 max-w-full group"
      title={value}
    >
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[#191c1e] truncate ${mono ? "font-mono text-xs" : "text-sm"}`}>
        <span className="truncate">{value || "—"}</span>
        <span className="material-symbols-outlined text-[14px] text-[#5c647a] group-hover:text-[#191c1e] shrink-0">
          {copied ? "check" : "content_copy"}
        </span>
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────────────────────
export default function BoutiquePage() {
  const qc = useQueryClient();
  const [activeRole, setActiveRole] = useState<"vendor" | "mentor">("vendor");
  const [tab, setTab] = useState<Tab>("general");

  const { data: response, isLoading } = useQuery<{ data: ShopData }>({
    queryKey: ["shop-settings"],
    queryFn: () => fetch("/api/formations/shop").then((r) => r.json()),
    staleTime: 30_000,
  });

  const data = response?.data;
  const hasVendor = !!data?.vendor;
  const hasMentor = !!data?.mentor;
  const profile = activeRole === "vendor" ? data?.vendor : data?.mentor;

  function refresh() {
    qc.invalidateQueries({ queryKey: ["shop-settings"] });
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "general", label: "Généraux", icon: "settings" },
    { id: "domain", label: "Nom de domaine", icon: "alternate_email" },
  ];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e]">Paramètres</h1>
        <p className="text-sm text-[#5c647a] mt-1">Gérez l&apos;apparence et le nom de domaine de votre boutique.</p>
      </header>

      {hasVendor && hasMentor && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveRole("vendor")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeRole === "vendor" ? "bg-[#006e2f] text-white border-[#006e2f]" : "bg-white text-[#5c647a] border-gray-200 hover:border-[#006e2f]"
            }`}
          >
            Boutique vendeur
          </button>
          <button
            onClick={() => setActiveRole("mentor")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeRole === "mentor" ? "bg-[#006e2f] text-white border-[#006e2f]" : "bg-white text-[#5c647a] border-gray-200 hover:border-[#006e2f]"
            }`}
          >
            Espace mentor
          </button>
        </div>
      )}

      {/* Onglets à la Vercel */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-full md:w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id ? "bg-[#4f46e5] text-white shadow-sm" : "text-[#5c647a] hover:text-[#191c1e]"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      ) : !profile ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-gray-300 block mb-3">storefront</span>
          <p className="text-sm font-semibold text-[#191c1e]">Profil {activeRole === "vendor" ? "vendeur" : "mentor"} introuvable</p>
          <p className="text-xs text-[#5c647a] mt-1">Créez votre profil pour pouvoir configurer une boutique.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          {tab === "general" && <GeneralTab role={activeRole} profile={profile} onSaved={refresh} />}
          {tab === "domain" && <DomainTab role={activeRole} profile={profile} onSaved={refresh} />}
        </div>
      )}
    </div>
  );
}
