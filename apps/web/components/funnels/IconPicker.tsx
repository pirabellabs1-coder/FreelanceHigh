"use client";

import { useState, useMemo } from "react";

// Curated list of Material Symbols relevant for marketing/features/products
const ICONS = [
  { name: "check_circle", keywords: "check validation ok" },
  { name: "star", keywords: "star rating favori" },
  { name: "favorite", keywords: "heart like coeur" },
  { name: "rocket_launch", keywords: "rocket launch fusee lancement" },
  { name: "bolt", keywords: "bolt flash eclair rapide" },
  { name: "trending_up", keywords: "growth croissance" },
  { name: "verified", keywords: "verified checked certifie" },
  { name: "shield", keywords: "shield security securite" },
  { name: "lock", keywords: "lock security cadenas" },
  { name: "visibility", keywords: "eye view voir" },
  { name: "settings", keywords: "settings params cogs" },
  { name: "tune", keywords: "tune config reglage" },
  { name: "analytics", keywords: "analytics graph stats" },
  { name: "bar_chart", keywords: "chart graph bar" },
  { name: "pie_chart", keywords: "chart pie camembert" },
  { name: "timeline", keywords: "timeline temps" },
  { name: "schedule", keywords: "time clock horloge" },
  { name: "timer", keywords: "timer chrono" },
  { name: "event", keywords: "calendar date" },
  { name: "event_available", keywords: "calendar check" },
  { name: "support_agent", keywords: "support agent aide" },
  { name: "chat_bubble", keywords: "chat message" },
  { name: "forum", keywords: "forum discussion" },
  { name: "groups", keywords: "groups team equipe" },
  { name: "person", keywords: "person user utilisateur" },
  { name: "person_add", keywords: "add user ajouter" },
  { name: "school", keywords: "school formation apprentissage" },
  { name: "psychology", keywords: "brain cerveau mentor" },
  { name: "lightbulb", keywords: "idea idee ampoule" },
  { name: "tips_and_updates", keywords: "tips astuce" },
  { name: "workspace_premium", keywords: "premium medal badge" },
  { name: "emoji_events", keywords: "trophy trophee" },
  { name: "military_tech", keywords: "medal decoration" },
  { name: "paid", keywords: "money argent payment" },
  { name: "attach_money", keywords: "money dollar revenu" },
  { name: "savings", keywords: "savings piggy epargne" },
  { name: "credit_card", keywords: "credit card carte" },
  { name: "shopping_cart", keywords: "cart panier" },
  { name: "shopping_bag", keywords: "bag sac commerce" },
  { name: "storefront", keywords: "shop boutique magasin" },
  { name: "inventory_2", keywords: "package produit box" },
  { name: "local_offer", keywords: "tag price promo" },
  { name: "sell", keywords: "sell price vente" },
  { name: "percent", keywords: "percent pourcentage discount" },
  { name: "workspaces", keywords: "workspace projet" },
  { name: "handshake", keywords: "handshake deal accord" },
  { name: "campaign", keywords: "megaphone campaign pub" },
  { name: "send", keywords: "send envoyer email" },
  { name: "mail", keywords: "mail email courriel" },
  { name: "mark_email_read", keywords: "mail read lu" },
  { name: "phone", keywords: "phone telephone" },
  { name: "video_call", keywords: "video call appel" },
  { name: "videocam", keywords: "videocam camera" },
  { name: "play_circle", keywords: "play video" },
  { name: "music_note", keywords: "music audio" },
  { name: "headphones", keywords: "headphones audio casque" },
  { name: "download", keywords: "download telecharger" },
  { name: "cloud_download", keywords: "cloud download" },
  { name: "attach_file", keywords: "file fichier attache" },
  { name: "description", keywords: "document doc file" },
  { name: "article", keywords: "article text" },
  { name: "menu_book", keywords: "book livre" },
  { name: "auto_stories", keywords: "book stories ebook" },
  { name: "checklist", keywords: "checklist list" },
  { name: "task_alt", keywords: "task done" },
  { name: "done_all", keywords: "done all" },
  { name: "fact_check", keywords: "check verify" },
  { name: "gpp_good", keywords: "shield good" },
  { name: "all_inclusive", keywords: "infinite illimité" },
  { name: "autorenew", keywords: "renew refresh" },
  { name: "sync", keywords: "sync synchro" },
  { name: "update", keywords: "update maj" },
  { name: "flash_on", keywords: "flash rapide" },
  { name: "diamond", keywords: "diamond premium luxe" },
  { name: "auto_awesome", keywords: "sparkle magic" },
  { name: "celebration", keywords: "celebration party" },
  { name: "whatshot", keywords: "hot fire tendance" },
  { name: "local_fire_department", keywords: "fire hot" },
  { name: "language", keywords: "language translate" },
  { name: "public", keywords: "public world monde" },
  { name: "home", keywords: "home maison" },
  { name: "dashboard", keywords: "dashboard tableau" },
  { name: "widgets", keywords: "widget block" },
  { name: "extension", keywords: "plugin extension" },
  { name: "api", keywords: "api code" },
  { name: "code", keywords: "code dev" },
  { name: "terminal", keywords: "terminal console" },
  { name: "design_services", keywords: "design creation" },
  { name: "palette", keywords: "palette color couleur" },
  { name: "brush", keywords: "brush peinture" },
  { name: "edit", keywords: "edit modify" },
  { name: "add_circle", keywords: "add plus" },
  { name: "remove_circle", keywords: "remove minus" },
  { name: "share", keywords: "share partager" },
  { name: "link", keywords: "link lien" },
  { name: "qr_code", keywords: "qr code" },
];

interface Props {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return ICONS;
    const q = query.toLowerCase();
    return ICONS.filter(
      (ic) => ic.name.includes(q) || ic.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-[#006e2f] text-sm text-[#191c1e] w-full"
      >
        <span
          className="material-symbols-outlined text-[20px] text-[#006e2f] flex-shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {value || "star"}
        </span>
        <span className="flex-1 text-left font-mono text-xs">{value || "Choisir une icône"}</span>
        <span className="material-symbols-outlined text-[16px] text-gray-400">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl p-2">
          <div className="relative mb-2">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-gray-400">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une icône…"
              autoFocus
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#006e2f] text-[#191c1e] placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="col-span-8 text-center py-6 text-xs text-gray-400">
                Aucune icône trouvée
              </div>
            ) : (
              filtered.map((ic) => (
                <button
                  key={ic.name}
                  type="button"
                  onClick={() => {
                    onChange(ic.name);
                    setOpen(false);
                  }}
                  title={ic.name}
                  className={`aspect-square flex items-center justify-center rounded-lg hover:bg-[#006e2f]/10 transition-colors ${
                    value === ic.name ? "bg-[#006e2f]/15 ring-2 ring-[#006e2f]/30" : ""
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      color: value === ic.name ? "#006e2f" : "#191c1e",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {ic.name}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500 text-center">
            {filtered.length} icônes disponibles
          </div>
        </div>
      )}
    </div>
  );
}
