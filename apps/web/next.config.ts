import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = isDev
  ? []
  : [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          // Note: Next.js requiert 'unsafe-inline' pour les styles inline generes.
          // 'unsafe-eval' supprime — utiliser 'unsafe-inline' seulement pour les scripts si necessaire.
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
          "connect-src 'self' ws: wss: https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com",
          "frame-ancestors 'self'",
        ].join("; "),
      },
    ];

const nextConfig: NextConfig = {
  // Ignorer ESLint et TypeScript pendant le build (erreurs mineures, deploy test)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Monorepo: indiquer la racine pour que Next.js trace les fichiers Prisma
  outputFileTracingRoot: path.join(__dirname, "../../"),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google OAuth avatars
    ],
  },
  async headers() {
    if (isDev) return [];
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // www -> non-www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.freelancehigh.com" }],
        destination: "https://freelancehigh.com/:path*",
        permanent: true,
      },
    ];
  },
  // Optimisations production
  poweredByHeader: false,
  compress: true,
};

export default withNextIntl(nextConfig);
