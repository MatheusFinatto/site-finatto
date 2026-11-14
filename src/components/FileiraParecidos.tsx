import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Imovel } from "@/lib/types";
import ImovelCard from "@/components/ImovelCard";

interface Props {
  titulo: string;
  imoveis: Imovel[];
  /** Link "ver todos" ao lado do título. */
  href: string;
  rotuloLink: string;
  className?: string;
}

/**
 * Fileira de imóveis parecidos no fim da página do imóvel (normal e
 * vendido): título com link "ver todos" e os cards, em carrossel no celular
 * e em grade de três no desktop.
 */
export default function FileiraParecidos({
  titulo,
  imoveis,
  href,
  rotuloLink,
  className = "pt-16 md:pt-24",
}: Props) {
  if (imoveis.length === 0) return null;
  return (
    <section aria-labelledby="parecidos-titulo" className={className}>
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <h2
          id="parecidos-titulo"
          className="scroll-mt-24 text-[clamp(26px,3vw,38px)] text-fg"
        >
          {titulo}
        </h2>
        <Link
          href={href}
          className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-green hover:underline"
        >
          {rotuloLink} <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
      <ul className="scroll-x snap-row mt-6 px-[clamp(16px,4vw,32px)] pb-3 [gap:16px] lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-3 lg:overflow-visible lg:[gap:20px]">
        {imoveis.map((p) => (
          <li key={p.id} className="w-[82%] shrink-0 sm:w-[360px] lg:w-auto">
            <ImovelCard imovel={p} sizes="(max-width: 640px) 82vw, 380px" />
          </li>
        ))}
        <li aria-hidden className="w-px shrink-0 lg:hidden" />
      </ul>
    </section>
  );
}
