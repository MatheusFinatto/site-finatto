"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { TipoImovel } from "@/lib/types";
import Numero404 from "@/components/Numero404";
import PlantaLoteamento, {
  type LoteTipo,
} from "@/components/PlantaLoteamento";
import WppIcon from "@/components/WppIcon";
import { WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import {
  BASE_URL,
  TIPO_PLURAL,
  WPP_MSG_FINATTO,
  generoTipo,
} from "@/lib/constants";

/** Palavras do slug que indicam o tipo, na ordem em que vencem: o tipo do
 *  imóvel ("casa", "pavilhao") ganha de onde ele fica ("loteamento"). */
const PALAVRAS_TIPO: [TipoImovel, string[]][] = [
  ["apartamento", ["apartamento", "apto"]],
  ["pavilhao", ["pavilhao", "galpao"]],
  ["chacara", ["chacara", "sitio"]],
  ["casa", ["casa", "sobrado"]],
  ["terreno", ["terreno", "lote"]],
];

/** Tipo deduzido do slug ("chacara-bairro-…", "terreno-…"), quando dá. Compara
 *  palavras inteiras: "loteamento" não conta como "lote". */
function tipoDoSlug(slug: string): TipoImovel | null {
  const palavras = new Set(slug.toLowerCase().split(/[^a-z0-9]+/));
  if (palavras.has("area") && palavras.has("rural")) return "chacara";
  for (const [tipo, chaves] of PALAVRAS_TIPO) {
    if (chaves.some((c) => palavras.has(c))) return tipo;
  }
  return null;
}

function decodificar(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    // Link truncado ("%C3" sem o resto): segue com o texto como veio.
    return s;
  }
}

// O caminho vem do navegador. A 404 da raiz é gerada uma vez no servidor,
// sem saber o endereço pedido; no servidor (e na hidratação) fica a versão
// genérica, e o cliente troca pela específica sem divergir do HTML.
const assinarNada = () => () => {};
const caminhoNoCliente = () => window.location.pathname;
const caminhoNoServidor = () => "";

/**
 * Corpo da página 404. Endereço qualquer: "Seu próximo imóvel está em outro
 * endereço." Link de imóvel (/imoveis/<slug>) que não existe mais: "Este
 * imóvel saiu do catálogo.", com o tipo deduzido do slug marcado na prancha,
 * o botão indo direto para a lista desse tipo e o WhatsApp já levando o
 * link. Continua respondendo 404 (o servidor decide; aqui só muda o texto).
 */
export default function Conteudo404({ lotes }: { lotes: LoteTipo[] }) {
  const path = useSyncExternalStore(
    assinarNada,
    caminhoNoCliente,
    caminhoNoServidor,
  );
  const slug = path.startsWith("/imoveis/")
    ? decodificar(path.slice("/imoveis/".length).split("/")[0] ?? "")
    : "";
  const imovel = slug.length > 0;
  const tipo = imovel ? tipoDoSlug(slug) : null;
  const temTipo = !!tipo && lotes.some((l) => l.tipo === tipo && l.count > 0);
  const plural = tipo ? TIPO_PLURAL[tipo] : "";
  // Concordância: "As chácaras … marcadas", "Os terrenos … marcados".
  const feminino = !!tipo && generoTipo(tipo) === "f";

  const titulo = imovel
    ? "Este imóvel saiu do catálogo."
    : "Seu próximo imóvel está em outro endereço.";
  const texto = imovel
    ? `Ele pode ter sido vendido ou retirado pelos sócios. ${
        temTipo
          ? `${feminino ? "As" : "Os"} ${plural.toLowerCase()} à venda agora estão ${feminino ? "marcadas" : "marcados"} em verde.`
          : "Veja os imóveis que estão à venda agora."
      }`
    : "Esta página não existe ou mudou de lugar. Veja os imóveis que estão à venda agora.";

  const hrefLista = temTipo ? `/?tipo=${tipo}#imoveis` : "/#imoveis";
  const rotuloLista = temTipo
    ? `Ver ${plural.toLowerCase()} à venda`
    : "Ver imóveis à venda";
  const msgWpp = imovel
    ? `Olá! Abri o link ${BASE_URL}${path} e o imóvel não aparece mais no site. Ele ainda está à venda? Se não, vocês têm algo parecido?`
    : WPP_MSG_FINATTO;

  return (
    <>
      <div className="rise">
        <Numero404 />
        <h1 className="mt-8 max-w-[13ch] text-balance text-[clamp(40px,5vw,68px)] text-fg">
          {titulo}
        </h1>
        <p className="mt-5 max-w-[44ch] text-pretty text-[clamp(16px,1.3vw,19px)] leading-relaxed text-muted-fg">
          {texto}
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <Link href={hrefLista} className="btn btn-lg btn-wpp">
            {rotuloLista}
          </Link>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, msgWpp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-wpp-outline"
          >
            <WppIcon size={17} />{" "}
            {imovel ? "Perguntar aos sócios" : "Falar com os sócios"}
          </a>
        </div>
      </div>

      <PlantaLoteamento
        lotes={lotes}
        // No link de imóvel, só o slug: o visitante reconhece o próprio link.
        endereco={imovel ? slug : path}
        destaque={temTipo ? tipo : null}
      />
    </>
  );
}
