"use client";

import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";

/**
 * Foto de capa do imóvel vendido. Client só por causa do loader do Sanity
 * (função não atravessa de Server para Client Component). Zoom leve
 * ancorado no topo: a borda de baixo, onde as fotos do portfólio trazem a
 * marca d'água da câmera, sai do quadro; o `sizes` acompanha o zoom para a
 * imagem não ser esticada.
 */
export default function FotoVendida({ url, alt }: { url: string; alt: string }) {
  return (
    <Image
      loader={sanityLoader}
      src={url}
      alt={alt}
      fill
      preload
      sizes="(max-width: 1023px) 116vw, 840px"
      className="origin-top scale-[1.16] object-cover"
    />
  );
}
