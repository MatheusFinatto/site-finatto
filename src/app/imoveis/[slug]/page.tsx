import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Car,
  ChevronRight,
  Grid2x2,
  MapPin,
  SquareDashed,
  type LucideIcon,
} from "lucide-react";
import type { Imovel } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import {
  allImovelSlugsQuery,
  imoveisParecidosQuery,
  imovelBySlugQuery,
} from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import WppIcon from "@/components/WppIcon";
import GaleriaImovel from "@/components/GaleriaImovel";
import ImovelCard from "@/components/ImovelCard";
import ImovelMapa from "@/components/ImovelMapa";
import Compartilhar from "@/components/Compartilhar";
import DescricaoImovel from "@/components/DescricaoImovel";
import BarraContato from "@/components/BarraContato";
import {
  formatArea,
  formatPreco,
  sanityImgCrop,
  WHATSAPP_FINATTO,
  WHATSAPP_FLAVIA,
  whatsappLink,
} from "@/lib/utils";
import {
  BASE_URL,
  STATUS_SELO,
  TAG_BADGE,
  TIPO_LABEL,
  TIPO_PLURAL,
  wppMsgImovel,
  wppMsgParecido,
} from "@/lib/constants";
import { jsonLdSafe } from "@/lib/jsonld";

const SITE_NAME = "Finatto Incorporadora e Engenharia";

