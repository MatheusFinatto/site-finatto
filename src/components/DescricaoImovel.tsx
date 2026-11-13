"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** Linha de lista como o cliente digita no Studio: "• item", "- item", "✅ item". */
const MARCADOR = /^\s*(?:[•·▪◦●○✓✔✅☑➤➜→*-]|\p{Extended_Pictographic}️?)\s+/u;
/** Régua feita à mão ("_____", "-----"): vira só um respiro. */
const REGUA = /^\s*[_\-=~*]{3,}\s*$/;

type Bloco = { tipo: "p"; texto: string } | { tipo: "ul"; itens: string[] };

function emBlocos(descricao: string): Bloco[] {
  const blocos: Bloco[] = [];
  let par: string[] = [];
  const fechaPar = () => {
    if (par.length) blocos.push({ tipo: "p", texto: par.join("\n") });
    par = [];
  };
  for (const linha of descricao.split(/\r?\n/)) {
    if (!linha.trim() || REGUA.test(linha)) {
      fechaPar();
      continue;
    }
    if (MARCADOR.test(linha)) {
      fechaPar();
      const item = linha.replace(MARCADOR, "").trim();
      const ultimo = blocos[blocos.length - 1];
      if (ultimo?.tipo === "ul") ultimo.itens.push(item);
      else blocos.push({ tipo: "ul", itens: [item] });
    } else {
      par.push(linha.trim());
    }
  }
  fechaPar();
  return blocos;
}

/** Acima disso a descrição abre recolhida, com "Ler mais". */
const LIMITE = 700;

/**
 * Descrição do imóvel. O texto vem livre do Studio; aqui as linhas com
 * marcador viram lista e textos longos abrem recolhidos, para o contato não
 * ficar a quilômetros de rolagem no celular. O texto inteiro está sempre no
 * HTML (busca e leitor de tela), só a altura muda.
 */
export default function DescricaoImovel({ descricao }: { descricao: string }) {
  const longa = descricao.length > LIMITE;
  const [aberta, setAberta] = useState(false);
  const blocos = emBlocos(descricao);

  return (
    <div className="mt-4 max-w-[68ch]">
      <div
        id="descricao-texto"
        className={`relative space-y-4 text-[16.5px] leading-[1.75] text-fg/85 ${
          longa && !aberta ? "max-h-[21rem] overflow-hidden" : ""
        }`}
      >
        {blocos.map((b, k) =>
          b.tipo === "p" ? (
            <p key={k} className="whitespace-pre-line">
              {b.texto}
            </p>
          ) : (
            <ul
              key={k}
              className="list-disc space-y-1.5 pl-5 marker:text-green"
            >
              {b.itens.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          ),
        )}
        {longa && !aberta && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--bg))",
            }}
          />
        )}
      </div>
      {longa && (
        <button
          type="button"
          onClick={() => {
            // Ao recolher, volta ao início do texto; senão a pessoa fica
            // parada no meio de outra seção, centenas de pixels abaixo.
            if (aberta) {
              document
                .getElementById("sobre-titulo")
                ?.scrollIntoView({ block: "start" });
            }
            setAberta((a) => !a);
          }}
          aria-expanded={aberta}
          aria-controls="descricao-texto"
          className="btn btn-sm btn-ghost mt-3"
        >
          {aberta ? "Mostrar menos" : "Ler descrição completa"}
          <ChevronDown
            size={15}
            strokeWidth={2.25}
            aria-hidden
            className={aberta ? "rotate-180" : ""}
          />
        </button>
      )}
    </div>
  );
}
