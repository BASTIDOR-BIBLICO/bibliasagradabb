import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHANNEL_URL = "https://www.youtube.com/@bastidorbiblico";
const CHANNEL_HANDLE = "@bastidorbiblico";
const EMBED_URL = "https://www.youtube.com/embed/2Z-WJEO-2z8";

export function LatestStudies() {
  return (
    <section className="mb-12">
      <div className="mb-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Bastidor Bíblico
        </p>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
          ÚLTIMO VÍDEO DO NOSSO CANAL
        </h2>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-sm">
          <iframe
            src={EMBED_URL}
            title="Último vídeo do canal Bastidor Bíblico"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>

        <div className="mt-5 flex justify-center">
          <Button asChild size="lg" className="gap-2">
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5" />
              🔴 Inscreva-se no canal {CHANNEL_HANDLE}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
