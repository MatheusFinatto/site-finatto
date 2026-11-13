import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { tiposPublicadosQuery } from "@/sanity/lib/queries";
import type { TipoImovel } from "@/lib/types";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { ANO_FUNDACAO, TIPO_ORDEM, TIPO_PLURAL } from "@/lib/constants";
import FilterLink from "./FilterLink";
import WppIcon from "./WppIcon";

const empresa = [
  { href: "/#imoveis", label: "Imóveis à venda" },
  { href: "/#loteamentos", label: "Parceria em loteamentos" },
  { href: "/#sobre", label: "Quem somos" },
  { href: "/#contato", label: "Contato" },
];

const linkCls =
  "text-[14.5px] text-white/75 transition-colors hover:text-white hover:underline";

/** Tipos com pelo menos um imóvel publicado, na ordem do catálogo. */
async function tiposComImoveis(): Promise<TipoImovel[]> {
  try {
    const tipos: TipoImovel[] = await client.fetch(tiposPublicadosQuery);
    const presentes = new Set(tipos);
    return TIPO_ORDEM.filter((t) => presentes.has(t));
  } catch {
    return TIPO_ORDEM;
  }
}

export default async function Footer() {
  const tipos = await tiposComImoveis();

  return (
    <footer id="contato" className="mt-16 bg-green-deep text-white md:mt-24">
      <div className="container-x py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-8">
          <div>
            <Image
              src="/img/logo-light.webp"
              alt="Finatto Incorporadora e Engenharia"
              width={160}
              height={40}
              className="logo-light-img h-8 w-auto rounded-md bg-white object-contain p-1"
              unoptimized
            />
            <Image
              src="/img/logo-dark.webp"
              alt="Finatto Incorporadora e Engenharia"
              width={160}
              height={40}
              className="logo-dark-img h-8 w-auto object-contain"
              unoptimized
            />
            <p className="mt-4 max-w-[34ch] text-[14.5px] leading-relaxed text-white/75">
              Incorporadora e engenharia em Erechim, RS, desde {ANO_FUNDACAO}.
              Chácaras, casas, terrenos e pavilhões em Erechim e região.
            </p>
          </div>

          <nav aria-label="Imóveis por tipo">
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white">
              Imóveis
            </p>
            <ul className="mt-3 space-y-2">
              {tipos.map((t) => (
                <li key={t}>
                  <FilterLink params={{ tipo: t }} className={linkCls}>
                    {TIPO_PLURAL[t]}
                  </FilterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresa">
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white">
              Empresa
            </p>
            <ul className="mt-3 space-y-2">
              {empresa.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white">
              Contato
            </p>
            <address className="mt-3 space-y-2 text-[14.5px] not-italic text-white/75">
              <p>
                Rua Sergipe, 1707 · Bela Vista
                <br />
                Erechim, RS
              </p>
              <p>
                <a
                  href={whatsappLink(WHATSAPP_FINATTO)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap py-1.5 hover:text-white hover:underline"
                >
                  <WppIcon size={14} />
                  <span className="tabular whitespace-nowrap">(54) 99163-6937</span> · Finatto
                </a>
              </p>
              <p>
                <a
                  href={whatsappLink(WHATSAPP_FLAVIA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap py-1.5 hover:text-white hover:underline"
                >
                  <WppIcon size={14} />
                  <span className="tabular whitespace-nowrap">(54) 99100-1050</span> · Flávia
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Finatto Incorporadora e Engenharia
            LTDA
          </p>
          <p className="tabular">CRECI/RS 51910 · CREA/RS 242604</p>
        </div>
      </div>
    </footer>
  );
}
