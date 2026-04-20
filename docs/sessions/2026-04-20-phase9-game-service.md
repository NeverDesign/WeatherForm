# Session: Phase 9 — Game Service (Supabase-backed)
**Date:** 2026-04-20

---

## What Was Built

`src/services/gameService.ts` — a Supabase-backed service object with all six methods from the Phase 9 spec. Wraps the Supabase client, the local `createGame` factory, and the `gameReducer` to keep the `games.state` column in sync after each event.

---

## Files Created / Modified

| File | Action | Description |
|---|---|---|
| `src/services/gameService.ts` | Created | Supabase game service — all 6 methods |
| `docs/plans/implementation-plan.md` | Modified | Phase 9 marked `[x] done` |

---

## Service API

| Method | Description |
|---|---|
| `createGame(p1Element)` | Inserts a new `waiting` game row; stores placeholder state until P2 joins |
| `joinGame(gameId, p2Element)` | Sets P2, creates real starting board from both elements, transitions to `active` |
| `getGame(gameId)` | Fetches a single game by ID |
| `listGames()` | Returns all games for the current user, newest first |
| `pushEvent(gameId, event)` | Appends to `game_events`, runs reducer, updates `games.state` snapshot |
| `subscribeToGame(gameId, cb)` | Realtime subscription on `games` UPDATE; calls `cb` with new `GameState` |

---

## Design Notes

- **State column as cache:** `games.state` is a denormalised snapshot for fast reads. The `game_events` table is the authoritative append-only log. If these ever diverge, the event log wins.
- **pushEvent is two writes:** insert into `game_events` then fetch + reduce + update `games`. Not atomic on the client — acceptable for async turn-based play where concurrent writes can't happen (only the current player can act).
- **Auth dependency:** All methods except `subscribeToGame` call `supabase.auth.getUser()`. They will work correctly once Phase 12 wires real Supabase Auth. Until then the local game store (Phase 4) handles all gameplay.
- **joinGame signature change:** The plan spec had `joinGame(gameId)` but P2's element choice is required to build the starting board, so the signature is `joinGame(gameId, p2Element)`. Phase 11 (GameMenuPage) passes the element from the join modal.

---

## Commit Notes

**Subject:** Add Supabase-backed gameService with createGame, joinGame, pushEvent, and Realtime subscription

- Add `src/services/gameService.ts` — createGame, joinGame, getGame, listGames, pushEvent, subscribeToGame
- pushEvent appends to game_events (append-only) then reduces and updates games.state snapshot
- subscribeToGame returns a RealtimeChannel on games UPDATE filtered by game ID
- joinGame takes p2Element to build the real starting board when opponent joins
- Mark Phase 9 done in implementation-plan.md

---

## Deferred

- No tests — gameService wraps Supabase and requires a live project or a mock client; integration tests deferred to after Phase 12 when auth is real
- `listGames` returns all games including `waiting` and `complete` — Phase 11 GameMenuPage will filter by phase for display
- Optimistic local dispatch + remote reconcile pattern (Phase 10) will wrap this service
