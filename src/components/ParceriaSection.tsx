import Image from "next/image";
import { Check } from "lucide-react";
import { WHATSAPP_FINATTO, sanityImg, whatsappLink } from "@/lib/utils";
import { WPP_MSG_PARCERIA } from "@/lib/constants";
import WppIcon from "./WppIcon";

interface Props {
  fotoUrl?: string | null;
}

const etapas = [
  "Estudo de viabilidade da área",
  "Projeto urbanístico",
  "Regularização completa",
  "Acompanhamento técnico até a entrega dos lotes",
];

export default function ParceriaSection({ fotoUrl }: Props) {
  return (
    <section id="loteamentos" aria-labelledby="parceria-titulo" className="container-x scroll-mt-20 pt-16 md:pt-24">
      <div className="grid overflow-hidden rounded-[28px] bg-green-deep text-white md:grid-cols-2">
        <div className="p-8 md:p-12 lg:p-14">
          <h2 id="parceria-titulo" className="text-balance text-[clamp(30px,3.6vw,48px)] text-white">
            Tem uma área? Transformamos em loteamento.
          </h2>
          <p className="mt-4 max-w-[50ch] text-[16px] leading-relaxed text-white/80">
            A Finatto faz parceria com proprietários de área urbana ou rural:
            entra com a engenharia, a documentação e a venda dos lotes, da
            ideia à entrega.
          </p>
          <ul className="mt-6 space-y-2.5">
            {etapas.map((e) => (
              <li key={e} className="flex items-start gap-3 text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                {e}
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_PARCERIA)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-on-green mt-8"
          >
            <WppIcon size={17} /> Falar sobre minha área
          </a>
        </div>
        <div className="relative min-h-[260px] md:min-h-0">
          {fotoUrl ? (
            <Image
              src={sanityImg(fotoUrl, 1200)}
              alt="Área rural à venda em Erechim e região"
              fill
              unoptimized
              sizes="(max-width: 768px) 92vw, 600px"
              className="object-cover"
            />
          ) : (
            <Image
              src="/img/hero-landscape.jpg"
              alt="Campo aberto no interior do Rio Grande do Sul"
              fill
              sizes="(max-width: 768px) 92vw, 600px"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
