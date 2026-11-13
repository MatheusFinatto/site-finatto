"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import WppIcon from "./WppIcon";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from "@/lib/constants";

export default function WppFloat() {
  const pathname = usePathname();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
  const isHome = pathname === "/";
  // Na página do imóvel o contato fica no card lateral e na barra fixa, que
  // já levam o nome e o preço; o flutuante mandaria a mensagem genérica.
  const isImovel = pathname.startsWith("/imoveis/");

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Na home aparece depois do primeiro scroll; nas demais páginas sempre.
  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const visible = !isStudio && !isImovel && (!isHome || scrolled);

  useEffect(() => {
    if (!open) return;
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOut);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={`fixed bottom-6 right-5 z-50 transition-all duration-300 md:bottom-7 md:right-7`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Falar no WhatsApp"
          className="absolute bottom-[68px] right-0 flex w-[248px] flex-col gap-2 rounded-[var(--radius-card)] border border-border bg-card p-3 shadow-float"
        >
          <p className="px-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-fg">
            Falar com
          </p>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wpp justify-start"
          >
            <WppIcon size={15} /> Finatto · Corretor
          </a>
          <a
            href={whatsappLink(WHATSAPP_FLAVIA, WPP_MSG_FLAVIA)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wpp-outline justify-start"
          >
            <WppIcon size={15} /> Flávia · Engenheira
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fechar opções de WhatsApp" : "Contato via WhatsApp"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-float transition-transform hover:scale-105 active:scale-95"
        style={{ background: "var(--wpp-green)" }}
      >
        {open ? <X size={22} strokeWidth={2.5} /> : <WppIcon size={26} />}
      </button>
    </div>
  );
}
