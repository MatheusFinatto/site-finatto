import type { Imovel, TipoImovel } from "./types";

// ── Modelo ───────────────────────────────────────────────────────────────────

export interface Filtros {
  q: string;
  tipo: TipoImovel | "";
  cidade: string;
  precoMin: number | null;
  precoMax: number | null;
  quartos: number; // 0 = qualquer; 4 = quatro ou mais
}

export type Ordem =
  | "mais-novos"
  | "preco-asc"
  | "preco-desc"
  | "area-desc"
  | "area-construida-desc";

export const FILTROS_VAZIOS: Filtros = {
  q: "",
  tipo: "",
  cidade: "",
  precoMin: null,
  precoMax: null,
  quartos: 0,
};

export const ORDEM_PADRAO: Ordem = "mais-novos";

export const ORDEM_OPTS: { label: string; value: Ordem }[] = [
  { label: "Mais recentes", value: "mais-novos" },
  { label: "Menor preço", value: "preco-asc" },
  { label: "Maior preço", value: "preco-desc" },
  { label: "Maior área", value: "area-desc" },
  { label: "Maior área construída", value: "area-construida-desc" },
];

export const QUARTOS_OPTS = [
  { label: "Quartos", value: 0 },
  { label: "1 quarto", value: 1 },
  { label: "2 quartos", value: 2 },
  { label: "3 quartos", value: 3 },
  { label: "4+ quartos", value: 4 },
];

// Faixas calibradas no catálogo atual (R$ 85 mil a R$ 1,55 mi).
export const PRECO_MAX_OPTS: { label: string; value: number | null }[] = [
  { label: "Qualquer preço", value: null },
  { label: "Até R$ 150 mil", value: 150_000 },
  { label: "Até R$ 300 mil", value: 300_000 },
  { label: "Até R$ 500 mil", value: 500_000 },
  { label: "Até R$ 800 mil", value: 800_000 },
  { label: "Até R$ 1,2 mi", value: 1_200_000 },
];

const TIPOS: TipoImovel[] = [
  "chacara",
  "casa",
  "apartamento",
  "terreno",
  "pavilhao",
];

// ── URL ⇄ filtros ────────────────────────────────────────────────────────────

function num(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function filtrosFromParams(sp: URLSearchParams): {
  filtros: Filtros;
  ordem: Ordem;
} {
  const tipoRaw = sp.get("tipo") ?? "";
  const tipo = (TIPOS as string[]).includes(tipoRaw)
    ? (tipoRaw as TipoImovel)
    : "";
  const quartosRaw = Number(sp.get("quartos") ?? 0);
  const quartos = [1, 2, 3, 4].includes(quartosRaw) ? quartosRaw : 0;
  const ordemRaw = sp.get("ordem") ?? "";
  const ordem = ORDEM_OPTS.some((o) => o.value === ordemRaw)
    ? (ordemRaw as Ordem)
    : ORDEM_PADRAO;
  return {
    filtros: {
      q: sp.get("q") ?? "",
      tipo,
      cidade: sp.get("cidade") ?? "",
      precoMin: num(sp.get("min")),
      precoMax: num(sp.get("max")),
      quartos,
    },
    ordem,
  };
}

export function paramsFromFiltros(f: Filtros, ordem: Ordem): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.tipo) p.set("tipo", f.tipo);
  if (f.cidade) p.set("cidade", f.cidade);
  if (f.precoMin !== null) p.set("min", String(f.precoMin));
  if (f.precoMax !== null) p.set("max", String(f.precoMax));
  if (f.quartos) p.set("quartos", String(f.quartos));
  if (ordem !== ORDEM_PADRAO) p.set("ordem", ordem);
  return p;
}

export function temFiltroAtivo(f: Filtros): boolean {
  return (
    f.q !== "" ||
    f.tipo !== "" ||
    f.cidade !== "" ||
    f.precoMin !== null ||
    f.precoMax !== null ||
    f.quartos !== 0
  );
}

// ── Navegação sem recarregar (integra com useSearchParams do Next) ───────────

export function aplicarNaUrl(
  params: URLSearchParams,
  modo: "push" | "replace" = "replace",
) {
  const qs = params.toString();
  const url = qs ? `/?${qs}` : "/";
  if (modo === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

export function rolarParaImoveis() {
  const el = document.getElementById("imoveis");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// ── Lógica ───────────────────────────────────────────────────────────────────

const SORTERS: Record<Ordem, (a: Imovel, b: Imovel) => number> = {
  "mais-novos": (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  "preco-asc": (a, b) => a.preco - b.preco,
  "preco-desc": (a, b) => b.preco - a.preco,
  "area-desc": (a, b) => b.area_total - a.area_total,
  "area-construida-desc": (a, b) =>
    (b.area_construida ?? -Infinity) - (a.area_construida ?? -Infinity),
};

function normaliza(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function filtrarEOrdenar(
  imoveis: Imovel[],
  f: Filtros,
  ordem: Ordem,
): Imovel[] {
  const q = normaliza(f.q.trim());
  const lista = imoveis.filter((i) => {
    if (q) {
      const alvo = normaliza(
        [i.titulo, i.bairro, i.cidade, i.logradouro ?? ""].join(" "),
      );
      if (!alvo.includes(q)) return false;
    }
    if (f.tipo && i.tipo !== f.tipo) return false;
    if (f.cidade && i.cidade !== f.cidade) return false;
    if (f.precoMin !== null && i.preco < f.precoMin) return false;
    if (f.precoMax !== null && i.preco > f.precoMax) return false;
    if (f.quartos === 4 && (i.quartos ?? 0) < 4) return false;
    if (f.quartos > 0 && f.quartos < 4 && i.quartos !== f.quartos) return false;
    return true;
  });
  // Vendidos continuam na lista, mas depois de tudo que ainda está à venda.
  const vendido = (i: Imovel) => (i.status === "vendido" ? 1 : 0);
  return [...lista].sort((a, b) => vendido(a) - vendido(b) || SORTERS[ordem](a, b));
}

/**
 * Lê o que a pessoa digita no campo de preço. Aceita "500000", "500.000",
 * "500 mil", "500k", "1,2 mi" e "1 milhão".
 */
export function parsePrecoInput(raw: string): number | null {
  const txt = raw.toLowerCase();
  const fator = /milh|mi(?!l)|\dm\b|\sm\b/.test(txt)
    ? 1_000_000
    : /mil|k/.test(txt)
      ? 1_000
      : 1;
  const cleaned = txt.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;
  let normalized: string;
  if (cleaned.includes(",")) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (fator > 1 && /^\d+\.\d{1,2}$/.test(cleaned)) {
    normalized = cleaned; // "1.5 mi": o ponto é decimal
  } else {
    normalized = cleaned.replace(/\./g, ""); // ponto é separador de milhar
  }
  const n = Math.round(Number(normalized) * fator);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formatPrecoBR(n: number): string {
  return n.toLocaleString("pt-BR");
}
