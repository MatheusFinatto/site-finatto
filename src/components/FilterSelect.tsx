"use client";

import { useState, useEffect, useRef } from "react";

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function FilterSelect<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <span
        className="text-muted-fg uppercase"
        style={{ fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap" }}
      >
        {label}
      </span>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-medium text-fg hover:text-accent transition-colors"
        style={{ fontSize: 12, background: "none", border: "1px solid var(--border)", cursor: "pointer", padding: "8px 12px", borderRadius: 6 }}
      >
        {selected?.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full border border-border bg-card shadow-lg z-20"
          style={{ left: 0, minWidth: 180, marginTop: 8 }}
        >
          {options.map((o) => (
            <button
              key={String(o.value)}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="w-full text-left font-medium transition-colors hover:bg-muted"
              style={{
                padding: "10px 16px",
                fontSize: 13,
                display: "block",
                color: o.value === value ? "var(--fg)" : "var(--muted-fg)",
                background: o.value === value ? "var(--muted)" : "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {o.value === value && (
                <span style={{ marginRight: 8, color: "var(--accent)" }}>
                  ✓
                </span>
              )}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
