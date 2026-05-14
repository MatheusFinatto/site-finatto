import { useCallback, useState, type ChangeEvent, type FocusEvent } from "react";
import { set, unset, type NumberInputProps } from "sanity";
import { formatBR, parseBR } from "../lib/br-number";

function toDisplay(v: number | undefined): string {
  if (v === undefined || !Number.isFinite(v)) return "";
  return formatBR(v, 2);
}

export function BrlNumberInput(props: NumberInputProps) {
  const { value, onChange, elementProps } = props;
  const [text, setText] = useState<string>(() => toDisplay(value));
  const [lastSynced, setLastSynced] = useState<number | undefined>(value);
  const [focused, setFocused] = useState(false);

  // Sync text only when value changes externally (not while user is typing)
  if (!focused && value !== lastSynced) {
    setLastSynced(value);
    setText(toDisplay(value));
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      setText(raw);
      if (raw.trim() === "") {
        setLastSynced(undefined);
        onChange(unset());
        return;
      }
      const num = parseBR(raw);
      if (num !== null) {
        setLastSynced(num);
        onChange(set(num));
      }
    },
    [onChange],
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      elementProps.onFocus?.(e);
    },
    [elementProps],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setLastSynced(value);
      setText(toDisplay(value));
      elementProps.onBlur?.(e);
    },
    [value, elementProps],
  );

  return (
    <input
      {...elementProps}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="Ex: 480.000,00"
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
