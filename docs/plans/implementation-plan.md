# WeatherForm: Prioritized Implementation Plan

## Context

The project has a complete UI shell: all 10 pages, routing, SCSS design system, content/copy layer, and auth store are in place. The game is not yet playable — no game engine, no real game state, no persistence beyond the mock auth stub.

The goal is to move from a designed prototype to a working async multiplayer game. This plan sequences the work from foundation → engine → UI integration → services, so each layer builds on what came before.

---

## Sequencing Summary

| Phase | Work | Agents | Status |
|-------|------|--------|--------|
| 0 | QA debt fixes | `@frontend` `@copy` | `[x] done` |
| 1 | Game types | `@backend` | `[x] done` |
| 2 | Game reducer | `@backend` | `[x] done` |
| 3 | Movement system | `@backend` | `[x] done` |
| 4 | Game store (local) | `@backend` | `[x] done` |
| 5 | GamePage UI integration | `@frontend` `@backend` | `[x] done` |
| 6 | Ability design + types | `@copy` `@backend` | `[x] done` |
| 7 | Set Manager integration | `@backend` `@frontend` | `[x] done` |
| 8 | Supabase setup + schema | `@backend` | `[x] done` |
| 9 | gameService (Supabase) | `@backend` | `[x] done` |
| 10 | Game store sync | `@backend` | `[x] done` |
| 11 | GameMenuPage + creation | `@frontend` `@backend` | `[x] done` |
| 12+ | Friends, Profile, Auth | all agents | `[ ] pending` |

Phases 1–4 are pure backend, no UI, fast to execute. Phase 5 is the first playable moment (local only). Phases 8–11 add real async multiplayer.

---

## Phase 0 — Outstanding QA Debt

> Status: `[x] done` — all 3 fixes were already in place from the scaffold; verified 2026-04-15

Clear the 3 failures from the 2026-04-09 QA session before adding new features.

| # | File | Fix |
|---|------|-----|
| 1 | `src/pages/GamePage.vue` | Replace 2 inline `style=""` HP bar widths with data-bound `:style` |
| 2 | `src/pages/GamePage.vue` + `src/components/BottomNav/` | Move 6 hardcoded strings ("Opponent", "You", "New Game", "Set Manager") into content layer |
| 3 | `src/pages/FriendsPage.vue` | Add `<label>` + `aria-label` to search input |

**Executor:** `@frontend` (template/SCSS fixes) + `@copy` (content strings)

---

## Work Stream 1 — Game Engine

The game engine is the critical path for everything else. Per `project-overrides.md`, the architecture is settled:

- **Pure reducer:** `(GameState, GameEvent) → GameState`
- **Integer damage:** multipliers are `150 / 100 / 50`, always `Math.floor()`
- **Plain JSON state:** safe for `structuredClone` and JSON round-trips
- **Event log:** all actions are `GameEvent` discriminated union values
- **`visibleState` pattern:** UI reads `visibleState` (returns `replayState` or `gameState`)
- **Movement generators:** pure functions per piece type, dispatched by `MovementRouter`
- **Board coordinates:** `(0,0)` = bottom-left from P1's perspective

### Phase 1 — Core Types

> Status: `[x] done` — 2026-04-15

**New file:** `src/types/game.ts`

- `Element` (already exists as `'TIDE' | 'GALE' | 'DUNE'`)
- `PieceType` — 6 shared piece types across all elements
- `Piece` — id, type, element, position, owner
- `Square` — `{ x: number; y: number }`
- `BoardState` — `Map<string, Piece>` keyed by `"x,y"`
- `PlayerState` — hp, element, pieces, abilities
- `GameState` — turn, phase, players (P1/P2), board, eventLog, winner
- `GameEvent` — discriminated union: `MOVE`, `ATTACK`, `USE_ABILITY`, `END_TURN`, `RESIGN`, `GAME_OVER`
- `GamePhase` — `'waiting' | 'active' | 'complete'`

**Executor:** `@backend`

### Phase 2 — Game Reducer

> Status: `[x] done` — 2026-04-15

**New file:** `src/stores/gameReducer.ts`

- `gameReducer(state: GameState, event: GameEvent): GameState`
- Pure function, no side effects
- Handles each `GameEvent` variant
- Applies element multipliers using `ELEMENT_MULTIPLIERS` constant (`{ TIDE_vs_DUNE: 150, ... }`)

**Executor:** `@backend`

### Phase 3 — Movement System

> Status: `[x] done` — 2026-04-15

**New files:** `src/game/movement/`

- `src/game/movement/types.ts` — `MoveCandidate`, `MovementContext`
- `src/game/movement/generators/` — one file per piece type, all pure functions returning `Square[]`
- `src/game/movement/MovementRouter.ts` — dispatches to correct generator by `PieceType`

**Executor:** `@backend`

### Phase 4 — Game Store (local)

> Status: `[x] done` — 2026-04-15

**New file:** `src/stores/useGameStore.ts`

- `gameState: GameState` ref
- `visibleState` computed (returns replayState during replay, gameState during live)
- `dispatch(event: GameEvent)` — calls reducer, updates state
- `isReplay` flag
- `replayState` ref (for move replay)
- Initial game factory: `createGame(p1Element, p2Element): GameState`

