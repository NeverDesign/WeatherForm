# Session: Phase 8 — Supabase Setup + Schema
**Date:** 2026-04-16

---

## What Was Built

Installed `@supabase/supabase-js`, created the Supabase client module, added an env template, wrote the full SQL migration for the three-table schema, and enabled Realtime on the relevant tables. The client uses placeholder values when env vars are absent so the build passes in CI without `.env.local`.

---

## Files Created / Modified

| File | Action | Description |
|---|---|---|
| `src/lib/supabase.ts` | Created | Supabase client (lazy — placeholders allow build without .env.local) |
| `.env.local.example` | Created | Template with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY |
| `supabase/migrations/20260416000000_initial_schema.sql` | Created | Full schema: accounts, games, game_events + RLS + Realtime |
| `.gitignore` | Modified | Added `.env.local` |
| `docs/plans/implementation-plan.md` | Modified | Phase 8 marked `[x] done` |

---

## Schema Summary

| Table | Key columns |
|---|---|
| `accounts` | id (uuid, FK → auth.users), display_name, player_tag (unique), created_at |
| `games` | id, p1_id, p2_id (nullable), p1_element, p2_element, state (jsonb), phase, whose_turn, created_at, updated_at |
| `game_events` | id, game_id (FK → games), event (jsonb), created_at — append-only |

RLS: accounts readable by all, writable by owner. Games readable/writable by participating players. game_events readable/insertable by participating players (no update/delete).

Realtime enabled on `games` and `game_events` for Phase 10 subscriptions.

---

## Supabase Project Setup Instructions

Follow these steps once to connect the app to a live Supabase project.

### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project** → choose an organisation → give it a name (e.g. `weatherform`)
3. Set a strong database password and choose a region close to your users
4. Wait for the project to provision (~1 minute)

### 2. Run the SQL migration
1. In the Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the entire contents of `supabase/migrations/20260416000000_initial_schema.sql`
4. Paste into the editor and click **Run**
5. Confirm the three tables appear under **Table Editor**

### 3. Get your API credentials
1. Go to **Project Settings** → **API**
2. Copy **Project URL** → this is your `VITE_SUPABASE_URL`
3. Copy **anon public** key → this is your `VITE_SUPABASE_ANON_KEY`

### 4. Create .env.local
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and paste in your URL and anon key.

### 5. Verify the connection
Restart the dev server (`npm run dev`) and open the browser console. No Supabase errors should appear. The app will continue working locally (game store is still local-only until Phase 10).

### 6. Enable Email auth (for Phase 12)
1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (it is by default)
3. Optionally disable **Confirm email** during development for faster iteration

---

## Commit Notes

**Subject:** Add Supabase client, env template, and initial schema migration

- Install `@supabase/supabase-js` v2
- Add `src/lib/supabase.ts` — Supabase client with placeholder fallback for builds without .env.local
- Add `.env.local.example` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Add `supabase/migrations/20260416000000_initial_schema.sql` — accounts, games, game_events tables with RLS and Realtime
- Add `.env.local` to .gitignore
- Mark Phase 8 done in implementation-plan.md
