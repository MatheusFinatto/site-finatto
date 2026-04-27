import { client } from "@/sanity/lib/client";
import { allImoveisQuery } from "@/sanity/lib/queries";
import type { Imovel } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import NumbersBar from "@/components/NumbersBar";
import ImoveisSection from "@/components/ImoveisSection";
import ParceriaSection from "@/components/ParceriaSection";
import EquipeSection from "@/components/EquipeSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const revalidate = 60; // ISR: revalida a cada 60s

export default async function HomePage() {
  const imoveis: Imovel[] = await client.fetch(allImoveisQuery);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <NumbersBar />
        <ImoveisSection imoveis={imoveis} />
        <ParceriaSection />
        <EquipeSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
