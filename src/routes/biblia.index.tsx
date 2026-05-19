import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useBooks, type DbBook } from "@/lib/bible/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/biblia/")({
  component: BibleIndex,
  head: () => ({ meta: [{ title: "Bíblia — Bíblia Sagrada BB" }] }),
});

const isOld = (t: DbBook["testament"]) => /antigo|old|^at$/i.test(String(t));

function BibleIndex() {
  const [tab, setTab] = useState<"AT" | "NT">("AT");
  const { data: books, isLoading, error } = useBooks();

  const filtered = useMemo(() => {
    if (!books) return [];
    return books.filter((b) => (tab === "AT" ? isOld(b.testament) : !isOld(b.testament)));
  }, [books, tab]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Bíblia Sagrada</h1>
        <p className="mt-1 text-sm text-muted-foreground">Selecione um livro para começar.</p>
      </header>

      <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1">
        {(["AT", "NT"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando livros...</p>}
      {error && <p className="text-sm text-destructive">Erro ao carregar livros.</p>}

      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {filtered.map((book) => (
          <li key={book.id}>
            <Link
              to="/biblia/$bookId"
              params={{ bookId: String(book.id) }}
              className="block rounded-lg border border-transparent px-3 py-2.5 transition hover:border-border hover:bg-card"
            >
              <span className="font-serif text-base">{book.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
