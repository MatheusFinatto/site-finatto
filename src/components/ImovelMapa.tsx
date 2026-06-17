"use client";

import { useEffect, useState } from "react";
import { Maximize2, X, MapPin, Eye } from "lucide-react";

interface Props {
  lat?: number;
  lng?: number;
}

// Mapa da localização na página de detalhe (OpenStreetMap via iframe).
// Sem lat/lng → não renderiza (fallback silencioso). A moldura segue o tema do site;
// o conteúdo do mapa é sempre claro (embed de terceiro não herda data-theme).
// Botão de tela cheia abre um overlay (position:fixed) — funciona em desktop e mobile,
// incluindo iOS Safari (a Fullscreen API nativa não cobre elementos não-vídeo no iOS).
export default function ImovelMapa({ lat, lng }: Props) {
  const [open, setOpen] = useState(false);

  // Esc fecha o overlay e trava o scroll do body enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (lat == null || lng == null) return null;

  // bbox do OSM é "lon,lat" (não "lat,lon") e exige layer=mapnik, senão fica em branco.
  const d = 0.01; // ~1 km de margem ao redor do ponto
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  // Links externos (Google Maps URLs API — sem chave, sem billing, custo zero).
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

  return (
    <div>
      <h2 className="text-fg font-semibold mb-3" style={{ fontSize: 16 }}>
        Localização
      </h2>
      <div
        className="relative w-full overflow-hidden border border-border"
        style={{ height: 280 }}
      >
        <iframe
          src={src}
          title="Mapa da localização do imóvel"
          loading="lazy"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
        />
        <button
          onClick={() => setOpen(true)}
          aria-label="Ver mapa em tela cheia"
          className="absolute bottom-3 right-3 flex items-center justify-center transition-opacity opacity-80 hover:opacity-100"
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "none",
            cursor: "pointer",
            width: 36,
            height: 36,
            zIndex: 2,
          }}
        >
          <Maximize2 size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-border text-fg no-underline hover:bg-muted transition-colors"
          style={{ fontSize: 13, padding: "8px 12px" }}
        >
          <MapPin size={14} /> Ver no Google Maps
        </a>
        <a
          href={streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-border text-fg no-underline hover:bg-muted transition-colors"
          style={{ fontSize: 13, padding: "8px 12px" }}
        >
          <Eye size={14} /> Ver no Street View
        </a>
      </div>

      {open && (
        <div
          className="fixed inset-0 flex flex-col"
          style={{ zIndex: 100, background: "rgba(0,0,0,0.85)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mapa da localização em tela cheia"
        >
          <div className="flex justify-end" style={{ padding: 12 }}>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar mapa"
              className="flex items-center justify-center transition-opacity opacity-80 hover:opacity-100"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "none",
                cursor: "pointer",
                width: 40,
                height: 40,
              }}
            >
              <X size={20} color="white" />
            </button>
          </div>
          <div className="flex-1" style={{ minHeight: 0 }}>
            <iframe
              src={src}
              title="Mapa da localização do imóvel em tela cheia"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
