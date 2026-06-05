"use client";

import { useState, useEffect, useRef, useId } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const listboxId = `${uid}-listbox`;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  const openMenu = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const commit = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    setOpen(false);
    // Clicar numa opção destrói o botão clicado; devolve o foco ao combobox
    // pra navegação por teclado continuar daqui (e não cair no <body>).
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, [open]);

  // Mantém a opção ativa visível ao navegar por teclado.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <span
        className="text-muted-fg uppercase"
        style={{ fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap" }}
      >
        {label}
      </span>
      <div
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        className="flex items-center gap-1.5 font-medium text-fg hover:text-accent transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        style={{
          fontSize: 12,
          background: "none",
          border: "1px solid var(--border)",
          cursor: "pointer",
          padding: "8px 12px",
        }}
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
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute top-full border border-border bg-card shadow-lg z-20"
          style={{ left: 0, minWidth: 180, marginTop: 8 }}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === activeIndex;
            return (
              <button
                key={String(o.value)}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => commit(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className="w-full text-left font-medium transition-colors"
                style={{
                  padding: "10px 16px",
                  fontSize: 13,
                  display: "block",
                  color: isSelected ? "var(--fg)" : "var(--muted-fg)",
                  background:
                    isActive || isSelected ? "var(--muted)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isSelected && (
                  <span style={{ marginRight: 8, color: "var(--accent)" }}>
                    ✓
                  </span>
                )}
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
