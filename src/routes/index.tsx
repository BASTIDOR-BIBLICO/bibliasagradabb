import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, NotebookPen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readingProgress, type LastRead } from "@/lib/reading-progress";
import { useDevotionals } from "@/hooks/useDevotionals";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Início — Lectio" }],
  }),
});

function Dashboard() {
  const [last, setLast] = useState<LastRead | null>(null);
  const { items } = useDevotionals();

  useEffect(() => {
    const refresh = () => setLast(readingProgress.get());
    refresh();
    window.addEventListener("reading:changed", refresh);
    return () => window.removeEventListener("reading:changed", refresh);
  }, []);

  const recent = items.slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <section className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          A paz esteja com você.
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Continue sua leitura ou comece um novo capítulo. Cada versículo pode se tornar um devocional.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Continuar leitura
        </h2>
        {last ? (
          <Link
            to="/biblia/$bookId/$chapter"
            params={{ bookId: last.bookId, chapter: String(last.chapter) }}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div>
              <p className="font-serif text-2xl">
                {last.bookName} {last.chapter}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Última leitura em {new Date(last.at).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-muted-foreground">Você ainda não começou nenhuma leitura.</p>
            <Button asChild className="mt-4">
              <Link to="/biblia">
                <BookOpen className="mr-2 h-4 w-4" /> Abrir a Bíblia
              </Link>
            </Button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Devocionais recentes
          </h2>
          <Link to="/devocionais" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-muted-foreground">
            <NotebookPen className="mx-auto mb-2 h-5 w-5" />
            Toque em um versículo durante a leitura para escrever sua primeira nota.
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((d) => (
              <li key={d.id} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-primary">
                  {d.bookName} {d.chapter}:{d.verse}
                </p>
                <p className="mt-1 font-serif italic text-muted-foreground line-clamp-2">"{d.verseText}"</p>
                <p className="mt-2 line-clamp-2 text-sm">{d.note}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
