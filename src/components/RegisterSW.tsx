import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Registers the SW (prod only, outside iframes/preview), polls for updates,
 * and shows a small toast when a new version is waiting.
 */
export function RegisterSW() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const isDev = import.meta.env.DEV;
    let inIframe = false;
    try { inIframe = window.self !== window.top; } catch { inIframe = true; }
    const host = window.location.hostname;
    const isPreviewHost =
      host.includes("id-preview--") || host.includes("lovableproject.com");

    if (isDev || inIframe || isPreviewHost) {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const forceFresh = params.has("v") || params.get("fresh") === "1";

    let reg: ServiceWorkerRegistration | null = null;

    const watchWaiting = (r: ServiceWorkerRegistration) => {
      if (r.waiting) setWaiting(r.waiting);
      r.addEventListener("updatefound", () => {
        const nw = r.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            setWaiting(nw);
          }
        });
      });
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (r) => {
        reg = r;
        watchWaiting(r);
        if (forceFresh) {
          try { await r.update(); } catch { /* ignore */ }
        }
      })
      .catch((err) => console.warn("[SW] registro falhou:", err));

    // Periodic update check (every 60 min) + when tab regains focus
    const interval = window.setInterval(() => { reg?.update().catch(() => {}); }, 60 * 60 * 1000);
    const onFocus = () => { reg?.update().catch(() => {}); };
    window.addEventListener("focus", onFocus);

    // Reload once when the new SW takes control
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const update = () => {
    if (!waiting) return;
    waiting.postMessage({ type: "SKIP_WAITING" });
  };

  if (!waiting) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-3">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-xl">
        <RefreshCw className="h-4 w-4 text-primary" />
        <span className="text-sm text-foreground">Nova versão disponível.</span>
        <Button size="sm" onClick={update} className="h-8 rounded-full px-3">
          Atualizar
        </Button>
      </div>
    </div>
  );
}
