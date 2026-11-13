"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { aplicarNaUrl, rolarParaImoveis } from "@/lib/filtros";

interface Props {
  params: Record<string, string>;
  className?: string;
  children: ReactNode;
}

/**
 * Link para a lista filtrada. Na home aplica os filtros sem recarregar e rola
 * até a lista; em qualquer outra página navega normalmente para `/?...#imoveis`.
 */
export default function FilterLink({ params, className, children }: Props) {
  const pathname = usePathname();
  const sp = new URLSearchParams(params);
  const qs = sp.toString();
  const href = `/${qs ? `?${qs}` : ""}#imoveis`;

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (pathname !== "/") return;
        e.preventDefault();
        aplicarNaUrl(sp, "push");
        rolarParaImoveis();
      }}
    >
      {children}
    </a>
  );
}
