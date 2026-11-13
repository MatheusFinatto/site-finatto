"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

interface Props {
  titulo: string;
  /** Texto que acompanha o link (ex.: título e preço). */
  texto: string;
}

/**
 * Manda o link do imóvel para alguém. No celular abre a folha de
 * compartilhamento do aparelho; onde ela não existe, copia o link.
 */
export default function Compartilhar({ titulo, texto }: Props) {
  const [copiado, setCopiado] = useState(false);

  const compartilhar = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
      } catch {
        // A pessoa fechou a folha sem escolher: nada a fazer.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copie o link do imóvel:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={compartilhar}
      className="btn btn-sm btn-ghost shrink-0"
    >
      {copiado ? (
        <Check size={15} strokeWidth={2.25} aria-hidden />
      ) : (
        <Share2 size={15} strokeWidth={2} aria-hidden />
      )}
      <span aria-live="polite">{copiado ? "Link copiado" : "Compartilhar"}</span>
    </button>
  );
}
