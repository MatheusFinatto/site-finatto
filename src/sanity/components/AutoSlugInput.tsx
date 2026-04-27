import { useEffect, useRef } from "react";
import { set, SlugInputProps, useFormValue } from "sanity";
import { SlugInput } from "sanity";

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function AutoSlugInput(props: SlugInputProps) {
  const titulo = useFormValue(["titulo"]) as string | undefined;
  const prevAutoSlug = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!titulo) return;
    const autoSlug = slugify(titulo);
    const current = props.value?.current;
    if (!current || current === prevAutoSlug.current) {
      prevAutoSlug.current = autoSlug;
      props.onChange(set({ _type: "slug", current: autoSlug }));
    }
  }, [titulo]);

  return <SlugInput {...props} />;
}
