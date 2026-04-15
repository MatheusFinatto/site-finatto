import Image from "next/image";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import {
  ANO_FUNDACAO,
  IMOVEIS_ENTREGUES,
  WPP_MSG_FINATTO,
  WPP_MSG_FLAVIA,
  anosDeExperiencia,
} from "@/lib/constants";
import WppIcon from "./WppIcon";

export default function Hero() {
  return (
    <section className="hero-grid border-b border-border relative">
      {/* Mobile background photo — hidden on md+ (replaced by right column) */}
      <Image
        src="/img/hero-landscape.jpg"
        alt=""
        fill
        className="object-cover md:hidden"
        style={{ opacity: 0.3 }}
        priority
        aria-hidden
      />

      {/* Left — text */}
      <div
        className="flex flex-col justify-center border-r border-border relative"
        style={{ padding: "clamp(40px, 6vw, 80px) clamp(32px, 5vw, 60px)" }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-6 h-px bg-accent inline-block" />
          <span
            className="text-muted-fg uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Erechim · RS · Desde {ANO_FUNDACAO}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-fg mb-7"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(40px, 4.5vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Encontre seu imóvel{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>ideal</em>{" "}
          em Erechim e região.
        </h1>

        <p
          className="text-muted-fg mb-10"
          style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 420 }}
        >
          {anosDeExperiencia()} anos de mercado. Chácaras, terrenos, casas e
          pavilhões com assessoria técnica especializada.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <a
            href="#imoveis"
            className="inline-block px-9 py-4 bg-fg text-bg font-medium hover:opacity-80 transition-opacity text-center"
            style={{ fontSize: 13, letterSpacing: 1 }}
          >
            Ver imóveis
          </a>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-wpp-btn inline-flex items-center justify-center gap-2 px-7 py-4 font-medium hover:opacity-80 transition-opacity"
            style={{ fontSize: 13, letterSpacing: 1 }}
          >
            <WppIcon size={16} /> Finatto Corretor
          </a>
          <a
            href={whatsappLink(WHATSAPP_FLAVIA, WPP_MSG_FLAVIA)}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-wpp-btn inline-flex items-center justify-center gap-2 px-7 py-4 font-medium hover:opacity-80 transition-opacity"
            style={{ fontSize: 13, letterSpacing: 1 }}
          >
            <WppIcon size={16} /> Flávia Finatto
          </a>
        </div>
      </div>

      {/* Right — landscape photo */}
      <div className="relative overflow-hidden hidden md:block">
        <Image
          src="/img/hero-landscape.jpg"
          alt="Chácara em Erechim e região"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        {/* Subtle dark overlay for contrast */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.25)", zIndex: 1 }}
        />
      </div>
    </section>
  );
}
