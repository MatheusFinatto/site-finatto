import { set, type StringInputProps } from "sanity";

const OPCOES = [
  {
    valor: "vendido",
    titulo: "Vendido",
    ajuda: "Continua no site com o selo “Vendido” e sem botão de contato.",
  },
  {
    valor: "reservado",
    titulo: "Reservado",
    ajuda: "Continua no site com o selo “Reservado”.",
  },
];

/**
 * Situação do imóvel como caixas de marcar: marcar "Vendido" é um clique.
 * Nenhuma marcada = disponível. O campo continua sendo o mesmo `status`
 * (disponivel | reservado | vendido), então nada muda nos dados já salvos.
 */
export function StatusInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps } = props;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {OPCOES.map((o, k) => {
        const marcado = value === o.valor;
        return (
          <label
            key={o.valor}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              border: "1px solid var(--card-border-color, #e1e3e7)",
              borderRadius: 6,
              cursor: readOnly ? "default" : "pointer",
              background: marcado
                ? "var(--card-muted-bg-color, #f3f4f6)"
                : "transparent",
            }}
          >
            <input
              type="checkbox"
              id={k === 0 ? elementProps.id : undefined}
              ref={k === 0 ? (elementProps.ref as React.Ref<HTMLInputElement>) : undefined}
              onFocus={elementProps.onFocus}
              onBlur={elementProps.onBlur}
              checked={marcado}
              disabled={readOnly}
              onChange={(e) =>
                onChange(set(e.target.checked ? o.valor : "disponivel"))
              }
              style={{ width: 20, height: 20, marginTop: 1, flexShrink: 0 }}
            />
            <span style={{ display: "grid", gap: 3 }}>
              <strong style={{ fontSize: 15 }}>{o.titulo}</strong>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--card-muted-fg-color, #6b7280)",
                }}
              >
                {o.ajuda}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
