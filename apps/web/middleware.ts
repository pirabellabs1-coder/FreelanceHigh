import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Route admin login secrete — pas de redirection, le token est verifie cote client+API
const ADMIN_LOGIN_PREFIX = "/admin-login/";

// ── Maintenance mode cache (60s TTL in Edge Runtime) ──
let maintenanceModeCache: { enabled: boolean; message: string; cachedAt: number } | null = null;
const MAINTENANCE_CACHE_TTL_MS = 60_000; // 60 seconds

// ── Custom domain resolution cache (5 min TTL) ──
const customDomainCache = new Map<string, { slug: string | null; cachedAt: number }>();
const CUSTOM_DOMAIN_CACHE_TTL_MS = 5 * 60_000;

// Hôtes considérés comme "principaux" (pas des domaines custom).
// On y ajoute localhost + *.vercel.app + le domaine principal via env.
function isPrimaryHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0];
  if (h === "localhost" || h === "127.0.0.1" || h.endsWith(".local")) return true;
  if (h.endsWith(".vercel.app")) return true;
  const primary = (process.env.NEXT_PUBLIC_PRIMARY_HOST ?? "").toLowerCase();
  if (primary && (h === primary || h === `www.${primary}` || h.endsWith(`.${primary}`))) return true;
  return false;
}

function getInternalOrigin(req: NextRequest): string {
  // L'origine doit être résolvable DNS depuis le process Node.
  // req.url reflète le Host header incoming — inutile si c'est un domaine custom.
  // On préfère VERCEL_URL (prod) puis NEXT_PUBLIC_PRIMARY_HOST, puis loopback dev.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const primary = process.env.NEXT_PUBLIC_PRIMARY_HOST;
  if (primary && !primary.includes("localhost")) return `https://${primary}`;
  // Dev fallback: use incoming protocol + loopback on current port.
  const port = req.nextUrl.port || "3000";
  return `http://127.0.0.1:${port}`;
}

async function resolveCustomDomain(host: string, req: NextRequest): Promise<string | null> {
  const cached = customDomainCache.get(host);
  if (cached && Date.now() - cached.cachedAt < CUSTOM_DOMAIN_CACHE_TTL_MS) {
    return cached.slug;
  }
  try {
    const origin = getInternalOrigin(req);
    const res = await fetch(`${origin}/api/formations/public/resolve-domain?host=${encodeURIComponent(host)}`);
    if (!res.ok) {
      customDomainCache.set(host, { slug: null, cachedAt: Date.now() });
      return null;
    }
    const body = await res.json();
    const slug = (body?.data?.slug as string | undefined) ?? null;
    customDomainCache.set(host, { slug, cachedAt: Date.now() });
    return slug;
  } catch {
    return null;
  }
}

// Routes publiques — toujours accessibles
const PUBLIC_ROUTES = [
  "/",
  "/explorer",
  "/formations",
  "/services",
  "/freelances",
  "/agences",
  "/offres-projets",
  "/projets",
  "/blog",
  "/tarifs",
  "/comment-ca-marche",
  "/confiance-securite",
  "/a-propos",
  "/contact",
  "/affiliation",
  "/faq",
  "/cgu",
  "/confidentialite",
  "/mentions-legales",
  "/cookies",
  "/aide",
  "/contrats",
  "/404",
  "/maintenance",
  "/status",
  "/debug-media",
  "/backoffice", // Admin secret login (slug validé côté page server)
  "/f", // Public funnel landing pages
];

// Routes auth — accessibles uniquement si NON connecte
const AUTH_ROUTES = ["/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe", "/onboarding"];



// Routes protegees par role
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  freelance: ["/dashboard"],
  client: ["/client"],
  agence: ["/agence"],
};

// Map role → dashboard URL (source unique de verite pour les redirections)
const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/admin",
  freelance: "/dashboard",
  client: "/client",
  agence: "/agence",
};

function getDashboardForRole(role: string | undefined): string {
  if (!role) return "/connexion";
  return ROLE_DASHBOARD[role.toLowerCase()] || "/connexion";
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/");
  });
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  );
}

