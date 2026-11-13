"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Select from "./Select";
import type { TipoResumo } from "./TiposSection";
import type { TipoImovel } from "@/lib/types";
import {
  FILTROS_VAZIOS,
  ORDEM_PADRAO,
  PRECO_MAX_OPTS,
  aplicarNaUrl,
  filtrosFromParams,
  paramsFromFiltros,
  rolarParaImoveis,
} from "@/lib/filtros";

interface Inicial {
  tipo: TipoImovel | "";
  cidade: string;
  max: string;
}

interface Props {
  cidades: string[];
  tipos: TipoResumo[];
  inicial?: Inicial;
}

const VAZIO: Inicial = { tipo: "", cidade: "", max: "" };

/** Busca em pílula (v3). Escreve os filtros na URL e rola até a lista. */
export default function SearchBar({ cidades, tipos, inicial = VAZIO }: Props) {
  const [tipo, setTipo] = useState<TipoImovel | "">(inicial.tipo);
  const [cidade, setCidade] = useState(inicial.cidade);
  const [max, setMax] = useState<string>(inicial.max);

  return (
    <form
      role="search"
      aria-label="Buscar imóveis"
      onSubmit={(e) => {
        e.preventDefault();
        const params = paramsFromFiltros(
          {
            ...FILTROS_VAZIOS,
            tipo,
            cidade,
            precoMax: max ? Number(max) : null,
          },
          ORDEM_PADRAO,
        );
        aplicarNaUrl(params, "push");
        rolarParaImoveis();
      }}
      className="grid grid-cols-1 gap-3 rounded-[24px] bg-card p-4 shadow-float md:grid-cols-[0.9fr_1.1fr_1fr_auto] md:items-center md:gap-0 md:rounded-full md:p-2 md:pl-5"
    >
      <Select
        variant="bare"
        label="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as TipoImovel | "")}
        className="md:border-r md:border-border md:pr-3"
      >
        <option value="">Todos os tipos</option>
        {tipos.map((t) => (
          <option key={t.tipo} value={t.tipo}>
            {t.label}
          </option>
        ))}
      </Select>
      <Select
        variant="bare"
        label="Cidade"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        className="md:border-r md:border-border md:px-3"
      >
        <option value="">Erechim e região</option>
        {cidades.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <Select
        variant="bare"
        label="Preço"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="md:px-3"
      >
        {PRECO_MAX_OPTS.map((o) => (
          <option key={o.label} value={o.value ?? ""}>
            {o.label}
          </option>
        ))}
      </Select>
      <button
        type="submit"
        className="btn btn-lg btn-wpp md:ml-2"
        aria-label="Buscar imóveis"
      >
        <Search size={18} strokeWidth={2.5} />
        <span className="md:hidden">Buscar imóveis</span>
      </button>
    </form>
  );
}

export function SearchBarFromUrl({ cidades, tipos }: Omit<Props, "inicial">) {
  const sp = useSearchParams();
  const chave = sp.toString();
  const { filtros } = filtrosFromParams(new URLSearchParams(chave));
  const maxConhecido = PRECO_MAX_OPTS.some(
    (o) => o.value !== null && o.value === filtros.precoMax,
  );
  const inicial: Inicial = {
    tipo: filtros.tipo,
    cidade: filtros.cidade,
    max: maxConhecido && filtros.precoMax ? String(filtros.precoMax) : "",
  };
  return (
    <SearchBar key={chave} cidades={cidades} tipos={tipos} inicial={inicial} />
  );
}
