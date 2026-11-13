import { MapPin } from "lucide-react";
import { WHATSAPP_FINATTO, WHATSAPP_FLAVIA, whatsappLink } from "@/lib/utils";
import { ANO_FUNDACAO, ANOS_CONSTRUTORA, IMOVEIS_ENTREGUES } from "@/lib/constants";
import WppIcon from "./WppIcon";

const equipe = [
  {
    iniciais: "F",
    nome: "Finatto",
    cargo: "Corretor de imóveis e sócio",
    registro: "CRECI/RS 51910",
    telefone: "(54) 99163-6937",
    wa: WHATSAPP_FINATTO,
    msg: "Olá, Finatto! Gostaria de mais informações.",
  },
  {
    iniciais: "FF",
    nome: "Flávia Finatto",
    cargo: "Engenheira civil e sócia",
    registro: "CREA/RS 242604",
    telefone: "(54) 99100-1050",
    wa: WHATSAPP_FLAVIA,
    msg: "Olá, Flávia! Gostaria de mais informações.",
  },
];

export default function EquipeSection() {
  return (
    <section id="sobre" aria-labelledby="equipe-titulo" className="container-x scroll-mt-20 pt-16 md:pt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <h2 id="equipe-titulo" className="text-balance text-[clamp(30px,3.6vw,48px)] text-fg">
            Quem vai te atender
          </h2>
          <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed text-muted-fg">
            Uma engenheira civil e um corretor na mesma mesa: cada imóvel passa
            por avaliação técnica antes de ser negociado. A Finatto está em
            Erechim desde {ANO_FUNDACAO}, trabalhou {ANOS_CONSTRUTORA} anos como
            construtora e já entregou mais de {IMOVEIS_ENTREGUES.replace("+", "")}{" "}
            imóveis na região.
          </p>
          <p className="mt-6 inline-flex items-start gap-2 text-[14.5px] text-fg">
            <MapPin size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-green" aria-hidden />
            <span>
              Rua Sergipe, 1707 · Bela Vista
              <br />
              Erechim, RS
            </span>
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {equipe.map((p) => (
            <li key={p.nome} className="card-lift flex flex-col rounded-[var(--radius-card)] bg-card p-6">
              <span
                aria-hidden
                className="display flex h-16 w-16 items-center justify-center rounded-full bg-straw text-[20px] text-fg"
              >
                {p.iniciais}
              </span>
              <p className="mt-4 text-[19px] font-bold text-fg">{p.nome}</p>
              <p className="text-[14px] text-muted-fg">{p.cargo}</p>
              <p className="tabular mt-3 text-[14px] font-semibold text-fg">{p.registro}</p>
              <p className="tabular text-[14px] text-muted-fg">{p.telefone}</p>
              <a
                href={whatsappLink(p.wa, p.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wpp mt-5"
              >
                <WppIcon size={15} /> Chamar no WhatsApp
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
