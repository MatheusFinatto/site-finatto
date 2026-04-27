import type { Metadata } from "next";
import { Space_Grotesk, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import WppFloat from "@/components/WppFloat";
import {
  BASE_URL,
  IMOVEIS_ENTREGUES,
  ANO_FUNDACAO,
  anosDeExperiencia,
} from "@/lib/constants";

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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const description = `Encontre seu imóvel ideal em Erechim e região. Chácaras, casas, terrenos e pavilhões. ${anosDeExperiencia()} anos de mercado, ${IMOVEIS_ENTREGUES} imóveis entregues.`;

export const metadata: Metadata = {
  title: "Finatto Incorporadora e Engenharia | Erechim, RS",
  description,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Finatto Imóveis",
    title: "Finatto Incorporadora e Engenharia | Erechim, RS",
    description,
    images: [
      {
        url: "/img/hero-landscape.jpg",
        width: 1600,
        alt: "Finatto Imóveis — Erechim, RS",
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
      className={`${spaceGrotesk.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        {children}
        <WppFloat />
      </body>
    </html>
  );
}
