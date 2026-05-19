/**
 * Auth + devotionals service.
 * Auth: Supabase real. Devotionals: localStorage (persistência local).
 */
import { supabase } from "@/integrations/supabase/client";
import { devotionalStore } from "@/lib/devotionals/storage";

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },
  async signUp(email: string, password: string) {
    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
    return data.user;
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

export const devotionalsService = {
  async list() {
    return devotionalStore.list();
  },
  async upsert(input: Parameters<typeof devotionalStore.upsert>[0]) {
    devotionalStore.upsert(input);
  },
  async remove(id: string) {
    devotionalStore.remove(id);
  },
};
