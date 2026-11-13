import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "box" | "bare";
  label: string; // sempre nomeado para leitores de tela; visível só no "bare"
}

/**
 * <select> nativo com seta própria. "box" é o controle de borda das barras de
 * filtro; "bare" é o campo do cartão de busca do hero (rótulo visível acima).
 */
export default function Select({
  variant = "box",
  label,
  className = "",
  children,
  id,
  ...rest
}: Props) {
  if (variant === "bare") {
    return (
      <label className={`block min-w-0 ${className}`}>
        <span className="block text-[12px] font-medium text-muted-fg">
          {label}
        </span>
        <span className="relative mt-0.5 block">
          <select id={id} className="ctl-bare truncate" {...rest}>
            {children}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={2}
            aria-hidden
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-fg"
          />
        </span>
      </label>
    );
  }
  return (
    <span className={`relative block ${className}`}>
      <select id={id} aria-label={label} className="ctl" {...rest}>
        {children}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg"
      />
    </span>
  );
}
