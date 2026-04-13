-- 001_initial_schema.sql

-- =====================
-- PARCOURS (Culte Familial)
-- =====================
create table parcours (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  translations  jsonb not null default '{}'::jsonb,
  image_url     text,
  audio_urls    jsonb not null default '{}'::jsonb,
  tags          text[] not null default '{}',
  difficulty    text not null default 'debutant'
                check (difficulty in ('debutant', 'intermediaire', 'avance')),
  tier          text not null default 'free'
                check (tier in ('free', 'premium')),
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =====================
-- QUESTIONS (Culte Familial)
-- =====================
create table questions (
  id            uuid primary key default gen_random_uuid(),
  parcours_id   uuid not null references parcours(id) on delete cascade,
  type          text not null check (type in ('facile', 'moyenne', 'impossible', 'parents')),
  order_index   integer not null,
  translations  jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  unique(parcours_id, order_index)
);

-- =====================
-- WORD SEARCH PUZZLES (Mots Mêlés)
-- =====================
create table word_search_puzzles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  mode          text not null default 'parcours'
                check (mode in ('parcours', 'aleatoire')),
  translations  jsonb not null default '{}'::jsonb,
  tags          text[] not null default '{}',
  tier          text not null default 'free'
                check (tier in ('free', 'premium')),
  published     boolean not null default false,
  order_index   integer not null default 0,
  created_at    timestamptz not null default now()
);

-- =====================
-- WORD SEARCH WORD BANK (aléatoire mode)
-- =====================
create table word_search_word_bank (
  id          uuid primary key default gen_random_uuid(),
  locale      text not null check (locale in ('fr', 'en', 'pt', 'th')),
  word        text not null,
  emoji       text,
  audio_url   text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now(),
  unique(locale, word)
);

-- =====================
-- FAMILY PROFILES
-- =====================
create table family_profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  display_name          text,
  stripe_customer_id    text unique,
  subscription_status   text not null default 'free'
                        check (subscription_status in ('free', 'active', 'past_due', 'canceled')),
  subscription_tier     text not null default 'free'
                        check (subscription_tier in ('free', 'premium')),
  subscription_ends_at  timestamptz,
  created_at            timestamptz not null default now()
);

-- =====================
-- PROGRESS SESSIONS
-- =====================
create table progress_sessions (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid references family_profiles(id) on delete set null,
  activity_type text not null check (activity_type in ('culte-familial', 'mots-meles')),
  content_id    uuid not null,
  current_step  integer not null default 0,
  answers       jsonb not null default '{}'::jsonb,
  score         integer not null default 0,
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- =====================
-- TRIGGER: auto-update parcours.updated_at
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger parcours_updated_at
  before update on parcours
  for each row execute function update_updated_at();

-- =====================
-- TRIGGER: auto-create family_profiles on user registration
-- =====================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.family_profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table parcours enable row level security;
alter table questions enable row level security;
alter table word_search_puzzles enable row level security;
alter table word_search_word_bank enable row level security;
alter table family_profiles enable row level security;
alter table progress_sessions enable row level security;

-- parcours: public reads published rows; service_role bypasses RLS for admin writes
create policy "public read published parcours"
  on parcours for select using (published = true);

-- questions: public reads questions whose parcours is published
create policy "public read questions of published parcours"
  on questions for select
  using (
    exists (
      select 1 from parcours p
      where p.id = questions.parcours_id and p.published = true
    )
  );

-- word_search_puzzles: public reads published
create policy "public read published puzzles"
  on word_search_puzzles for select using (published = true);

-- word_search_word_bank: public reads all (needed for aléatoire mode)
create policy "public read word bank"
  on word_search_word_bank for select using (true);

-- family_profiles: users own their row
create policy "users read own profile"
  on family_profiles for select using (auth.uid() = id);

create policy "users update own profile"
  on family_profiles for update using (auth.uid() = id);

-- progress_sessions: users own their sessions; anyone can insert (supports guests)
create policy "users read own sessions"
  on progress_sessions for select
  using (family_id = auth.uid() or family_id is null);

create policy "anyone insert session"
  on progress_sessions for insert with check (true);

create policy "users update own sessions"
  on progress_sessions for update using (family_id = auth.uid());
