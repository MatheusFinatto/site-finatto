import Link from "next/link";
import { SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WppIcon from "@/components/WppIcon";
import { WHATSAPP_FINATTO, whatsappLink } from "@/lib/utils";
import { WPP_MSG_FINATTO } from "@/lib/constants";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-x flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center py-16 text-center">
        <span
          aria-hidden
          className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-green shadow-card"
        >
          <SearchX size={28} strokeWidth={1.75} />
        </span>
        <h1 className="mt-6 max-w-[18ch] text-balance text-[clamp(32px,5vw,52px)] text-fg">
          Esta página não existe mais.
        </h1>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-muted-fg">
          O imóvel pode ter saído do catálogo ou o endereço mudou. Os imóveis
          à venda em Erechim e região estão todos na lista.
        </p>
        <div className="mt-8 flex w-full max-w-[420px] flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row">
          <Link href="/#imoveis" className="btn btn-lg btn-wpp">
            Ver imóveis à venda
          </Link>
          <a
            href={whatsappLink(WHATSAPP_FINATTO, WPP_MSG_FINATTO)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-wpp-outline"
          >
            <WppIcon size={17} /> Falar com os sócios
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
