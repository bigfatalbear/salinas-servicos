create extension if not exists pgcrypto;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  business_name text not null,
  whatsapp text not null,
  category_id uuid references public.categories(id) on delete set null,
  neighborhood text,
  address text,
  description text,
  photo_1_url text,
  photo_2_url text,
  is_featured boolean not null default false,
  featured_order integer not null default 0,
  is_active boolean not null default true,
  recommendations integer not null default 0,
  whatsapp_clicks integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index professionals_active_featured_idx
  on public.professionals (is_active, is_featured, featured_order);
create index professionals_category_idx on public.professionals (category_id);
create index professionals_user_idx on public.professionals (user_id);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'professional' check (role in ('professional', 'admin')),
  created_at timestamptz not null default now()
);

create table public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  label text,
  description text,
  updated_at timestamptz not null default now()
);

create table public.recommendation_votes (
  professional_id uuid not null references public.professionals(id) on delete cascade,
  voter_token text not null,
  created_at timestamptz not null default now(),
  primary key (professional_id, voter_token)
);

create table public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  option_key text not null check (option_key in ('yes', 'no', 'maybe')),
  voter_token text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger professionals_set_updated_at
before update on public.professionals
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category uuid;
begin
  begin
    v_category := nullif(new.raw_user_meta_data ->> 'category_id', '')::uuid;
  exception when invalid_text_representation then
    v_category := null;
  end;

  insert into public.professionals (
    user_id,
    business_name,
    whatsapp,
    category_id,
    neighborhood,
    address,
    description
  ) values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'business_name', ''), split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'whatsapp', ''),
    v_category,
    new.raw_user_meta_data ->> 'neighborhood',
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'description'
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'professional')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.recommend_professional(
  p_professional_id uuid,
  p_voter_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_added boolean := false;
  v_count integer;
begin
  if p_voter_token is null or length(p_voter_token) < 8 then
    raise exception 'Token inválido';
  end if;

  if not exists (
    select 1 from public.professionals
    where id = p_professional_id and is_active = true
  ) then
    raise exception 'Perfil indisponível';
  end if;

  insert into public.recommendation_votes (professional_id, voter_token)
  values (p_professional_id, p_voter_token)
  on conflict do nothing;

  v_added := found;

  if v_added then
    update public.professionals
    set recommendations = recommendations + 1
    where id = p_professional_id;
  end if;

  select recommendations into v_count
  from public.professionals
  where id = p_professional_id;

  return jsonb_build_object('added', v_added, 'recommendations', coalesce(v_count, 0));
end;
$$;

create or replace function public.register_whatsapp_click(p_professional_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.professionals
  set whatsapp_clicks = whatsapp_clicks + 1
  where id = p_professional_id and is_active = true;
end;
$$;

create or replace function public.poll_results()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'yes', count(*) filter (where option_key = 'yes'),
    'no', count(*) filter (where option_key = 'no'),
    'maybe', count(*) filter (where option_key = 'maybe')
  )
  from public.poll_votes;
$$;

create or replace function public.vote_poll(p_option text, p_voter_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_added boolean := false;
begin
  if p_option not in ('yes', 'no', 'maybe') then
    raise exception 'Opção inválida';
  end if;

  if p_voter_token is null or length(p_voter_token) < 8 then
    raise exception 'Token inválido';
  end if;

  insert into public.poll_votes (option_key, voter_token)
  values (p_option, p_voter_token)
  on conflict (voter_token) do nothing;

  v_added := found;

  return jsonb_build_object('added', v_added, 'results', public.poll_results());
end;
$$;

grant execute on function public.recommend_professional(uuid, text) to anon, authenticated;
grant execute on function public.register_whatsapp_click(uuid) to anon, authenticated;
grant execute on function public.poll_results() to anon, authenticated;
grant execute on function public.vote_poll(text, text) to anon, authenticated;

alter table public.categories enable row level security;
alter table public.professionals enable row level security;
alter table public.user_roles enable row level security;
alter table public.feature_flags enable row level security;
alter table public.recommendation_votes enable row level security;
alter table public.poll_votes enable row level security;

create policy "categories_public_read"
on public.categories for select
using (active = true or public.is_admin());

create policy "categories_admin_write"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "professionals_public_read"
on public.professionals for select
using (is_active = true or user_id = auth.uid() or public.is_admin());

create policy "professionals_owner_insert"
on public.professionals for insert
to authenticated
with check (user_id = auth.uid());

create policy "professionals_owner_update"
on public.professionals for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "professionals_admin_delete"
on public.professionals for delete
to authenticated
using (public.is_admin());

create policy "user_roles_own_read"
on public.user_roles for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "user_roles_admin_write"
on public.user_roles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "feature_flags_public_read"
on public.feature_flags for select
using (true);

create policy "feature_flags_admin_write"
on public.feature_flags for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.feature_flags (key, enabled, label, description) values
  ('poll_enabled', true, 'Enquete na home', 'Mostra a enquete sobre o futuro do app.'),
  ('ratings_enabled', false, 'Sistema de avaliações', 'Ativa o aviso de avaliações nos perfis.')
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('professional-photos', 'professional-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "professional_photos_public_read" on storage.objects;
create policy "professional_photos_public_read"
on storage.objects for select
using (bucket_id = 'professional-photos');

drop policy if exists "professional_photos_owner_insert" on storage.objects;
create policy "professional_photos_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'professional-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "professional_photos_owner_update" on storage.objects;
create policy "professional_photos_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'professional-photos'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
)
with check (
  bucket_id = 'professional-photos'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

drop policy if exists "professional_photos_owner_delete" on storage.objects;
create policy "professional_photos_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'professional-photos'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);
