# Session: Phase 5 — GamePage UI Integration

**Date:** 2026-04-15
**Agents:** orchestrator, backend, frontend
**QA result:** PASS

## What Was Built

Phase 5 makes GamePage playable for the first time (local only). A new composable
(`useGameBoard`) encapsulates all reactive game-board logic: board grid construction,
piece selection, move dispatch, HP bar computation, move log, and replay navigation.
The GamePage template was fully rewritten to consume the composable and render a live,
interactive 8×8 board with element-coloured pieces, highlighted valid moves, and a
wired dock (End Turn, Resign, Move Log, 6 disabled ability slots).

## Files

| File | Agent | Action |
|------|-------|--------|
| `src/composables/useGameBoard.ts` | backend | Created |
| `src/composables/useGameBoard.test.ts` | backend | Created (33 tests) |
| `src/pages/GamePage.vue` | frontend | Rewritten template + script setup |
| `src/pages/GamePage.scss` | frontend | Extended (tile states, piece layer, move log, replay, dock variants) |
| `src/pages/GamePage.test.ts` | frontend | Updated (9 tests, now provides Pinia + Router) |
| `src/content/game.ts` | frontend | Added hud.endTurn, hud.exitReplay, hud.abilitySlot, hud.replayingBadge |
| `docs/plans/implementation-plan.md` | orchestrator | Phase 5 marked done |
| `.handoffs/kickoff-phase5-gamepage.md` | orchestrator | Created |
| `.handoffs/backend-phase5-gamepage.md` | backend | Created |
| `.handoffs/frontend-phase5-gamepage.md` | frontend | Created |

## Test Results

- `npm run build` — exits 0 (type-check + production build)
- `npm run test:run` — 156 tests, 14 test files, all pass

## Git Commit

Subject: `feat: implement Phase 5 — make GamePage playable (local only)`

Body:
- Add useGameBoard composable with board grid, selection state, valid-move highlighting, and move dispatch
- Wire GamePage template to composable: live 8×8 board, element-coloured pieces, HP bars, dock buttons
- Extend GamePage.scss with tile state classes (selected, valid-move, capture), piece layer, move log panel, replay badge
- Add End Turn, Resign, Move Log, and 6 placeholder ability slot buttons to dock
- Add desktop move log panel (slide-in, ≥768px) with event list and replay row click
- Add content keys: hud.endTurn, hud.exitReplay, hud.abilitySlot, hud.replayingBadge
- Update GamePage.test.ts to provide Pinia + Router; add 8 new rendering assertions
- Mark Phase 5 done in implementation-plan.md

## Deferred

- Damage calculation on ATTACK is placeholder `10` — Phase 6 will compute real values using element multipliers
- 6 ability slots are always disabled — Phase 6 will add ability types and activation
- Move log panel is desktop-only (display:none on mobile) — per spec
- Local player is hardcoded as P1 — Phase 11 will make this dynamic

## Uncertainty Log

- `ELEMENT_COLOURS.base` is a hex string bound via `:style="{ color: ... }"` on individual piece `<span>` elements. This is the only intentional inline style after mount (not an SCSS violation — the value is runtime-dynamic and comes from the type-safe constant, not hardcoded).
- `rgba($wf-accent, 0.25)` is used for the valid-move tile overlay. SCSS's built-in `rgba()` with a colour variable is fine; no `$wf-accent-rgb` token is needed.
- `boardRows` renders y=7 at index 0 (top of screen) and y=0 at index 7 (bottom). This matches the board coordinate spec: `(0,0)` = bottom-left from P1's perspective.
- The tile checkerboard was recalculated: `(x + y) % 2 === 0` is dark. The original template used a row/col convention that would have been misaligned with board coordinates after the coordinate-aware rewrite.
