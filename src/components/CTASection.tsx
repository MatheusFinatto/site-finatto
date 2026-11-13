import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO, WPP_MSG_FLAVIA } from "@/lib/constants";
import WppIcon from "./WppIcon";

const contatos = [
  { label: "Finatto · Corretor", numero: WHATSAPP_FINATTO, msg: WPP_MSG_FINATTO },
  { label: "Flávia · Engenheira", numero: WHATSAPP_FLAVIA, msg: WPP_MSG_FLAVIA },
];

export default function CTASection() {
  return (
    <section aria-labelledby="cta-titulo" className="container-x pt-16 md:pt-24">
      <div className="rounded-[28px] bg-card px-6 py-12 text-center shadow-card md:px-12 md:py-16">
        <h2 id="cta-titulo" className="mx-auto max-w-[18ch] text-balance text-[clamp(30px,3.8vw,52px)] text-fg">
          Pronto para encontrar seu imóvel?
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[16px] leading-relaxed text-muted-fg">
          Fale direto com os sócios pelo WhatsApp. Sem formulário, sem fila de
          atendimento.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {contatos.map((c) => (
            <a
              key={c.label}
              href={whatsappLink(c.numero, c.msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-wpp"
            >
              <WppIcon size={17} /> {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
