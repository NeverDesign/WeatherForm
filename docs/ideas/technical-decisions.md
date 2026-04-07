# Technical Decisions

> **Purpose:** Records key architectural decisions for weatherform. Flags what is inherited from weatherform-0.0 unchanged, what is modified, and what is new. Written to prevent revisiting settled choices.

---

## Inherited from Weatherform-0.0 (keep as-is)

### Pure Reducer Architecture
All state transitions are `(GameState, GameEvent) → GameState` — pure functions, no side effects.

**Why:** Enables deterministic replay, simplifies testing, works identically across clients and server.

### Integer-Only Damage Math
All damage calculations use integers ×100 (e.g., `150` = 1.5×). Results are always `Math.floor()`'d.

**Why:** Floating-point arithmetic is non-deterministic across JS environments. Integer math is reproducible everywhere.

### GameState as Plain JSON-Serializable Object
No class instances, no functions in state. All mutations produce a fresh copy via `structuredClone` or `JSON.parse(JSON.stringify(...))`.

**Why:** Required for server persistence, network transmission, and replay determinism.

### Event System (Discriminated Union)
All game actions are `GameEvent` values. The engine is a reducer over this event log.

**Why:** Enables full replay, audit log, and deterministic state reconstruction from any point.

### `visibleState` Pattern
The store exposes a `visibleState` computed property: returns `replayState` during replay, `gameState` during live play. All UI reads from `visibleState` only.

**Why:** Replay works automatically for any UI component — no component needs to know whether replay is active.

### Schema Versioning
State schema version is stored alongside persisted data. On version mismatch, stored data is discarded.

**Why:** Prevents crashes from stale data after engine updates.

### `StatusEffect` as Typed Union
`statusEffects: StatusEffect[]` uses a discriminated union, not raw strings. Re-applying refreshes duration — does not stack.

**Why:** Each effect carries metadata (`damagePerTurn`, `duration`) that a string cannot hold. TypeScript exhaustive checking catches missing cases.

---

## Modified from Weatherform-0.0

### Element System
**0.0:** 6 elements (FIRE/WATER/EARTH/AIR/LIGHTNING/NEUTRAL), per-piece assignment, asymmetric advantage table.

**New:** 3 elements (TIDE/GALE/DUNE), mono-elemental armies, symmetric RPS triangle with 150/100/50 multipliers. No neutral element.

**Why:** Simpler mental model for async/mobile audience. Mono-elemental model creates "race commitment" strategic layer (StarCraft-style).

### Ability System
**0.0:** 6 abilities, one per piece type, fixed regardless of element.

**New:** 18 abilities (V1), one per piece type per element. Ability is determined by the set's element choice — all pieces of the same type in a set use the same ability. The data model includes an ability slot per piece type to support future O/D/S expansion.

**Why:** Element should have thematic expression in combat, not just in damage multipliers.

### Persistence Layer
**0.0:** `localStorage` — browser-native, zero-dependency, single-device.

**New:** Server-side persistence required. Game state, events, and player sets are stored on the backend. `localStorage` may still be used for UI preferences and session caching, but is not authoritative.

**Why:** Async multiplayer requires shared state accessible from any device, by either player, at any time.

---

## New Decisions (not in Weatherform-0.0)

### Async Multiplayer Model
Players take turns over hours or days — not real-time. The game is playable like correspondence chess.

**Implementation:** Each `GameState` is stored server-side. On `END_TURN`, state is persisted and the waiting player is notified (push notification or in-app).

### Turn Timer + `TIMEOUT_FORFEIT` Event
Each turn has a configurable time limit (e.g., 72 hours). On expiry, a `TIMEOUT_FORFEIT` event is emitted server-side, ending the game in favour of the waiting player.

This is a new event type not present in weatherform-0.0's event system.

### Authentication and Identity
Players have persistent accounts: display name, player tag (`Name#0000`), and email. Auth is required before any game action.

**Minimum data captured at registration:** display name, player tag, email.

**Future:** MFA.

### Set Storage
Sets are stored per-player on the server. A set's element is visible to both players from game start — no hidden-element mechanic.

Sets cannot be modified while in use in an active game.

### Coordinate System / Board Orientation
Engine coordinates are unchanged from 0.0: `(0,0)` = bottom-left from P1's perspective, `x` left→right, `y` bottom→top.

UI always renders the current player's pieces at the bottom of the board — orientation is flipped for P2's view. This is a UI transform only; engine coordinates are not affected.

### Movement Generator Functions (inherited pattern, extended)
Each piece type has a dedicated movement generator function returning `Position[]`. These are pure functions — no state mutation.

The `MovementRouter` dispatches by `piece.type`. This pattern is inherited from 0.0 and should be maintained.

### Pointer Event Model (inherited pattern)
The pieces layer has `pointer-events: none`. Individual piece components have `pointer-events: auto` and forward clicks to the board's `handleTileClick` handler.

**Why:** Piece clicks and empty tile clicks must route through the same handler; the pieces layer must not block tile interaction.
