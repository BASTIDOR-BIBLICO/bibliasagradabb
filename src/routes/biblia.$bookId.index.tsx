import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useBook, useChapterCount } from "@/lib/bible/queries";

export const Route = createFileRoute("/biblia/$bookId/")({
  component: ChapterGrid,
  head: () => ({ meta: [{ title: "Livro — Lectio" }] }),
});

function ChapterGrid() {
  const { bookId } = Route.useParams();
  const id = Number(bookId);
  const { data: book, isLoading } = useBook(id);
  const { data: chapters = 0 } = useChapterCount(id);

  if (!Number.isFinite(id)) throw notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/biblia" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Livros
      </Link>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : !book ? (
        <p className="text-sm text-destructive">Livro não encontrado.</p>
      ) : (
        <>
          <h1 className="font-serif text-3xl">{book.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {String(book.testament)} Testamento · {chapters} capítulos
          </p>

          <ul className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {Array.from({ length: chapters }, (_, i) => i + 1).map((c) => (
              <li key={c}>
                <Link
                  to="/biblia/$bookId/$chapter"
                  params={{ bookId: String(book.id), chapter: String(c) }}
                  className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card font-serif text-lg transition hover:border-primary hover:bg-accent hover:text-accent-foreground"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
