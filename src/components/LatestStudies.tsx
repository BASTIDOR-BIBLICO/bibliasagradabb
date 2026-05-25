import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const CHANNEL_URL = "https://www.youtube.com/@bastidorbiblico";
const CHANNEL_HANDLE = "@bastidorbiblico";
const SETTING_KEY = "latest_video_url";

/**
 * Extracts a YouTube video ID from common URL formats.
 * Returns null when the URL points to a channel/handle (no specific video).
 */
function extractVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "").trim();
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const i = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
      if (i >= 0 && parts[i + 1]) return parts[i + 1];
    }
  } catch {
    // not a parseable URL
  }
  return null;
}

export function LatestStudies() {
  const [open, setOpen] = useState(false);

  const { data: videoUrl } = useQuery({
    queryKey: ["app_settings", SETTING_KEY],
    queryFn: async (): Promise<string | null> => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", SETTING_KEY)
        .maybeSingle();
      if (error) throw error;
      return (data?.value as string) ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });

  const videoId = extractVideoId(videoUrl);
  const thumb = videoId
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : null;

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
        {videoId ? (
          <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative block aspect-video w-full overflow-hidden"
              aria-label="Assistir ao último vídeo"
            >
              {thumb && (
                <img
                  src={thumb}
                  alt="Último vídeo do canal Bastidor Bíblico"
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Play className="h-7 w-7 translate-x-0.5 fill-current" />
                </span>
              </span>
            </button>
          </article>
        ) : (
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-video w-full overflow-hidden rounded-xl border border-dashed border-border bg-card"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Youtube className="h-10 w-10 text-primary" />
              <p className="font-serif text-lg">Canal Bastidor Bíblico</p>
              <p className="text-sm text-muted-foreground">
                Defina a URL do último vídeo no Painel do Administrador.
              </p>
            </div>
          </a>
        )}

        <div className="mt-5 flex justify-center">
          <Button asChild size="lg" className="gap-2">
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5" />
              🔴 Inscreva-se no canal {CHANNEL_HANDLE}
            </a>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 sm:rounded-lg overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="font-serif text-lg">
              Último vídeo — Bastidor Bíblico
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full bg-black">
            {videoId && open && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Último vídeo do canal Bastidor Bíblico"
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
