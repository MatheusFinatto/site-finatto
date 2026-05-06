import { useCallback, useState, type ChangeEvent } from "react";
import { set, unset, type NumberInputProps } from "sanity";

function parseBR(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function BrlNumberInput(props: NumberInputProps) {
  const { value, onChange, elementProps } = props;
  const [text, setText] = useState<string>(
    value === undefined ? "" : String(value),
  );
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value === undefined ? "" : String(value));
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      setText(raw);
      if (raw.trim() === "") {
        onChange(unset());
        return;
      }
      const num = parseBR(raw);
      if (num !== null) onChange(set(num));
    },
    [onChange],
  );

  return (
    <input
      {...elementProps}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={handleChange}
      style={{
        display: "block",
        width: "100%",
        padding: "8px 12px",
        fontSize: 14,
        border: "1px solid var(--card-border-color, #e1e3e7)",
        borderRadius: 3,
        background: "var(--card-bg-color, #fff)",
        color: "var(--card-fg-color, inherit)",
        outline: "none",
      }}
    />
  );
}
