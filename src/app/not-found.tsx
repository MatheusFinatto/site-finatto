import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WppIcon from "@/components/WppIcon";
import { WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO } from "@/lib/constants";

const quickLinks = [
  { href: "/#imoveis", label: "Imóveis" },
  { href: "/#loteamentos", label: "Loteamentos" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          padding: "clamp(56px, 10vw, 120px) clamp(24px, 5vw, 60px)",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Decorative oversized 404 — chácara gradient, brand-consistent */}
        <span
          aria-hidden="true"
          className="select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontWeight: 400,
            fontSize: "clamp(160px, 32vw, 360px)",
            lineHeight: 0.82,
            background:
              "linear-gradient(150deg, #2a5010 0%, #3d7020 55%, #285010 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: 0.16,
            letterSpacing: "-0.02em",
          }}
        >
          404
        </span>

        {/* Foreground content, overlapping the big 404 */}
        <div
          className="flex flex-col items-center"
          style={{ marginTop: "clamp(-90px, -14vw, -150px)" }}
        >
          <p
            className="text-accent uppercase flex items-center gap-2"
            style={{ fontSize: 11, letterSpacing: 3, marginBottom: 14 }}
          >
            <span
              className="inline-block bg-accent"
              style={{ width: 24, height: 1.5 }}
            />
            Erro 404
          </p>

          <h1
            className="text-fg"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 16,
              maxWidth: 620,
            }}
          >
            Esta página saiu do{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              mapa
            </em>
            .
          </h1>

          <p
            className="text-muted-fg"
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 460,
              marginBottom: 32,
            }}
          >
            O imóvel ou página que você procura não existe mais ou mudou de
            endereço. Mas temos muitas outras oportunidades em Erechim e região.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
            <Link
              href="/#imoveis"
              className="inline-block bg-fg text-bg font-medium hover:opacity-80 transition-opacity"
              style={{
                padding: "14px 28px",
                fontSize: 13,
                letterSpacing: 1,
              }}
            >
              Ver imóveis
            </Link>
            <Link
              href="/"
              className="inline-block font-medium border border-border text-fg hover:bg-muted transition-colors"
              style={{ padding: "14px 28px", fontSize: 13, letterSpacing: 1 }}
            >
              Voltar ao início
            </Link>
            <a
              href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-opacity"
              style={{
                background: "var(--wpp-green)",
                color: "#fff",
                padding: "14px 28px",
                fontSize: 13,
                letterSpacing: 1,
              }}
            >
              <WppIcon size={16} /> Falar com a equipe
            </a>
          </div>

          {/* Quick links */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            style={{ marginTop: 40 }}
          >
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted-fg hover:text-fg transition-colors uppercase"
                style={{ fontSize: 11, letterSpacing: 2 }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
