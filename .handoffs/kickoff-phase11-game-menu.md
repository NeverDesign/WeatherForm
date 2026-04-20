---
feature: phase11-game-menu
agent: orchestrator
status: complete
timestamp: 2026-04-20
---

brief: >
  Wire GameMenuPage to real Supabase game creation and the game list. Auth is
  still mocked (Phase 12), so all gameService calls that require auth will fail
  gracefully — show empty state, not a crash. The page gains two inline modals
  (New Game, Join Game), a real game list with loading/empty states, and each
  game row links to the GamePage. GamePage.vue also needs its mount updated so
  it loads a remote game when the route id is a real Supabase UUID.

screens:
  - GameMenuPage: game list + empty state + New Game modal + Join Game modal
  - GamePage: mount updated to call loadGame for remote IDs; no visual change

entities:
  GameState:
    id: string
    phase: waiting | active | complete
    turn: P1 | P2 | null
    players:
      P1: { hp, element, pieceIds, abilityCooldowns }
      P2: { hp, element, pieceIds, abilityCooldowns }
    board: Record<string, Piece>
    eventLog: GameEvent[]
    winner: null | P1 | P2

interactions:
  - "BottomNav 'New Game' → opens New Game modal"
  - "Empty state 'New Game' CTA → opens New Game modal"
  - "Empty state 'Join Game' CTA → opens Join Game modal"
  - "New Game modal: choose element + submit → gameService.createGame → redirect /game/:id"
  - "New Game modal: cancel / backdrop click → closes modal"
  - "Join Game modal: enter game ID + choose element + submit → gameService.joinGame → redirect /game/:id"
  - "Join Game modal: cancel / backdrop click → closes modal"
  - "Game row: Play/Open button → router.push /game/:id"
  - "GamePage mounts with remote id → store.loadGame(id) + subscribeToUpdates()"
  - "GamePage unmounts → store.unsubscribeFromUpdates()"

constraints:
  - Inline modals only — no new .vue component files
  - All strings from gameMenuContent — no hardcoded copy in templates
  - ELEMENT_COLOURS for element badge colours — no hardcoded hex
  - Auth will fail gracefully: useGameList catches errors and shows empty state
  - ROUTES.GAME is /game/:id — use .replace(':id', id) for navigation
  - No commits — write commit notes to session doc only

unknowns:
  - GameState.players.P2 may be null when game is in 'waiting' phase (p2_id is null in DB).
    Treat missing P2 as "Waiting for opponent" in game row display.
  - joinGame in gameService.ts takes (gameId, p2Element) — the Join Game modal must collect both.
  - Local game IDs start with "game-" (from createGame factory: `game-${Date.now()}`).
    Remote Supabase IDs are UUIDs (no "game-" prefix). Use this to distinguish in GamePage mount.

sequence:
  - copy
  - backend
  - frontend
  - qa
