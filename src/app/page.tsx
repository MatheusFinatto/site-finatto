import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { allImoveisQuery } from "@/sanity/lib/queries";
import type { Imovel } from "@/lib/types";
import { TIPO_ORDEM, TIPO_PLURAL } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DestaquesSection from "@/components/DestaquesSection";
import TiposSection, { type TipoResumo } from "@/components/TiposSection";
import ImoveisSection from "@/components/ImoveisSection";
import ImovelCard from "@/components/ImovelCard";
import ParceriaSection from "@/components/ParceriaSection";
import EquipeSection from "@/components/EquipeSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const revalidate = 60; // ISR: revalida a cada 60s

function cidadesPorFrequencia(imoveis: Imovel[]): string[] {
  const cont = new Map<string, number>();
  for (const i of imoveis) {
    if (!i.cidade) continue;
    cont.set(i.cidade, (cont.get(i.cidade) ?? 0) + 1);
  }
  return [...cont.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
    .map(([c]) => c);
}

/** Destaques primeiro, depois oportunidades; sem tag nenhuma, os mais recentes. */
function escolherDestaques(imoveis: Imovel[]): {
  lista: Imovel[];
  recentes: boolean;
} {
  // Vendido não entra em destaque, mesmo com a tag ainda marcada.
  const aVenda = imoveis.filter((i) => i.status !== "vendido");
  const destaque = aVenda.filter((i) => i.tag === "Destaque");
  const oportunidade = aVenda.filter((i) => i.tag === "Oportunidade");
  const lista = [...destaque, ...oportunidade];
  if (lista.length === 0) return { lista: aVenda.slice(0, 6), recentes: true };
  return { lista: lista.slice(0, 8), recentes: false };
}

function resumirTipos(imoveis: Imovel[]): TipoResumo[] {
  return TIPO_ORDEM.map((tipo) => {
    const doTipo = imoveis.filter((i) => i.tipo === tipo);
    const comFoto = doTipo.find((i) => i.fotos?.[0]?.url);
    return {
      tipo,
      label: TIPO_PLURAL[tipo],
      count: doTipo.length,
      fotoUrl: comFoto?.fotos[0].url ?? null,
    };
  }).filter((t) => t.count > 0);
}

/** Foto da maior área aberta do catálogo (terreno ou chácara) para a seção de loteamentos. */
function fotoDeArea(imoveis: Imovel[]): string | null {
  const candidatos = imoveis
    .filter(
      (i) => (i.tipo === "terreno" || i.tipo === "chacara") && i.fotos?.[0]?.url,
    )
    .sort((a, b) => b.area_total - a.area_total);
  return candidatos[0]?.fotos[0].url ?? null;
}

/**
 * Enquanto a grade filtrável (que lê a URL) não hidrata, o HTML já traz os
 * primeiros imóveis como cards reais, sem esqueleto.
 */
// EXPORT_TODOS=1 (só na exportação estática) renderiza todos os cards no HTML inicial.
const LIMITE_INICIAL = process.env.EXPORT_TODOS === "1" ? Infinity : 12;

function GradeInicial({ imoveis }: { imoveis: Imovel[] }) {
  return (
    <section id="imoveis" className="container-x scroll-mt-20 pt-14 md:pt-20">
      <h2 className="text-[clamp(28px,3.2vw,42px)] text-fg">
        Imóveis à venda
      </h2>
      <p className="mt-1 text-[15px] text-muted-fg">
        <span className="tabular font-semibold text-fg">{imoveis.length}</span>{" "}
        {imoveis.length === 1 ? "imóvel" : "imóveis"} em Erechim e região
      </p>
      <ul id="grade-cards" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {imoveis.slice(0, LIMITE_INICIAL).map((imovel) => (
          <li
            key={imovel.id}
            data-tipo={imovel.tipo}
            data-cidade={imovel.cidade}
            data-preco={imovel.preco}
            data-quartos={imovel.quartos ?? ""}
            data-area={imovel.area_total}
            data-areac={imovel.area_construida ?? ""}
            data-criado={imovel.createdAt}
            data-busca={[imovel.titulo, imovel.bairro, imovel.cidade, imovel.logradouro ?? ""].join(" ")}
          >
            <ImovelCard imovel={imovel} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function HomePage() {
  const imoveis: Imovel[] = await client.fetch(allImoveisQuery);
  const cidades = cidadesPorFrequencia(imoveis);
  const tipos = resumirTipos(imoveis);
  const destaques = escolherDestaques(imoveis);

  return (
    <>
      <Navbar />
      <main>
        <Hero cidades={cidades} tipos={tipos} />
        <DestaquesSection
          destaques={destaques.lista}
          recentes={destaques.recentes}
        />
        <TiposSection tipos={tipos} />
        <Suspense fallback={<GradeInicial imoveis={imoveis} />}>
          <ImoveisSection imoveis={imoveis} cidades={cidades} tipos={tipos} />
        </Suspense>
        <ParceriaSection fotoUrl={fotoDeArea(imoveis)} />
        <EquipeSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
