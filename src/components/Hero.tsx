import Image, { getImageProps } from "next/image";
import { Suspense, type CSSProperties } from "react";
import { preload } from "react-dom";
import HeroPolaroids from "./HeroPolaroids";
import SearchBar, { SearchBarFromUrl } from "./SearchBar";
import type { TipoResumo } from "./TiposSection";
import {
  ANO_FUNDACAO,
  ANOS_CONSTRUTORA,
  IMOVEIS_ENTREGUES,
} from "@/lib/constants";

// Tamanho das polaroids no desktop: quantos px a pilha passa da altura do
// bloco de texto, em cima e embaixo (0 = mesma altura do texto; negativo =
// menor). A largura acompanha sozinha.
const POLAROID_EXTRA_PX = 50;
// Desloca a pilha na vertical (negativo = sobe), sem mudar o tamanho.
const POLAROID_DESLOCA_Y_PX = -20;

// Quanto a pilha passa do bloco de texto em cima e embaixo, já com o
// deslocamento. Vira padding da grade no desktop: em tela baixa o hero cresce
// em vez de a pilha entrar por baixo do header.
const FOLGA_TOPO_PX = Math.max(0, POLAROID_EXTRA_PX - POLAROID_DESLOCA_Y_PX);
const FOLGA_BASE_PX = Math.max(0, POLAROID_EXTRA_PX + POLAROID_DESLOCA_Y_PX);

const FUNDO_MOBILE = "/img/hero-landscape.jpg";
const FUNDO_MOBILE_SIZES = "100vw";

interface Props {
  cidades: string[];
  tipos: TipoResumo[];
  /** Slugs dos imóveis à venda; polaroid de imóvel fora do ar fica sem link. */
  slugsAtivos: ReadonlySet<string>;
}

export default function Hero({ cidades, tipos, slugsAtivos }: Props) {
  // A foto de fundo só aparece no celular/tablet: pré-carrega só lá (no
  // desktop o LCP é a pilha de polaroids, que tem o próprio preload).
  const { props: fundo } = getImageProps({
    src: FUNDO_MOBILE,
    alt: "",
    fill: true,
    sizes: FUNDO_MOBILE_SIZES,
  });
  preload(fundo.src, {
    as: "image",
    imageSrcSet: fundo.srcSet,
    imageSizes: fundo.sizes,
    fetchPriority: "high",
    media: "(max-width: 1023px)",
  });

  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-x-clip">
      {/* Celular e tablet: a foto fica ao fundo, sob um véu de papel forte o
          bastante para o texto escuro manter contraste em qualquer ponto dela */}
      <div aria-hidden className="absolute inset-0 overflow-hidden lg:hidden">
        <Image
          src={FUNDO_MOBILE}
          alt=""
          fill
          fetchPriority="high"
          sizes={FUNDO_MOBILE_SIZES}
          className="object-cover object-[60%_45%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(244,243,238,0.8) 0%, rgba(244,243,238,0.84) 60%, var(--bg) 100%)",
          }}
        />
      </div>

      <div className="container-x relative pt-10 pb-14 md:pt-14 lg:py-8">
        {/* No desktop o hero ocupa a primeira tela inteira (janela − header de
            4rem − padding vertical de 4rem), com mínimo de 600px. A grade fica
            centralizada nessa caixa; a altura da linha vem só do texto, e a
            pilha (absoluta) acompanha essa altura. */}
        <div className="lg:flex lg:min-h-[max(600px,calc(100svh-8rem))] lg:items-center">
          <div
            className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:pt-(--folga-topo) lg:pb-(--folga-base)"
            style={
              {
                "--folga-topo": `${FOLGA_TOPO_PX}px`,
                "--folga-base": `${FOLGA_BASE_PX}px`,
              } as CSSProperties
            }
          >
            <div className="min-w-0">
              <h1
                id="hero-titulo"
                className="rise max-w-[15ch] text-balance text-[clamp(42px,5.2vw,76px)] text-fg"
              >
                Encontre seu imóvel ideal em{" "}
                <span className="text-green">Erechim e região.</span>
              </h1>
              <p className="rise rise-2 mt-5 max-w-[50ch] lg:mt-8 text-[clamp(16px,1.3vw,21px)] leading-relaxed text-fg lg:text-muted-fg">
                Chácaras, casas e terrenos com avaliação técnica de engenheira
                civil. Você fala direto com os sócios, pelo WhatsApp.
              </p>
              <div className="rise rise-3 mt-7 lg:mt-12">
                <Suspense
                  fallback={<SearchBar cidades={cidades} tipos={tipos} />}
                >
                  <SearchBarFromUrl cidades={cidades} tipos={tipos} />
                </Suspense>
              </div>
              <p className="mt-5 text-[13.5px] lg:mt-10 text-fg lg:text-muted-fg">
                Em Erechim desde {ANO_FUNDACAO} · {IMOVEIS_ENTREGUES} imóveis
                entregues · {ANOS_CONSTRUTORA} anos como construtora · CRECI/RS
                51910 · CREA/RS 242604
              </p>
            </div>

            {/* Desktop: pilha de polaroids animada em CSS (HeroPolaroids), com a
              altura do bloco de texto + POLAROID_EXTRA_PX. A foto do topo voa
              para cima/direita e passa por baixo do header; a section corta o
              excesso na horizontal. isolate: os z-index das polaroids ficam
              presos aqui dentro. [container-type:size] deixa a pilha medir
              largura e altura disponíveis (cqw/cqh). */}
            <div className="relative isolate hidden lg:block">
              <div
                className="absolute inset-x-0 flex items-center justify-end [container-type:size]"
                style={{
                  top: -POLAROID_EXTRA_PX + POLAROID_DESLOCA_Y_PX,
                  bottom: -POLAROID_EXTRA_PX - POLAROID_DESLOCA_Y_PX,
                }}
              >
                <HeroPolaroids slugsAtivos={slugsAtivos} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
