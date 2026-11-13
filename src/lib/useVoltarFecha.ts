import { useCallback, useEffect, useRef, type RefObject } from "react";

/**
 * Faz o "voltar" do navegador (gesto do Android, botão do sistema) fechar uma
 * tela cheia em vez de sair da página. Abrir empilha uma entrada no histórico;
 * voltar fecha o <dialog>; fechar pelo X ou Esc desempilha a entrada.
 */
export function useVoltarFecha(dialogo: RefObject<HTMLDialogElement | null>) {
  const porVoltar = useRef(false);

  useEffect(() => {
    const aoVoltar = () => {
      if (!dialogo.current?.open) return;
      porVoltar.current = true;
      dialogo.current.close();
    };
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, [dialogo]);

  /** Chamar no clique que abre a tela cheia. */
  const empilhar = useCallback(() => {
    porVoltar.current = false;
    window.history.pushState(null, "", window.location.href);
  }, []);

  /** Chamar no evento `close` do <dialog>. */
  const desempilhar = useCallback(() => {
    if (!porVoltar.current) window.history.back();
    porVoltar.current = false;
  }, []);

  return { empilhar, desempilhar };
}