/** Resumo para buscador e prévia de link: sem emoji, uma linha, até 160 caracteres. */
function resumoParaMeta(descricao: string): string {
  const limpo = descricao
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, "")
    .replace(/[_=~*]{2,}/g, " ")
    .replace(/\s*[•·▪●]\s*/g, " · ")
    .replace(/^[\s·]+|(?<=:)\s*·/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (limpo.length <= 160) return limpo;
  const corte = limpo.slice(0, 157);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

/** "Outras chácaras", "Outros terrenos": concorda com o gênero do tipo. */
const OUTROS: Record<Imovel["tipo"], string> = {
  chacara: "Outras chácaras",
  casa: "Outras casas",
  apartamento: "Outros apartamentos",
  terreno: "Outros terrenos",
  pavilhao: "Outros pavilhões",
};

const H2 = "text-[clamp(22px,2.2vw,28px)] text-fg";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

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
  const title = `${imovel.titulo} em ${imovel.cidade}/RS | ${SITE_NAME}`;
  const description = resumoParaMeta(imovel.descricao ?? "");
  const url = `${BASE_URL}/imoveis/${imovel.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/imoveis/${imovel.slug}` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: imovel.fotos?.[0]?.url
        ? [
            {
              url: sanityImgCrop(imovel.fotos[0].url, 1200, 630),
              width: 1200,
              height: 630,
              alt: imovel.titulo,
            },
          ]
        : [
            {
              url: "/img/hero-landscape.jpg",
              width: 1600,
              height: 900,
              alt: imovel.titulo,
            },
          ],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ImovelPage({ params }: Props) {
  const { slug } = await params;
  const imovel: Imovel | null = await client.fetch(imovelBySlugQuery, { slug });
  if (!imovel) notFound();

  const preco = formatPreco(imovel.preco);
  const vendido = imovel.status === "vendido";
  const waMsg = vendido
    ? wppMsgParecido(imovel.titulo)
    : wppMsgImovel(imovel.titulo, preco, imovel.slug);
  const tipoLabel = TIPO_LABEL[imovel.tipo];
  const hrefTipo = `/?tipo=${imovel.tipo}#imoveis`;

  const candidatos: Imovel[] = await client.fetch(imoveisParecidosQuery, {
    tipo: imovel.tipo,
    slug: imovel.slug,
  });
  const parecidos = candidatos
    .sort(
      (a, b) =>
        Math.abs(a.preco - imovel.preco) - Math.abs(b.preco - imovel.preco),
    )
    .slice(0, 3);

  const attrs = [
    imovel.area_total > 0 && {
      I: SquareDashed,
      label: "Área total",
      value: formatArea(imovel.area_total),
    },
    imovel.area_construida != null &&
      imovel.area_construida > 0 && {
        I: Grid2x2,
        label: "Área construída",
        value: formatArea(imovel.area_construida),
      },
    imovel.quartos != null && {
      I: BedDouble,
      label: imovel.quartos === 1 ? "Quarto" : "Quartos",
      value: String(imovel.quartos),
    },
    imovel.banheiros != null && {
      I: Bath,
      label: imovel.banheiros === 1 ? "Banheiro" : "Banheiros",
      value: String(imovel.banheiros),
    },
    imovel.vagas != null && {
      I: Car,
      label: imovel.vagas === 1 ? "Vaga" : "Vagas",
      value: String(imovel.vagas),
    },
  ].filter(Boolean) as { I: LucideIcon; label: string; value: string }[];

  const endereco = [
    [imovel.logradouro, imovel.complemento].filter(Boolean).join(", "),
    imovel.bairro,
    `${imovel.cidade}/RS`,
  ]
    .filter(Boolean)
    .join(" · ");

  const resumo = [
    tipoLabel,
    imovel.area_total > 0 ? formatArea(imovel.area_total) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const statusSelo = STATUS_SELO[imovel.status];
  const selos =
    imovel.tag || statusSelo ? (
      <>
        {statusSelo && (
          <span className={`badge ${statusSelo.cls}`}>{statusSelo.label}</span>
        )}
        {imovel.tag && !vendido && (
          <span className={`badge ${TAG_BADGE[imovel.tag] ?? "badge-ink"}`}>
            {imovel.tag}
          </span>
        )}
      </>
    ) : null;

  const contatos = [
    { label: "Finatto · Corretor", numero: WHATSAPP_FINATTO, cls: "btn-wpp" },
    {
      label: "Flávia · Engenheira",
      numero: WHATSAPP_FLAVIA,
      cls: "btn-wpp-outline",
    },
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
    description: resumoParaMeta(imovel.descricao ?? ""),
    url: `${BASE_URL}/imoveis/${imovel.slug}`,
    ...(imovel.fotos?.[0]?.url ? { image: imovel.fotos[0].url } : {}),
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
      <Navbar mensagem={waMsg} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(listingSchema) }}
      />
      <main>
        <div className="container-x flex items-center gap-4 py-3 md:py-4">
          <BackButton />
          <nav aria-label="Você está em" className="hidden min-w-0 md:block">
            <ol className="flex items-center gap-1.5 text-[13.5px] text-muted-fg">
              <li>
                <Link
                  href="/#imoveis"
                  className="hover:text-fg hover:underline"
                >
                  Imóveis
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden className="shrink-0" />
              <li>
                <Link href={hrefTipo} className="hover:text-fg hover:underline">
                  {TIPO_PLURAL[imovel.tipo]}
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden className="shrink-0" />
              <li aria-current="page" className="truncate text-fg">
                {imovel.titulo}
              </li>
            </ol>
          </nav>
          <div className="ml-auto">
            <Compartilhar
              titulo={imovel.titulo}
              texto={`${imovel.titulo} · ${preco}`}
            />
          </div>
        </div>

        <GaleriaImovel
          fotos={imovel.fotos ?? []}
          titulo={imovel.titulo}
          selos={selos}
        />

        <div className="container-x grid gap-10 pt-6 md:grid-cols-[minmax(0,1fr)_340px] md:gap-12 md:pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div className="flex min-w-0 flex-col gap-10 md:gap-12">
            <header className="rise">
              <h1 className="text-balance break-words text-[clamp(28px,3.4vw,44px)] text-fg">
                {imovel.titulo}
              </h1>
              <p className="mt-3 flex items-start gap-1.5 text-[15px] leading-snug text-muted-fg">
                <MapPin
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-green"
                />
                {endereco}
              </p>
              <p
                id="preco-topo"
                className="display tabular mt-5 text-[32px] text-fg md:hidden"
              >
                {preco}
              </p>

              {attrs.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 sm:flex sm:flex-wrap sm:gap-x-10 md:mt-8">
                  {attrs.map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <a.I
                        size={22}
                        strokeWidth={1.6}
                        aria-hidden
                        className="shrink-0 text-green"
                      />
                      <div className="flex flex-col-reverse">
                        <dt className="text-[13px] text-muted-fg">{a.label}</dt>
                        <dd className="tabular text-[18px] font-semibold leading-tight text-fg">
                          {a.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </header>

            {imovel.descricao && (
              <section aria-labelledby="sobre-titulo">
                <h2 id="sobre-titulo" className={`${H2} scroll-mt-20`}>
                  Sobre {imovel.tipo === "terreno" ? "o terreno" : "o imóvel"}
                </h2>
                <DescricaoImovel descricao={imovel.descricao} />
              </section>
            )}

            <ImovelMapa lat={imovel.lat} lng={imovel.lng} />
          </div>

          <aside aria-label="Preço e contato">
            <div className="rounded-[var(--radius-card)] bg-card p-5 shadow-card md:sticky md:top-[88px] md:p-6 md:shadow-float">
              <div className="hidden border-b border-border pb-5 md:block">
                <p className="display tabular text-[36px] text-fg">{preco}</p>
                <p className="mt-2 text-[14px] text-muted-fg">{resumo}</p>
              </div>
              <h2 className="text-[19px] text-fg md:mt-5">
                {vendido ? "Este imóvel foi vendido" : "Fale com os sócios"}
              </h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-fg">
                {vendido
                  ? "Fale com os sócios para ver imóveis parecidos."
                  : "A mensagem já vai com o nome e o preço deste imóvel."}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {contatos.map((c) => (
                  <a
                    key={c.label}
                    href={whatsappLink(c.numero, waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-lg ${c.cls} w-full`}
                  >
                    <WppIcon size={17} /> {c.label}
                  </a>
                ))}
              </div>
              <p className="mt-4 text-center text-[12.5px] text-muted-fg">
                CRECI/RS 51910 · CREA/RS 242604
              </p>
            </div>
          </aside>
        </div>

        {parecidos.length > 0 && (
          <section
            aria-labelledby="parecidos-titulo"
            className="pt-16 md:pt-24"
          >
            <div className="container-x flex flex-wrap items-end justify-between gap-4">
              <h2
                id="parecidos-titulo"
                className="text-[clamp(26px,3vw,38px)] text-fg"
              >
                {OUTROS[imovel.tipo]}
              </h2>
              <Link
                href={hrefTipo}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-green hover:underline"
              >
                Ver{" "}
                {imovel.tipo === "chacara" || imovel.tipo === "casa"
                  ? "todas"
                  : "todos"}{" "}
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
            <ul className="scroll-x snap-row mt-6 px-[clamp(16px,4vw,32px)] pb-3 [gap:16px] lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-3 lg:overflow-visible lg:[gap:20px]">
              {parecidos.map((p) => (
                <li
                  key={p.id}
                  className="w-[82%] shrink-0 sm:w-[360px] lg:w-auto"
                >
                  <ImovelCard
                    imovel={p}
                    sizes="(max-width: 640px) 82vw, 380px"
                  />
                </li>
              ))}
              <li aria-hidden className="w-px shrink-0 lg:hidden" />
            </ul>
          </section>
        )}

        {/* Celular: preço e WhatsApp à mão depois que o preço do topo sai da
            tela; para ao fim do conteúdo, sem cobrir o rodapé. */}
        <BarraContato
          alvoId="preco-topo"
          resumo={
            <>
              <p className="display tabular text-[19px] text-fg">{preco}</p>
              <p className="mt-1 truncate text-[12.5px] text-muted-fg">
                {resumo}
              </p>
            </>
          }
        >
          <a
            href={whatsappLink(WHATSAPP_FINATTO, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wpp"
            aria-label={
              vendido
                ? "Pedir imóveis parecidos no WhatsApp"
                : `Falar no WhatsApp sobre ${imovel.titulo}`
            }
          >
            <WppIcon size={16} />{" "}
            {vendido ? "Ver parecidos" : "Falar no WhatsApp"}
          </a>
        </BarraContato>
      </main>
      <Footer />
    </>
  );
}
