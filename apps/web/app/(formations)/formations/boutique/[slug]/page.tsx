"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type VendorShop = {
  kind: "vendor";
  id: string;
  slug: string;
  name: string;
  owner: { id: string; name: string | null; image: string | null };
  customDomain: string | null;
  domainVerified: boolean;
  primaryColor: string;
  logoUrl: string | null;
  bio: string | null;
  expertise: string[];
  website: string | null;
  linkedin: string | null;
  formations: Array<{
    id: string;
    slug: string;
    title: string;
    shortDesc: string | null;
    thumbnail: string | null;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviewsCount: number;
    studentsCount: number;
  }>;
  digitalProducts: Array<{
    id: string;
    slug: string;
    title: string;
    banner: string | null;
    productType: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviewsCount: number;
    salesCount: number;
  }>;
};

type MentorShop = {
  kind: "mentor";
  id: string;
  slug: string;
  name: string;
  owner: { id: string; name: string | null; image: string | null };
  customDomain: string | null;
  domainVerified: boolean;
  primaryColor: string;
  logoUrl: string | null;
  specialty: string | null;
  bio: string | null;
  domainExpertise: string[];
  sessionPrice: number;
  sessionDuration: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  totalSessions: number;
};

type Shop = VendorShop | MentorShop;

function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

