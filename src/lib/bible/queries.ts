import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbBook {
  id: number;
  name: string;
  testament: "Antigo" | "Novo" | string;
}

export interface DbVerse {
  verse: number;
  text: string;
}

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<DbBook[]> => {
      const { data, error } = await supabase
        .from("books")
        .select("id, name, testament")
        .order("id", { ascending: true });
      if (error) throw error;
      return (data ?? []) as DbBook[];
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: async (): Promise<DbBook | null> => {
      const { data, error } = await supabase
        .from("books")
        .select("id, name, testament")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as DbBook | null;
    },
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 60,
  });
}

export function useChapterCount(bookId: number) {
  return useQuery({
    queryKey: ["chapter-count", bookId],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from("verses")
        .select("chapter")
        .eq("book_id", bookId)
        .order("chapter", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data?.[0]?.chapter ?? 0;
    },
    enabled: Number.isFinite(bookId),
    staleTime: 1000 * 60 * 60,
  });
}

export function useChapter(bookId: number, chapter: number) {
  return useQuery({
    queryKey: ["verses", bookId, chapter],
    queryFn: async (): Promise<DbVerse[]> => {
      const { data, error } = await supabase
        .from("verses")
        .select("verse, text")
        .eq("book_id", bookId)
        .eq("chapter", chapter)
        .order("verse", { ascending: true });
      if (error) throw error;
      return (data ?? []) as DbVerse[];
    },
    enabled: Number.isFinite(bookId) && Number.isFinite(chapter),
    staleTime: 1000 * 60 * 5,
  });
}
