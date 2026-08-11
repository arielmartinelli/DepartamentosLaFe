-- ═══════════════════════════════════════════════════════════════════
--  Departamentos La Fe — esquema de la base
--
--  Pegar completo en Supabase → SQL Editor → Run.
--  Es idempotente: se puede volver a ejecutar sin romper nada.
-- ═══════════════════════════════════════════════════════════════════

-- ── Perfiles ───────────────────────────────────────────────────────
-- Cada persona que se registra tiene un perfil. El rol distingue a la
-- propietaria de los visitantes.

create table if not exists public.perfiles (
  id          uuid primary key references auth.users on delete cascade,
  nombre      text not null default '',
  telefono    text not null default '',
  rol         text not null default 'visitante'
              check (rol in ('visitante', 'propietaria')),
  creado      timestamptz not null default now()
);

alter table public.perfiles enable row level security;

-- Se crea el perfil solo al registrarse.
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, telefono)
  values (
    new.id,
    -- 'nombre' llega del formulario propio; 'full_name' y 'name', de Google.
    coalesce(
      nullif(new.raw_user_meta_data ->> 'nombre', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      ''
    ),
    coalesce(new.raw_user_meta_data ->> 'telefono', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- ¿Quien pide es la propietaria?
create or replace function public.es_propietaria()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'propietaria'
  );
$$;

drop policy if exists "cada uno ve su perfil" on public.perfiles;
create policy "cada uno ve su perfil" on public.perfiles
  for select using (auth.uid() = id or public.es_propietaria());

drop policy if exists "cada uno edita su perfil" on public.perfiles;
create policy "cada uno edita su perfil" on public.perfiles
  for update using (auth.uid() = id) with check (auth.uid() = id);


-- ── Contenido público ──────────────────────────────────────────────
-- Edificios, departamentos, actividades, comentarios, servicios,
-- galerías, bloqueos y ajustes. Todo lo que se ve en la web.
-- Lo lee cualquiera; sólo la propietaria lo modifica.

create table if not exists public.contenido (
  clave       text primary key,
  valor       jsonb not null,
  actualizado timestamptz not null default now()
);

alter table public.contenido enable row level security;

drop policy if exists "el contenido es público" on public.contenido;
create policy "el contenido es público" on public.contenido
  for select using (true);

drop policy if exists "sólo la propietaria escribe contenido" on public.contenido;
create policy "sólo la propietaria escribe contenido" on public.contenido
  for all using (public.es_propietaria()) with check (public.es_propietaria());


-- ── Reservas ───────────────────────────────────────────────────────
-- Tienen nombre, correo y teléfono de huéspedes: nunca son públicas.

create table if not exists public.reservas (
  id             text primary key,
  codigo         text not null default '',
  huesped        text not null default '',
  email          text not null default '',
  telefono       text not null default '',
  departamento   text not null default '',
  desde          date not null,
  hasta          date not null,
  personas       int  not null default 1,
  estado         text not null default 'pendiente',
  origen         text not null default 'Web',
  total          bigint not null default 0,
  notas          text,
  creado         timestamptz not null default now()
);

alter table public.reservas enable row level security;

drop policy if exists "sólo la propietaria ve las reservas" on public.reservas;
create policy "sólo la propietaria ve las reservas" on public.reservas
  for all using (public.es_propietaria()) with check (public.es_propietaria());

-- La web pública necesita saber qué días están ocupados, sin ver de quién.
create or replace view public.dias_ocupados as
  select departamento, desde, hasta
  from public.reservas
  where estado <> 'cancelada';

grant select on public.dias_ocupados to anon, authenticated;


-- ── Consultas ──────────────────────────────────────────────────────
-- Las crea cualquier visitante, con o sin cuenta.

create table if not exists public.consultas (
  id            text primary key,
  nombre        text not null default '',
  email         text not null default '',
  telefono      text not null default '',
  departamento  text,
  desde         date,
  hasta         date,
  personas      int  not null default 1,
  mensaje       text not null default '',
  estado        text not null default 'nueva',
  canal         text not null default 'Web',
  cuenta        uuid references auth.users on delete set null,
  conversacion  jsonb not null default '[]'::jsonb,
  creado        timestamptz not null default now()
);

alter table public.consultas enable row level security;

drop policy if exists "cualquiera puede consultar" on public.consultas;
create policy "cualquiera puede consultar" on public.consultas
  for insert with check (true);

drop policy if exists "la propietaria y el autor leen la consulta" on public.consultas;
create policy "la propietaria y el autor leen la consulta" on public.consultas
  for select using (public.es_propietaria() or cuenta = auth.uid());

drop policy if exists "la propietaria y el autor responden" on public.consultas;
create policy "la propietaria y el autor responden" on public.consultas
  for update using (public.es_propietaria() or cuenta = auth.uid())
  with check (public.es_propietaria() or cuenta = auth.uid());

drop policy if exists "sólo la propietaria elimina consultas" on public.consultas;
create policy "sólo la propietaria elimina consultas" on public.consultas
  for delete using (public.es_propietaria());

create index if not exists consultas_creado on public.consultas (creado desc);
create index if not exists reservas_fechas on public.reservas (departamento, desde);


-- ── Tiempo real ────────────────────────────────────────────────────
-- Para que las consultas y las respuestas aparezcan solas, sin recargar
-- la página, ni en el panel ni en la vista del visitante.

alter table public.consultas replica identity full;
alter table public.reservas  replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table public.consultas;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.reservas;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.contenido;
  exception when duplicate_object then null;
  end;
end $$;


-- ── Imágenes ───────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do nothing;

drop policy if exists "las imágenes son públicas" on storage.objects;
create policy "las imágenes son públicas" on storage.objects
  for select using (bucket_id = 'imagenes');

drop policy if exists "sólo la propietaria sube imágenes" on storage.objects;
create policy "sólo la propietaria sube imágenes" on storage.objects
  for insert with check (bucket_id = 'imagenes' and public.es_propietaria());

drop policy if exists "sólo la propietaria borra imágenes" on storage.objects;
create policy "sólo la propietaria borra imágenes" on storage.objects
  for delete using (bucket_id = 'imagenes' and public.es_propietaria());


-- ═══════════════════════════════════════════════════════════════════
--  Después de correr esto:
--
--  1. Authentication → Users → Add user: creá el usuario de la dueña.
--  2. Volvé acá y ejecutá, con ese correo:
--
--     update public.perfiles set rol = 'propietaria'
--     where id = (select id from auth.users where email = 'correo@dueña.com');
--
--  3. Copiá Project URL y anon key a las variables de entorno.
-- ═══════════════════════════════════════════════════════════════════
