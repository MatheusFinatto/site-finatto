"use client";

import { useState, useMemo } from "react";
import { Imovel, TipoImovel } from "@/lib/types";
import { TIPO_TABS } from "@/lib/constants";
import ImovelRow from "./ImovelRow";
import FilterSelect from "./FilterSelect";

// ── Types ────────────────────────────────────────────────────────────────────

interface Filtros {
  busca: string;
  tipo: TipoImovel | "";
  precoMax: number; // 0 = sem limite
  quartos: number; // 0 = qualquer
}

type Ordem =
  | "mais-novos"
  | "mais-antigos"
  | "preco-asc"
  | "preco-desc"
  | "area-desc";

// ── Options ──────────────────────────────────────────────────────────────────

const PRECO_OPTS = [
  { label: "Qualquer preço", value: 0 },
  { label: "Até R$ 100 mil", value: 100_000 },
  { label: "Até R$ 300 mil", value: 300_000 },
  { label: "Até R$ 500 mil", value: 500_000 },
  { label: "Até R$ 800 mil", value: 800_000 },
  { label: "Acima de R$ 800 mil", value: -800_000 }, // valor negativo = filtro "acima de"
];

const QUARTOS_OPTS = [
  { label: "Qualquer", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const ORDEM_OPTS: { label: string; value: Ordem }[] = [
  { label: "Mais novos", value: "mais-novos" },
  { label: "Mais antigos", value: "mais-antigos" },
  { label: "Menor preço", value: "preco-asc" },
  { label: "Maior preço", value: "preco-desc" },
  { label: "Maior área", value: "area-desc" },
];

const FILTROS_INICIAIS: Filtros = {
  busca: "",
  tipo: "",
  precoMax: 0,
  quartos: 0,
};

// ── Logic ────────────────────────────────────────────────────────────────────

function filtrarEOrdenar(
  imoveis: Imovel[],
  f: Filtros,
  ordem: Ordem,
): Imovel[] {
  let lista = imoveis.filter((i) => {
    if (f.busca && !i.titulo.toLowerCase().includes(f.busca.toLowerCase()))
      return false;
    if (f.tipo && i.tipo !== f.tipo) return false;
    if (f.precoMax > 0 && i.preco > f.precoMax) return false;
    if (f.precoMax < 0 && i.preco <= Math.abs(f.precoMax)) return false;
    if (f.quartos === 4 && (i.quartos ?? 0) < 4) return false;
    if (f.quartos > 0 && f.quartos < 4 && i.quartos !== f.quartos) return false;
    return true;
  });

  // JSON order = cadastro order; id é string numérica crescente
  if (ordem === "mais-novos")
    lista = [...lista].sort((a, b) => Number(b.id) - Number(a.id));
  if (ordem === "mais-antigos")
    lista = [...lista].sort((a, b) => Number(a.id) - Number(b.id));
  if (ordem === "preco-asc")
    lista = [...lista].sort((a, b) => a.preco - b.preco);
  if (ordem === "preco-desc")
    lista = [...lista].sort((a, b) => b.preco - a.preco);
  if (ordem === "area-desc")
    lista = [...lista].sort((a, b) => b.area_total - a.area_total);

  return lista;
}

function temFiltroAtivo(f: Filtros) {
  return f.busca !== "" || f.tipo !== "" || f.precoMax !== 0 || f.quartos !== 0;
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  imoveis: Imovel[];
}

export default function ImoveisSection({ imoveis }: Props) {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const [ordem, setOrdem] = useState<Ordem>("mais-novos");
  const [filtroPanelOpen, setFiltroPanelOpen] = useState(false);

  const set = <K extends keyof Filtros>(key: K, value: Filtros[K]) =>
    setFiltros((f) => ({ ...f, [key]: value }));

  const filtrados = useMemo(
    () => filtrarEOrdenar(imoveis, filtros, ordem),
    [imoveis, filtros, ordem],
  );

  const ativo = temFiltroAtivo(filtros);

  return (
    <section
      id="imoveis"
      style={{ padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 60px)" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p
          className="text-accent uppercase flex items-center gap-2"
          style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}
        >
          <span
            className="inline-block bg-accent"
            style={{ width: 24, height: 1.5 }}
          />
          Portfólio
        </p>
        <h2
          className="text-fg"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(28px, 3vw, 38px)",
            fontWeight: 400,
          }}
        >
          Imóveis disponíveis
        </h2>
      </div>

      {/* ── Desktop filters ── */}
      <div
        className="hidden md:block border border-border"
        style={{ marginBottom: 0 }}
      >
        {/* Row 1: search + sort */}
        <div className="flex items-stretch border-b border-border">
          {/* Search */}
          <div
            className="flex items-center flex-1 gap-3"
            style={{ padding: "0 16px" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-fg flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={filtros.busca}
              onChange={(e) => set("busca", e.target.value)}
              className="flex-1 bg-transparent text-fg placeholder:text-muted-fg outline-none"
              style={{ fontSize: 13, padding: "14px 0" }}
            />
            {filtros.busca && (
              <button
                onClick={() => set("busca", "")}
                className="text-muted-fg hover:text-fg"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ×
              </button>
            )}
          </div>
          {/* Divider */}
          <div style={{ width: 1, background: "var(--border)" }} />
          {/* Sort */}
          <div className="flex items-center" style={{ padding: "0 16px" }}>
            <FilterSelect<Ordem>
              label="Ordenar"
              options={ORDEM_OPTS}
              value={ordem}
              onChange={setOrdem}
            />
          </div>
        </div>

        {/* Row 2: tipo + preço + quartos */}
        <div
          className="flex items-center gap-0 flex-wrap"
          style={{ background: "var(--muted)" }}
        >
          {/* Tipo */}
          <div
            className="flex items-center border-r border-border"
            style={{ padding: "0 4px" }}
          >
            {TIPO_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => set("tipo", t.value)}
                className="font-medium uppercase transition-all"
                style={{
                  padding: "9px 14px",
                  fontSize: 11,
                  letterSpacing: 1,
                  color:
                    filtros.tipo === t.value ? "var(--fg)" : "var(--muted-fg)",
                  background:
                    filtros.tipo === t.value ? "var(--card)" : "transparent",
                  boxShadow:
                    filtros.tipo === t.value
                      ? "0 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Preço */}
          <div
            className="flex items-center border-r border-border"
            style={{ padding: "10px 16px" }}
          >
            <FilterSelect<number>
              label="Preço"
              options={PRECO_OPTS}
              value={filtros.precoMax}
              onChange={(v) => set("precoMax", v)}
            />
          </div>

          {/* Quartos */}
          <div
            className="flex items-center gap-2"
            style={{ padding: "10px 16px" }}
          >
            <span
              className="text-muted-fg uppercase"
              style={{ fontSize: 11, letterSpacing: 1 }}
            >
              Quartos
            </span>
            <div className="flex">
              {QUARTOS_OPTS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set("quartos", o.value)}
                  className="font-medium transition-colors"
                  style={{
                    padding: "8px 10px",
                    fontSize: 11,
                    color:
                      filtros.quartos === o.value
                        ? "var(--fg)"
                        : "var(--muted-fg)",
                    background:
                      filtros.quartos === o.value
                        ? "var(--card)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {ativo && (
            <button
              onClick={() => setFiltros(FILTROS_INICIAIS)}
              className="text-muted-fg hover:text-fg transition-colors"
              style={{
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 16px",
                marginLeft: "auto",
              }}
            >
              Limpar ×
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile filters ── */}
      <div
        className="md:hidden flex flex-wrap items-center gap-2 border-b border-border"
        style={{ paddingBottom: 12, marginBottom: 0 }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 border border-border"
          style={{ padding: "8px 12px", minWidth: 160, position: "relative" }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-fg flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar..."
            value={filtros.busca}
            onChange={(e) => set("busca", e.target.value)}
            className="flex-1 bg-transparent text-fg placeholder:text-muted-fg outline-none"
            style={{ fontSize: 13, paddingRight: filtros.busca ? 24 : 0 }}
          />
          {filtros.busca && (
            <button
              onClick={() => set("busca", "")}
              className="text-muted-fg hover:text-fg"
              style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>

        {/* Tipo select */}
        <select
          value={filtros.tipo}
          onChange={(e) => set("tipo", e.target.value as TipoImovel | "")}
          className="border border-border bg-card text-fg font-medium uppercase"
          style={{
            padding: "8px 12px",
            fontSize: 12,
            letterSpacing: 1,
            cursor: "pointer",
          }}
        >
          {TIPO_TABS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          className="inline-flex items-center gap-2 font-medium"
          onClick={() => setFiltroPanelOpen((o) => !o)}
          style={{
            fontSize: 12,
            padding: "8px 14px",
            border: `1px solid ${ativo ? "var(--accent)" : "var(--border)"}`,
            color: ativo ? "var(--accent)" : "var(--fg)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filtros{ativo ? " •" : ""}
        </button>

        {/* Sort select mobile */}
        <select
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as Ordem)}
          className="border border-border bg-card text-fg font-medium"
          style={{ padding: "8px 12px", fontSize: 12, cursor: "pointer" }}
        >
          {ORDEM_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile filter panel */}
      {filtroPanelOpen && (
        <div
          className="md:hidden flex flex-col gap-5 border-b border-border"
          style={{ padding: "20px 0" }}
        >
          <div>
            <p
              className="text-muted-fg uppercase mb-2"
              style={{ fontSize: 11, letterSpacing: 1 }}
            >
              Preço máximo
            </p>
            <div className="flex flex-wrap gap-2">
              {PRECO_OPTS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set("precoMax", o.value)}
                  className="font-medium transition-colors"
                  style={{
                    padding: "8px 14px",
                    fontSize: 12,
                    color:
                      filtros.precoMax === o.value
                        ? "var(--fg)"
                        : "var(--muted-fg)",
                    background:
                      filtros.precoMax === o.value
                        ? "var(--card)"
                        : "transparent",
                    border: `1px solid ${filtros.precoMax === o.value ? "var(--fg)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p
              className="text-muted-fg uppercase mb-2"
              style={{ fontSize: 11, letterSpacing: 1 }}
            >
              Quartos
            </p>
            <div className="flex flex-wrap gap-2">
              {QUARTOS_OPTS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set("quartos", o.value)}
                  className="font-medium transition-colors"
                  style={{
                    padding: "8px 14px",
                    fontSize: 12,
                    color:
                      filtros.quartos === o.value
                        ? "var(--fg)"
                        : "var(--muted-fg)",
                    background:
                      filtros.quartos === o.value
                        ? "var(--card)"
                        : "transparent",
                    border: `1px solid ${filtros.quartos === o.value ? "var(--fg)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          {ativo && (
            <button
              onClick={() => setFiltros(FILTROS_INICIAIS)}
              className="text-muted-fg hover:text-fg transition-colors self-start"
              style={{
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Limpar filtros ×
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div className="flex flex-col">
        {filtrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-fg" style={{ fontSize: 16 }}>
              Nenhum imóvel encontrado.
            </p>
            <button
              onClick={() => setFiltros(FILTROS_INICIAIS)}
              className="text-accent hover:opacity-70 transition-opacity mt-3"
              style={{
                fontSize: 13,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          filtrados.map((imovel) => (
            <ImovelRow key={imovel.id} imovel={imovel} />
          ))
        )}
      </div>

      {/* Count */}
      <p className="text-muted-fg mt-6 text-center" style={{ fontSize: 13 }}>
        {filtrados.length} imóve{filtrados.length !== 1 ? "is" : "l"} encontrado
        {filtrados.length !== 1 ? "s" : ""}
        {ativo && " com os filtros aplicados"}
      </p>
    </section>
  );
}