function getRequiredRole(pathname: string): string | null {
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
      return role;
    }
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Laisser passer les assets statiques et les routes API
  if (isStaticAsset(pathname) || isApiRoute(pathname)) {
    return NextResponse.next();
  }

  // ── Custom domain routing ──
  // Si la requête arrive via un domaine custom (pas notre host principal),
  // on réécrit vers /formations/boutique/[slug] correspondant à ce domaine.
  const host = req.headers.get("host") ?? "";
  if (host && !isPrimaryHost(host) && !pathname.startsWith("/formations/boutique/")) {
    const slug = await resolveCustomDomain(host.toLowerCase().split(":")[0], req);
    if (slug) {
      const url = req.nextUrl.clone();
      url.pathname = `/formations/boutique/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  // Route admin-login secrete — laisser passer (la verification du token se fait cote client+API)
  if (pathname.startsWith(ADMIN_LOGIN_PREFIX)) {
    return NextResponse.next();
  }

  // ── Maintenance mode check (cached ~60s in-memory) ──
  // Skip maintenance check for: /maintenance itself, /admin/*, /admin-login/*, /api/*
  const skipMaintenance = pathname === "/maintenance" || pathname.startsWith("/admin") || pathname.startsWith(ADMIN_LOGIN_PREFIX);
  if (!skipMaintenance) {
    try {
      let maintenanceState = maintenanceModeCache;

      // Refresh cache if expired or missing
      if (!maintenanceState || Date.now() - maintenanceState.cachedAt >= MAINTENANCE_CACHE_TTL_MS) {
        const maintenanceRes = await fetch(new URL("/api/public/maintenance", req.url));
        if (maintenanceRes.ok) {
          const data = await maintenanceRes.json();
          maintenanceState = {
            enabled: !!data.enabled,
            message: data.message || "",
            cachedAt: Date.now(),
          };
          maintenanceModeCache = maintenanceState;
        }
      }

      if (maintenanceState?.enabled) {
        // Allow admin users through even during maintenance
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const userRole = token?.role as string | undefined;
        if (userRole !== "admin") {
          const maintenanceUrl = new URL("/maintenance", req.url);
          return NextResponse.redirect(maintenanceUrl);
        }
      }
    } catch {
      // If maintenance check fails, allow access (fail open)
    }
  }

  // --- i18n : set locale cookie from Accept-Language if absent ---
  const localeCookie = req.cookies.get("locale")?.value;
  let needsLocaleCookie = false;
  let detectedLocale = "fr";
  if (!localeCookie) {
    const acceptLang = req.headers.get("accept-language") ?? "";
    const preferredLocale = acceptLang
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
      .find((lang) => lang === "en" || lang === "fr");
    detectedLocale = preferredLocale ?? "fr";
    needsLocaleCookie = true;
  }

  function withLocaleCookie(res: NextResponse): NextResponse {
    if (needsLocaleCookie) {
      res.cookies.set("locale", detectedLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return res;
  }

  // Pas de profil public client (/clients/[id] → rediriger par rôle)
  if (pathname.startsWith("/clients/")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = token?.role as string | undefined;
    const redirectUrl = role ? getDashboardForRole(role) : "/";
    return withLocaleCookie(NextResponse.redirect(new URL(redirectUrl, req.url)));
  }



  // Routes publiques — toujours accessibles
  if (isPublicRoute(pathname)) {
    // Si connecté et sur la page d'accueil → rediriger par rôle
    if (pathname === "/") {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (token) {
        const role = token.role as string | undefined;
        const redirectUrl = getDashboardForRole(role);
        return withLocaleCookie(NextResponse.redirect(new URL(redirectUrl, req.url)));
      }
    }
    return withLocaleCookie(NextResponse.next());
  }

  // Lire le token JWT directement (compatible Edge Runtime)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // Routes auth — rediriger vers le bon espace si deja connecte
  if (isAuthRoute(pathname)) {
    if (isAuthenticated && userRole) {
      const redirectUrl = getDashboardForRole(userRole);
      return withLocaleCookie(NextResponse.redirect(new URL(redirectUrl, req.url)));
    }
    return withLocaleCookie(NextResponse.next());
  }

  // Toutes les autres routes necessitent une authentification
  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return withLocaleCookie(NextResponse.redirect(new URL(`/connexion?callbackUrl=${callbackUrl}`, req.url)));
  }

  // Verification du role
  const requiredRole = getRequiredRole(pathname);
  if (requiredRole) {
    // L'admin a acces a tout
    if (userRole === "admin") {
      const res = NextResponse.next();
      if (requiredRole !== "admin") {
        res.headers.set("x-admin-viewing", "true");
      }
      return withLocaleCookie(res);
    }

    // Verifier que le role correspond — rediriger vers l'espace du rôle
    // avec parametre ?access_denied=1 pour afficher une notification
    if (userRole !== requiredRole) {
      const redirectUrl = getDashboardForRole(userRole);
      const url = new URL(redirectUrl, req.url);
      url.searchParams.set("access_denied", "1");
      return withLocaleCookie(NextResponse.redirect(url));
    }
  }

  return withLocaleCookie(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
