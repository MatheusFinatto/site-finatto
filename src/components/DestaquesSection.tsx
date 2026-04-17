"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import type { SwiperRef } from "swiper/react";
import { Imovel } from "@/lib/types";
import DestaqueCard from "./DestaqueCard";

interface Props {
  destaques: Imovel[];
}

export default function DestaquesSection({ destaques }: Props) {
  const swiperRef = useRef<SwiperRef>(null);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Sub-header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <p className="text-muted-fg uppercase" style={{ fontSize: 11, letterSpacing: 3 }}>
          Destaques
        </p>

        {destaques.length > 1 && (
          <div className="flex gap-1.5">
            <button
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              aria-label="Anterior"
              className="flex items-center justify-center transition-opacity hover:opacity-60"
              style={{ width: 30, height: 30, border: "1px solid var(--border)", background: "transparent", cursor: "pointer" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12,19 5,12 12,5" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.swiper.slideNext()}
              aria-label="Próximo"
              className="flex items-center justify-center transition-opacity hover:opacity-60"
              style={{ width: 30, height: 30, border: "1px solid var(--border)", background: "transparent", cursor: "pointer" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Skeleton pré-mount */}
      {!mounted && (
        <div className="flex gap-3" style={{ overflow: "hidden" }}>
          {[1, 0.15].map((w, i) => (
            <div key={i} style={{ flex: `0 0 ${w * 82}%`, minWidth: 0 }}>
              <div className="animate-pulse bg-muted" style={{ height: "clamp(180px, 20vw, 260px)" }} />
              <div className="bg-card border-x border-b border-border" style={{ padding: "16px 16px 14px" }}>
                <div className="animate-pulse bg-muted" style={{ height: 10, width: "50%", marginBottom: 8 }} />
                <div className="animate-pulse bg-muted" style={{ height: 18, width: "85%", marginBottom: 12 }} />
                <div className="flex gap-2">
                  <div className="animate-pulse bg-muted flex-1" style={{ height: 34 }} />
                  <div className="animate-pulse bg-muted flex-1" style={{ height: 34 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel */}
      {mounted && <div style={{ margin: "0 calc(-1 * clamp(24px, 5vw, 60px))" }}>
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          loop={destaques.length > 2}
          spaceBetween={12}
          slidesPerView={1.15}
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
          breakpoints={{
            768:  { slidesPerView: 3.15, slidesOffsetBefore: 40, slidesOffsetAfter: 40 },
            1024: { slidesPerView: 4.15, slidesOffsetBefore: 60, slidesOffsetAfter: 60 },
          }}
          onSlideChange={(s) => setCurrent(s.realIndex)}
        >
          {destaques.map((imovel) => (
            <SwiperSlide key={imovel.id}>
              <DestaqueCard imovel={imovel} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>}

      {/* Dots */}
      {destaques.length > 1 && (
        <div className="flex justify-center gap-2" style={{ marginTop: 14 }}>
          {destaques.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.swiper.slideToLoop(i)}
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
  );
}
