"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import WppIcon from "./WppIcon";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from "@/lib/constants";

const links = [
  { href: "/#imoveis", label: "Imóveis" },
  { href: "/#loteamentos", label: "Loteamentos" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
];

interface Props {
  /** Na página do imóvel, a mensagem já leva o nome e o preço dele. */
  mensagem?: string;
}

export default function Navbar({ mensagem }: Props) {
  const [open, setOpen] = useState(false);
  const msgFinatto = mensagem ?? WPP_MSG_FINATTO;
  const msgFlavia = mensagem ?? WPP_MSG_FLAVIA;

  return (
    <header
      className="sticky top-0 z-50 border-b border-border backdrop-blur-md"
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Finatto, página inicial">
          <Image
            src="/img/logo-light.webp"
            alt=""
            width={160}
            height={40}
            className="logo-light-img h-8 w-auto object-contain mix-blend-multiply"
            priority
            unoptimized
          />
          <Image
            src="/img/logo-dark.webp"
            alt=""
            width={160}
            height={40}
            className="logo-dark-img h-8 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[14.5px] font-medium text-muted-fg transition-colors hover:text-fg"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={whatsappLink(WHATSAPP_FINATTO, msgFinatto)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-wpp"
          >
            <WppIcon size={15} /> WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-fg hover:bg-muted"
          >
            {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="menu-mobile"
          className="container-x border-t border-border bg-bg pb-5 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-3.5 text-[16px] font-medium text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={whatsappLink(WHATSAPP_FINATTO, msgFinatto)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wpp"
            >
              <WppIcon size={15} /> Finatto
            </a>
            <a
              href={whatsappLink(WHATSAPP_FLAVIA, msgFlavia)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wpp-outline"
            >
              <WppIcon size={15} /> Flávia
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
