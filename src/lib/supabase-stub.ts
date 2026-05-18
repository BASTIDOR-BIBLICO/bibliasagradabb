/**
 * Supabase service stub.
 *
 * Quando o backend estiver conectado (Lovable Cloud), substitua o conteúdo
 * destas funções por chamadas reais ao client `@/integrations/supabase/client`.
 * A assinatura das funções foi pensada para corresponder 1:1 às tabelas
 * sugeridas: `profiles`, `devotionals`, `reading_progress`.
 */

import { devotionalStore, type Devotional } from "@/lib/devotionals/storage";

export interface AuthUser {
  id: string;
  email: string;
}

const AUTH_KEY = "biblia.auth.user";

export const authService = {
  async signIn(email: string, _password: string): Promise<AuthUser> {
    // TODO: supabase.auth.signInWithPassword({ email, password })
    const user: AuthUser = { id: crypto.randomUUID(), email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },
  async signUp(email: string, _password: string): Promise<AuthUser> {
    // TODO: supabase.auth.signUp({ email, password })
    const user: AuthUser = { id: crypto.randomUUID(), email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },
  async signOut() {
    // TODO: supabase.auth.signOut()
    localStorage.removeItem(AUTH_KEY);
  },
  current(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
};

export const devotionalsService = {
  async list(): Promise<Devotional[]> {
    // TODO: supabase.from('devotionals').select('*').order('created_at', { ascending: false })
    return devotionalStore.list();
  },
  async upsert(input: Parameters<typeof devotionalStore.upsert>[0]) {
    // TODO: supabase.from('devotionals').upsert(...)
    devotionalStore.upsert(input);
  },
  async remove(id: string) {
    // TODO: supabase.from('devotionals').delete().eq('id', id)
    devotionalStore.remove(id);
  },
};
