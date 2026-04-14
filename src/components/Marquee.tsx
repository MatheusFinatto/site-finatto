const items = [
  'Chácaras', 'Terrenos', 'Casas', 'Pavilhões',
  'Erechim', 'Loteamentos', 'Assessoria Técnica',
  'Corretor CRECI 51910', 'Engenharia Civil', '17 Anos',
]

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden border-y border-zinc-800"
      style={{ background: 'var(--fg)', padding: '14px 0' }}
    >
      <div
        className="inline-flex whitespace-nowrap"
        style={{ animation: 'marquee 24s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-10">
            <span
              className="uppercase"
              style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              {item}
            </span>
            <span
              className="rounded-full inline-block"
              style={{ width: 4, height: 4, background: 'var(--accent)', flexShrink: 0 }}
            />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
