-- ============================================================
-- Nutriquébom — Schema Supabase
-- Cole este conteúdo no SQL Editor do seu projeto Supabase
-- e clique em "Run"
-- ============================================================

-- Extensão para UUIDs
create extension if not exists "uuid-ossp";

-- ── Perfis (vinculado a auth.users) ─────────────────────────
create table if not exists profiles (
  id     uuid references auth.users on delete cascade primary key,
  role   text not null default 'nutritionist' check (role in ('nutritionist','patient')),
  name   text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;

create policy "Usuário lê próprio perfil" on profiles
  for select using (auth.uid() = id);
create policy "Usuário atualiza próprio perfil" on profiles
  for update using (auth.uid() = id);
create policy "Usuário insere próprio perfil" on profiles
  for insert with check (auth.uid() = id);

-- ── Pacientes ────────────────────────────────────────────────
create table if not exists patients (
  id               text primary key,
  nutritionist_id  uuid references profiles(id) on delete cascade not null,
  user_id          uuid references auth.users,   -- preenchido quando paciente cria conta
  name             text not null,
  email            text,
  phone            text,
  birth            text,
  sex              text,
  notes            text,
  created_at       bigint
);
alter table patients enable row level security;

create policy "Nutricionista gerencia seus pacientes" on patients
  for all using (auth.uid() = nutritionist_id);
create policy "Paciente lê próprio registro" on patients
  for select using (auth.uid() = user_id);

-- ── Dietas ───────────────────────────────────────────────────
create table if not exists diets (
  id               text primary key,
  patient_id       text references patients(id) on delete cascade,
  nutritionist_id  uuid references profiles(id) on delete cascade,
  name             text,
  created_at       bigint,
  data             jsonb not null default '{}'
);
alter table diets enable row level security;

create policy "Nutricionista gerencia dietas" on diets
  for all using (auth.uid() = nutritionist_id);
create policy "Paciente lê próprias dietas" on diets
  for select using (
    exists (
      select 1 from patients
      where patients.id = diets.patient_id
        and patients.user_id = auth.uid()
    )
  );

-- ── Avaliações físicas ───────────────────────────────────────
create table if not exists assessments (
  id               text primary key,
  patient_id       text references patients(id) on delete cascade,
  nutritionist_id  uuid references profiles(id) on delete cascade,
  date             text,
  data             jsonb not null default '{}'
);
alter table assessments enable row level security;

create policy "Nutricionista gerencia avaliações" on assessments
  for all using (auth.uid() = nutritionist_id);
create policy "Paciente lê próprias avaliações" on assessments
  for select using (
    exists (
      select 1 from patients
      where patients.id = assessments.patient_id
        and patients.user_id = auth.uid()
    )
  );

-- ── Exames laboratoriais ─────────────────────────────────────
create table if not exists exams (
  id               text primary key,
  patient_id       text references patients(id) on delete cascade,
  nutritionist_id  uuid references profiles(id) on delete cascade,
  created_at       bigint,
  data             jsonb not null default '{}'
);
alter table exams enable row level security;

create policy "Nutricionista gerencia exames" on exams
  for all using (auth.uid() = nutritionist_id);
create policy "Paciente lê próprios exames" on exams
  for select using (
    exists (
      select 1 from patients
      where patients.id = exams.patient_id
        and patients.user_id = auth.uid()
    )
  );

-- ── Anamnese ─────────────────────────────────────────────────
create table if not exists anamnese (
  patient_id       text references patients(id) on delete cascade primary key,
  nutritionist_id  uuid references profiles(id) on delete cascade,
  answers          jsonb not null default '{}',
  updated_at       timestamptz default now()
);
alter table anamnese enable row level security;

create policy "Nutricionista gerencia anamnese" on anamnese
  for all using (auth.uid() = nutritionist_id);
create policy "Paciente lê própria anamnese" on anamnese
  for select using (
    exists (
      select 1 from patients
      where patients.id = anamnese.patient_id
        and patients.user_id = auth.uid()
    )
  );

-- ── Agendamentos ─────────────────────────────────────────────
create table if not exists appointments (
  id               text primary key,
  nutritionist_id  uuid references profiles(id) on delete cascade,
  patient_id       text,
  data             jsonb not null default '{}'
);
alter table appointments enable row level security;

create policy "Nutricionista gerencia agendamentos" on appointments
  for all using (auth.uid() = nutritionist_id);

-- ── Alimentos customizados ───────────────────────────────────
create table if not exists custom_foods (
  id               text primary key,
  nutritionist_id  uuid references profiles(id) on delete cascade,
  data             jsonb not null default '{}'
);
alter table custom_foods enable row level security;

create policy "Nutricionista gerencia alimentos" on custom_foods
  for all using (auth.uid() = nutritionist_id);

-- ── Configurações do nutricionista ──────────────────────────
create table if not exists nutritionist_settings (
  id                uuid references profiles(id) on delete cascade primary key,
  profile_data      jsonb default '{}',
  anamnese_template jsonb
);
alter table nutritionist_settings enable row level security;

create policy "Nutricionista gerencia configurações" on nutritionist_settings
  for all using (auth.uid() = id);

-- ── Trigger: cria perfil automaticamente ao cadastrar ────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'nutritionist'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
