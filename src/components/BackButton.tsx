"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Volta para a lista preservando filtros e posição de scroll. Quem chegou de
 * fora (Google, link compartilhado) não tem lista para onde voltar: nesse
 * caso vai para a lista de imóveis, em vez de ser devolvido ao site anterior.
 */
export default function BackButton({ label = "Voltar" }: { label?: string }) {
  const router = useRouter();
  const handleBack = () => {
    let veioDoSite = false;
    try {
      veioDoSite =
        document.referrer !== "" &&
        new URL(document.referrer).origin === window.location.origin;
    } catch {
      veioDoSite = false;
    }
    // Navegação interna do Next não muda o referrer do documento; o card
    // marca na sessão qual imóvel foi aberto de dentro do site.
    let navegouAqui = false;
    try {
      navegouAqui =
        sessionStorage.getItem("finatto:navegou") === window.location.pathname;
    } catch {
      navegouAqui = false;
    }
    if ((veioDoSite || navegouAqui) && window.history.length > 1) {
      router.back();
    } else {
      router.push("/#imoveis");
    }
  };
  return (
    <button
      type="button"
      onClick={handleBack}
      className="btn btn-sm btn-ghost shrink-0"
    >
      <ArrowLeft size={15} strokeWidth={2.25} aria-hidden /> {label}
    </button>
  );
}
