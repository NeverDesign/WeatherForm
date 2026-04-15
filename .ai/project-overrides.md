# Project Overrides — WeatherForm

**Priority:** Higher than all other configuration. Agents check this first.

---

## Project Identity

- **Product name:** WeatherForm
- **Description:** Async multiplayer chess variant where players choose a mono-elemental army (TIDE, GALE, or DUNE) before each match. Elements form a rock-paper-scissors advantage triangle. Chess movement + per-element abilities = tactical layer. Turns taken asynchronously (hours or days), like correspondence chess.
- **Primary audience:** Tabletop / strategy game players who enjoy correspondence-style play
- **Setup date:** 2026-04-15

Game design documentation: `docs/ideas/` — read `overview.md` first, then follow links.

---

## Settled Decisions

These architectural patterns are carried over from the predecessor project. **Do not revisit, refactor, or propose alternatives to these.** If you believe one needs changing, note it in your session summary's Observations section and let the human decide.

- **Pure reducer:** All state transitions are `(GameState, GameEvent) → GameState` — no side effects in the engine
- **Integer-only damage math:** Multiply by 100 integers (e.g., `150` = 1.5×), always `Math.floor()` the result — no floats, ever
- **Plain JSON state:** `GameState` contains no class instances or functions — must be safe for `structuredClone` and JSON round-trips
- **Event log:** All game actions are `GameEvent` discriminated union values; the engine is a reducer over this log
- **`visibleState` pattern:** The store exposes `visibleState` which returns `replayState` during replay and `gameState` during live play — all UI reads from `visibleState` only, never directly from `gameState`
- **Movement generators:** Each piece type has a pure function returning `Position[]`, dispatched via a `MovementRouter` by `piece.type`
- **Pointer event model:** The pieces layer has `pointer-events: none`; individual piece components have `pointer-events: auto` and forward clicks to `handleTileClick`
- **Board coordinates:** `(0,0)` = bottom-left from P1's perspective; `x` left→right, `y` bottom→top. P2's view is a UI-layer transform only — engine coordinates are never changed

---

## Stack Deviations

- No backend server — this is a pure Vue 3 SPA; "services" are client-side only for now
- No ORM or database direct access — all persistence is stubbed or via future API
- Pinia setup store style only — options API is not used anywhere in this project

---

## Agent Scope

- **Design agent:** Figma MCP (`get_design_context`, `generate_diagram`) if available; fall back to markdown wireframes
- **Backend agent:** Never touch game engine reducer logic unless explicitly asked — the reducer patterns are settled
- **QA agent:** Browser validation at 375px and 1280px; note that Playwright may not be available in sandbox

---

## Known Gotchas

- `_settings.scss` is auto-injected by Vite into every `.scss` file — agents must never `@import` it manually; doing so causes double-injection
- The `ELEMENT_COLOURS` constant in `src/types/index.ts` maps elements to their SCSS token names — use this, don't hardcode element colours
- `visibleState` is the single source of truth for all UI — agents who read `gameState` directly are introducing a bug
- Element damage multipliers are integers: `150`, `100`, `50` — not `1.5`, `1.0`, `0.5`

---

## Accessibility & Language Requirements

- WCAG 2.2 AA minimum
- English only (no i18n required)
- Game-specific ARIA: board squares need `role="gridcell"`, pieces need descriptive `aria-label` including piece type and element
