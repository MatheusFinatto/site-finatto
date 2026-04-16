import { anosDeExperiencia } from "@/lib/constants";

const items = [
  "Chácaras",
  "Terrenos",
  "Casas",
  "Pavilhões",
  "Erechim",
  "Loteamentos",
  "Assessoria Técnica",
  "Finatto Corretor",
  "Engenharia Civil",
  `${anosDeExperiencia()} Anos`,
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-b border-border"
      style={{ background: "#0a0a0a", padding: "14px 0", lineHeight: 0 }}
    >
      <div
        className="inline-flex whitespace-nowrap"
        style={{ animation: "marquee 24s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-10">
            <span
              className="uppercase"
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {item}
            </span>
            <span
              className="rounded-full inline-block"
              style={{
                width: 4,
                height: 4,
                background: "var(--accent)",
                flexShrink: 0,
              }}
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
  );
}
