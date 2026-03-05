import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Routes publiques — toujours accessibles
const PUBLIC_ROUTES = [
  "/",
  "/explorer",
  "/services",
  "/freelances",
  "/agences",
  "/offres-projets",
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

function isPublicRoute(pathname: string): boolean {
  // Exact match or starts with a public route prefix
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

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } }) => {
  const { pathname } = req.nextUrl;

  // Laisser passer les assets statiques et les routes API
  if (isStaticAsset(pathname) || isApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Routes publiques — toujours accessibles
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const session = req.auth;
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  // Routes auth — rediriger vers le bon espace si deja connecte
  if (isAuthRoute(pathname)) {
    if (isAuthenticated && userRole) {
      const redirectMap: Record<string, string> = {
        admin: "/admin",
        freelance: "/dashboard",
        client: "/client",
        agence: "/agence",
      };
      const redirectUrl = redirectMap[userRole] || "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    return NextResponse.next();
  }

  // Toutes les autres routes necessitent une authentification
  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/connexion?callbackUrl=${callbackUrl}`, req.url));
  }

  // Verification du role
  const requiredRole = getRequiredRole(pathname);
  if (requiredRole) {
    // L'admin a acces a tout
    if (userRole === "admin") {
      const response = NextResponse.next();
      // Ajouter un header pour l'impersonation si l'admin visite un espace non-admin
      if (requiredRole !== "admin") {
        response.headers.set("x-admin-viewing", "true");
      }
      return response;
    }

    // Verifier que le role correspond
    if (userRole !== requiredRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
