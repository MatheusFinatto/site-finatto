"use client";

import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import type { TipoImovel } from "@/lib/types";
import FilterLink from "./FilterLink";

export interface TipoResumo {
  tipo: TipoImovel;
  label: string;
  count: number;
  fotoUrl: string | null;
}

interface Props {
  tipos: TipoResumo[];
}

/** Tiles com foto real por tipo (mesma estrutura da v1, no mundo arredondado da v3). */
export default function TiposSection({ tipos }: Props) {
  if (tipos.length === 0) return null;
  const cols =
    tipos.length >= 4
      ? "lg:grid-cols-4"
      : tipos.length === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2";

  return (
    <section aria-labelledby="tipos-titulo" className="container-x pt-14 md:pt-20">
      <h2 id="tipos-titulo" className="text-[clamp(28px,3.2vw,42px)] text-fg">
        O que você procura?
      </h2>
      <p className="mt-1.5 text-[15px] text-muted-fg">
        Imóveis à venda em Erechim e região, por tipo.
      </p>

      <ul className={`mt-6 grid grid-cols-2 gap-3 md:gap-4 ${cols}`}>
        {tipos.map((t) => (
          <li key={t.tipo}>
            <FilterLink
              params={{ tipo: t.tipo }}
              className="card-lift group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-muted"
            >
              {t.fotoUrl && (
                <Image
                  loader={sanityLoader}
                  src={t.fotoUrl}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 46vw, 290px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(27,42,31,0.82) 0%, rgba(27,42,31,0.28) 55%, rgba(27,42,31,0.05) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="display text-[20px] leading-tight text-white md:text-[22px]">
                  {t.label}
                </p>
                <p className="tabular mt-0.5 text-[13px] text-white/85">
                  {t.count} {t.count === 1 ? "imóvel" : "imóveis"}
                </p>
              </div>
            </FilterLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
