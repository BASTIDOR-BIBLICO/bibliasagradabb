import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBook } from "@/lib/bible/books";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/biblia/$bookId/")({
  component: ChapterGrid,
  head: ({ params }) => {
    const b = getBook(params.bookId);
    return { meta: [{ title: `${b?.name ?? "Livro"} — Lectio` }] };
  },
});

function ChapterGrid() {
  const { bookId } = Route.useParams();
  const book = getBook(bookId);
  if (!book) throw notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/biblia" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Livros
      </Link>
      <h1 className="font-serif text-3xl">{book.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {book.testament === "AT" ? "Antigo" : "Novo"} Testamento · {book.chapters} capítulos
      </p>

      <ul className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
          <li key={c}>
            <Link
              to="/biblia/$bookId/$chapter"
              params={{ bookId: book.id, chapter: String(c) }}
              className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card font-serif text-lg transition hover:border-primary hover:bg-accent hover:text-accent-foreground"
            >
              {c}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
