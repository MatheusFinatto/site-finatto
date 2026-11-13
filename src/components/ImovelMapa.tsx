"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, X, MapPin, Eye } from "lucide-react";
import { useVoltarFecha } from "@/lib/useVoltarFecha";

interface Props {
  lat?: number;
  lng?: number;
}

// Mapa da localização na página de detalhe (OpenStreetMap via iframe).
// Sem lat/lng → não renderiza (fallback silencioso).
// A tela cheia é um <dialog> nativo, como o visualizador de fotos: foco preso,
// Esc fecha. Funciona no iOS Safari, onde a Fullscreen API não cobre iframes.
export default function ImovelMapa({ lat, lng }: Props) {
  const [open, setOpen] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const { empilhar, desempilhar } = useVoltarFecha(dialogo);
  const abrir = () => {
    empilhar();
    setOpen(true);
  };

  // Abre como modal e trava o scroll da página enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (lat == null || lng == null) return null;

  // bbox do OSM é "lon,lat" (não "lat,lon") e exige layer=mapnik, senão fica em branco.
  const d = 0.004; // ~400 m ao redor do ponto: mostra o bairro, não a cidade
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  // Links externos (Google Maps URLs API — sem chave, sem billing, custo zero).
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

  return (
    <section aria-labelledby="localizacao-titulo">
      <h2
        id="localizacao-titulo"
        className="text-[clamp(22px,2.2vw,28px)] text-fg"
      >
        Localização
      </h2>
      <div className="relative mt-4 h-[280px] w-full overflow-hidden rounded-[var(--radius-card)] border border-card-border bg-muted md:h-[340px]">
        {/* No celular o mapa não recebe o toque, senão o dedo que rola a
            página fica preso nele; tocar abre a tela cheia, onde ele é livre. */}
        <iframe
          src={src}
          title="Mapa da localização do imóvel"
          loading="lazy"
          width="100%"
          height="100%"
          className="max-md:pointer-events-none"
          style={{ border: 0, display: "block" }}
        />
        <button
          type="button"
          onClick={abrir}
          aria-label="Abrir o mapa em tela cheia"
          className="absolute inset-0 z-[1] md:hidden"
        />
        <button
          type="button"
          onClick={abrir}
          aria-label="Ver mapa em tela cheia"
          className="absolute left-3 top-3 z-[2] flex h-11 w-11 items-center justify-center rounded-full bg-card text-fg shadow-arrow transition-colors hover:bg-muted max-md:pointer-events-none"
        >
          <Maximize2 size={17} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-ghost"
        >
          <MapPin size={15} strokeWidth={2} aria-hidden /> Abrir no Google Maps
        </a>
        <a
          href={streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-ghost"
        >
          <Eye size={15} strokeWidth={2} aria-hidden /> Ver no Street View
        </a>
      </div>

      {open && (
        <dialog
          ref={dialogo}
          onClose={() => {
            desempilhar();
            setOpen(false);
          }}
          aria-label="Mapa da localização em tela cheia"
          className="visualizador"
        >
          <div className="flex h-full flex-col">
            <div className="flex justify-end px-4 py-3">
              <button
                type="button"
                onClick={() => dialogo.current?.close()}
                aria-label="Fechar mapa"
                className="visualizador-btn flex"
              >
                <X size={20} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <iframe
                src={src}
                title="Mapa da localização do imóvel em tela cheia"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
              />
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
