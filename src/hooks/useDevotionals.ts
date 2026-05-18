import { useEffect, useState, useCallback } from "react";
import { devotionalStore, type Devotional } from "@/lib/devotionals/storage";

export function useDevotionals() {
  const [items, setItems] = useState<Devotional[]>([]);

  const refresh = useCallback(() => {
    setItems(devotionalStore.list());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("devotionals:changed", onChange);
    return () => window.removeEventListener("devotionals:changed", onChange);
  }, [refresh]);

  return { items, refresh };
}

export function useVerseDevotional(bookId: string, chapter: number, verse: number) {
  const [item, setItem] = useState<Devotional | undefined>();
  useEffect(() => {
    const refresh = () =>
      setItem(devotionalStore.forVerse(bookId, chapter, verse));
    refresh();
    window.addEventListener("devotionals:changed", refresh);
    return () => window.removeEventListener("devotionals:changed", refresh);
  }, [bookId, chapter, verse]);
  return item;
}
