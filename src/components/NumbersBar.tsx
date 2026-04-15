import { ANO_FUNDACAO, ANOS_CONSTRUTORA, IMOVEIS_ENTREGUES, anosDeExperiencia } from '@/lib/constants'

interface Stat { value: string; label: string; desc: string }

const stats: Stat[] = [
  { value: IMOVEIS_ENTREGUES,        label: 'Imóveis entregues',    desc: `desde a fundação em ${ANO_FUNDACAO}` },
  { value: String(anosDeExperiencia()), label: 'Anos de mercado',   desc: 'em Erechim e região' },
  { value: String(ANOS_CONSTRUTORA), label: 'Anos como construtora', desc: 'antes de ser incorporadora' },
]

export default function NumbersBar() {
  return (
    <div className="numbers-grid border-b border-border">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-col gap-1.5 border-b md:border-b-0"
          style={{
            padding: 'clamp(28px, 4vw, 48px) clamp(20px, 5vw, 60px)',
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : undefined,
          }}
        >
          <span
            className="text-fg"
            style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 'clamp(36px, 4vw, 52px)', lineHeight: 1 }}
          >
            {s.value}
          </span>
          <span className="text-muted-fg uppercase" style={{ fontSize: 12, letterSpacing: 1 }}>
            {s.label}
          </span>
          <span className="text-muted-fg" style={{ fontSize: 14, marginTop: 2 }}>
            {s.desc}
          </span>
        </div>
      ))}
    </div>
  )
}