**Executor:** `@backend`

---

## Work Stream 2 — Game UI Integration

### Phase 5 — GamePage Board + Dock

> Status: `[x] done` — 2026-04-15  
> **Milestone: first playable moment (local)**

**File:** `src/pages/GamePage.vue`

- Replace placeholder 8×8 grid with `visibleState`-driven board
- Piece rendering: element colour + piece type icon/label
- Click to select piece → show valid moves (from `MovementRouter`)
- Click valid move square → dispatch `MOVE` or `ATTACK` event
- HP bars: data-bound to `playerState.hp`
- "End Turn" button → dispatch `END_TURN`
- 6 ability slots in dock → dispatch `USE_ABILITY`; disabled if on cooldown
- Desktop: move log panel rendering `gameState.eventLog`; click to enter replay mode

**Executor:** `@frontend` (template) + `@backend` (composable wiring)

---

## Work Stream 3 — Ability & Set System

### Phase 6 — Ability Design + Types

> Status: `[x] done` — 2026-04-16

**New file:** `src/types/abilities.ts`

- `Ability` — id, name, element, description, cooldown, effectType, effectValue
- Design all 18 abilities (6 per element) — none yet defined
- `AbilitySet` — 6 chosen abilities for a player's game

**Executor:** `@copy` (names/descriptions) + `@backend` (types/registry)

### Phase 7 — Set Manager Integration

> Status: `[x] done` — 2026-04-16

**File:** `src/pages/SetManagerPage.vue`

- Element tab → loads 6 abilities from ability registry
- Each row: name, description, cooldown indicator
- Save Set → persists to localStorage via store
- Saved sets list → shows real saved sets

**Executor:** `@backend` (store/types) + `@frontend` (template)

---

## Work Stream 4 — Supabase Backend

### Phase 8 — Supabase Setup + Schema

> Status: `[x] done` — 2026-04-16

**New files:** `src/lib/supabase.ts`, `.env.local` (not committed)

- Install `@supabase/supabase-js`
- Configure Supabase client (URL + anon key from env vars)
- Schema:
  - `accounts` — id, display_name, player_tag, created_at
  - `games` — id, p1_id, p2_id, p1_element, p2_element, state (jsonb), phase, whose_turn, created_at, updated_at
  - `game_events` — id, game_id, event (jsonb), created_at (append-only log)
  - Row Level Security: players can only read/write their own games

**Executor:** `@backend`

### Phase 9 — Game Service (Supabase-backed)

> Status: `[x] done` — 2026-04-20

**File:** `src/services/gameService.ts`

- `createGame(p1Element: Element): Promise<Game>`
- `joinGame(gameId: string): Promise<Game>`
- `getGame(gameId: string): Promise<Game>`
- `listGames(): Promise<Game[]>`
- `pushEvent(gameId: string, event: GameEvent): Promise<void>`
- `subscribeToGame(gameId: string, cb): RealtimeChannel`

**Executor:** `@backend`

### Phase 10 — Game Store Sync

> Status: `[x] done` — 2026-04-20

**File:** `src/stores/useGameStore.ts`

- `loadGame(id)` — fetches via `gameService.getGame()`, seeds reducer state
- `dispatch(event)` — calls reducer locally + `gameService.pushEvent()` to sync
- `subscribeToUpdates()` — wires Supabase Realtime; remote events run through local reducer (optimistic + reconcile)

**Executor:** `@backend`

### Phase 11 — GameMenuPage + Game Creation

> Status: `[x] done` — 2026-04-20  
> **Milestone: real async multiplayer**

**File:** `src/pages/GameMenuPage.vue`

- "New Game" → modal: choose element → `gameService.createGame()` → redirect to `/game/:id`
- "Join Game" → modal: enter game ID → `gameService.joinGame()` → redirect
- Game list → real games from store, shows opponent, element, whose turn, "Your turn" indicator

**Executor:** `@frontend` + `@backend`

---

## Work Stream 5 — Polish & Secondary Screens

### Phase 12+ — Friends, Profile, Real Auth

> Status: `[x] done` — 2026-04-20

- **FriendsPage:** search by player tag, send/accept/decline requests, challenge → create game
- **ProfilePage:** edit display name (inline), sign out, delete account
- **Auth:** swap `authService` mock for Supabase Auth

**Executor:** all agents

---

## Resolved Decisions

| Question | Answer |
|----------|--------|
| Piece types | 6 shared across all 3 elements — elements are a multiplier/skin layer |
| Abilities | Not yet defined — design all 18 as part of Phase 6 |
| Persistence | Supabase (Postgres + Realtime) from Phase 8 |
| Auth backend | Keep mock auth for now; swap for Supabase Auth in Phase 12+ |

---

## Verification

After each phase, run:
```bash
npm run build       # type-check + build passes
npm run test:run    # all tests pass
```

After Phase 5 (first playable moment), manual browser test at 375px + 1280px:
- New game → board renders → select piece → valid moves highlight → make move → HP updates
