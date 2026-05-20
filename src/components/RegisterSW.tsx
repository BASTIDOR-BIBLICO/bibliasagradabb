import { useEffect } from "react";

/**
 * Registra o service worker — APENAS em produção, fora de iframe,
 * e fora dos domínios de preview do Lovable. Isso evita cache stale
 * no editor e garante que offline funcione no site publicado.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const isDev = import.meta.env.DEV;
    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch {
      inIframe = true;
    }
    const host = window.location.hostname;
    const isPreviewHost =
      host.includes("id-preview--") || host.includes("lovableproject.com");

    if (isDev || inIframe || isPreviewHost) {
      // Limpa qualquer SW antigo no preview/dev
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[SW] registro falhou:", err);
    });
  }, []);

  return null;
}
