"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import type { Imovel } from "@/lib/types";
import sanityLoader from "@/lib/sanityLoader";
import ImovelCard from "@/components/ImovelCard";
import WppIcon from "@/components/WppIcon";
import { WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, wppMsgParecido } from "@/lib/constants";

interface Props {
  imovel: Imovel;
  endereco: string;
  /** Imóveis à venda para seguir em frente (mesmo tipo primeiro). */
  parecidos: Imovel[];
  /** Título da fileira de parecidos ("Outras chácaras à venda", "À venda agora"). */
  tituloParecidos: string;
  hrefParecidos: string;
}

/**
 * Estado "vendido" da página do imóvel. A foto do imóvel com um selo
 * gráfico assumido (não uma placa realista): a marca FINATTO, "VENDE" e a
 * tarja VENDIDO colada por cima. Ao lado, o aviso e a conversa com os
 * sócios como ação principal; logo abaixo, os parecidos à venda e um fecho
 * para quem não achou.
 */
export default function ImovelVendido({
  imovel,
  endereco,
  parecidos,
  tituloParecidos,
  hrefParecidos,
}: Props) {
  const foto = imovel.fotos?.[0];
  const msgParecido = wppMsgParecido(imovel.titulo);
  const temParecidos = parecidos.length > 0;

  return (
    <>
      <section
        aria-labelledby="vendido-titulo"
        className="container-x grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16"
      >
        <div className="vendido-foto relative overflow-hidden rounded-[var(--radius-card)] bg-muted">
          {foto && (
            <Image
              loader={sanityLoader}
              src={foto.url}
              alt={imovel.titulo}
              fill
              preload
              sizes="(max-width: 1023px) 100vw, 720px"
              // Zoom leve ancorado no topo: a borda de baixo, onde fica a
              // marca d'água da câmera ("Galaxy S20 FE"), sai do quadro.
              className="origin-top scale-[1.16] object-cover"
            />
          )}
          {/* Selo da placa, chapado no canto da foto. Decorativo. */}
          <div className="placa" aria-hidden>
            {/* Marca da Finatto vetorizada em branco (logo-light.webp). */}
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG local, sem otimização a fazer */}
            <img
              src="/img/logo-placa.svg"
              alt=""
              width={398}
              height={144}
              className="placa-marca"
            />
            <span className="placa-vende">
              VENDE
              <span className="placa-tarja">VENDIDO</span>
            </span>
          </div>
        </div>

        <div className="rise">
          <h1
            id="vendido-titulo"
            className="text-balance text-[clamp(34px,3.8vw,54px)] text-fg"
          >
            Este imóvel já encontrou um dono.
          </h1>
          <p className="mt-4 text-[clamp(17px,1.4vw,20px)] font-semibold text-fg">
            {imovel.titulo}
          </p>
          <p className="mt-1.5 flex items-start gap-1.5 text-[15px] leading-snug text-muted-fg">
            <MapPin
              size={16}
              strokeWidth={2}
              aria-hidden
              className="mt-0.5 shrink-0 text-green"
            />
            {endereco}
          </p>
          <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-muted-fg">
            {temParecidos
              ? "Mas ainda tem parecidos à venda: separamos alguns logo abaixo. Se nenhum te agradar, conte o que você procura e os sócios respondem pelo WhatsApp."
              : "Conte o que você procura e os sócios respondem pelo WhatsApp."}
          </p>
          <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={whatsappLink(WHATSAPP_FINATTO, msgParecido)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-wpp w-full sm:w-auto"
            >
              <WppIcon size={17} /> Pedir um parecido
            </a>
            <Link
              href={temParecidos ? "#parecidos-titulo" : hrefParecidos}
              className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-green hover:underline"
            >
              {temParecidos ? (
                <>
                  Ver os parecidos{" "}
                  <ArrowDown size={16} strokeWidth={2.5} aria-hidden />
                </>
              ) : (
                <>
                  Ver imóveis à venda{" "}
                  <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
                </>
              )}
            </Link>
          </div>
        </div>
      </section>

      {temParecidos && (
        <section aria-labelledby="parecidos-titulo" className="pt-14 md:pt-20">
          <div className="container-x flex flex-wrap items-end justify-between gap-4">
            <h2
              id="parecidos-titulo"
              className="scroll-mt-24 text-[clamp(26px,3vw,38px)] text-fg"
            >
              {tituloParecidos}
            </h2>
            <Link
              href={hrefParecidos}
              className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-green hover:underline"
            >
              Ver todos à venda{" "}
              <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
          <ul className="scroll-x snap-row mt-4 px-[clamp(16px,4vw,32px)] pb-3 [gap:16px] lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-3 lg:overflow-visible lg:[gap:20px]">
            {parecidos.map((p) => (
              <li key={p.id} className="w-[82%] shrink-0 sm:w-[360px] lg:w-auto">
                <ImovelCard imovel={p} sizes="(max-width: 640px) 82vw, 380px" />
              </li>
            ))}
            <li aria-hidden className="w-px shrink-0 lg:hidden" />
          </ul>
        </section>
      )}

      {/* Fecho: para quem não achou nada nos parecidos. */}
      {temParecidos && (
        <section className="container-x pt-12 pb-6 md:pt-16">
          <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[48ch] text-[clamp(18px,1.6vw,22px)] font-semibold text-fg">
              Não achou?{" "}
              <span className="font-normal text-muted-fg">
                Conte o que você procura: tipo, bairro, tamanho. Os sócios
                respondem pelo WhatsApp.
              </span>
            </p>
            <a
              href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-wpp-outline shrink-0"
            >
              <WppIcon size={17} /> Falar com os sócios
            </a>
          </div>
        </section>
      )}
    </>
  );
}
