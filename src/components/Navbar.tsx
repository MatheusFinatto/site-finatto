"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import WppIcon from "./WppIcon";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from "@/lib/constants";

interface NavLink {
  href: string;
  label: string;
}
interface WppButton {
  label: string;
  numero: string;
  msg: string;
}

const links: NavLink[] = [
  { href: "#imoveis", label: "Imóveis" },
  { href: "#loteamentos", label: "Loteamentos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

const wppButtons: WppButton[] = [
  { label: "Finatto", numero: WHATSAPP_FINATTO, msg: WPP_MSG_FINATTO },
  { label: "Flávia", numero: WHATSAPP_FLAVIA, msg: WPP_MSG_FLAVIA },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-sm border-b border-border"
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <div style={{ padding: "0 clamp(24px, 5vw, 60px)" }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/img/logo-light.jpeg"
              alt="Finatto"
              width={160}
              height={40}
              className="logo-light-img h-9 w-auto object-contain"
              priority
            />
            <Image
              src="/img/logo-dark.jpeg"
              alt="Finatto"
              width={160}
              height={40}
              className="logo-dark-img h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-fg hover:text-fg transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <ThemeToggle />
            <div className="flex items-center gap-2 border-l border-border pl-4">
              {wppButtons.map((b) => (
                <a
                  key={b.label}
                  href={whatsappLink(b.numero, b.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium hover:opacity-80 transition-opacity"
                  style={{
                    fontSize: 12,
                    color: "var(--wpp-green)",
                    padding: "6px 10px",
                    border: "1px solid var(--wpp-green)",
                    letterSpacing: 0.5,
                  }}
                >
                  <WppIcon size={13} /> {b.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="p-2 text-muted-fg hover:text-fg"
            >
              {open ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-fg hover:text-fg transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-1">
              {wppButtons.map((b) => (
                <a
                  key={b.label}
                  href={whatsappLink(b.numero, b.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 font-medium hover:opacity-80 transition-opacity"
                  style={{
                    fontSize: 12,
                    color: "var(--wpp-green)",
                    padding: "8px 10px",
                    border: "1px solid var(--wpp-green)",
                  }}
                >
                  <WppIcon size={13} /> {b.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
