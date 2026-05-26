// ══════════════════════════════════════════════════════════════════════════
// Design Tokens Centralises — FreelanceHigh
// Source unique de verite pour couleurs, styles et utilitaires UI
// ══════════════════════════════════════════════════════════════════════════

// ── Couleurs semantiques (utilisees dans les charts, badges, indicateurs) ──
// Refonte FH 2026 : fond blanc partout, accent vert canonical #006e2f.
// Tous violets/purples sont bannis. Style Fiverr (cards) + ComeUp (sobriete).
export const COLORS = {
  primary: "#006e2f",         // vert FH canonical (boutons, CTAs, liens)
  primaryHover: "#005425",    // hover state
  primarySoft: "#e8f3ec",     // fond doux/badges
  secondary: "#0EA5E9",       // bleu — usage tertiaire
  accent: "#006e2f",          // accent = primary (plus de violet)
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  muted: "#64748B",
} as const;

// ── Couleurs de fond et surface (light theme) ──
export const SURFACE = {
  background: "#FFFFFF",      // blanc partout
  card: "#FFFFFF",            // cards blanches
  sidebar: "#FFFFFF",         // sidebar blanche
  subtle: "#FAFAF9",          // stone-50 — sections subtiles
  border: "#E5E7EB",          // gray-200 — divisions sobres
  borderStrong: "#D1D5DB",    // gray-300
  overlay: "rgba(15, 23, 42, 0.5)",
} as const;

// ── Couleurs de texte (sur fond clair) ──
export const TEXT = {
  primary: "#111827",         // gray-900 — texte principal
  secondary: "#4B5563",       // gray-600 — secondaire
  muted: "#6B7280",           // gray-500 — atténué
  disabled: "#9CA3AF",        // gray-400
  link: "#006e2f",            // vert FH
  // Legacy white text — uniquement pour CTAs sur fond vert/sombre
  onDark: "#FFFFFF",
} as const;

// ── Palette de graphiques multi-series (violet retiré) ──
export const CHART_COLORS = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  info: COLORS.info,
  muted: COLORS.muted,
  series: [
    "#006e2f", // vert FH (primary)
    "#0EA5E9", // bleu
    "#F59E0B", // orange
    "#14B8A6", // teal
    "#EC4899", // rose
    "#EF4444", // rouge
    "#6366F1", // indigo (remplace violet)
    "#22C55E", // vert clair
  ],
} as const;

// ── Styles des tooltips de graphiques (light theme) ──
export const TOOLTIP_STYLES = {
  backgroundColor: "#FFFFFF",
  borderColor: "rgba(17, 24, 39, 0.08)",
  textColor: "#111827",
  labelColor: "#6B7280",
} as const;

// ── Styles des axes de graphiques (light theme) ──
export const CHART_AXIS = {
  stroke: "#9CA3AF",
  fontSize: 12,
  gridStroke: "rgba(17, 24, 39, 0.06)",
} as const;

// ── Indicateurs de tendance (light theme : opacités plus marquées sur blanc) ──
export const STAT_CARD_TRENDS = {
  positive: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: "trending_up",
  },
  negative: {
    color: "text-red-700",
    bg: "bg-red-50",
    icon: "trending_down",
  },
  neutral: {
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: "trending_flat",
  },
} as const;

// ── Couleurs de statut de commande (light theme) ──
export const ORDER_STATUS_COLORS: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: "En attente", color: "text-amber-700", bg: "bg-amber-50" },
  en_cours: { label: "En cours", color: "text-blue-700", bg: "bg-blue-50" },
  revision: { label: "Revision", color: "text-orange-700", bg: "bg-orange-50" },
  livre: { label: "Livre", color: "text-emerald-700", bg: "bg-emerald-50" },
  termine: { label: "Termine", color: "text-emerald-700", bg: "bg-emerald-50" },
  annule: { label: "Annule", color: "text-red-700", bg: "bg-red-50" },
  litige: { label: "Litige", color: "text-red-700", bg: "bg-red-50" },
};

// ── Couleurs de statut utilisateur (light theme) ──
export const USER_STATUS_COLORS: Record<string, { label: string; color: string; bg: string }> = {
  ACTIF: { label: "Actif", color: "text-emerald-700", bg: "bg-emerald-50" },
  suspendu: { label: "Suspendu", color: "text-amber-700", bg: "bg-amber-50" },
  banni: { label: "Banni", color: "text-red-700", bg: "bg-red-50" },
};

// ── Couleurs de badge (light theme, violet → vert pour pro) ──
export const BADGE_COLORS = {
  verified: { color: "text-blue-700", bg: "bg-blue-50", icon: "verified" },
  topRated: { color: "text-amber-700", bg: "bg-amber-50", icon: "star" },
  risingTalent: { color: "text-emerald-700", bg: "bg-emerald-50", icon: "trending_up" },
  pro: { color: "text-fh-700", bg: "bg-fh-50", icon: "workspace_premium" },
  elite: { color: "text-orange-700", bg: "bg-orange-50", icon: "diamond" },
} as const;

// ── Utilitaires ──

export function getTrendStyle(value: number) {
  if (value > 0) return STAT_CARD_TRENDS.positive;
  if (value < 0) return STAT_CARD_TRENDS.negative;
  return STAT_CARD_TRENDS.neutral;
}

export function formatTrend(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  const symbols: Record<string, string> = {
    EUR: "\u20AC",
    USD: "$",
    GBP: "\u00A3",
    FCFA: "FCFA",
    MAD: "MAD",
  };
  const symbol = symbols[currency] || currency;
  const formatted = amount.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return currency === "FCFA" || currency === "MAD"
    ? `${formatted} ${symbol}`
    : `${symbol}${formatted}`;
}

// ── Breakpoints responsive (miroir de tailwind) ──
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ── Constantes de pagination ──
export const PAGINATION = {
  defaultPageSize: 20,
  listingPageSize: 24,
  dashboardPageSize: 10,
  maxPageSize: 100,
} as const;
