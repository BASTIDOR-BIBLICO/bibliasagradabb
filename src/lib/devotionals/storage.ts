// Local storage layer for devotional notes.
// Replace with Supabase calls when backend is ready.

export interface Devotional {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  note: string;
  createdAt: string; // ISO
  updatedAt: string;
}

const KEY = "biblia.devotionals.v1";

function read(): Devotional[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Devotional[]) : [];
  } catch {
    return [];
  }
}

function write(items: Devotional[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("devotionals:changed"));
}

export const devotionalStore = {
  list(): Devotional[] {
    return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  forVerse(bookId: string, chapter: number, verse: number): Devotional | undefined {
    return read().find(
      (d) => d.bookId === bookId && d.chapter === chapter && d.verse === verse,
    );
  },
  upsert(input: Omit<Devotional, "id" | "createdAt" | "updatedAt"> & { id?: string }) {
    const items = read();
    const now = new Date().toISOString();
    const existing = input.id
      ? items.find((d) => d.id === input.id)
      : items.find(
          (d) =>
            d.bookId === input.bookId &&
            d.chapter === input.chapter &&
            d.verse === input.verse,
        );
    if (existing) {
      existing.note = input.note;
      existing.updatedAt = now;
    } else {
      items.push({
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      });
    }
    write(items);
  },
  remove(id: string) {
    write(read().filter((d) => d.id !== id));
  },
};
