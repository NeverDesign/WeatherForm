---
feature: phase11-game-menu
agent: backend
status: complete
timestamp: 2026-04-20
---

completed:
  composables:
    - src/composables/useGameList.ts:
        state: games (ref<GameState[]>), loading (ref<boolean>), error (ref<string|null>)
        actions: refresh() — calls gameService.listGames(), catches all errors gracefully
        lifecycle: calls refresh() on onMounted
  pages:
    - src/pages/GamePage.vue script setup updated:
        - imports useRoute, onMounted, onUnmounted, useGameStore
        - onMounted: if route id starts with "game-" → no-op (local game); else → store.loadGame(id) + store.subscribeToUpdates()
        - onUnmounted: store.unsubscribeFromUpdates()

contract_for_frontend:
  types_available:
    - "import type { GameState } from '@/types/game'"
    - "import { useGameList } from '@/composables/useGameList'"
  composable_returns:
    - games: GameState[] — list of current user's games (empty until auth is available)
    - loading: boolean — true while fetching
    - error: string | null — null when ok, error message when fetch failed
    - refresh(): void — manual re-fetch trigger
  game_state_fields_for_rows:
    - game.id — string (UUID for remote games)
    - game.phase — 'waiting' | 'active' | 'complete'
    - game.turn — 'P1' | 'P2' (whose turn it is)
    - game.players.P1.element — Element for badge colour
    - game.players.P2.element — Element for badge colour (may be null in waiting phase if P2 hasn't joined)
    - no p2_id field on GameState — use game.phase === 'waiting' to detect "Waiting for opponent"

blocked_on: null
