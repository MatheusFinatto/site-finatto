import type { CSSProperties } from "react";

/** "!" do susto do martelo: posição a partir do canto de baixo à direita do
 *  número (em ems do próprio "!"), inclinação e atraso. */
const POWS: { x: string; y: string; r: string; delay: string }[] = [
  { x: "1.75em", y: "2.7em", r: "-20deg", delay: "0ms" },
  { x: "0.85em", y: "3.25em", r: "2deg", delay: "70ms" },
  { x: "-0.3em", y: "2.55em", r: "22deg", delay: "140ms" },
];

/**
 * "404" da página não encontrada: "40" em pé e o último 4 tombado, com o
 * contorno no lugar dele. Em loop, o martelo dá três golpes, o 4 levanta,
 * o 404 fica inteiro, o 4 tomba de novo e o martelo leva um susto, com "!"
 * de quadrinho em volta dele, que somem, e recomeça. Duração, posições e
 * ângulos ficam em variáveis no .num404 (globals.css). Com movimento
 * reduzido, só o 404 inteiro, sem martelo. Decorativo para leitor de tela:
 * o h1 diz o que houve.
 */
export default function Numero404() {
  return (
    <p className="num404" aria-hidden>
      <span>4</span>
      <span>0</span>
      <span className="num404-vaga">
        4<span className="num404-caido">4</span>
      </span>
      {/* Martelo: Fluent Emoji "Hammer" (Microsoft, licença MIT). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG local decorativo */}
      <img
        src="/img/martelo.svg"
        alt=""
        width={32}
        height={32}
        className="num404-martelo"
      />
      {POWS.map((p) => (
        <span
          key={p.x}
          className="num404-pow"
          style={
            {
              "--x": p.x,
              "--y": p.y,
              "--r": p.r,
              animationDelay: p.delay,
            } as CSSProperties
          }
        >
          !
        </span>
      ))}
    </p>
  );
}
