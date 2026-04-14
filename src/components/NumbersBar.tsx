const stats = [
  { value: '500+', label: 'Imóveis entregues', desc: 'desde a fundação em 2008' },
  { value: '17', label: 'Anos de mercado', desc: 'em Erechim e região' },
  { value: '13', label: 'Anos como construtora', desc: 'antes de ser incorporadora' },
]

export default function NumbersBar() {
  return (
    <div
      className="grid border-b border-border"
      style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-col gap-1.5"
          style={{
            padding: 'clamp(32px, 4vw, 48px) clamp(24px, 5vw, 60px)',
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : undefined,
          }}
        >
          <span
            className="text-fg"
            style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 'clamp(36px, 4vw, 52px)', lineHeight: 1 }}
          >
            {s.value}
          </span>
          <span
            className="text-muted-fg uppercase"
            style={{ fontSize: 12, letterSpacing: 1 }}
          >
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
