export function parseBR(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Dot = thousand separator (always), comma = decimal separator
  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function formatBR(n: number, maxDecimals: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}
