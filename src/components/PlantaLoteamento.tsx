import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { TipoImovel } from "@/lib/types";
import { TIPO_ORDEM, TIPO_PLURAL } from "@/lib/constants";
import LoteDesenho, { type Desenho } from "@/components/LoteDesenho";

export interface LoteTipo {
  tipo: TipoImovel;
  count: number;
}

interface Props {
  lotes: LoteTipo[];
  /** Endereço pedido, escrito no lote 404. */
  endereco?: string;
  /** Tipo do imóvel que saiu do catálogo: o lote dele fica marcado. */
  destaque?: TipoImovel | null;
}

function rotuloContagem(n: number) {
  return `${n} à venda`;
}

interface LoteProps {
  href: string;
  desenho: Desenho;
  nome: string;
  conta: string;
  /** Ordem em que o lote "é plotado" na entrada (--i). */
  ordem: number;
  alto?: boolean;
  marcado?: boolean;
  /** No celular (2 colunas), ocupa a linha inteira. */
  largo?: boolean;
}

/** Um lote clicável da prancha: ícone, nome e contagem, com seta no canto. */
function Lote({
  href,
  desenho,
  nome,
  conta,
  ordem,
  alto = false,
  marcado = false,
  largo = false,
}: LoteProps) {
  const classes = [
    "lote group",
    alto ? "lote-alto" : "lote-baixo",
    marcado && "lote-marcado",
    largo && "lote-largo",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Link
      href={href}
      aria-label={`${nome}: ${conta}`}
      className={classes}
      style={{ "--i": ordem } as CSSProperties}
    >
      <ArrowUpRight
        aria-hidden
        size={18}
        strokeWidth={1.5}
        className="absolute top-3 right-3 text-green opacity-60 transition-opacity group-hover:opacity-100"
      />
      <LoteDesenho tipo={desenho} />
      <span className="lote-nome">{nome}</span>
      <span className="lote-conta tabular">{conta}</span>
    </Link>
  );
}

/**
 * Prancha de loteamento da página 404: cada tipo à venda é um lote, todos da
 * mesma largura, com a quantidade real escrita; o endereço pedido é o lote
 * tracejado "404", que não existe na planta. Cada lote leva à lista filtrada
 * por tipo. Sem dados do Sanity, a prancha continua de pé com o lote 404,
 * Loteamentos e Todos os imóveis.
 */
export default function PlantaLoteamento({
  lotes,
  endereco,
  destaque,
}: Props) {
  const ordenados = TIPO_ORDEM.map((tipo) =>
    lotes.find((l) => l.tipo === tipo),
  ).filter((l): l is LoteTipo => !!l && l.count > 0);
  const total = ordenados.reduce((s, l) => s + l.count, 0);

  // Fileira de cima: os três primeiros tipos, com o lote 404 no meio deles.
  // Fileira de baixo: o resto, mais Loteamentos e Todos os imóveis.
  const cima = ordenados.slice(0, 3);
  const baixo = ordenados.slice(3);
  const posVazio = Math.min(2, cima.length);

  let ordem = 0; // ordem em que a prancha "é plotada"
  const loteTipo = (l: LoteTipo, alto: boolean, largo = false) => (
    <Lote
      key={l.tipo}
      href={`/?tipo=${l.tipo}#imoveis`}
      desenho={l.tipo}
      nome={TIPO_PLURAL[l.tipo]}
      conta={rotuloContagem(l.count)}
      ordem={ordem++}
      alto={alto}
      marcado={destaque === l.tipo}
      largo={largo}
    />
  );

  // No celular (2 colunas), o último lote de uma fileira ímpar ocupa a linha
  // inteira em vez de sobrar sozinho.
  const fileiraCima = cima.map((l, k) =>
    loteTipo(l, true, cima.length % 2 === 1 && k === cima.length - 1),
  );
  fileiraCima.splice(
    posVazio,
    0,
    <div
      key="vazio"
      className="lote lote-alto lote-vazio"
      style={{ "--i": 99 } as CSSProperties}
    >
      <span className="lote-cota" aria-hidden>
        ? m
      </span>
      <span className="lote-404" aria-hidden>
        404
      </span>
      <span className="lote-conta">lote sem registro</span>
      {endereco && endereco !== "/" && (
        <span className="lote-endereco" title={endereco}>
          {endereco}
        </span>
      )}
    </div>,
  );

  const fileiraBaixo = baixo.map((l) => loteTipo(l, false));
  const todosLargo = (fileiraBaixo.length + 2) % 2 === 1;

  return (
    <figure className="prancha" aria-label="Imóveis à venda por tipo">
      <div className="prancha-fileira prancha-cima">{fileiraCima}</div>

      <div className="prancha-rua" aria-hidden>
        <span>Rua sem saída</span>
      </div>

      <div className="prancha-fileira prancha-baixo">
        {fileiraBaixo}
        <Lote
          href="/#loteamentos"
          desenho="loteamentos"
          nome="Loteamentos"
          conta="parcerias da Finatto"
          ordem={ordem++}
        />
        <Lote
          href="/#imoveis"
          desenho="todos"
          nome="Todos os imóveis"
          conta={total > 0 ? rotuloContagem(total) : "lista completa"}
          ordem={ordem++}
          largo={todosLargo}
        />
      </div>
    </figure>
  );
}
