import Link from "next/link";
import { Imovel } from "@/lib/types";
import {
  formatArea,
  formatPreco,
  WHATSAPP_FINATTO,
  whatsappLink,
} from "@/lib/utils";
import { TIPO_LABEL, THUMB_GRADIENT, wppMsgImovel } from "@/lib/constants";
import WppIcon from "./WppIcon";

interface Props {
  imovel: Imovel;
}

const ArrowRight = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);

export default function ImovelRow({ imovel }: Props) {
  const detailHref = `/imoveis/${imovel.id}`;
  const waLink = whatsappLink(
    WHATSAPP_FINATTO,
    wppMsgImovel(imovel.titulo, formatPreco(imovel.preco)),
  );

  return (
    <div className="imovel-row group">
      {/* Thumb */}
      <Link
        href={detailHref}
        className="imovel-row-thumb relative overflow-hidden flex-shrink-0 block"
      >
        <div
          className="w-full h-full"
          style={{
            background: THUMB_GRADIENT[imovel.tipo] ?? THUMB_GRADIENT.chacara,
            backgroundImage: imovel.fotos?.[0]
              ? `url(${imovel.fotos[0]})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {imovel.tag && (
          <span
            className="absolute top-2 left-2 bg-fg text-bg uppercase"
            style={{ fontSize: 9, letterSpacing: 1, padding: "3px 7px" }}
          >
            {imovel.tag}
          </span>
        )}
      </Link>

      {/* Info */}
      <Link href={detailHref} className="block no-underline">
        <p
          className="text-accent uppercase"
          style={{ fontSize: 10, letterSpacing: 2, marginBottom: 5 }}
        >
          {TIPO_LABEL[imovel.tipo]} · {imovel.logradouro ?? imovel.bairro}
          {imovel.complemento ? `, ${imovel.complemento}` : ""}
        </p>
        <p
          className="text-fg"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 20,
            marginBottom: 8,
          }}
        >
          {imovel.titulo}
        </p>
        <div
          className="flex flex-wrap gap-3 text-muted-fg"
          style={{ fontSize: 13 }}
        >
          {imovel.quartos != null && <span>{imovel.quartos} quartos</span>}
          {imovel.banheiros != null && (
            <span>{imovel.banheiros} banheiros</span>
          )}
          {imovel.vagas != null && <span>{imovel.vagas} vagas</span>}
        </div>
        <p
          className="md:hidden text-fg"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: 26,
            lineHeight: 1,
            marginTop: 8,
          }}
        >
          {formatPreco(imovel.preco)}
        </p>
      </Link>

      {/* Mobile actions */}
      <div className="md:hidden flex" style={{ gap: 8, marginTop: 4 }}>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 font-medium"
          style={{
            background: "var(--wpp-green)",
            color: "#fff",
            padding: "11px 12px",
            fontSize: 12,
          }}
        >
          <WppIcon size={13} /> Consultar
        </a>
        <Link
          href={detailHref}
          className="flex-1 flex items-center justify-center gap-2 font-medium no-underline"
          style={{
            background: "transparent",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            padding: "11px 12px",
            fontSize: 12,
          }}
        >
          Ver detalhes <ArrowRight size={11} />
        </Link>
      </div>

      {/* Area — desktop */}
      <div className="imovel-row-area text-right" style={{ minWidth: 110 }}>
        <span
          className="text-fg block"
          style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22 }}
        >
          {formatArea(imovel.area_total)}
        </span>
        <span
          className="text-muted-fg uppercase"
          style={{ fontSize: 11, letterSpacing: 1 }}
        >
          área total
        </span>
      </div>

      {/* Price — desktop */}
      <div className="imovel-row-price text-right" style={{ minWidth: 150 }}>
        <span
          className="text-fg block"
          style={{ fontFamily: "var(--font-dm-serif)", fontSize: 30 }}
        >
          {formatPreco(imovel.preco)}
        </span>
      </div>

      {/* Actions — desktop */}
      <div className="imovel-row-arrow" style={{ minWidth: 140 }}>
        <Link
          href={detailHref}
          className="btn-details inline-flex items-center justify-center gap-2 font-medium"
          style={{ fontSize: 12, padding: "9px 16px", whiteSpace: "nowrap" }}
        >
          Ver detalhes <ArrowRight size={13} />
        </Link>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-80"
          style={{
            background: "var(--wpp-green)",
            color: "#fff",
            padding: "9px 16px",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          <WppIcon size={13} /> Consultar
        </a>
      </div>
    </div>
  );
}
