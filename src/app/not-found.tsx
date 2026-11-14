import type { Metadata } from "next";
import { connection } from "next/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Conteudo404 from "@/components/Conteudo404";
import type { LoteTipo } from "@/components/PlantaLoteamento";
import { client } from "@/sanity/lib/client";
import { tiposAVendaQuery } from "@/sanity/lib/queries";
import type { TipoImovel } from "@/lib/types";

export const metadata: Metadata = {
  title: "Página não encontrada | Finatto Incorporadora e Engenharia",
};

async function contarPorTipo(): Promise<LoteTipo[]> {
  try {
    const tipos: TipoImovel[] = await client.fetch(
      tiposAVendaQuery,
      {},
      { next: { revalidate: 60 } },
    );
    const cont = new Map<TipoImovel, number>();
    for (const t of tipos) cont.set(t, (cont.get(t) ?? 0) + 1);
    return [...cont].map(([tipo, count]) => ({ tipo, count }));
  } catch {
    // Sem o Sanity a prancha continua de pé, só sem os lotes por tipo.
    return [];
  }
}

export default async function NotFound() {
  // Renderiza por pedido: a 404 da raiz seria gerada uma vez no build, com as
  // contagens congeladas até o próximo deploy. A busca no Sanity tem cache de
  // 60s, como o resto do site.
  await connection();
  const lotes = await contarPorTipo();

  return (
    <>
      <Navbar />
      <main className="container-x grid items-center gap-12 py-12 md:py-16 lg:min-h-[calc(100svh-64px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-10">
        <Conteudo404 lotes={lotes} />
      </main>
      <Footer />
    </>
  );
}
