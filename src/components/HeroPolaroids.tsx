import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { CSSProperties } from "react";

// Fotos do próprio portfólio da Finatto (Sanity), recortadas em quadrado sem
// a marca d'água da câmera, com leve ajuste de cor. Título (encurtado),
// endereço e slug vêm do cadastro de cada imóvel; clicar abre a página dele.
const FOTOS = [
  {
    src: "/img/polaroids/condominio-lago.jpg",
    titulo: "Condomínio rural de alto padrão",
    endereco: "Km 10, Erechim",
    slug: "terreno-condominio-rural-alto-padrao-erechim",
  },
  {
    src: "/img/polaroids/chacara-novo-atlantico.jpg",
    titulo: "Chácara no Novo Atlântico",
    endereco: "Rua Dorvino Domingos de Lima, Erechim",
    slug: "chacara-bairro-novo-atlantico",
  },
  {
    src: "/img/polaroids/casa-dal-molin.jpg",
    titulo: "Casa de esquina no Dal Molin",
    endereco: "Rua Nery Silveira, Erechim",
    slug: "casa-de-esquina-no-bairro-dal-molin",
  },
  {
    src: "/img/polaroids/casa-parreirais.jpg",
    titulo: "Casa no Vale dos Parreirais",
    endereco: "Rua Hermínio Kamainski, Erechim",
    slug: "casa-bairro-vale-dos-parreirais",
  },
  {
    src: "/img/polaroids/area-rural-linha-tres.jpg",
    titulo: "Área rural na Linha Três",
    endereco: "Comunidade Santa Tereza, Erechim",
    slug: "area-rural-14ha-linha-tres-erechim",
  },
];

// Uma volta completa dura FOTOS.length × PASSO (13s; tem que bater com a
// duração da animação .polaroid no globals.css).
// Todas as fotos usam a mesma animação; o atraso negativo põe cada uma numa
// posição diferente da pilha no instante zero.
const PASSO = 2.6;

// Posição e inclinação fixas de cada foto na pilha. Só a foto que vai para
// o fim se mexe (e gira); as outras ficam paradas onde estão.
const LUGAR = [
  { tx: "0%", ty: "0%", rot: "-3deg" },
  { tx: "2%", ty: "1%", rot: "2.5deg" },
  { tx: "-2%", ty: "2%", rot: "-6deg" },
  { tx: "3%", ty: "2.5%", rot: "5deg" },
  { tx: "0%", ty: "3%", rot: "-1deg" },
];

export default function HeroPolaroids() {
  const n = FOTOS.length;
  return (
    // .pilha-polaroids:hover pausa a troca (globals.css).
    <div className="pilha-polaroids relative aspect-[0.83] h-full">
      {FOTOS.map(({ src, titulo, endereco, slug }, i) => {
        // Foto i começa na profundidade i. Na linha do tempo da animação ela
        // fica no topo em 0–20%, e a profundidade d (≥1) ocupa a faixa
        // (n − d) × 20%; daí o atraso. --z só vale com movimento reduzido.
        const atraso = +(-((n - i) % n) * PASSO).toFixed(2);
        return (
          <Link
            key={src}
            href={`/imoveis/${slug}`}
            // @container: a legenda usa cqw (% da largura da polaroid), então
            // cresce e encolhe junto com ela.
            className="polaroid @container absolute inset-0 block rounded-[3px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-green bg-[#fbfaf7] px-[6%] pt-[6%] pb-[22%] shadow-[0_2px_6px_rgba(0,0,0,0.08),0_22px_40px_-14px_rgba(0,0,0,0.38)]"
            style={
              {
                animationDelay: `${atraso}s`,
                "--tx": LUGAR[i].tx,
                "--ty": LUGAR[i].ty,
                "--rot": LUGAR[i].rot,
                "--z": n - i,
              } as CSSProperties
            }
          >
            <div className="relative aspect-square overflow-hidden bg-[#e9e7e0]">
              <Image
                src={src}
                alt=""
                fill
                // Celular/tablet: pai com display:none + lazy → nada é baixado.
                // No desktop a polaroid tem ~450–600px de largura.
                sizes="(min-width: 1800px) 600px, 520px"
                className="object-cover"
                draggable={false}
              />
            </div>
            <div className="absolute inset-x-[6%] bottom-0 flex h-[22%] flex-col justify-center gap-[1.4cqw]">
              <p className="font-display text-[4.6cqw] leading-none font-semibold tracking-tight text-fg">
                {titulo}
              </p>
              <p className="flex min-w-0 items-center gap-[1.2cqw] text-[2.9cqw] leading-none text-muted-fg">
                <MapPin
                  aria-hidden
                  className="size-[3.2cqw] shrink-0 text-green"
                  strokeWidth={2.2}
                />
                <span className="truncate">{endereco}</span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
