interface Props {
  lat?: number;
  lng?: number;
}

// Mapa da localização na página de detalhe. Server Component (sem "use client"):
// é só um <iframe> estático do OpenStreetMap, sem JS de cliente.
// Sem lat/lng → não renderiza (fallback silencioso). A moldura segue o tema do site;
// o conteúdo do mapa é sempre claro (embed de terceiro não herda data-theme).
export default function ImovelMapa({ lat, lng }: Props) {
  if (lat == null || lng == null) return null;

  // bbox do OSM é "lon,lat" (não "lat,lon") e exige layer=mapnik, senão fica em branco.
  const d = 0.01; // ~1 km de margem ao redor do ponto
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div>
      <h2 className="text-fg font-semibold mb-3" style={{ fontSize: 16 }}>
        Localização
      </h2>
      <div
        className="w-full overflow-hidden border border-border"
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
      </div>
    </div>
  );
}
