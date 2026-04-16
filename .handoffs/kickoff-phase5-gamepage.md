---
feature: phase5-gamepage
agent: orchestrator
status: complete
timestamp: 2026-04-15
---

brief: >
  Phase 5 makes GamePage playable for the first time (local only). On mount a
  TIDE-vs-GALE game is auto-started. The board renders live from visibleState,
  pieces are clickable, valid moves highlight, and moves/attacks are dispatched
  through the game store. HP bars, End Turn, Move Log, and Resign are wired up.

screens:
  - GamePage: 8×8 interactive board with piece selection, valid-move highlights,
      HP bars, dock with End Turn + 6 ability slots, move-log panel (desktop),
      replay mode overlay

entities:
  GameState: { turn, phase, players, board, eventLog, winner }
  Piece: { id, type, element, position, owner }
  Square: { x, y }
  MoveCandidate: { from, to, capture? }
  MovementContext: { board, piece, playerId }

interactions:
  - "mount → store.newGame('TIDE', 'GALE') auto-called"
  - "click friendly piece → select it, compute valid moves via MovementRouter"
  - "click highlighted tile (move) → dispatch MOVE event"
  - "click highlighted tile (capture) → dispatch ATTACK with damage: 10"
  - "click elsewhere → deselect"
  - "End Turn button → dispatch END_TURN for current turn player"
  - "Resign button → dispatch RESIGN for P1, navigate to menu"
  - "Move Log button → toggle move-log panel (desktop only)"
  - "click event row in move log → store.enterReplay(index)"
  - "click again in replay → store.exitReplay()"

constraints:
  - All UI reads from visibleState only — never gameState directly
  - ELEMENT_COLOURS from src/types/index.ts — no hardcoded hex
  - No new SCSS token names — use existing $wf-* tokens
  - No new components — inline elements within GamePage only
  - Damage on ATTACK is placeholder 10 — Phase 6 will compute real values
  - Pointer event model: pieces layer pointer-events none; individual pieces pointer-events auto
  - Board coordinates: (0,0) = bottom-left from P1 perspective
  - STARTING_HP from src/stores/useGameStore.ts for HP bar computation
  - WCAG 2.2 AA — board squares role="gridcell", pieces aria-label with type + element

unknowns:
  - none blocking

sequence:
  - backend  (composable useGameBoard.ts + unit tests)
  - frontend (GamePage.vue template + GamePage.scss + GamePage.test.ts update)

agent_files:
  backend:  .claude/agents/backend.md
  frontend: .claude/agents/frontend.md

key_files:
  - src/pages/GamePage.vue
  - src/pages/GamePage.scss
  - src/stores/useGameStore.ts
  - src/stores/useGameStore.test.ts
  - src/game/movement/MovementRouter.ts
  - src/game/movement/types.ts
  - src/types/game.ts
  - src/types/index.ts
  - src/content/game.ts
  - .ai/project-overrides.md
