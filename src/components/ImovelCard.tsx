"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Bath,
  Car,
  SquareDashed,
  Grid2x2,
  Camera,
  ImageOff,
} from "lucide-react";
import type { Imovel } from "@/lib/types";
import {
  formatArea,
  formatPreco,
  WHATSAPP_FINATTO,
  whatsappLink,
} from "@/lib/utils";
import sanityLoader from "@/lib/sanityLoader";
import {
  STATUS_SELO,
  TAG_BADGE,
  TIPO_LABEL,
  wppMsgImovel,
} from "@/lib/constants";
import WppIcon from "./WppIcon";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

interface Props {
  imovel: Imovel;
  priority?: boolean;
  sizes?: string;
}

export default function ImovelCard({
  imovel,
  priority = false,
  sizes = "(max-width: 640px) 86vw, (max-width: 1024px) 46vw, 380px",
}: Props) {
  const href = `/imoveis/${imovel.slug}`;
  const foto = imovel.fotos?.[0];
  const nFotos = imovel.fotos?.length ?? 0;
  const waLink = whatsappLink(
    WHATSAPP_FINATTO,
    wppMsgImovel(imovel.titulo, formatPreco(imovel.preco), imovel.slug),
  );
  const tipoLabel = TIPO_LABEL[imovel.tipo];
  const mostraTipo = !norm(imovel.titulo).startsWith(norm(tipoLabel));
  const local = [
    mostraTipo ? tipoLabel : null,
    [imovel.bairro, imovel.cidade].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" · ");
  const vendido = imovel.status === "vendido";
  const statusSelo = STATUS_SELO[imovel.status];
  // Com as duas áreas no card, cada uma diz o que é; sozinha, é a do imóvel.
  const duasAreas =
    imovel.area_total > 0 &&
    imovel.area_construida != null &&
    imovel.area_construida > 0;
  const attrs = [
    imovel.quartos != null && {
      I: BedDouble,
      v: imovel.quartos,
      sr: "quartos",
    },
    imovel.banheiros != null && {
      I: Bath,
      v: imovel.banheiros,
      sr: "banheiros",
    },
    imovel.vagas != null && { I: Car, v: imovel.vagas, sr: "vagas" },
    imovel.area_total > 0 && {
      I: SquareDashed,
      v: formatArea(imovel.area_total),
      sr: "área total",
      rot: duasAreas ? "total" : undefined,
    },
    imovel.area_construida != null &&
      imovel.area_construida > 0 && {
        I: Grid2x2,
        v: formatArea(imovel.area_construida),
        sr: "área construída",
        rot: "construída",
      },
  ].filter(Boolean) as {
    I: typeof BedDouble;
    v: string | number;
    sr: string;
    rot?: string;
  }[];

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-card">
      <div className="relative m-2 aspect-[3/2] overflow-hidden rounded-[14px] bg-muted">
        {foto ? (
          <Image
            loader={sanityLoader}
            src={foto.url}
            alt={foto.alt || imovel.titulo}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-fg">
            <ImageOff size={26} strokeWidth={1.5} aria-hidden />
            <span className="text-xs">Fotos em breve</span>
          </div>
        )}
        {(statusSelo || imovel.tag) && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {statusSelo && (
              <span className={`badge ${statusSelo.cls}`}>
                {statusSelo.label}
              </span>
            )}
            {imovel.tag && !vendido && (
              <span className={`badge ${TAG_BADGE[imovel.tag] ?? "badge-ink"}`}>
                {imovel.tag}
              </span>
            )}
          </div>
        )}
        {nFotos > 1 && (
          <span className="badge badge-dark tabular absolute right-3 top-3 gap-1.5">
            <Camera size={12} strokeWidth={2.25} aria-hidden /> {nFotos}
          </span>
        )}
        <span className="badge badge-price tabular absolute bottom-3 left-3">
          {formatPreco(imovel.preco)}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-fg">
          <Link
            href={href}
            // Marca que a página do imóvel foi aberta de dentro do site, para
            // o "Voltar" de lá saber que há uma lista para onde voltar.
            onClick={() => {
              try {
                sessionStorage.setItem("finatto:navegou", href);
              } catch {
                // Navegação privada pode bloquear o armazenamento: segue sem.
              }
            }}
            className="after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {imovel.titulo}
          </Link>
        </h3>
        {local && (
          <p className="mt-1 truncate text-[13px] text-muted-fg">{local}</p>
        )}
        {attrs.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-muted-fg">
            {attrs.map((a) => (
              <li key={a.sr} className="inline-flex items-center gap-1.5">
                <a.I size={15} strokeWidth={1.75} aria-hidden />
                <span className="tabular">{a.v}</span>
                {a.rot ? <span aria-hidden>{a.rot}</span> : null}
                <span className="sr-only"> {a.sr}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4">
          {vendido ? (
            <p className="flex h-[38px] items-center justify-center rounded-full bg-muted text-[13px] font-semibold text-muted-fg max-md:h-[44px]">
              Imóvel vendido
            </p>
          ) : (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-wpp-outline relative z-10 w-full"
              aria-label={`Falar no WhatsApp sobre ${imovel.titulo}`}
            >
              <WppIcon size={14} /> Falar sobre este imóvel
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
