import { WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import { WPP_MSG_PARCERIA } from "@/lib/constants";
import WppIcon from "./WppIcon";

const bullets = [
  "Estudo de viabilidade",
  "Projeto urbanístico",
  "Regularização completa",
  "Acompanhamento técnico",
];

export default function ParceriaSection() {
  const waLink = whatsappLink(WHATSAPP_FINATTO, WPP_MSG_PARCERIA);

  return (
    <section
      id="loteamentos"
      className="bg-muted border-y border-border"
      style={{ padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 60px)" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p
          className="text-accent uppercase flex items-center justify-center gap-2"
          style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}
        >
          <span className="inline-block bg-accent" style={{ width: 24, height: 1.5 }} />
          Parceria · Loteamentos
        </p>
        <h2
          className="text-fg"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 3vw, 38px)",
            fontWeight: 400,
            marginBottom: 16,
          }}
        >
          Tem uma área? Transformamos em loteamento.
        </h2>
        <p
          className="text-muted-fg mx-auto"
          style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 560, marginBottom: 28 }}
        >
          Fazemos estudo de viabilidade, projeto urbanístico, regularização e
          acompanhamento técnico completo, da ideia à entrega dos lotes.
        </p>

        <div
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3"
          style={{ marginBottom: 36 }}
        >
          {bullets.map((item) => (
            <div key={item} className="flex items-center gap-2 text-muted-fg" style={{ fontSize: 13 }}>
              <span
                className="rounded-full inline-block"
                style={{ width: 6, height: 6, background: "var(--accent)", flexShrink: 0 }}
              />
              {item}
            </div>
          ))}
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium hover:opacity-90 transition-opacity"
          style={{ background: "var(--wpp-green)", color: "#fff", padding: "14px 28px", fontSize: 14 }}
        >
          <WppIcon size={16} /> Falar sobre minha área
        </a>
      </div>
    </section>
  );
}
