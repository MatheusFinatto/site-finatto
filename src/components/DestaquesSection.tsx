"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Imovel } from "@/lib/types";
import DestaqueCard from "./DestaqueCard";

interface Props {
  destaques: Imovel[];
}

export default function DestaquesSection({ destaques }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [current, setCurrent] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Sub-header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 16 }}
      >
        <p
          className="text-muted-fg uppercase"
          style={{ fontSize: 11, letterSpacing: 3 }}
        >
          Destaques
        </p>

        {destaques.length > 1 && (
          <div className="flex gap-1.5">
            <button
              onClick={scrollPrev}
                aria-label="Anterior"
              className="flex items-center justify-center transition-opacity hover:opacity-60"
              style={{
                width: 30,
                height: 30,
                border: "1px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-fg"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12,19 5,12 12,5" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
                aria-label="Próximo"
              className="flex items-center justify-center transition-opacity hover:opacity-60"
              style={{
                width: 30,
                height: 30,
                border: "1px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-fg"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Carousel — negative margin para estender até a borda da seção */}
      <div
        style={{ margin: "0 calc(-1 * clamp(24px, 5vw, 60px))" }}
      >
        <div ref={emblaRef} className="overflow-hidden">
        <div className="flex" style={{ gap: 12, paddingLeft: "clamp(24px, 5vw, 60px)", paddingRight: "clamp(24px, 5vw, 60px)" }}>
          {destaques.map((imovel) => (
            <div
              key={imovel.id}
              // mobile: 1+peek, md(notebook): 3, lg(desktop): 4
              className="flex-[0_0_88%] md:flex-[0_0_calc(33.333%-8px)] lg:flex-[0_0_calc(25%-9px)]"
              style={{ minWidth: 0, height: "clamp(300px, 28vw, 400px)" }}
            >
              <DestaqueCard imovel={imovel} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {destaques.length > 1 && (
        <div className="flex justify-center gap-2" style={{ marginTop: 14 }}>
          {destaques.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Destaque ${i + 1}`}
              style={{
                width: i === current ? 18 : 6,
                height: 6,
                background: i === current ? "var(--fg)" : "var(--border)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
