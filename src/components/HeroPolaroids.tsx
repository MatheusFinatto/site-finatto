import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { preload } from "react-dom";
import type { CSSProperties, ReactNode } from "react";

// A animação (@keyframes polaroid-ciclo, globals.css) é escrita para
// exatamente 5 fotos: cada uma tem uma faixa de 20% do ciclo no topo. Os
// tipos abaixo impedem adicionar ou remover uma foto sem reescrever o CSS.
type Cinco<T> = readonly [T, T, T, T, T];

interface Foto {
  src: string;
  titulo: string;
  endereco: string;
  slug: string;
}

// Fotos do próprio portfólio da Finatto (Sanity), recortadas em quadrado sem
// a marca d'água da câmera, com leve ajuste de cor. Título (encurtado),
// endereço e slug vêm do cadastro de cada imóvel; clicar abre a página dele.
const FOTOS: Cinco<Foto> = [
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

// Tempo de cada foto no topo. A volta completa (5 × PASSO) vai inline como
// animation-duration, então só este número controla a velocidade.
const PASSO = 2.6;

// Posição e inclinação fixas de cada foto na pilha. Só a foto que vai para
// o fim se mexe (e gira); as outras ficam paradas onde estão.
const LUGAR: Cinco<{ tx: string; ty: string; rot: string }> = [
  { tx: "0%", ty: "0%", rot: "-3deg" },
  { tx: "2%", ty: "1%", rot: "2.5deg" },
  { tx: "-2%", ty: "2%", rot: "-6deg" },
  { tx: "3%", ty: "2.5%", rot: "5deg" },
  { tx: "0%", ty: "3%", rot: "-1deg" },
];

// No desktop a polaroid tem ~450–600px de largura.
const SIZES = "(min-width: 1800px) 600px, 520px";
const DESKTOP = "(min-width: 1024px)";

interface Props {
  /** Slugs de imóveis ainda publicados e não vendidos. Uma foto cujo imóvel
   *  saiu do ar continua na pilha (a animação precisa das 5), só sem link. */
  slugsAtivos: ReadonlySet<string>;
}

export default function HeroPolaroids({ slugsAtivos }: Props) {
  const n = FOTOS.length;

  // A foto do topo é o maior elemento da primeira tela no desktop (LCP):
  // pré-carrega a variante certa, só em tela de desktop. Celular e tablet não
  // mostram a pilha (pai com display:none + imagens lazy) e não baixam nada.
  const { props: topo } = getImageProps({
    src: FOTOS[0].src,
    alt: "",
    fill: true,
    sizes: SIZES,
  });
  preload(topo.src, {
    as: "image",
    imageSrcSet: topo.srcSet,
    imageSizes: topo.sizes,
    fetchPriority: "high",
    media: DESKTOP,
  });

  return (
    // .pilha-polaroids: hover ou foco dentro pausa a troca (globals.css).
    // A largura é a menor entre a da coluna e a que a altura disponível
    // permite (proporção 0,83), então a pilha nunca invade o texto.
    <div className="pilha-polaroids relative aspect-[0.83] w-[min(100cqw,calc(100cqh*0.83))]">
      {FOTOS.map(({ src, titulo, endereco, slug }, i) => {
        // Foto i começa na profundidade i. Na linha do tempo da animação ela
        // fica no topo em 0–20%, e a profundidade d (≥1) ocupa a faixa
        // (n − d) × 20%; daí o atraso. --z só vale com movimento reduzido.
        const atraso = +(-((n - i) % n) * PASSO).toFixed(2);
        const ativo = slugsAtivos.has(slug);

        // @container: a legenda usa cqw (% da largura da polaroid), então
        // cresce e encolhe junto com ela.
        const className =
          "polaroid @container absolute inset-0 block rounded-[3px] bg-[#fbfaf7] px-[6%] pt-[6%] pb-[22%] shadow-[0_2px_6px_rgba(0,0,0,0.08),0_22px_40px_-14px_rgba(0,0,0,0.38)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-green";
        const style = {
          animationDelay: `${atraso}s`,
          animationDuration: `${n * PASSO}s`,
          "--tx": LUGAR[i].tx,
          "--ty": LUGAR[i].ty,
          "--rot": LUGAR[i].rot,
          "--z": n - i,
        } as CSSProperties;

        const conteudo: ReactNode = (
          <>
            <div className="relative aspect-square overflow-hidden bg-[#e9e7e0]">
              <Image
                src={src}
                alt=""
                fill
                sizes={SIZES}
                fetchPriority={i === 0 ? "high" : undefined}
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
          </>
        );

        return ativo ? (
          <Link
            key={src}
            href={`/imoveis/${slug}`}
            // Sem prefetch: são 5 links visíveis de uma vez e só o do topo
            // costuma ser clicado.
            prefetch={false}
            className={className}
            style={style}
          >
            {conteudo}
          </Link>
        ) : (
          <div key={src} className={className} style={style}>
            {conteudo}
          </div>
        );
      })}
    </div>
  );
}
