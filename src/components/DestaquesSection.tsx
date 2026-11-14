"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Imovel } from "@/lib/types";
import ImovelCard from "./ImovelCard";
import SetasRolagem from "./SetasRolagem";

interface Props {
  destaques: Imovel[];
  recentes: boolean;
}

/** Fileira rolável com snap nativo; sem biblioteca de carrossel. */
export default function DestaquesSection({ destaques, recentes }: Props) {
  const fileira = useRef<HTMLUListElement>(null);
  if (destaques.length === 0) return null;

  return (
    <section aria-labelledby="destaques-titulo" className="md:pt-24 lg:pt-12">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="destaques-titulo"
            className="text-[clamp(28px,3.2vw,42px)] text-fg"
          >
            Em destaque
          </h2>
          <p className="mt-1.5 text-[15px] text-muted-fg">
            {recentes
              ? "Os imóveis mais recentes."
              : "Destaques e oportunidades escolhidos pelos sócios."}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/#imoveis"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-green hover:underline"
          >
            Ver todos os imóveis <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
          <SetasRolagem alvo={fileira} rotulo="imóveis" emLinha />
        </div>
      </div>

      <ul
        ref={fileira}
        className="scroll-x snap-row fileira-pagina mt-6 pb-3 [gap:16px] md:[gap:20px]"
      >
          {destaques.map((imovel, i) => (
            <li
              key={imovel.id}
              className="w-[82%] shrink-0 sm:w-[360px] lg:w-[380px]"
            >
              <ImovelCard imovel={imovel} priority={i < 3} />
            </li>
          ))}
          <li aria-hidden className="w-px shrink-0" />
      </ul>
    </section>
  );
}
