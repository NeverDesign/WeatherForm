---
feature: phase11-game-menu
agent: frontend
status: complete
timestamp: 2026-04-20
---

completed:
  pages:
    - src/pages/GameMenuPage.vue: full rewrite with game list, New Game modal, Join Game modal
    - src/pages/GamePage.vue: script setup updated (backend agent), no template changes
  styles:
    - src/pages/GameMenuPage.scss: extended with skeleton, game list, game row, turn badge, modal, element selector, form field styles

states_implemented:
  - GameMenuPage: loading (skeleton rows), empty (existing empty state), populated (game list)
  - New Game modal: idle, submitting (button shows …), error (inline alert)
  - Join Game modal: idle, submitting (button shows …), error (inline alert with aria-describedby)

deviations_from_spec:
  - Opponent label uses "vs. Opponent" as a placeholder since GameState has no display name field (Phase 12 will wire real names)
  - Game row turn status uses game.turn === 'P1' as proxy for "your turn" — full per-user auth check deferred to Phase 12
  - Element badge uses inline :style for backgroundColor (runtime value from ELEMENT_COLOURS.base) — intentional, consistent with pieceColour pattern in GamePage

missing_copy_keys: []

notes_for_qa:
  - Modal backdrop click closes modal (click.self on backdrop div)
  - Element buttons use aria-pressed; fieldset/legend for accessible group label
  - Join Game input has id="join-game-id" paired with for="join-game-id" label
  - Error messages use role="alert" + aria-live="polite"
  - ELEMENT_COLOURS.base is a hex string — used only via JS binding, not hardcoded in SCSS

blocked_on: null
