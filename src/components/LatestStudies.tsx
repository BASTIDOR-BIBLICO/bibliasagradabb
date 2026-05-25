import { useState } from "react";
import { Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Study {
  id: string;
  title: string;
  videoId: string;
}

// Vídeos recentes do canal Bastidor Bíblico (estrutura local para evitar CORS/API).
const STUDIES: Study[] = [
  {
    id: "1",
    title: "O Mistério por Trás do Livro de Apocalipse",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Quem Realmente Escreveu os Evangelhos?",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "Os Bastidores do Êxodo: Verdade ou Mito?",
    videoId: "dQw4w9WgXcQ",
  },
];

const CHANNEL_URL = "https://www.youtube.com/@bastidorbiblico";

export function LatestStudies() {
  const [active, setActive] = useState<Study | null>(null);

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">
            Bastidor Bíblico
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
            Últimos Estudos
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STUDIES.map((s) => (
          <article
            key={s.id}
            className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40 hover:shadow-sm"
          >
            <button
              type="button"
              onClick={() => setActive(s)}
              className="relative block aspect-video w-full overflow-hidden"
              aria-label={`Assistir: ${s.title}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${s.videoId}/hqdefault.jpg`}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                </span>
              </span>
            </button>
            <div className="p-4">
              <h3 className="line-clamp-2 font-serif text-base leading-snug">
                {s.title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setActive(s)}
              >
                <Play className="mr-1.5 h-3.5 w-3.5" /> Assistir
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube className="h-5 w-5" />
            🔴 Inscreva-se no canal Bastidor Bíblico
          </a>
        </Button>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl p-0 sm:rounded-lg overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="font-serif text-lg">
              {active?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full bg-black">
            {active && (
              <iframe
                key={active.id}
                src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
