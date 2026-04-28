import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Imovel } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import {
  allImovelSlugsQuery,
  imovelBySlugQuery,
} from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import WppIcon from "@/components/WppIcon";
import {
  formatArea,
  formatPreco,
  WHATSAPP_FINATTO,
  WHATSAPP_FLAVIA,
  whatsappLink,
} from "@/lib/utils";
import {
  BASE_URL,
  TIPO_LABEL,
  THUMB_GRADIENT,
  TAG_COLORS,
  wppMsgImovel,
} from "@/lib/constants";
import FotoCarrossel from "@/components/FotoCarrossel";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

const ArrowLeft = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);

// ── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(allImovelSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const imovel: Imovel | null = await client.fetch(imovelBySlugQuery, { slug });
  if (!imovel) return {};
  const title = `${imovel.titulo} em ${imovel.cidade}/RS — Finatto Imóveis`;
  const url = `${BASE_URL}/imoveis/${imovel.slug}`;
  return {
    title,
    description: imovel.descricao,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: "Finatto Imóveis",
      title,
      description: imovel.descricao,
      images: imovel.fotos?.[0]
        ? [{ url: imovel.fotos[0], width: 1200, alt: imovel.titulo }]
        : [{ url: "/img/hero-landscape.jpg", width: 1600, alt: imovel.titulo }],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ImovelPage({ params }: Props) {
  const { slug } = await params;
  const imovel: Imovel | null = await client.fetch(imovelBySlugQuery, { slug });
  if (!imovel) notFound();

  const waMsg = wppMsgImovel(imovel.titulo, formatPreco(imovel.preco));

  const attrs: { label: string; value: string }[] = [
    { label: "Área total", value: formatArea(imovel.area_total) },
    ...(imovel.area_construida != null
      ? [
          {
            label: "Área construída",
            value: formatArea(imovel.area_construida),
          },
        ]
      : []),
    ...(imovel.quartos != null
      ? [{ label: "Quartos", value: String(imovel.quartos) }]
      : []),
    ...(imovel.banheiros != null
      ? [{ label: "Banheiros", value: String(imovel.banheiros) }]
      : []),
    ...(imovel.vagas != null
      ? [{ label: "Vagas", value: String(imovel.vagas) }]
      : []),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Imóveis",
        item: `${BASE_URL}/#imoveis`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: imovel.titulo,
        item: `${BASE_URL}/imoveis/${imovel.slug}`,
      },
    ],
  };

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: imovel.titulo,
    description: imovel.descricao,
    url: `${BASE_URL}/imoveis/${imovel.id}`,
    ...(imovel.fotos?.[0] ? { image: imovel.fotos[0] } : {}),
    offers: {
      "@type": "Offer",
      price: imovel.preco,
      priceCurrency: "BRL",
      availability:
        imovel.status === "disponivel"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: imovel.area_total,
      unitCode: "MTK",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: imovel.cidade,
      addressRegion: "RS",
      addressCountry: "BR",
      ...(imovel.bairro ? { neighborhood: imovel.bairro } : {}),
    },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      <main style={{ background: "var(--bg)" }}>
        {/* Breadcrumb */}
        <div
          className="border-b border-border"
          style={{ padding: "10px clamp(24px, 5vw, 60px)" }}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <BackButton />
            <span className="text-muted-fg" style={{ fontSize: 13 }}>
              /
            </span>
            <span className="text-fg truncate" style={{ fontSize: 13 }}>
              {imovel.titulo}
            </span>
          </div>
        </div>

        {/* Photo hero / carrossel */}
        <div
          className="w-full relative"
          style={{ background: THUMB_GRADIENT[imovel.tipo] }}
        >
          {imovel.fotos?.length > 0 ? (
            <FotoCarrossel fotos={imovel.fotos} alt={imovel.titulo} />
          ) : (
            <div
              className="w-full flex items-center justify-center opacity-10"
              style={{ height: "clamp(280px, 45vw, 560px)" }}
            >
              <span
                className="text-white font-bold"
                style={{
                  fontSize: "clamp(60px, 12vw, 120px)",
                  letterSpacing: 8,
                }}
              >
                {TIPO_LABEL[imovel.tipo].toUpperCase()}
              </span>
            </div>
          )}
          {imovel.tag && (
            <span
              className={`absolute top-5 left-5 px-3 py-1 text-xs font-semibold uppercase z-10 ${TAG_COLORS[imovel.tag] ?? "bg-fg text-bg"}`}
              style={{ letterSpacing: 1 }}
            >
              {imovel.tag}
            </span>
          )}
          <span
            className="absolute top-5 right-16 bg-bg/90 text-fg px-3 py-1 text-xs font-semibold uppercase z-10"
            style={{ letterSpacing: 1 }}
          >
            {TIPO_LABEL[imovel.tipo]}
          </span>
        </div>

        {/* Content grid */}
        <div
          className="max-w-7xl mx-auto detail-grid"
          style={{ padding: "clamp(32px, 5vw, 60px) clamp(24px, 5vw, 60px)" }}
        >
          {/* Left */}
          <div className="flex flex-col gap-8">
            <div>
              <p
                className="text-accent uppercase"
                style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}
              >
                {imovel.cidade}/RS ·{" "}
                {[imovel.bairro, imovel.logradouro].filter(Boolean).join(" · ")}
                {imovel.complemento ? `, ${imovel.complemento}` : ""}
              </p>
              <h1
                className="text-fg"
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                }}
              >
                {imovel.titulo}
              </h1>
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-4 border border-border"
              style={{ gap: 1, background: "var(--border)" }}
            >
              {attrs.map((attr) => (
                <div
                  key={attr.label}
                  className="flex flex-col gap-1 bg-card"
                  style={{ padding: "16px 20px" }}
                >
                  <span
                    className="text-muted-fg uppercase"
                    style={{ fontSize: 10, letterSpacing: 2 }}
                  >
                    {attr.label}
                  </span>
                  <span
                    className="text-fg font-semibold"
                    style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22 }}
                  >
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <h2
                className="text-fg font-semibold mb-3"
                style={{ fontSize: 16 }}
              >
                Descrição
              </h2>
              <p
                className="text-muted-fg"
                style={{
                  fontSize: 16,
                  lineHeight: 1.9,
                  maxWidth: 640,
                  whiteSpace: "pre-wrap",
                }}
              >
                {imovel.descricao}
              </p>
            </div>

            <BackButton size={13} style={{ fontSize: 13, padding: "10px 18px" }} />
          </div>

          {/* Right — sticky price card */}
          <div>
            <div
              className="sticky border border-border bg-card flex flex-col gap-5"
              style={{ top: 88, padding: "28px 24px" }}
            >
              <div>
                <p
                  className="text-muted-fg uppercase"
                  style={{ fontSize: 10, letterSpacing: 2, marginBottom: 6 }}
                >
                  Preço
                </p>
                <p
                  className="text-fg"
                  style={{
                    fontFamily: "var(--font-dm-serif)",
                    fontSize: 36,
                    lineHeight: 1,
                  }}
                >
                  {formatPreco(imovel.preco)}
                </p>
              </div>
              <div className="border-t border-border pt-4 flex flex-col gap-2">
                <p
                  className="text-muted-fg"
                  style={{ fontSize: 12, marginBottom: 4 }}
                >
                  Fale diretamente com a equipe:
                </p>
                <a
                  href={whatsappLink(WHATSAPP_FINATTO, waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90"
                  style={{
                    background: "var(--wpp-green)",
                    color: "#fff",
                    padding: "13px 20px",
                    fontSize: 14,
                  }}
                >
                  <WppIcon size={16} /> Finatto Corretor
                </a>
                <a
                  href={whatsappLink(WHATSAPP_FLAVIA, waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90"
                  style={{
                    color: "var(--wpp-green)",
                    padding: "13px 20px",
                    fontSize: 14,
                    border: "1px solid var(--wpp-green)",
                  }}
                >
                  <WppIcon size={16} /> Flávia Finatto
                </a>
              </div>
              <p className="text-muted-fg text-center" style={{ fontSize: 11 }}>
                CRECI/RS 51910 · CREA/RS 242604
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
