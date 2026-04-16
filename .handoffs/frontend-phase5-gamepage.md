---
feature: phase5-gamepage
agent: frontend
status: complete
timestamp: 2026-04-15
---

completed:
  pages:
    - src/pages/GamePage.vue (full rewrite of template + script setup)
  styles:
    - src/pages/GamePage.scss (extended with tile states, piece layer, move log panel,
        replay badge, ability slots, dock button variants)

states_implemented:
  - board: empty | with-pieces | piece-selected | valid-moves-highlighted | capture-highlighted
  - dock: end-turn-enabled | end-turn-disabled | replay-mode (shows Exit Replay)
  - move-log panel: hidden (mobile) | open (desktop ≥768px, slide-in animation)
  - replay: board dimmed (opacity 0.65) + "Replaying…" badge
  - hp bars: data-bound to live HP values

content_keys_added_to_src/content/game.ts:
  - hud.endTurn: 'End Turn'
  - hud.exitReplay: 'Exit Replay'
  - hud.abilitySlot: '—'
  - hud.replayingBadge: 'Replaying…'

deviations_from_spec:
  - Ability slots are rendered as 6 inline buttons (not a separate component)
    — spec says no new components; this is compliant
  - Move log panel is display:none on mobile, display:flex on desktop;
    toggleMoveLog still works (button updates aria-expanded) — panel is desktop-only per spec

notes_for_qa:
  - Verify 64 gridcells rendered (role="gridcell")
  - Verify 32 pieces rendered on initial board
  - Click P1 pawn → valid moves should highlight (green overlay)
  - Click P2 piece on P1's turn → no selection
  - Click valid move → piece moves, board updates
  - HP bars: aria-valuenow should match store HP
  - End Turn button: enabled on P1's turn, disabled on P2's turn
  - Move Log button: toggles panel on desktop; panel shows event rows
  - Resign: navigates to /menu
  - At 375px: move log panel not visible (display:none)
  - At 1280px: move log panel opens beside board when toggled

blocked_on: null
