"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Images, X } from "lucide-react";
import sanityLoader from "@/lib/sanityLoader";
import type { Foto } from "@/lib/types";
import SetasRolagem, { comportamento } from "./SetasRolagem";
import { useVoltarFecha } from "@/lib/useVoltarFecha";

interface Props {
  fotos: Foto[];
  titulo: string;
  /** Selos sobre a primeira foto (tag, status). */
  selos?: React.ReactNode;
}

const MAX_MOSAICO = 5;

/**
 * Galeria da página do imóvel. Uma única lista de fotos com dois arranjos:
 * no celular, trilho com swipe (scroll-snap nativo); do tablet para cima,
 * mosaico de até 5 fotos. Qualquer foto abre o visualizador em tela cheia.
 */
export default function GaleriaImovel({ fotos, titulo, selos }: Props) {
  const n = fotos.length;
  const [aberta, setAberta] = useState<number | null>(null);
  const [atual, setAtual] = useState(0);
  const trilho = useRef<HTMLUListElement>(null);
  const tira = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const { empilhar, desempilhar } = useVoltarFecha(dialogo);
  const abrir = (i: number) => {
    empilhar();
    setAberta(i);
  };

  // No celular, a miniatura da foto em vista acompanha o swipe.
  useEffect(() => {
    const t = tira.current;
    const alvo = t?.children[atual] as HTMLElement | undefined;
    if (!t || !alvo || alvo.offsetWidth === 0) return;
    t.scrollTo({
      left: alvo.offsetLeft - (t.clientWidth - alvo.offsetWidth) / 2,
      behavior: comportamento(),
    });
  }, [atual]);

  // Celular: a miniatura leva o trilho até a foto. Tablet+: abre em tela cheia.
  const aoEscolher = (i: number) => {
    const el = trilho.current;
    if (el && !window.matchMedia("(min-width: 768px)").matches) {
      el.scrollTo({ left: i * el.clientWidth, behavior: comportamento() });
    } else {
      abrir(i);
    }
  };

  const aoRolar = () => {
    const el = trilho.current;
    if (!el || el.clientWidth === 0) return;
    setAtual(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (n === 0) {
    return (
      <div className="galeria-wrap">
        <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-muted text-muted-fg md:aspect-auto md:h-[clamp(300px,30vw,400px)] md:rounded-[var(--radius-card)]">
          <ImageOff size={30} strokeWidth={1.5} aria-hidden />
          <span className="text-[14px]">Fotos em breve</span>
          {selos && (
            <div className="absolute left-3 top-3 flex gap-1.5 md:left-4 md:top-4">
              {selos}
            </div>
          )}
        </div>
      </div>
    );
  }

  const altDe = (i: number) => fotos[i].alt || `${titulo}, foto ${i + 1}`;

  return (
    <div className="galeria-wrap">
      <div className="relative">
        <ul
          ref={trilho}
          onScroll={aoRolar}
          className="mosaico"
          data-n={Math.min(n, MAX_MOSAICO)}
        >
          {fotos.map((foto, i) => (
            <li
              key={foto.url + i}
              className={i >= MAX_MOSAICO ? "md:hidden" : undefined}
            >
              <button
                type="button"
                onClick={() => abrir(i)}
                aria-label={`Abrir foto ${i + 1} de ${n} em tela cheia`}
                className="group relative block h-full w-full cursor-zoom-in overflow-hidden bg-muted"
              >
                <Image
                  loader={sanityLoader}
                  src={foto.url}
                  alt={altDe(i)}
                  fill
                  priority={i === 0}
                  sizes={
                    i === 0
                      ? "(max-width: 767px) 100vw, (max-width: 1320px) 60vw, 800px"
                      : "(max-width: 767px) 100vw, (max-width: 1320px) 30vw, 400px"
                  }
                  className="object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.03]"
                />
              </button>
            </li>
          ))}
        </ul>

        {selos && (
          <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5 md:left-4 md:top-4">
            {selos}
          </div>
        )}

        {n > 1 && (
          <>
            <span
              className="badge badge-dark tabular pointer-events-none absolute bottom-3 right-3 md:hidden"
              aria-hidden
            >
              {atual + 1} / {n}
            </span>
            <button
              type="button"
              onClick={() => abrir(0)}
              className="btn btn-sm btn-ghost absolute bottom-4 right-4 hidden shadow-arrow md:inline-flex"
            >
              <Images size={15} strokeWidth={2} aria-hidden />
              {n > MAX_MOSAICO
                ? `Ver todas as ${n} fotos`
                : `Ver as ${n} fotos`}
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className={`relative${n <= MAX_MOSAICO ? " md:hidden" : ""}`}>
          <div ref={tira} className="tira-fotos">
            {fotos.map((foto, i) => (
              <button
                key={foto.url + i}
                type="button"
                onClick={() => aoEscolher(i)}
                aria-label={`Ver foto ${i + 1} de ${n}`}
                aria-current={i === atual ? "true" : undefined}
                className={`tira-foto${i < MAX_MOSAICO ? " md:hidden" : ""}`}
              >
                <Image
                  loader={sanityLoader}
                  src={foto.url}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 64px, 112px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <SetasRolagem alvo={tira} rotulo="miniaturas" />
        </div>
      )}

      {aberta !== null && (
        <Visualizador
          fotos={fotos}
          titulo={titulo}
          inicio={aberta}
          altDe={altDe}
          dialogo={dialogo}
          onClose={() => {
            desempilhar();
            setAberta(null);
          }}
        />
      )}
    </div>
  );
}

function Visualizador({
  fotos,
  titulo,
  inicio,
  altDe,
  dialogo,
  onClose,
}: {
  fotos: Foto[];
  titulo: string;
  inicio: number;
  altDe: (i: number) => string;
  dialogo: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}) {
  const n = fotos.length;
  const palco = useRef<HTMLDivElement>(null);
  const tira = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(inicio);

  // Abre como modal nativo (foco preso, Esc fecha) e trava o scroll da página.
  useEffect(() => {
    const d = dialogo.current;
    const p = palco.current;
    if (!d || !p) return;
    if (!d.open) d.showModal();
    p.scrollTo({ left: inicio * p.clientWidth, behavior: "instant" });
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [inicio, dialogo]);

  // Mantém a miniatura da foto atual visível na tira.
  useEffect(() => {
    const t = tira.current;
    const alvo = t?.children[i] as HTMLElement | undefined;
    if (!t || !alvo) return;
    t.scrollTo({
      left: alvo.offsetLeft - (t.clientWidth - alvo.offsetWidth) / 2,
      behavior: comportamento(),
    });
  }, [i]);

  // Foto para onde o visualizador está indo (igual à atual quando parado).
  const destino = useRef(inicio);
  const parou = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ir = useCallback(
    (k: number, direto = false) => {
      const p = palco.current;
      if (!p) return;
      const alvo = Math.max(0, Math.min(n - 1, k));
      // Com uma rolagem suave ainda em curso, ou num salto de várias fotos
      // (Home, End, miniatura distante), vai direto em vez de animar.
      const emCurso =
        Math.abs(p.scrollLeft - destino.current * p.clientWidth) > 2;
      const salto = Math.abs(alvo - destino.current) > 1;
      destino.current = alvo;
      p.scrollTo({
        left: alvo * p.clientWidth,
        behavior: direto || emCurso || salto ? "instant" : comportamento(),
      });
    },
    [n],
  );

  const aoRolar = () => {
    const p = palco.current;
    if (!p || p.clientWidth === 0) return;
    const k = Math.round(p.scrollLeft / p.clientWidth);
    if (k !== i) setI(k);
    // Swipe com o dedo também muda o destino: acerta quando a rolagem para.
    clearTimeout(parou.current);
    parou.current = setTimeout(() => {
      destino.current = Math.round(p.scrollLeft / p.clientWidth);
    }, 120);
  };

  // Teclas repetidas somam a partir do destino, não da foto em que o scroll
  // suave ainda está passando; senão cinco toques rápidos avançam só duas.
  const aoTeclar = (e: React.KeyboardEvent) => {
    const passo: Record<string, number> = {
      ArrowRight: destino.current + 1,
      ArrowLeft: destino.current - 1,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in passo)) return;
    e.preventDefault();
    ir(passo[e.key], e.repeat);
  };

  const fechar = () => dialogo.current?.close();

  return (
    <dialog
      ref={dialogo}
      onClose={onClose}
      onKeyDown={aoTeclar}
      aria-label={`Fotos de ${titulo}`}
      className="visualizador"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <p className="min-w-0 truncate text-[14px] text-white/80">
            <span className="tabular font-semibold text-white">
              {i + 1} / {n}
            </span>
            <span className="mx-2 hidden text-white/40 sm:inline">·</span>
            <span className="hidden sm:inline">{titulo}</span>
          </p>
          <button
            type="button"
            onClick={fechar}
            className="visualizador-btn flex"
            aria-label="Fechar fotos"
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={palco} onScroll={aoRolar} className="visualizador-palco">
            {fotos.map((foto, k) => (
              <div
                key={foto.url + k}
                className="relative h-full flex-[0_0_100%] snap-center"
              >
                {Math.abs(k - i) <= 1 && (
                  <Image
                    loader={sanityLoader}
                    src={foto.url}
                    alt={altDe(k)}
                    fill
                    sizes="100vw"
                    draggable={false}
                    className="select-none object-contain"
                  />
                )}
              </div>
            ))}
          </div>

          {n > 1 && (
            <>
              <button
                type="button"
                onClick={() => ir(destino.current - 1)}
                disabled={i === 0}
                aria-label="Foto anterior"
                className="visualizador-btn absolute left-4 top-1/2 hidden -translate-y-1/2 md:flex"
              >
                <ChevronLeft size={22} strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => ir(destino.current + 1)}
                disabled={i === n - 1}
                aria-label="Próxima foto"
                className="visualizador-btn absolute right-4 top-1/2 hidden -translate-y-1/2 md:flex"
              >
                <ChevronRight size={22} strokeWidth={2} aria-hidden />
              </button>
            </>
          )}
        </div>

        {n > 1 && (
          <div className="relative">
            <div ref={tira} className="visualizador-tira">
              {fotos.map((foto, k) => (
                <button
                  key={foto.url + k}
                  type="button"
                  onClick={() => ir(k)}
                  aria-label={`Ir para a foto ${k + 1}`}
                  aria-current={k === i ? "true" : undefined}
                  className="visualizador-miniatura"
                >
                  <Image
                    loader={sanityLoader}
                    src={foto.url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <SetasRolagem alvo={tira} rotulo="miniaturas" escura />
          </div>
        )}
      </div>
    </dialog>
  );
}
