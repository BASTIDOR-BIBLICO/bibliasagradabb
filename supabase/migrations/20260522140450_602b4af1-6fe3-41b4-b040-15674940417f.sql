
-- Bíblia tables (recriadas no novo projeto Cloud)
create table if not exists public.books (
  id int primary key,
  name text not null,
  testament text not null
);
alter table public.books enable row level security;
create policy "books_public_read" on public.books for select to anon, authenticated using (true);

create table if not exists public.verses (
  book_id int not null references public.books(id) on delete cascade,
  chapter int not null,
  verse int not null,
  text text not null,
  primary key (book_id, chapter, verse)
);
create index if not exists verses_book_chapter_idx on public.verses(book_id, chapter);
alter table public.verses enable row level security;
create policy "verses_public_read" on public.verses for select to anon, authenticated using (true);

-- Devotionals (30 dias, podendo ir até 60)
create table if not exists public.devotionals (
  id uuid primary key default gen_random_uuid(),
  day_number int not null unique check (day_number between 1 and 60),
  title text not null,
  verse_reference text not null,
  verse_text text not null,
  reflection text not null,
  prayer text not null,
  product_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.devotionals enable row level security;
create policy "devotionals_public_read" on public.devotionals for select to anon, authenticated using (true);

-- Admin allowlist
create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admin_emails enable row level security;
create policy "admin_emails_self_read" on public.admin_emails for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Função is_admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- Escrita admin nos devocionais
create policy "devotionals_admin_write" on public.devotionals for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Trigger updated_at
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_devotionals_touch on public.devotionals;
create trigger trg_devotionals_touch before update on public.devotionals
  for each row execute function public.touch_updated_at();

-- App settings
create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
create policy "app_settings_public_read" on public.app_settings for select to anon, authenticated using (true);
create policy "app_settings_admin_write" on public.app_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop trigger if exists trg_app_settings_touch on public.app_settings;
create trigger trg_app_settings_touch before update on public.app_settings
  for each row execute function public.touch_updated_at();

insert into public.app_settings (key, value)
values ('book_product_url', 'https://s.shopee.com.br/9fHvmPWQgY')
on conflict (key) do nothing;
