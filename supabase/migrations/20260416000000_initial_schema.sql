-- WeatherForm — initial schema
-- Run this in the Supabase Dashboard → SQL Editor, or via `supabase db push`

-- ─── Extensions ──────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ─── accounts ─────────────────────────────────────────────────────────────────
-- One row per authenticated user. id mirrors auth.users.id.

create table public.accounts (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text        not null check (char_length(display_name) between 1 and 32),
  player_tag    text        not null unique check (player_tag ~ '^[A-Za-z0-9_]{3,16}$'),
  created_at    timestamptz not null default now()
);

alter table public.accounts enable row level security;

-- Users can read any account (for friend search / game display)
create policy "accounts: anyone can read"
  on public.accounts for select
  using (true);

-- Users can only insert/update their own account
create policy "accounts: owner can write"
  on public.accounts for insert
  with check (id = auth.uid());

create policy "accounts: owner can update"
  on public.accounts for update
  using (id = auth.uid());

-- ─── games ───────────────────────────────────────────────────────────────────
-- One row per game. state is the full GameState JSON snapshot.

create table public.games (
  id          uuid        primary key default gen_random_uuid(),
  p1_id       uuid        not null references public.accounts (id),
  p2_id       uuid        references public.accounts (id),   -- null = open / waiting for opponent
  p1_element  text        not null check (p1_element in ('TIDE', 'GALE', 'DUNE')),
  p2_element  text        check (p2_element in ('TIDE', 'GALE', 'DUNE')),
  state       jsonb       not null,
  phase       text        not null default 'waiting' check (phase in ('waiting', 'active', 'complete')),
  whose_turn  text        check (whose_turn in ('P1', 'P2')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.games enable row level security;

-- Players can read any game they are part of
create policy "games: players can read own games"
  on public.games for select
  using (auth.uid() = p1_id or auth.uid() = p2_id);

-- P1 creates the game
create policy "games: p1 can create"
  on public.games for insert
  with check (auth.uid() = p1_id);

-- Either player can update (turn enforcement lives in gameService, not RLS)
create policy "games: players can update own games"
  on public.games for update
  using (auth.uid() = p1_id or auth.uid() = p2_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger games_updated_at
  before update on public.games
  for each row execute function public.set_updated_at();

-- ─── game_events ─────────────────────────────────────────────────────────────
-- Append-only event log. event is the serialised GameEvent JSON.

create table public.game_events (
  id       uuid        primary key default gen_random_uuid(),
  game_id  uuid        not null references public.games (id) on delete cascade,
  event    jsonb       not null,
  created_at timestamptz not null default now()
);

alter table public.game_events enable row level security;

-- Players in the game can read its events
create policy "game_events: players can read"
  on public.game_events for select
  using (
    exists (
      select 1 from public.games g
      where g.id = game_id
        and (g.p1_id = auth.uid() or g.p2_id = auth.uid())
    )
  );

-- Players in the game can append events (no update/delete — log is immutable)
create policy "game_events: players can insert"
  on public.game_events for insert
  with check (
    exists (
      select 1 from public.games g
      where g.id = game_id
        and (g.p1_id = auth.uid() or g.p2_id = auth.uid())
    )
  );

-- ─── Realtime ────────────────────────────────────────────────────────────────
-- Enable Realtime for game_events so Phase 10 can subscribe to opponent moves.

alter publication supabase_realtime add table public.game_events;
alter publication supabase_realtime add table public.games;
