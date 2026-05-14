import {
  useCallback,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { set, unset, type NumberInputProps } from "sanity";
import { formatBR, parseBR } from "../lib/br-number";

type Unit = "m2" | "ha";

const HA_TO_M2 = 10000;

function toInput(m2: number | undefined, unit: Unit): string {
  if (m2 === undefined || !Number.isFinite(m2)) return "";
  return unit === "m2" ? formatBR(m2, 2) : formatBR(m2 / HA_TO_M2, 4);
}

export function AreaInput(props: NumberInputProps) {
  const { value, onChange, elementProps } = props;
  const [unit, setUnit] = useState<Unit>("m2");
  const [text, setText] = useState<string>(() => toInput(value, "m2"));
  const [lastSynced, setLastSynced] = useState<number | undefined>(value);

  if (value !== lastSynced) {
    setLastSynced(value);
    setText(toInput(value, unit));
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
      const n = parseBR(raw);
      if (n === null) return;
      const m2 = unit === "ha" ? n * HA_TO_M2 : n;
      setLastSynced(m2);
      onChange(set(m2));
    },
    [onChange, unit],
  );

  const switchUnit = useCallback(
    (next: Unit) => {
      if (next === unit) return;
      setUnit(next);
      setText(toInput(value, next));
    },
    [unit, value],
  );

  const hasValue = value !== undefined && Number.isFinite(value);
  const inM2 = hasValue ? formatBR(value as number, 2) : "";
  const inHa = hasValue ? formatBR((value as number) / HA_TO_M2, 4) : "";

  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        <input
          {...elementProps}
          type="text"
          inputMode="decimal"
          value={text}
          onChange={handleChange}
          placeholder={unit === "m2" ? "Ex: 121,73" : "Ex: 1,22"}
          style={{
            flex: 1,
            minWidth: 0,
            display: "block",
            padding: "8px 12px",
            fontSize: 14,
            border: "1px solid var(--card-border-color, #e1e3e7)",
            borderRadius: 3,
            background: "var(--card-bg-color, #fff)",
            color: "var(--card-fg-color, inherit)",
            outline: "none",
          }}
        />
        <div
          role="group"
          aria-label="Unidade"
          style={{
            display: "inline-flex",
            border: "1px solid var(--card-border-color, #e1e3e7)",
            borderRadius: 3,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <UnitButton active={unit === "m2"} onClick={() => switchUnit("m2")}>
            m²
          </UnitButton>
          <UnitButton active={unit === "ha"} onClick={() => switchUnit("ha")}>
            ha
          </UnitButton>
        </div>
      </div>

      {hasValue && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "var(--card-muted-fg-color, #6b7280)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          ={" "}
          <strong style={{ color: "var(--card-fg-color, inherit)" }}>
            {inM2} m²
          </strong>{" "}
          · {inHa} ha
        </div>
      )}
    </div>
  );
}

function UnitButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "0 14px",
        minWidth: 44,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        background: active
          ? "var(--card-focus-ring-color, #156dff)"
          : "transparent",
        color: active ? "#fff" : "var(--card-fg-color, inherit)",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}
