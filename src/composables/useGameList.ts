import { ref, onMounted } from 'vue'
import type { GameState } from '@/types/game'
import { gameService } from '@/services/gameService'

/**
 * Composable that fetches and exposes the current user's game list.
 *
 * Auth is not available until Phase 12 — all fetch failures (including
 * "Not authenticated") are caught and produce an empty list, not a crash.
 */
export function useGameList() {
  const games = ref<GameState[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      games.value = await gameService.listGames()
    } catch (e) {
      // Auth not available yet — show empty state gracefully
      games.value = []
      error.value = e instanceof Error ? e.message : 'Failed to load games'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    refresh()
  })

  return {
    games,
    loading,
    error,
    refresh,
  }
}
