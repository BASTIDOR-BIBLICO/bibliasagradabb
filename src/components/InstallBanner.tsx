import { useEffect, useState } from "react";
import { X, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "bb.install.dismissed.v1";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    if (!isMobile()) return;
    if (localStorage.getItem(KEY)) return;

    const _ios = isIOS();
    setIos(_ios);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari never fires beforeinstallprompt — show the tutorial directly
    if (_ios) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBIP);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:hidden">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-foreground/10">
        <div className="flex items-start gap-3">
          <img src="/icon-192.png" alt="" className="h-10 w-10 rounded-lg" width={40} height={40} />
          <div className="flex-1">
            <p className="font-serif text-base leading-tight text-foreground">
              Instale a Bíblia Sagrada BB
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Adicione à tela de início para ler offline, em tela cheia e com acesso rápido.
            </p>

            {ios ? (
              <div className="mt-3 space-y-2 rounded-lg bg-muted/50 p-3 text-xs text-foreground/90">
                <p className="flex items-center gap-1.5">
                  1. Toque em <Share className="inline h-3.5 w-3.5 text-primary" /> <span className="font-medium">Compartilhar</span> na barra do Safari.
                </p>
                <p className="flex items-center gap-1.5">
                  2. Escolha <Plus className="inline h-3.5 w-3.5 text-primary" /> <span className="font-medium">Adicionar à Tela de Início</span>.
                </p>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={install} disabled={!deferred} className="flex-1">
                  Adicionar à tela
                </Button>
              </div>
            )}
          </div>
          <button
            onClick={dismiss}
            aria-label="Fechar"
            className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
