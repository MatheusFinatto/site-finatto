import { useCallback, type FocusEvent } from "react";
import { set, unset, type StringInputProps } from "sanity";

export function TrimmedStringInput(props: StringInputProps) {
  const { onChange, value, elementProps, renderDefault } = props;

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      elementProps.onBlur?.(e);
      if (typeof value !== "string") return;
      const trimmed = value.trim();
      if (trimmed === value) return;
      onChange(trimmed === "" ? unset() : set(trimmed));
    },
    [elementProps, onChange, value],
  );

  return renderDefault({
    ...props,
    elementProps: { ...elementProps, onBlur: handleBlur },
  });
}