export default function BoutiquePublicPage() {
  const params = useParams();
  const slug = String(params?.slug ?? "");

  const { data, isLoading, error } = useQuery<{ data?: Shop; error?: string }>({
    queryKey: ["public-shop", slug],
    queryFn: () => fetch(`/api/formations/public/shop/${slug}`).then((r) => r.json()),
    enabled: !!slug,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Chargement de la boutique…</div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <span className="material-symbols-outlined text-[48px] text-gray-600">storefront</span>
        <h1 className="mt-4 text-lg md:text-xl font-bold text-gray-900">Boutique introuvable</h1>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Cette boutique n&apos;existe pas ou a été désactivée.
        </p>
        <Link
          href="/formations/explorer"
          className="mt-6 px-5 py-2.5 rounded-lg bg-fh-600 text-white text-sm font-semibold hover:bg-fh-700"
        >
          Explorer la marketplace
        </Link>
      </div>
    );
  }

  const shop = data.data;
  const color = shop.primaryColor;

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Hero — solid couleur boutique (sobriété) */}
      <header
        className="relative overflow-hidden"
        style={{ background: color }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="flex items-start gap-4 md:gap-6">
            {shop.logoUrl ? (
              <img
                src={shop.logoUrl}
                alt={shop.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-white/10 border-2 border-white/30"
              />
            ) : shop.owner.image ? (
              <img
                src={shop.owner.image}
                alt={shop.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-white/20 flex items-center justify-center text-white text-2xl md:text-3xl font-bold border-2 border-white/30">
                {(shop.name || "S").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0 text-white">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-extrabold truncate">{shop.name}</h1>
                {shop.kind === "mentor" && shop.isVerified && (
                  <span className="material-symbols-outlined text-[20px]" title="Mentor vérifié">
                    verified
                  </span>
                )}
              </div>
              {shop.kind === "mentor" && shop.specialty && (
                <p className="mt-1 text-white/90 text-sm">{shop.specialty}</p>
              )}
              {shop.kind === "vendor" && shop.expertise?.length > 0 && (
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  {shop.expertise.slice(0, 4).map((e) => (
                    <span
                      key={e}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wide"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm text-white/90 max-w-2xl">
                {shop.bio ?? "Boutique Novakou"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
        {shop.kind === "vendor" ? <VendorBody shop={shop} /> : <MentorBody shop={shop} />}
      </main>

      <footer className="border-t border-gray-200 py-6 mt-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between text-xs text-gray-600">
          <span>
            Propulsé par{" "}
            <Link href="/formations" className="font-semibold text-fh-600 hover:underline">
              Novakou
            </Link>
          </span>
          {shop.customDomain && shop.domainVerified && (
            <span className="text-[10px]">{shop.customDomain}</span>
          )}
        </div>
      </footer>
    </div>
  );
}

function VendorBody({ shop }: { shop: VendorShop }) {
  const hasFormations = shop.formations.length > 0;
  const hasProducts = shop.digitalProducts.length > 0;
  const color = shop.primaryColor;

  if (!hasFormations && !hasProducts) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-[48px] text-gray-600">inventory_2</span>
        <h2 className="mt-4 font-bold text-gray-900">Aucun produit pour le moment</h2>
        <p className="mt-1 text-sm text-gray-600">Revenez bientôt — de nouveaux produits arrivent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {hasFormations && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Formations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shop.formations.map((f) => (
              <Link
                key={f.id}
                href={`/formations/formation/${f.slug}`}
                className="group bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="aspect-[4/3] bg-gray-100 overflow-hidden"
                  style={!f.thumbnail ? { background: `${color}15` } : undefined}
                >
                  {f.thumbnail ? (
                    <img src={f.thumbnail} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[40px]" style={{ color }}>play_circle</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{f.title}</h3>
                  {f.shortDesc && <p className="mt-1 text-xs text-gray-600 line-clamp-2">{f.shortDesc}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-base font-extrabold" style={{ color }}>{formatFCFA(f.price)}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="material-symbols-outlined text-[14px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-semibold text-gray-900">{f.rating.toFixed(1)}</span> ({f.reviewsCount})
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasProducts && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Produits digitaux</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shop.digitalProducts.map((p) => (
              <Link
                key={p.id}
                href={`/formations/produit/${p.slug}`}
                className="group bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="aspect-[4/3] bg-gray-100 overflow-hidden"
                  style={!p.banner ? { background: `${color}15` } : undefined}
                >
                  {p.banner ? (
                    <img src={p.banner} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[40px]" style={{ color }}>inventory_2</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide bg-gray-100 text-gray-600">
                    {p.productType}
                  </span>
                  <h3 className="mt-2 font-semibold text-gray-900 text-sm line-clamp-2">{p.title}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-base font-extrabold" style={{ color }}>{formatFCFA(p.price)}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="material-symbols-outlined text-[14px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-semibold text-gray-900">{p.rating.toFixed(1)}</span> ({p.reviewsCount})
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MentorBody({ shop }: { shop: MentorShop }) {
  const color = shop.primaryColor;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900">À propos</h2>
          <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
            {shop.bio ?? "Aucune bio renseignée."}
          </p>
          {shop.domainExpertise?.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-900 mb-2">Domaines d&apos;expertise</div>
              <div className="flex gap-1.5 flex-wrap">
                {shop.domainExpertise.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: `${color}15`, color }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900">Statistiques</h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Stat label="Sessions" value={shop.totalSessions.toString()} />
            <Stat label="Note" value={`${shop.rating.toFixed(1)}/5`} />
            <Stat label="Avis" value={shop.reviewsCount.toString()} />
          </div>
        </section>
      </div>

      <aside className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 h-fit lg:sticky lg:top-6">
        <div className="text-center">
          <div className="text-xs text-gray-600 uppercase tracking-wide">Session à partir de</div>
          <div className="mt-1 text-xl md:text-2xl font-extrabold" style={{ color }}>
            {formatFCFA(shop.sessionPrice)}
          </div>
          <div className="text-xs text-gray-600">{shop.sessionDuration} minutes</div>
        </div>
        <Link
          href={`/formations/mentors/${shop.id}/reserver`}
          className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 rounded-lg text-white font-semibold text-sm transition-opacity ${
            shop.isAvailable ? "hover:opacity-90" : "opacity-60 pointer-events-none"
          }`}
          style={{ background: color }}
        >
          <span className="material-symbols-outlined text-[18px]">event</span>
          {shop.isAvailable ? "Réserver une session" : "Indisponible"}
        </Link>
        <Link
          href={`/formations/mentors/${shop.id}`}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-50"
        >
          Voir le profil complet
        </Link>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-base md:text-lg font-extrabold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}
