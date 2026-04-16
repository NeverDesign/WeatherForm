# Session: Phase 4 — Game Store (local)
**Date:** 2026-04-15

---

## What Was Built

A local Pinia store (`useGameStore`) that wires the game reducer into Vue state. Provides the `visibleState` computed pattern, a replay system, and a `createGame` factory that generates a standard chess starting board.

---

## Files Created / Modified

| File | Action | Description |
|---|---|---|
| `src/stores/useGameStore.ts` | Created | Pinia game store + `createGame` factory |
| `src/stores/useGameStore.test.ts` | Created | 26 tests covering factory, dispatch, and replay |
| `docs/plans/implementation-plan.md` | Modified | Phase 4 marked `[x] done` |

---

## Store API

| Export | Kind | Description |
|---|---|---|
| `createGame(p1Element, p2Element)` | function | Returns a fresh `GameState` with standard chess starting layout |
| `STARTING_HP` | const | `100` — starting HP for each player |
| `useGameStore()` | Pinia store | Main game store |
| `gameState` | `ref<GameState \| null>` | Live source of truth |
| `initialState` | `ref<GameState \| null>` | Snapshot at game creation (used for replay) |
| `visibleState` | `computed<GameState \| null>` | What all UI reads — replayState during replay, gameState otherwise |
| `isReplay` | `ref<boolean>` | True when replay mode is active |
| `replayState` | `ref<GameState \| null>` | Reconstructed state at the replay cursor |
| `newGame(p1, p2)` | action | Initialises a new game and stores `initialState` |
| `dispatch(event)` | action | Applies a `GameEvent` via the pure reducer |
| `enterReplay(index)` | action | Replays events 0..index-1 from `initialState` |
| `exitReplay()` | action | Restores live game view |

## Board layout from `createGame`

- P1 back rank: y=0, x=0..7 → ROOK KNIGHT BISHOP QUEEN KING BISHOP KNIGHT ROOK
- P1 pawns: y=1, x=0..7
- P2 back rank: y=7, x=0..7 (same column layout from P1's coordinate system)
- P2 pawns: y=6, x=0..7
- Both sides: 16 pieces each, 32 total

---

## Gotcha Resolved

Pinia wraps reactive state in Vue Proxy objects. `structuredClone` (used inside the reducer) cannot clone Proxy objects in the test environment. Fixed by JSON round-tripping `gameState.value` in `dispatch` and `enterReplay` before passing to the reducer. This is safe because `GameState` is guaranteed JSON-serialisable by design.

---

## Commit Notes

**Subject:** Add local game store with createGame factory and replay system

- Add `src/stores/useGameStore.ts` — Pinia store wiring reducer into Vue state
- Export `createGame(p1Element, p2Element)` — builds standard 32-piece starting board
- Implement `visibleState` computed: replayState during replay, gameState otherwise
- Implement `dispatch(event)` with JSON round-trip to strip Vue Proxy before reducer call
- Implement `enterReplay(index)` / `exitReplay()` for move-log replay
- Add `src/stores/useGameStore.test.ts` — 26 tests covering factory, dispatch, and replay
- Mark Phase 4 complete in `docs/plans/implementation-plan.md`

---

## Known Limitations / Deferred

- `dispatch` does not yet push events to Supabase — that comes in Phase 10
- `newGame` generates a local-only game ID (`game-${Date.now()}`); real IDs come from Supabase in Phase 9
- Ability effects in `USE_ABILITY` remain a placeholder (Phase 6)
