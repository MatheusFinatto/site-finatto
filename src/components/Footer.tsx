import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from '@/lib/utils'
import { ANO_FUNDACAO, IMOVEIS_ENTREGUES, anosDeExperiencia } from '@/lib/constants'
import WppIcon from './WppIcon'

export default function Footer() {
  return (
    <footer
      id="contato"
      className="border-t border-border bg-muted mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/img/logo-light.jpeg"
              alt="Finatto"
              width={140}
              height={36}
              className="h-8 w-auto object-contain mb-4"
            />
            <p className="text-sm text-muted-fg leading-relaxed max-w-xs">
              {anosDeExperiencia()} anos transformando sonhos em imóveis. Erechim e região.
            </p>
            <p className="text-xs text-muted-fg mt-3">
              Fundada em {ANO_FUNDACAO} · {IMOVEIS_ENTREGUES} imóveis entregues
            </p>
          </div>

          {/* Imóveis */}
          <div>
            <h4 className="font-semibold text-fg text-sm mb-3">Imóveis</h4>
            <ul className="flex flex-col gap-2">
              {['Chácaras', 'Casas', 'Terrenos', 'Pavilhões'].map((tipo) => (
                <li key={tipo}>
                  <Link
                    href="#imoveis"
                    className="text-sm text-muted-fg hover:text-fg transition-colors"
                  >
                    {tipo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-fg text-sm mb-3">Contato</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-fg">
              <li>Erechim, RS</li>
              <li>
                <a
                  href={whatsappLink(WHATSAPP_FINATTO)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-fg transition-colors"
                >
                  <WppIcon size={12} />(54) 99163-6937 · Finatto
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(WHATSAPP_FLAVIA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-fg transition-colors"
                >
                  <WppIcon size={12} />(54) 99100-1050 · Flávia Finatto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-fg">
          <span>© 2025 Finatto Incorporadora e Engenharia LTDA</span>
          <span>CRECI/RS 51910</span>
        </div>
      </div>
    </footer>
  )
}
