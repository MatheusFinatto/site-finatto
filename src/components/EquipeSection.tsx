import Image from 'next/image'
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from '@/lib/utils'
import WppIcon from './WppIcon'

const team = [
  {
    nome: 'Finatto Corretor',
    cargo: 'Corretor de Imóveis',
    info: 'CRECI/RS 51910\n(54) 99163-6937',
    wa: WHATSAPP_FINATTO,
  },
  {
    nome: 'Flávia Finatto',
    cargo: 'Engenheira Civil',
    info: 'CREA/RS 242604\n(54) 99100-1050',
    wa: WHATSAPP_FLAVIA,
  },
]

const waMsg = (nome: string) => `Olá, ${nome}! Gostaria de mais informações.`

export default function EquipeSection() {
  return (
    <section id="sobre" className="border-t border-border">

      {/* Mobile — stacked layout */}
      <div className="md:hidden">
        {/* Photo header */}
        <div className="relative w-full" style={{ height: 220 }}>
          <Image
            src="/img/equipe-landscape.jpg"
            alt="Campo em Erechim e região"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
          <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: '24px 20px' }}>
            <p className="text-white/60 uppercase" style={{ fontSize: 10, letterSpacing: 3, marginBottom: 6 }}>
              Equipe
            </p>
            <h2 className="text-white" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 28, fontWeight: 400 }}>
              Quem vai te atender
            </h2>
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: '24px 20px 0' }}>
          <p className="text-muted-fg" style={{ fontSize: 15, lineHeight: 1.8 }}>
            Atendimento direto com os sócios, sem intermediários. Experiência técnica e conhecimento profundo do mercado local.
          </p>
        </div>

        {/* Team cards — vertical */}
        <div className="flex flex-col" style={{ gap: 1, background: 'var(--border)', margin: '24px 0 0' }}>
          {team.map((p) => (
            <a
              key={p.nome}
              href={whatsappLink(p.wa, waMsg(p.nome))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-card hover:bg-muted transition-colors no-underline"
              style={{ padding: '20px' }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-accent uppercase" style={{ fontSize: 10, letterSpacing: 2 }}>{p.cargo}</p>
                <p className="text-fg" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 20 }}>{p.nome}</p>
                <p className="text-muted-fg" style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{p.info}</p>
              </div>
              <span
                className="inline-flex items-center gap-1.5 font-medium flex-shrink-0 ml-4"
                style={{ color: '#fff', background: 'var(--wpp-green)', fontSize: 12, padding: '10px 14px' }}
              >
                <WppIcon size={13} /> Chamar
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop — split grid */}
      <div className="hidden md:grid" style={{ gridTemplateColumns: '1fr 1fr', minHeight: 560 }}>
        {/* Left — photo */}
        <div className="relative overflow-hidden">
          <Image
            src="/img/equipe-landscape.jpg"
            alt="Campo e natureza em Erechim e região"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
        </div>

        {/* Right — content */}
        <div
          className="flex flex-col justify-center"
          style={{ padding: 'clamp(40px, 5vw, 80px) clamp(32px, 5vw, 60px)', background: 'var(--muted)' }}
        >
          <p className="text-accent uppercase flex items-center gap-2" style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>
            <span className="inline-block bg-accent" style={{ width: 24, height: 1.5 }} />
            Equipe
          </p>
          <h2
            className="text-fg"
            style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400, marginBottom: 16 }}
          >
            Quem vai te atender
          </h2>
          <p className="text-muted-fg" style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 440, marginBottom: 36 }}>
            Atendimento direto com os sócios, sem intermediários. Experiência técnica e conhecimento profundo do mercado local.
          </p>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
            {team.map((p) => (
              <a
                key={p.nome}
                href={whatsappLink(p.wa, waMsg(p.nome))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 bg-card hover:bg-muted transition-colors no-underline"
                style={{ padding: '20px 24px' }}
              >
                <p className="text-accent uppercase" style={{ fontSize: 10, letterSpacing: 2 }}>{p.cargo}</p>
                <p className="text-fg" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 18 }}>{p.nome}</p>
                <p className="text-muted-fg" style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{p.info}</p>
                <span className="inline-flex items-center gap-1 mt-2" style={{ color: 'var(--wpp-green)', fontSize: 11 }}>
                  <WppIcon size={11} /> Enviar mensagem
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
