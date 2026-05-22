import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DailyDevotional {
  id: string;
  day_number: number;
  title: string;
  verse_reference: string;
  verse_text: string;
  reflection: string;
  prayer: string;
  product_url: string | null;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_PRODUCT_URL = "https://s.shopee.com.br/9fHvmPWQgY";

export function todayDayNumber(): number {
  // Dia 1..30 baseado no dia do mês (ciclo mensal estável).
  const d = new Date().getDate();
  return ((d - 1) % 30) + 1;
}

export function useDailyDevotional(day?: number) {
  const n = day ?? todayDayNumber();
  return useQuery({
    queryKey: ["devotional", n],
    queryFn: async (): Promise<DailyDevotional | null> => {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .eq("day_number", n)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as DailyDevotional | null;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useAllDevotionals() {
  return useQuery({
    queryKey: ["devotionals", "all"],
    queryFn: async (): Promise<DailyDevotional[]> => {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .order("day_number", { ascending: true });
      if (error) throw error;
      return (data ?? []) as DailyDevotional[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useProductUrl() {
  return useQuery({
    queryKey: ["app_settings", "book_product_url"],
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "book_product_url")
        .maybeSingle();
      if (error) throw error;
      return (data?.value as string) || DEFAULT_PRODUCT_URL;
    },
    staleTime: 1000 * 60 * 30,
  });
}
