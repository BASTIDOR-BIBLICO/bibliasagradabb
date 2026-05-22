
-- Restringe is_admin: só faz sentido para autenticados (admin precisa estar logado)
revoke execute on function public.is_admin() from anon, public;
grant execute on function public.is_admin() to authenticated;

-- Fix search_path em touch_updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;
