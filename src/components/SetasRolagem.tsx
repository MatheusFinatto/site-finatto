"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function comportamento(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

interface Props {
  /** Elemento com rolagem horizontal que as setas controlam. */
  alvo: React.RefObject<HTMLElement | null>;
  /** O que está sendo rolado, no plural: "miniaturas", "imóveis". */
  rotulo: string;
  /** Sobre fundo escuro (visualizador de fotos). */
  escura?: boolean;
  /** Par de setas no fluxo (cabeçalho da seção), em vez de sobre a fileira. */
  emLinha?: boolean;
}

/**
 * Setas de uma fileira com rolagem horizontal, para quem usa mouse. Só
 * aparecem do tablet para cima e só no lado em que ainda há itens escondidos.
 * O pai precisa ser `relative`, exceto com `emLinha`, que desenha o par
 * lado a lado e desabilita a seta do lado que acabou.
 */
export default function SetasRolagem({ alvo, rotulo, escura, emLinha }: Props) {
  const [lados, setLados] = useState({ antes: false, depois: false });

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    const medir = () => {
      const antes = el.scrollLeft > 4;
      const depois = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
      setLados((l) =>
        l.antes === antes && l.depois === depois ? l : { antes, depois },
      );
    };
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    el.addEventListener("scroll", medir, { passive: true });
    return () => {
      obs.disconnect();
      el.removeEventListener("scroll", medir);
    };
  }, [alvo]);

  const rolar = (sentido: 1 | -1) => {
    const el = alvo.current;
    if (!el) return;
    el.scrollBy({
      left: sentido * el.clientWidth * 0.8,
      behavior: comportamento(),
    });
  };

  if (emLinha) {
    return (
      <div className="hidden gap-2 md:flex">
        <button
          type="button"
          onClick={() => rolar(-1)}
          disabled={!lados.antes}
          aria-label={`Ver ${rotulo} anteriores`}
          className="tira-seta tira-seta-linha flex"
        >
          <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => rolar(1)}
          disabled={!lados.depois}
          aria-label={`Ver mais ${rotulo}`}
          className="tira-seta tira-seta-linha flex"
        >
          <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    );
  }

  const classe = `tira-seta hidden md:flex${escura ? " tira-seta-escura" : ""}`;
  const tamanho = 18;

  return (
    <>
      {lados.antes && (
        <button
          type="button"
          onClick={() => rolar(-1)}
          aria-label={`Ver ${rotulo} anteriores`}
          className={`${classe} left-2`}
        >
          <ChevronLeft size={tamanho} strokeWidth={2.25} aria-hidden />
        </button>
      )}
      {lados.depois && (
        <button
          type="button"
          onClick={() => rolar(1)}
          aria-label={`Ver mais ${rotulo}`}
          className={`${classe} right-2`}
        >
          <ChevronRight size={tamanho} strokeWidth={2.25} aria-hidden />
        </button>
      )}
    </>
  );
}
