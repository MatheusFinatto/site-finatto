"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Imovel, TipoImovel } from "@/lib/types";
import { WPP_MSG_FINATTO } from "@/lib/constants";
import type { TipoResumo } from "./TiposSection";
import { WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import {
  FILTROS_VAZIOS,
  ORDEM_OPTS,
  ORDEM_PADRAO,
  QUARTOS_OPTS,
  aplicarNaUrl,
  filtrarEOrdenar,
  filtrosFromParams,
  formatPrecoBR,
  paramsFromFiltros,
  parsePrecoInput,
  temFiltroAtivo,
  type Filtros,
  type Ordem,
} from "@/lib/filtros";
import ImovelCard from "./ImovelCard";
import Select from "./Select";
import WppIcon from "./WppIcon";

const PAGINA = 12;

// ── Preço mín/máx: texto local, compromete no blur/Enter ─────────────────────

function PrecoInput({
  valor,
  placeholder,
  label,
  onCommit,
}: {
  valor: number | null;
  placeholder: string;
  label: string;
  onCommit: (n: number | null) => void;
}) {
  const [txt, setTxt] = useState(valor === null ? "" : formatPrecoBR(valor));
  const [ultimo, setUltimo] = useState(valor);
  if (valor !== ultimo) {
    setUltimo(valor);
    setTxt(valor === null ? "" : formatPrecoBR(valor));
  }
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-fg"
      >
        R$
      </span>
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        title={`${label}. Aceita 300000, 300.000 ou 300 mil.`}
        placeholder={placeholder}
        value={txt}
        onChange={(e) => {
          // Só dígitos: já separa o milhar. Com letra ("500 mil"), deixa como está.
          const v = e.target.value;
          const digitos = v.replace(/\D/g, "");
          setTxt(
            /^[\d.\s]*$/.test(v) && digitos
              ? formatPrecoBR(Number(digitos))
              : v,
          );
        }}
        onBlur={(e) => {
          const n = parsePrecoInput(e.target.value);
          setTxt(n === null ? "" : formatPrecoBR(n));
          onCommit(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className="ctl tabular pl-9"
      />
    </label>
  );
}

// ── Seção ────────────────────────────────────────────────────────────────────

interface Props {
  imoveis: Imovel[];
  cidades: string[];
  tipos: TipoResumo[]; // só tipos com imóveis publicados
}

export default function ImoveisSection({ imoveis, cidades, tipos }: Props) {
  const chips: { value: TipoImovel | ""; label: string }[] = [
    { value: "", label: "Todos" },
    ...tipos.map((t) => ({ value: t.tipo, label: t.label })),
  ];
  const sp = useSearchParams();
  const chave = sp.toString();
  const { filtros, ordem } = useMemo(
    () => filtrosFromParams(new URLSearchParams(chave)),
    [chave],
  );

  // Quantidade visível reinicia quando os filtros mudam.
  const [vis, setVis] = useState({ chave, n: PAGINA });
  if (vis.chave !== chave) setVis({ chave, n: PAGINA });

  const aplicar = (patch: Partial<Filtros>, novaOrdem: Ordem = ordem) => {
    aplicarNaUrl(paramsFromFiltros({ ...filtros, ...patch }, novaOrdem));
  };
  const limpar = () =>
    aplicarNaUrl(paramsFromFiltros(FILTROS_VAZIOS, ORDEM_PADRAO));
  // Mínimo maior que o máximo: a pessoa trocou os campos; a faixa é a mesma.
  const aplicarPreco = (patch: Partial<Filtros>) => {
    const f = { ...filtros, ...patch };
    if (f.precoMin !== null && f.precoMax !== null && f.precoMin > f.precoMax) {
      aplicar({ precoMin: f.precoMax, precoMax: f.precoMin });
    } else {
      aplicar(patch);
    }
  };

  // Filtros ligados, para o estado vazio mostrar o que está zerando a lista.
  const ativos: { label: string; tirar: Partial<Filtros> }[] = [
    filtros.q && { label: `"${filtros.q}"`, tirar: { q: "" } },
    filtros.tipo && {
      label: chips.find((c) => c.value === filtros.tipo)?.label ?? filtros.tipo,
      tirar: { tipo: "" as const },
    },
    filtros.cidade && { label: filtros.cidade, tirar: { cidade: "" } },
    filtros.precoMin !== null && {
      label: `A partir de R$ ${formatPrecoBR(filtros.precoMin)}`,
      tirar: { precoMin: null },
    },
    filtros.precoMax !== null && {
      label: `Até R$ ${formatPrecoBR(filtros.precoMax)}`,
      tirar: { precoMax: null },
    },
    filtros.quartos > 0 && {
      label: QUARTOS_OPTS.find((o) => o.value === filtros.quartos)?.label ?? "",
      tirar: { quartos: 0 },
    },
  ].filter(Boolean) as { label: string; tirar: Partial<Filtros> }[];

  const resultado = useMemo(
    () => filtrarEOrdenar(imoveis, filtros, ordem),
    [imoveis, filtros, ordem],
  );
  const ativo = temFiltroAtivo(filtros);

  // Celular: preço, cidade, quartos e ordem ficam atrás de "Filtros e
  // ordenação"; os chips de tipo e a busca por texto seguem à vista. Com algum
  // deles ligado, já vem aberta. Do tablet para cima, tudo sempre visível.
  const nAvancados =
    Number(filtros.precoMin !== null) +
    Number(filtros.precoMax !== null) +
    Number(filtros.cidade !== "") +
    Number(filtros.quartos !== 0) +
    Number(ordem !== ORDEM_PADRAO);
  const [abertaNaMao, setAvancadaAberta] = useState(false);
  // Filtro ligado nunca fica escondido, venha da URL ou da busca do topo.
  const avancadaAberta = abertaNaMao || nAvancados > 0;
  const visiveis = resultado.slice(0, vis.n);
  const restantes = resultado.length - visiveis.length;

  return (
    <section
      id="imoveis"
      aria-labelledby="imoveis-titulo"
      className="container-x scroll-mt-20 pt-14 md:pt-20"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2
            id="imoveis-titulo"
            className="text-[clamp(28px,3.2vw,42px)] text-fg"
          >
            Imóveis à venda
          </h2>
          <p className="mt-1 text-[15px] text-muted-fg" aria-live="polite">
            <span className="tabular font-semibold text-fg">
              {resultado.length}
            </span>{" "}
            {resultado.length === 1 ? "imóvel" : "imóveis"}
            {ativo ? " com os filtros aplicados" : " em Erechim e região"}
          </p>
        </div>
        {ativo && (
          <button
            type="button"
            onClick={limpar}
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-fg hover:underline"
          >
            <X size={15} strokeWidth={2.25} /> Limpar filtros
          </button>
        )}
      </div>

      {/* Tipo */}
      <div
        className="scroll-x -mx-4 mt-6 px-4 md:mx-0 md:flex-wrap md:px-0"
        role="group"
        aria-label="Tipo de imóvel"
      >
        {chips.map((t) => (
          <button
            key={t.value}
            type="button"
            className="chip"
            aria-pressed={filtros.tipo === t.value}
            onClick={() => aplicar({ tipo: t.value })}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Barra de filtros */}
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <label className="relative col-span-2 block md:col-span-1">
          <span className="sr-only">Buscar por título, bairro ou rua</span>
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
          />
          <input
            type="search"
            placeholder="Buscar por título, bairro ou rua"
            value={filtros.q}
            onChange={(e) => aplicar({ q: e.target.value })}
            className="ctl pl-9"
          />
        </label>
        <button
          type="button"
          onClick={() => setAvancadaAberta((a) => !a)}
          aria-expanded={avancadaAberta}
          aria-controls="filtros-ordenacao"
          className="btn btn-ghost col-span-2 rounded-[var(--radius-ctl)] md:hidden"
        >
          <SlidersHorizontal size={16} strokeWidth={2} aria-hidden />
          Filtros e ordenação
          {nAvancados > 0 && (
            <span className="tabular flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1.5 text-[11.5px] font-bold text-white">
              {nAvancados}
            </span>
          )}
          <ChevronDown
            size={16}
            strokeWidth={2.25}
            aria-hidden
            className={`transition-transform ${avancadaAberta ? "rotate-180" : ""}`}
          />
        </button>

        <div
          id="filtros-ordenacao"
          className={`contents ${avancadaAberta ? "" : "max-md:hidden"}`}
        >
          <PrecoInput
            label="Preço mínimo"
            placeholder="Mínimo"
            valor={filtros.precoMin}
            onCommit={(n) => aplicarPreco({ precoMin: n })}
          />
          <PrecoInput
            label="Preço máximo"
            placeholder="Máximo"
            valor={filtros.precoMax}
            onCommit={(n) => aplicarPreco({ precoMax: n })}
          />

          <Select
            label="Cidade"
            value={filtros.cidade}
            onChange={(e) => aplicar({ cidade: e.target.value })}
          >
            <option value="">Erechim e região</option>
            {cidades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            label="Quartos"
            value={filtros.quartos}
            onChange={(e) => aplicar({ quartos: Number(e.target.value) })}
          >
            {QUARTOS_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>

          <Select
            label="Ordenar por"
            className="col-span-2 md:col-span-1"
            value={ordem}
            onChange={(e) => aplicar({}, e.target.value as Ordem)}
          >
            {ORDEM_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Grade */}
      {resultado.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[var(--radius-card)] bg-card px-6 py-16 text-center">
          <SearchX
            size={30}
            strokeWidth={1.5}
            className="text-muted-fg"
            aria-hidden
          />
          <p className="mt-4 text-[17px] font-semibold text-fg">
            Nenhum imóvel com esses filtros.
          </p>
          <p className="mt-1 max-w-[42ch] text-[14.5px] text-muted-fg">
            Tire um dos filtros abaixo para ver mais imóveis. Se quiser, conte o
            que procura e a gente avisa quando entrar algo parecido.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {ativos.map((a) => (
              <li key={a.label}>
                <button
                  type="button"
                  onClick={() => aplicar(a.tirar)}
                  aria-label={`Remover filtro ${a.label}`}
                  className="chip gap-1.5 text-fg"
                >
                  {a.label} <X size={14} strokeWidth={2.25} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={limpar} className="btn btn-ghost">
              Limpar filtros
            </button>
            <a
              href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wpp"
            >
              <WppIcon size={15} /> Contar o que procuro
            </a>
          </div>
        </div>
      ) : (
        <>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {visiveis.map((imovel) => (
              <li key={imovel.id}>
                <ImovelCard imovel={imovel} />
              </li>
            ))}
          </ul>
          {restantes > 0 && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setVis({ chave, n: vis.n + PAGINA })}
                className="btn btn-lg btn-ghost"
              >
                Mostrar mais imóveis
              </button>
              <p className="tabular text-[13px] text-muted-fg">
                Mostrando {visiveis.length} de {resultado.length}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
