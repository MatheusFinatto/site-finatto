import SearchBar from './SearchBar'
import { WHATSAPP_FINATTO, whatsappLink } from '@/lib/utils'

export default function Hero() {
  return (
    <section className="hero-grid border-b border-border">
      {/* Left — text */}
      <div
        className="flex flex-col justify-center px-14 py-20 border-r border-border"
        style={{ padding: 'clamp(40px, 6vw, 80px) clamp(32px, 5vw, 60px)' }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-6 h-px bg-accent inline-block" />
          <span
            className="text-muted-fg uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Erechim · RS · Desde 2008
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-fg mb-7"
          style={{
            fontFamily: 'var(--font-dm-serif)',
            fontSize: 'clamp(40px, 4.5vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Encontre seu imóvel{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>ideal</em>{' '}
          em Erechim e região.
        </h1>

        <p className="text-muted-fg mb-12" style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 420 }}>
          17 anos de mercado. Chácaras, terrenos, casas e pavilhões com
          assessoria técnica especializada.
        </p>

        {/* Busca */}
        <SearchBar />

        {/* Actions */}
        <div className="flex gap-4 mt-8 flex-wrap">
          <a
            href="#imoveis"
            className="inline-block px-9 py-4 bg-fg text-bg font-medium hover:opacity-80 transition-opacity"
            style={{ fontSize: 13, letterSpacing: 1 }}
          >
            Ver imóveis
          </a>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, 'Olá! Gostaria de informações sobre imóveis.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-4 border border-border text-muted-fg hover:border-fg hover:text-fg transition-all"
            style={{ fontSize: 13, letterSpacing: 1 }}
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Right — CSS landscape */}
      <div className="relative overflow-hidden hidden md:block">
        {/* Gradient sky */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #1a3a0e 0%, #2d5a18 30%, #3e7020 55%, #2a5010 75%, #1e3d0c 100%)',
          }}
        />

        {/* Horizon line */}
        <div
          className="absolute"
          style={{
            bottom: '30%',
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(255,255,255,0.08)',
          }}
        />

        {/* Tree silhouettes */}
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: '#0f2008',
            clipPath:
              'polygon(0% 100%, 0% 70%, 6% 50%, 11% 68%, 14% 35%, 18% 58%, 22% 28%, 27% 52%, 31% 20%, 35% 48%, 39% 32%, 43% 55%, 47% 18%, 51% 45%, 55% 30%, 59% 52%, 63% 22%, 67% 48%, 71% 35%, 75% 58%, 79% 28%, 83% 52%, 87% 38%, 91% 60%, 95% 42%, 100% 62%, 100% 100%)',
          }}
        />

        {/* Light overlay from left */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(244,244,244,0.06) 0%, transparent 100%)', zIndex: 2 }}
        />

        {/* Floating stat card */}
        <div
          className="absolute bg-bg"
          style={{ bottom: 40, left: 40, padding: '20px 24px', zIndex: 3, minWidth: 200, borderTop: '3px solid var(--accent)' }}
        >
          <p className="text-muted-fg uppercase" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
            Imóveis entregues
          </p>
          <p className="text-fg" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 44, lineHeight: 1 }}>
            500<span style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 28 }}>+</span>
          </p>
          <p className="text-muted-fg" style={{ fontSize: 12, marginTop: 4 }}>
            17 anos de experiência
          </p>
        </div>
      </div>
    </section>
  )
}
