import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from '@/lib/utils'
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from '@/lib/constants'
import WppIcon from './WppIcon'

export default function CTASection() {
  return (
    <section
      className="flex items-center justify-between gap-16 flex-wrap"
      style={{ padding: 'clamp(48px, 6vw, 80px) clamp(32px, 5vw, 60px)', background: 'var(--fg)' }}
    >
      <div>
        <h2
          className="text-bg"
          style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, lineHeight: 1.15, maxWidth: 480 }}
        >
          Pronto para encontrar seu imóvel?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>
          Fale direto com nossos especialistas.
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-shrink-0">
        <a
          href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-medium transition-opacity hover:opacity-90"
          style={{ background: 'var(--wpp-green)', color: '#fff', padding: '14px 28px', fontSize: 14 }}
        >
          <WppIcon size={18} /> Finatto Corretor
        </a>
        <a
          href={whatsappLink(WHATSAPP_FLAVIA, WPP_MSG_FLAVIA)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-medium transition-opacity hover:opacity-90"
          style={{ background: 'var(--wpp-green)', color: '#fff', padding: '14px 28px', fontSize: 14 }}
        >
          <WppIcon size={18} /> Flávia Engenheira
        </a>
      </div>
    </section>
  )
}
