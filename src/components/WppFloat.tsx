"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import WppIcon from "./WppIcon";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from "@/lib/constants";

export default function WppFloat() {
  const pathname = usePathname();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Na homepage aparece após scroll; nas demais páginas sempre visível
  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const visible = !isStudio && (!isHome || scrolled);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, [open]);

  return (
    <div
      ref={ref}
      className="fixed z-50 transition-all duration-300"
      style={{
        bottom: 28,
        right: 24,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {/* Popup menu */}
      {open && (
        <div
          className="absolute flex flex-col gap-2 border border-border bg-card"
          style={{
            bottom: 64,
            right: 0,
            padding: 12,
            minWidth: 220,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <p
            className="text-muted-fg uppercase"
            style={{ fontSize: 10, letterSpacing: 2, marginBottom: 4 }}
          >
            Falar com
          </p>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium hover:opacity-90 transition-opacity"
            style={{
              background: "var(--wpp-green)",
              color: "#fff",
              padding: "11px 16px",
              fontSize: 13,
            }}
          >
            <WppIcon size={15} /> Finatto Corretor
          </a>
          <a
            href={whatsappLink(WHATSAPP_FLAVIA, WPP_MSG_FLAVIA)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium hover:opacity-90 transition-opacity"
            style={{
              color: "var(--wpp-green)",
              padding: "11px 16px",
              fontSize: 13,
              border: "1px solid var(--wpp-green)",
            }}
          >
            <WppIcon size={15} /> Flávia Finatto
          </a>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contato via WhatsApp"
        className="flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          width: 56,
          height: 56,
          background: "var(--wpp-green)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {open ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <WppIcon size={26} />
        )}
      </button>
    </div>
  );
}
