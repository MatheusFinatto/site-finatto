"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Imovel } from "@/lib/types";
import { formatPreco, WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import { TIPO_LABEL, THUMB_GRADIENT, wppMsgImovel } from "@/lib/constants";
import WppIcon from "./WppIcon";

interface Props {
  imovel: Imovel;
}

export default function DestaqueCard({ imovel }: Props) {
  const detailHref = `/imoveis/${imovel.id}`;
  const waLink = whatsappLink(
    WHATSAPP_FINATTO,
    wppMsgImovel(imovel.titulo, formatPreco(imovel.preco)),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const hasFotos = imovel.fotos?.length > 0;

  return (
    <div
      className="flex flex-col group"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Photo area — 65% — clicável para detalhe */}
      <Link
        href={detailHref}
        className="relative flex-shrink-0 block no-underline overflow-hidden"
        style={{ height: "65%" }}
      >
        {hasFotos ? (
          <div ref={emblaRef} className="overflow-hidden w-full h-full">
            <div className="flex h-full">
              {imovel.fotos.map((url, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] min-w-0 h-full relative"
                >
                  <Image
                    src={url}
                    alt={`${imovel.titulo} — foto ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 92vw, 48vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full"
            style={{ background: THUMB_GRADIENT[imovel.tipo] }}
          />
        )}

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "60%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
            zIndex: 1,
          }}
        />

        {/* Price — on image */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ padding: "0 16px 14px", zIndex: 2 }}
        >
          <p
            className="text-white"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(20px, 2.5vw, 26px)",
              lineHeight: 1,
            }}
          >
            {formatPreco(imovel.preco)}
          </p>
        </div>

        {/* Type badge */}
        <span
          className="absolute top-3 left-3 bg-fg text-bg uppercase"
          style={{ fontSize: 9, letterSpacing: 1.5, padding: "3px 8px", zIndex: 2 }}
        >
          {TIPO_LABEL[imovel.tipo]}
        </span>

        {/* Photo dots */}
        {hasFotos && imovel.fotos.length > 1 && (
          <div
            className="absolute top-3 right-3 flex gap-1"
            style={{ zIndex: 2 }}
          >
            {imovel.fotos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(i);
                }}
                aria-label={`Foto ${i + 1}`}
                style={{
                  width: i === current ? 14 : 5,
                  height: 5,
                  background:
                    i === current ? "white" : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Content area — 35% */}
      <div
        className="flex flex-col flex-1 bg-card border-x border-b border-border"
        style={{ padding: "16px 16px 14px" }}
      >
        <p
          className="text-accent uppercase"
          style={{ fontSize: 10, letterSpacing: 2, marginBottom: 5 }}
        >
          {imovel.logradouro ?? imovel.bairro}
          {imovel.complemento ? `, ${imovel.complemento}` : ""}
        </p>

        <Link
          href={detailHref}
          className="text-fg no-underline flex-1"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.25,
            marginBottom: 12,
            display: "block",
          }}
        >
          {imovel.titulo}
        </Link>

        {/* CTAs */}
        <div className="flex gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--wpp-green)",
              color: "#fff",
              padding: "9px 10px",
              fontSize: 11,
            }}
          >
            <WppIcon size={12} /> Falar agora
          </a>
          <Link
            href={detailHref}
            className="flex-1 inline-flex items-center justify-center gap-1.5 font-medium no-underline border border-border text-fg transition-colors hover:bg-muted"
            style={{ padding: "9px 10px", fontSize: 11 }}
          >
            Ver imóvel
          </Link>
        </div>
      </div>
    </div>
  );
}
