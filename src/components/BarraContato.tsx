"use client";

import { useEffect, useState } from "react";

interface Props {
  /** id do elemento do preço no topo da página. */
  alvoId: string;
  /** Preço e resumo: só entram quando o preço do topo sai da tela. */
  resumo: React.ReactNode;
  /** Botão de WhatsApp: sempre visível. */
  children: React.ReactNode;
}

/**
 * Barra fixa do celular na página do imóvel. O WhatsApp está sempre à mão;
 * o preço só aparece nela depois que o do topo sai da tela, para não repetir
 * o que já está à vista.
 */
export default function BarraContato({ alvoId, resumo, children }: Props) {
  const [precoNaTela, setPrecoNaTela] = useState(true);

  useEffect(() => {
    const alvo = document.getElementById(alvoId);
    if (!alvo) return;
    const obs = new IntersectionObserver(
      ([e]) => setPrecoNaTela(e.isIntersecting || e.boundingClientRect.top > 0),
      { threshold: 0 },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [alvoId]);

  return (
    <div
      className="sticky bottom-0 z-40 mt-10 border-t border-border bg-card md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-x flex items-center justify-between gap-3 py-2.5">
        {!precoNaTela && <div className="min-w-0">{resumo}</div>}
        <div className={precoNaTela ? "flex-1 [&>a]:w-full" : "shrink-0"}>
          {children}
        </div>
      </div>
    </div>
  );
}
