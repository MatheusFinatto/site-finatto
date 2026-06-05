export function formatPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatArea(m2: number): string {
  if (m2 >= 10000) {
    const ha = m2 / 10000;
    return `${ha.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ha`;
  }
  return `${m2.toLocaleString("pt-BR")} m²`;
}

/**
 * Append Sanity CDN transform params to a raw `asset->url`.
 * Serves a right-sized, auto-format (WebP/AVIF) image instead of the
 * full-resolution original — cuts origin transfer dramatically.
 */
export function sanityImg(url: string, width: number, quality = 75): string {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${width}&q=${quality}&auto=format&fit=max`;
}

/**
 * Like {@link sanityImg} but crops to an exact width×height box (fit=crop).
 * Use for fixed-ratio slots (e.g. OG images) where the declared dimensions
 * must match the served image.
 */
export function sanityImgCrop(
  url: string,
  width: number,
  height: number,
  quality = 75,
): string {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${width}&h=${height}&fit=crop&auto=format&q=${quality}`;
}

export const WHATSAPP_FINATTO = "5554991636937";
export const WHATSAPP_FLAVIA = "5554991001050";

export function whatsappLink(numero: string, mensagem?: string): string {
  const msg = mensagem ? encodeURIComponent(mensagem) : "";
  return `https://wa.me/${numero}${msg ? `?text=${msg}` : ""}`;
}
