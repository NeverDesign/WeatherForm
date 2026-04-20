# Session: Phase 10 — Game Store Sync
**Date:** 2026-04-20

---

## What Was Built

Extended `useGameStore` with three new actions that wire the local reducer to Supabase. The store now has two modes: **local-only** (used by the existing game board) and **online** (used when a real game is loaded from Supabase).

---

## Files Modified

| File | Action | Description |
|---|---|---|
| `src/stores/useGameStore.ts` | Modified | Added loadGame, subscribeToUpdates, unsubscribeFromUpdates; extended dispatch with remote sync |
| `docs/plans/implementation-plan.md` | Modified | Phase 10 marked `[x] done` |

---

## New Store API

| Addition | Kind | Description |
|---|---|---|
| `remoteGameId` | `ref<string \| null>` | Supabase game ID; null = local-only mode |
| `realtimeChannel` | `ref<RealtimeChannel \| null>` | Active subscription; managed internally |
| `loadGame(id)` | async action | Fetches game from Supabase, seeds state, switches to online mode |
| `subscribeToUpdates()` | action | Opens Realtime channel; reconciles remote state when opponent moves |
| `unsubscribeFromUpdates()` | action | Tears down channel (call on component unmount) |

## Extended Behavior

**`dispatch(event)`** — unchanged call signature; now also pushes to Supabase when `remoteGameId` is set. Local state update is always synchronous (optimistic). Remote push is fire-and-forget with console error on failure.

**`newGame(p1, p2)`** — clears `remoteGameId` and tears down any active channel, ensuring local-only mode.

---

## Online Mode Flow (Phase 11 will drive this)

```
loadGame(id)              → seeds gameState, sets remoteGameId
subscribeToUpdates()      → opens Realtime channel
dispatch(event)           → local optimistic update + pushEvent to Supabase
  ↳ opponent's move       → Realtime fires → reconcile replaces gameState
unsubscribeFromUpdates()  → on component unmount
```

---

## Commit Notes

**Subject:** Extend game store with Supabase sync — loadGame, subscribeToUpdates, remote dispatch

- Add `loadGame(id)` — fetches GameState from Supabase, seeds store, enables online mode
- Add `subscribeToUpdates()` — Realtime subscription; reconciles remote state on opponent move
- Add `unsubscribeFromUpdates()` — channel cleanup for component unmount
- Extend `dispatch` — local optimistic update + fire-and-forget `pushEvent` when remoteGameId is set
- Add `remoteGameId` ref — null = local-only, string = online mode
- `newGame` clears remoteGameId and tears down any active channel
- Mark Phase 10 done in implementation-plan.md

---

## Deferred

- No retry logic on failed `pushEvent` — connection errors show in console only; retry/offline queue deferred to post-MVP
- Reconcile is a full state replace (not a diff merge) — acceptable for async turn-based play where only one player writes at a time
- `loadGame` doesn't yet call `subscribeToUpdates` automatically — Phase 11 `GamePage` will call both in sequence on mount
