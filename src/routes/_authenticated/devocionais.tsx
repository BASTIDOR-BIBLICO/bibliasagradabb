import { createFileRoute, Link } from "@tanstack/react-router";
import { useDevotionals } from "@/hooks/useDevotionals";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/devocionais")({
  component: DevotionalsPage,
  head: () => ({ meta: [{ title: "Meus Devocionais — Lectio" }] }),
});

function DevotionalsPage() {
  const { items } = useDevotionals();

  // group by date (yyyy-mm-dd)
  const groups = items.reduce<Record<string, typeof items>>((acc, d) => {
    const key = d.createdAt.slice(0, 10);
    (acc[key] ||= []).push(d);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl">Meus Devocionais</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suas reflexões pessoais, organizadas por data.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <NotebookPen className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          <p className="text-muted-foreground">Você ainda não escreveu nenhum devocional.</p>
          <Button asChild className="mt-5">
            <Link to="/biblia">Começar a ler</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groups).map(([date, entries]) => (
            <section key={date}>
              <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </h2>
              <ul className="space-y-3">
                {entries.map((d) => (
                  <li key={d.id}>
                    <Link
                      to="/biblia/$bookId/$chapter"
                      params={{ bookId: d.bookId, chapter: String(d.chapter) }}
                      className="block rounded-xl border border-border bg-card p-5 transition hover:border-primary/40"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-primary">
                        {d.bookName} {d.chapter}:{d.verse}
                      </p>
                      <p className="mt-2 font-serif italic text-muted-foreground leading-relaxed">
                        "{d.verseText}"
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-foreground">{d.note}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
