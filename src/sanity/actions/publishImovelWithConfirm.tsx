import { useState, type ReactNode } from "react";
import type {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
} from "sanity";
import { useClient, useDocumentOperation } from "sanity";
import { apiVersion } from "../env";
import { formatBR } from "../lib/br-number";

type ImovelDoc = {
  titulo?: string;
  tipo?: string;
  status?: string;
  preco?: number;
  area_total?: number;
  area_construida?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  complemento?: string;
};

const TIPOS: Record<string, string> = {
  chacara: "Chácara",
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  pavilhao: "Pavilhão",
};

const STATUS: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

const HA_TO_M2 = 10000;

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Cascading candidates from semantic fields. Order = preference.
// Caller picks first one not yet taken in the dataset.
function slugCandidates(doc: ImovelDoc): string[] {
  const base = slugify(doc.titulo ?? "");
  if (!base) return [];

  const bairro = doc.bairro ? slugify(doc.bairro) : "";
  const cidade = doc.cidade ? slugify(doc.cidade) : "";
  const logradouro = doc.logradouro ? slugify(doc.logradouro) : "";
  const complemento = doc.complemento ? slugify(doc.complemento) : "";

  const list = [
    base,
    bairro && `${base}-${bairro}`,
    bairro && cidade && `${base}-${bairro}-${cidade}`,
    logradouro && bairro && `${base}-${logradouro}-${bairro}`,
    complemento && bairro && `${base}-${complemento}-${bairro}`,
    logradouro && cidade && `${base}-${logradouro}-${cidade}`,
  ].filter((s): s is string => Boolean(s));

  return Array.from(new Set(list));
}

function fmtArea(m2: number | undefined): string {
  if (m2 === undefined || !Number.isFinite(m2)) return "—";
  const ha = m2 / HA_TO_M2;
  return `${formatBR(m2, 2)} m² (${formatBR(ha, 4)} ha)`;
}

function fmtPreco(n: number | undefined): string {
  if (n === undefined || !Number.isFinite(n)) return "—";
  return `R$ ${formatBR(n, 2)}`;
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid var(--card-border-color, #e1e3e7)",
        fontSize: 14,
      }}
    >
      <span style={{ color: "var(--card-muted-fg-color, #6b7280)" }}>
        {label}
      </span>
      <strong style={{ fontVariantNumeric: "tabular-nums" }}>{value}</strong>
    </div>
  );
}

function SummaryBody({ doc }: { doc: ImovelDoc }) {
  return (
    <div style={{ padding: "4px 0" }}>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 13,
          color: "var(--card-muted-fg-color, #6b7280)",
        }}
      >
        Confira os dados antes de publicar. Cancele para editar.
      </p>
      <Row label="Título" value={doc.titulo ?? "—"} />
      <Row label="Tipo" value={doc.tipo ? (TIPOS[doc.tipo] ?? doc.tipo) : "—"} />
      <Row
        label="Status"
        value={doc.status ? (STATUS[doc.status] ?? doc.status) : "—"}
      />
      <Row label="Preço" value={fmtPreco(doc.preco)} />
      <Row label="Área total" value={fmtArea(doc.area_total)} />
      <Row label="Área construída" value={fmtArea(doc.area_construida)} />
      <Row
        label="Quartos / Banh. / Vagas"
        value={`${doc.quartos ?? "—"} / ${doc.banheiros ?? "—"} / ${doc.vagas ?? "—"}`}
      />
      <Row
        label="Localização"
        value={[doc.bairro, doc.cidade].filter(Boolean).join(", ") || "—"}
      />
    </div>
  );
}

export function withPublishConfirm(
  Original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props: DocumentActionProps) => {
    const [open, setOpen] = useState(false);
    const [checking, setChecking] = useState(false);
    const [slugError, setSlugError] = useState<string | null>(null);
    const original = Original(props);
    const { patch, publish } = useDocumentOperation(props.id, props.type);
    const client = useClient({ apiVersion });

    if (!original) return null;

    const doc = (props.draft ?? props.published ?? {}) as ImovelDoc;
    const disabled = Boolean(original.disabled);

    const handleOpen = () => {
      if (disabled) return;
      setSlugError(null);
      setOpen(true);
    };

    const handleConfirm = async () => {
      setChecking(true);
      setSlugError(null);

      const candidates = slugCandidates(doc);
      if (candidates.length === 0) {
        setChecking(false);
        setSlugError("Título inválido para gerar URL.");
        return;
      }

      const taken = await client.fetch<string[]>(
        `*[_type == "imovel" && slug.current in $candidates && !(_id in [$id, $draftId])].slug.current`,
        { candidates, id: props.id, draftId: `drafts.${props.id}` },
      );
      const takenSet = new Set(taken);
      const chosen = candidates.find((c) => !takenSet.has(c));

      setChecking(false);

      if (!chosen) {
        setSlugError(
          "Já existe um imóvel com título, bairro, cidade e endereço idênticos. Diferencie algum desses campos.",
        );
        return;
      }

      setOpen(false);
      patch.execute([{ set: { slug: { _type: "slug", current: chosen } } }]);
      publish.execute();
    };

    const description: DocumentActionDescription = {
      ...original,
      label: original.label ?? "Publicar",
      onHandle: handleOpen,
      dialog: open
        ? {
            type: "dialog",
            header: "Confirmar publicação",
            onClose: () => setOpen(false),
            content: (
              <div>
                <SummaryBody doc={doc} />
                {slugError && (
                  <p
                    style={{
                      marginTop: 12,
                      padding: "8px 12px",
                      fontSize: 13,
                      color: "#b91c1c",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 3,
                    }}
                  >
                    {slugError}
                  </p>
                )}
              </div>
            ),
            footer: (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  padding: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "8px 14px",
                    fontSize: 13,
                    background: "transparent",
                    border: "1px solid var(--card-border-color, #e1e3e7)",
                    borderRadius: 3,
                    cursor: "pointer",
                    color: "var(--card-fg-color, inherit)",
                  }}
                >
                  Cancelar e editar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={checking}
                  style={{
                    padding: "8px 14px",
                    fontSize: 13,
                    background: checking
                      ? "var(--card-muted-fg-color, #9ca3af)"
                      : "var(--card-focus-ring-color, #156dff)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 3,
                    cursor: checking ? "not-allowed" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  {checking ? "Verificando..." : "Confirmar e publicar"}
                </button>
              </div>
            ),
          }
        : original.dialog,
    };

    return description;
  };

  Wrapped.action = Original.action;
  return Wrapped;
}
