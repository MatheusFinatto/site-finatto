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
    // As fotos do Sanity usam o loader próprio (src/lib/sanityLoader.ts) e não
    // passam pelo otimizador da Vercel. O que sobra aqui são os assets locais
    // de /public/img — poucos, e sempre em slots grandes. Enxugar a lista de
    // larguras corta o número de variantes (= "transformations" cobradas).
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256],
    qualities: [75],
    // Assets locais têm nome fixo; se um deles mudar, renomeie o arquivo para
    // furar o cache (não há como invalidar manualmente).
    minimumCacheTTL: 2678400, // 31 dias
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
