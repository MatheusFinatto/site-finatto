import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from "@/lib/constants";
import WppIcon from "./WppIcon";

const wppLinks = [
  { label: "Finatto Corretor", numero: WHATSAPP_FINATTO, msg: WPP_MSG_FINATTO },
  { label: "Flávia Engenheira", numero: WHATSAPP_FLAVIA, msg: WPP_MSG_FLAVIA },
];

export default function CTASection() {
  return (
    <section
      className="flex items-center justify-between gap-16 flex-wrap"
      style={{
        padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 60px)",
        background: "var(--fg)",
      }}
    >
      <div>
        <h2
          className="text-bg"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.15,
            maxWidth: 480,
          }}
        >
          Pronto para encontrar seu imóvel?
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--bg)",
            opacity: 0.5,
            marginTop: 12,
          }}
        >
          Fale direto com nossos especialistas.
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-shrink-0">
        {wppLinks.map((b) => (
          <a
            key={b.label}
            href={whatsappLink(b.numero, b.msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--wpp-green)",
              color: "#fff",
              padding: "14px 28px",
              fontSize: 14,
            }}
          >
            <WppIcon size={18} /> {b.label}
          </a>
        ))}
      </div>
    </section>
  );
}
