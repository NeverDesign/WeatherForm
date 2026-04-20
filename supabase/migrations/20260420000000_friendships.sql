-- WeatherForm — friendships schema
-- Adds friend_requests table and fixes player_tag constraint to allow #NNNN suffix

-- ─── Fix player_tag constraint ────────────────────────────────────────────────
-- The initial schema used ^[A-Za-z0-9_]{3,16}$ which does not allow the
-- DisplayName#NNNN format required by the auth service.
-- New format: up to 16 chars before #, then exactly 4 digits.

alter table public.accounts
  drop constraint if exists accounts_player_tag_check;

alter table public.accounts
  add constraint accounts_player_tag_check
  check (player_tag ~ '^[A-Za-z0-9_]{1,16}#[0-9]{4}$');

-- ─── friend_requests ──────────────────────────────────────────────────────────

create table public.friend_requests (
  id          uuid        primary key default gen_random_uuid(),
  from_id     uuid        not null references public.accounts (id) on delete cascade,
  to_id       uuid        not null references public.accounts (id) on delete cascade,
  status      text        not null default 'pending'
                          check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at  timestamptz not null default now(),

  constraint friend_requests_unique_pair unique (from_id, to_id)
);

create index friend_requests_to_id_idx on public.friend_requests (to_id);

alter table public.friend_requests enable row level security;

-- Users can see requests they sent or received
create policy "friend_requests: parties can read"
  on public.friend_requests for select
  using (auth.uid() = from_id or auth.uid() = to_id);

-- Users can insert requests where they are the sender
create policy "friend_requests: sender can insert"
  on public.friend_requests for insert
  with check (auth.uid() = from_id);

-- Users can update status on requests sent TO them (accept / decline)
-- The sender can also upsert to 'blocked' (handled via a separate insert path)
create policy "friend_requests: recipient can update"
  on public.friend_requests for update
  using (auth.uid() = to_id);

-- Allow the sender to update to 'blocked' (block flow upserts from sender side)
create policy "friend_requests: sender can block"
  on public.friend_requests for update
  using (auth.uid() = from_id);
