import { useEffect, useState, useCallback } from "react";
import { X, Share, Plus, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "bb.install.dismissedAt.v2";
const DISMISS_MS = 24 * 60 * 60 * 1000; // 24h

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPromptGlobal: BIPEvent | null = null;

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream;
}

function wasDismissedRecently() {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    return Date.now() - Number(v) < DISMISS_MS;
  } catch {
    return false;
  }
}

// Capture beforeinstallprompt as early as possible, even before banner mounts
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPromptGlobal = e as BIPEvent;
    window.dispatchEvent(new CustomEvent("bb:bip-ready"));
  });
  window.addEventListener("appinstalled", () => {
    deferredPromptGlobal = null;
    try { localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS * 365)); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("bb:installed"));
  });
}

export function openInstallBanner() {
  window.dispatchEvent(new CustomEvent("bb:open-install"));
}

export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    const _ios = isIOS();
    setIos(_ios);
    setDeferred(deferredPromptGlobal);

    const params = new URLSearchParams(window.location.search);
    const forceOpen = params.get("install") === "1";

    const shouldShow = forceOpen || !wasDismissedRecently();

    if (shouldShow) {
      // Slight delay so it doesn't flash during hydration
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onBip = () => setDeferred(deferredPromptGlobal);
    const onOpen = () => setVisible(true);
    const onInstalled = () => setVisible(false);
    window.addEventListener("bb:bip-ready", onBip);
    window.addEventListener("bb:open-install", onOpen);
    window.addEventListener("bb:installed", onInstalled);
    return () => {
      window.removeEventListener("bb:bip-ready", onBip);
      window.removeEventListener("bb:open-install", onOpen);
      window.removeEventListener("bb:installed", onInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (ios || !deferred) {
      setShowIosHelp(true);
      return;
    }
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        deferredPromptGlobal = null;
        setVisible(false);
      } else {
        dismiss();
      }
    } catch {
      setShowIosHelp(true);
    }
  }, [deferred, ios, dismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 id="install-title" className="font-serif text-xl leading-tight text-foreground">
              Instale nosso app no seu celular
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Acesse este conteúdo com mais facilidade. Instale o app na tela inicial do seu
              celular e abra sempre que quiser, como um aplicativo normal.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Fechar"
            className="-mr-2 -mt-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {showIosHelp || (ios && !deferred) ? (
          <div className="mt-5 space-y-2 rounded-xl bg-muted/60 p-4 text-sm text-foreground/90">
            <p className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span className="flex flex-wrap items-center gap-1">
                Toque em <Share className="inline h-4 w-4 text-primary" />
                <span className="font-medium">Compartilhar</span> na barra do Safari.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span className="flex flex-wrap items-center gap-1">
                Escolha <Plus className="inline h-4 w-4 text-primary" />
                <span className="font-medium">Adicionar à Tela de Início</span>.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>Confirme tocando em <span className="font-medium">Adicionar</span>.</span>
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button onClick={install} size="lg" className="h-12 w-full text-base font-semibold sm:w-auto sm:flex-1">
            <Download className="mr-2 h-5 w-5" />
            Instalar aplicativo
          </Button>
          <Button onClick={dismiss} variant="ghost" size="lg" className="h-12 w-full sm:w-auto">
            Agora não
          </Button>
        </div>
      </div>
    </div>
  );
}
