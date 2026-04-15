import {
  ANO_FUNDACAO,
  ANOS_CONSTRUTORA,
  IMOVEIS_ENTREGUES,
  anosDeExperiencia,
} from "@/lib/constants";

interface Stat {
  value: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    value: IMOVEIS_ENTREGUES,
    label: "Imóveis entregues",
    desc: `desde a fundação em ${ANO_FUNDACAO}`,
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
  {
    value: String(anosDeExperiencia()),
    label: "Anos de mercado",
    desc: "em Erechim e região",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="12" strokeWidth="2" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    value: String(ANOS_CONSTRUTORA),
    label: "Anos como construtora",
    desc: "antes de ser incorporadora",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
];

export default function NumbersBar() {
  return (
    <div className="numbers-grid border-b border-border">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-row items-center justify-between border-b md:border-b-0"
          style={{
            padding: "clamp(28px, 4vw, 48px) clamp(20px, 5vw, 60px)",
            borderRight:
              i < stats.length - 1 ? "1px solid var(--border)" : undefined,
          }}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className="text-fg"
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(36px, 4vw, 52px)",
                lineHeight: 1,
              }}
            >
              {s.value}
            </span>
            <span
              className="text-muted-fg uppercase"
              style={{ fontSize: 12, letterSpacing: 1 }}
            >
              {s.label}
            </span>
            <span
              className="text-muted-fg"
              style={{ fontSize: 14, marginTop: 2 }}
            >
              {s.desc}
            </span>
          </div>
          <span className="text-accent" style={{ opacity: 0.35, flexShrink: 0, marginLeft: 24 }}>
            {s.icon}
          </span>
        </div>
      ))}
    </div>
  );
}
