import type { CSSProperties } from "react";
import type { TipoImovel } from "@/lib/types";

/**
 * Ícone de cada lote da prancha 404: Phosphor Icons (traço "light", licença
 * MIT), em public/img/lotes/. Usado como máscara para herdar o verde da
 * prancha (e mudar de cor no hover), como o resto do traço técnico.
 */
export type Desenho = TipoImovel | "loteamentos" | "todos";

export default function LoteDesenho({ tipo }: { tipo: Desenho }) {
  return (
    <span
      aria-hidden
      className="lote-desenho"
      style={{ "--icone": `url(/img/lotes/${tipo}.svg)` } as CSSProperties}
    />
  );
}
