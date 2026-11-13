import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import WppFloat from "@/components/WppFloat";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  BASE_URL,
  IMOVEIS_ENTREGUES,
  ANO_FUNDACAO,
  anosDeExperiencia,
} from "@/lib/constants";
import { jsonLdSafe } from "@/lib/jsonld";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  name: "Finatto Incorporadora e Engenharia",
  url: BASE_URL,
  foundingDate: String(ANO_FUNDACAO),
  telephone: "+55 54 99163-6937",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Sergipe, 1707",
    addressLocality: "Erechim",
    addressRegion: "RS",
    postalCountry: "BR",
    neighborhood: "Bela Vista",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -27.6339,
    longitude: -52.2744,
  },
  areaServed: "Erechim e região, RS",
  priceRange: "$$",
};

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const description = `Encontre seu imóvel ideal em Erechim e região. Chácaras, casas, terrenos e pavilhões. ${anosDeExperiencia()} anos de mercado, ${IMOVEIS_ENTREGUES} imóveis entregues.`;

export const metadata: Metadata = {
  title: "Finatto Incorporadora e Engenharia | Erechim, RS",
  description,
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Finatto Incorporadora e Engenharia",
    title: "Finatto Incorporadora e Engenharia | Erechim, RS",
    description,
    images: [
      {
        url: "/img/hero-landscape.jpg",
        width: 1600,
        height: 900,
        alt: "Finatto Incorporadora e Engenharia — Erechim, RS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finatto Incorporadora e Engenharia | Erechim, RS",
    description,
    images: ["/img/hero-landscape.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${figtree.variable} ${bricolage.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Apply theme before first paint to avoid flash */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdSafe(businessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        {children}
        <WppFloat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
