import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Minus, Plus, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useDevotionals } from "@/hooks/useDevotionals";
import { VerseNoteSheet } from "@/components/VerseNoteSheet";
import { readingProgress } from "@/lib/reading-progress";
import { useBook, useChapter, useChapterCount } from "@/lib/bible/queries";

export const Route = createFileRoute("/_authenticated/biblia/$bookId/$chapter")({
  component: ReaderPage,
  head: () => ({ meta: [{ title: "Leitura — Lectio" }] }),
});

function ReaderPage() {
  const { bookId, chapter } = Route.useParams();
  const id = Number(bookId);
  const chapterNum = Number(chapter);
  if (!Number.isFinite(id) || !Number.isFinite(chapterNum)) throw notFound();

  const { data: book } = useBook(id);
  const { data: verses = [], isLoading } = useChapter(id, chapterNum);
  const { data: maxChapter = 0 } = useChapterCount(id);

  const { fontSize, increaseFont, decreaseFont } = useReaderSettings();
  const { items } = useDevotionals();
  const [activeVerse, setActiveVerse] = useState<number | null>(null);

  useEffect(() => {
    if (!book) return;
    readingProgress.set({
      bookId: String(book.id),
      bookName: book.name,
      chapter: chapterNum,
      at: new Date().toISOString(),
    });
    window.scrollTo({ top: 0 });
  }, [book, chapterNum]);

  const notedVerses = new Set(
    items.filter((d) => d.bookId === String(id) && d.chapter === chapterNum).map((d) => d.verse),
  );

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = maxChapter && chapterNum < maxChapter ? chapterNum + 1 : null;
  const activeVerseObj = activeVerse != null ? verses.find((v) => v.verse === activeVerse) : null;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/biblia/$bookId" params={{ bookId }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Capítulos
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={decreaseFont} aria-label="Diminuir fonte">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={increaseFont} aria-label="Aumentar fonte">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{book?.name ?? ""}</p>
        <h1 className="mt-2 font-serif text-5xl">{chapterNum}</h1>
      </header>

      {isLoading ? (
        <p className="text-center text-sm text-muted-foreground">Carregando versículos...</p>
      ) : (
        <article className="reader-text" style={{ fontSize: `${fontSize}px` }}>
          {verses.map((v) => {
            const hasNote = notedVerses.has(v.verse);
            return (
              <span
                key={v.verse}
                onClick={() => setActiveVerse(v.verse)}
                className={cn(
                  "cursor-pointer rounded px-0.5 transition-colors hover:bg-accent/60",
                  hasNote && "bg-[var(--color-verse-highlight)] hover:bg-[var(--color-verse-highlight)]",
                )}
              >
                <sup className="mr-1 select-none font-sans text-[0.65em] font-semibold text-primary">
                  {v.verse}
                </sup>
                {v.text}{" "}
                {hasNote && <NotebookPen className="mx-0.5 inline h-3 w-3 text-primary" />}
              </span>
            );
          })}
        </article>
      )}

      <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
        {prevChapter ? (
          <Button asChild variant="ghost">
            <Link to="/biblia/$bookId/$chapter" params={{ bookId, chapter: String(prevChapter) }}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Capítulo {prevChapter}
            </Link>
          </Button>
        ) : <span />}
        {nextChapter ? (
          <Button asChild variant="ghost">
            <Link to="/biblia/$bookId/$chapter" params={{ bookId, chapter: String(nextChapter) }}>
              Capítulo {nextChapter} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : <span />}
      </nav>

      <VerseNoteSheet
        open={activeVerse != null}
        onOpenChange={(o) => !o && setActiveVerse(null)}
        bookId={String(id)}
        bookName={book?.name ?? ""}
        chapter={chapterNum}
        verse={activeVerse}
        verseText={activeVerseObj?.text ?? ""}
      />
    </main>
  );
}
