// Tracks last reading position. LocalStorage for now; move to Supabase later.
const KEY = "biblia.last-read.v1";

export interface LastRead {
  bookId: string;
  bookName: string;
  chapter: number;
  verse?: number;
  at: string;
}

export const readingProgress = {
  get(): LastRead | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as LastRead) : null;
    } catch {
      return null;
    }
  },
  set(value: LastRead) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("reading:changed"));
  },
};
