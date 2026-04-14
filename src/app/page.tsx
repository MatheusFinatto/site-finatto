import imoveis from '@/data/imoveis.json'
import { Imovel } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import NumbersBar from '@/components/NumbersBar'
import ImoveisSection from '@/components/ImoveisSection'
import ParceriaSection from '@/components/ParceriaSection'
import EquipeSection from '@/components/EquipeSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <NumbersBar />
        <ImoveisSection imoveis={imoveis as Imovel[]} />
        <ParceriaSection />
        <EquipeSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
