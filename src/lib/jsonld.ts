/**
 * Serialize an object for embedding in a <script type="application/ld+json">.
 *
 * JSON.stringify alone does NOT escape `<`, `>` or `&`, so CMS-authored text
 * (e.g. a description containing `</script>`) could break out of the script
 * context — a stored-XSS vector. Escaping these (plus the line/paragraph
 * separators U+2028/U+2029) as \uXXXX keeps the JSON valid while making
 * script-context breakout impossible.
 */
const esc = (c: string) =>
  "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");

const SEPARATORS = new RegExp(
  "[" + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + "]",
  "g",
);

export function jsonLdSafe(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&]/g, esc).replace(SEPARATORS, esc);
}
