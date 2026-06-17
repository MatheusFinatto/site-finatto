import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite testar pelo IP da LAN (celular no mesmo WiFi) sem o Next 16
  // bloquear o HMR cross-origin. Só vale em dev; não afeta produção.
  allowedDevOrigins: ["192.168.0.111", "192.168.19.63"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Subconjunto seguro: sem script-src/connect-src (não quebra Studio
            // nem scripts inline de tema/JSON-LD). Cobre clickjacking, injeção
            // de <base>, plugins e destino de formulários.
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src 'self' blob: https://www.openstreetmap.org",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
