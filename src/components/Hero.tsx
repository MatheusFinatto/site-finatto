import Image from "next/image";
import { Suspense } from "react";
import SearchBar, { SearchBarFromUrl } from "./SearchBar";
import type { TipoResumo } from "./TiposSection";
import {
  ANO_FUNDACAO,
  ANOS_CONSTRUTORA,
  IMOVEIS_ENTREGUES,
} from "@/lib/constants";

interface Props {
  cidades: string[];
  tipos: TipoResumo[];
}

export default function Hero({ cidades, tipos }: Props) {
  return (
    <section aria-labelledby="hero-titulo" className="relative">
      {/* Celular e tablet: a foto fica ao fundo, sob um véu de papel forte o
          bastante para o texto escuro manter contraste em qualquer ponto dela */}
      <div aria-hidden className="absolute inset-0 overflow-hidden lg:hidden">
        <Image
          src="/img/hero-landscape.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
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
        <div className="grid grid-cols-1 items-center gap-10 lg:min-h-[600px] lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <h1
              id="hero-titulo"
              className="rise max-w-[15ch] text-balance text-[clamp(42px,5.2vw,70px)] text-fg"
            >
              Encontre seu imóvel ideal em{" "}
              <span className="text-green">Erechim e região.</span>
            </h1>
            <p className="rise rise-2 mt-5 max-w-[50ch] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-fg lg:text-muted-fg">
              Chácaras, casas e terrenos com avaliação técnica de engenheira
              civil. Você fala direto com os sócios, pelo WhatsApp.
            </p>
            <div className="rise rise-3 mt-7">
              <Suspense
                fallback={<SearchBar cidades={cidades} tipos={tipos} />}
              >
                <SearchBarFromUrl cidades={cidades} tipos={tipos} />
              </Suspense>
            </div>
            <p className="mt-5 text-[13.5px] text-fg lg:text-muted-fg">
              Em Erechim desde {ANO_FUNDACAO} · {IMOVEIS_ENTREGUES} imóveis
              entregues · {ANOS_CONSTRUTORA} anos como construtora · CRECI/RS
              51910 · CREA/RS 242604
            </p>
          </div>

          {/* Desktop: a foto ocupa a coluna e termina na mesma margem da
              esquerda */}
          <div className="relative hidden self-stretch overflow-hidden rounded-[28px] lg:block">
            <Image
              src="/img/hero-landscape.jpg"
              alt="Campo ao entardecer no interior do Rio Grande do Sul"
              fill
              priority
              sizes="(max-width: 1320px) 48vw, 620px"
              className="object-cover object-[62%_55%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
