import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { GameState, GameEvent, Piece, PieceType, BoardState } from '@/types/game'
import type { Element } from '@/types'
import { gameReducer } from './gameReducer'
import { gameService } from '@/services/gameService'

// ─── Constants ───────────────────────────────────────────────────────────────

export const STARTING_HP = 100

/**
 * Standard chess back-rank layout left→right from P1's perspective.
 * x=0: a-file, x=7: h-file.
 */
const BACK_RANK: PieceType[] = [
  'ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK',
]

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create a fresh GameState from two chosen elements.
 * P1 occupies rows y=0 (back rank) and y=1 (pawns).
 * P2 occupies rows y=7 (back rank) and y=6 (pawns).
 * Both sides use the same BACK_RANK column layout from P1's coordinate system.
 */
export function createGame(p1Element: Element, p2Element: Element): GameState {
  const board: BoardState = {}
  const p1PieceIds: string[] = []
  const p2PieceIds: string[] = []

  for (let x = 0; x < 8; x++) {
    const pieceType = BACK_RANK[x]

    // P1 back rank (y=0) + pawns (y=1)
    const p1BackId = `p1-${pieceType.toLowerCase()}-${x}`
    const p1PawnId = `p1-pawn-${x}`

    const p1Back: Piece = { id: p1BackId, type: pieceType,  element: p1Element, position: { x, y: 0 }, owner: 'P1' }
    const p1Pawn: Piece = { id: p1PawnId, type: 'PAWN', element: p1Element, position: { x, y: 1 }, owner: 'P1' }

    board[`${x},0`] = p1Back
    board[`${x},1`] = p1Pawn
    p1PieceIds.push(p1BackId, p1PawnId)

    // P2 back rank (y=7) + pawns (y=6)
    const p2BackId = `p2-${pieceType.toLowerCase()}-${x}`
    const p2PawnId = `p2-pawn-${x}`

    const p2Back: Piece = { id: p2BackId, type: pieceType,  element: p2Element, position: { x, y: 7 }, owner: 'P2' }
    const p2Pawn: Piece = { id: p2PawnId, type: 'PAWN', element: p2Element, position: { x, y: 6 }, owner: 'P2' }

    board[`${x},7`] = p2Back
    board[`${x},6`] = p2Pawn
    p2PieceIds.push(p2BackId, p2PawnId)
  }

  return {
    id: `game-${Date.now()}`,
    phase: 'active',
    turn: 'P1',
    turnNumber: 1,
    players: {
      P1: { hp: STARTING_HP, element: p1Element, pieceIds: p1PieceIds, abilityCooldowns: {} },
      P2: { hp: STARTING_HP, element: p2Element, pieceIds: p2PieceIds, abilityCooldowns: {} },
    },
    board,
    eventLog: [],
    winner: null,
  }
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useGameStore = defineStore('game', () => {
  /** Live game state — the source of truth. */
  const gameState = ref<GameState | null>(null)

  /**
   * The state at game creation, before any events. Stored so replay can
   * reconstruct any intermediate state by replaying the event log.
   */
  const initialState = ref<GameState | null>(null)

  /** When true, the UI reads from replayState instead of gameState. */
  const isReplay = ref(false)

  /** Reconstructed state at the replay cursor position. */
  const replayState = ref<GameState | null>(null)

  /**
   * Supabase game ID when in online mode. null = local-only (no remote sync).
   * Set by loadGame; cleared by newGame.
   */
  const remoteGameId = ref<string | null>(null)

  /** Active Realtime channel. Stored so it can be unsubscribed on cleanup. */
  const realtimeChannel = ref<RealtimeChannel | null>(null)

  /**
   * The single source of truth for all UI rendering.
   * Returns replayState during replay, gameState during live play.
   * Matches the `visibleState` pattern from project-overrides.md.
   */
  const visibleState = computed<GameState | null>(() =>
    isReplay.value ? replayState.value : gameState.value,
  )

  // ─── Local actions ─────────────────────────────────────────────────────────

  /** Start a new local-only game (no Supabase sync). */
  function newGame(p1Element: Element, p2Element: Element): void {
    const state = createGame(p1Element, p2Element)
    initialState.value = structuredClone(state)
    gameState.value = state
    remoteGameId.value = null
    isReplay.value = false
    replayState.value = null
    _cleanupChannel()
  }

  /**
   * Apply a GameEvent to the live state optimistically.
   * When in online mode (remoteGameId is set), also pushes the event to
   * Supabase in the background — fire-and-forget with console error on failure.
   */
  function dispatch(event: GameEvent): void {
    if (!gameState.value) return

    // Optimistic local update — always synchronous
    const plain = JSON.parse(JSON.stringify(gameState.value)) as GameState
    gameState.value = gameReducer(plain, event)

    // Remote sync when online
    if (remoteGameId.value) {
      gameService.pushEvent(remoteGameId.value, event).catch((err) => {
        console.error('[gameStore] pushEvent failed:', err)
      })
    }
  }

  /**
   * Enter replay mode at a specific event index.
   * Reconstructs game state by replaying events 0..eventIndex-1
   * from the initial state.
   *
   * @param eventIndex - number of events to include (0 = initial board)
   */
  function enterReplay(eventIndex: number): void {
    if (!initialState.value || !gameState.value) return

    const plain = JSON.parse(JSON.stringify(initialState.value)) as GameState
    const events = (JSON.parse(JSON.stringify(gameState.value)) as GameState).eventLog.slice(0, eventIndex)

    let state = plain
    for (const event of events) {
      state = gameReducer(state, event)
    }

    replayState.value = state
    isReplay.value = true
  }

  /** Exit replay mode and return to the live game state. */
  function exitReplay(): void {
    isReplay.value = false
    replayState.value = null
  }

  // ─── Online / Supabase actions ─────────────────────────────────────────────

  /**
   * Load an existing game from Supabase and seed the local store.
   * Switches the store into online mode — subsequent dispatch calls will
   * also push events to Supabase.
   */
  async function loadGame(id: string): Promise<void> {
    const state = await gameService.getGame(id)

    remoteGameId.value = id
    gameState.value = state
    // Reconstruct initial board for replay from the two elements
    initialState.value = {
      ...createGame(state.players.P1.element, state.players.P2.element),
      id,
    }
    isReplay.value = false
    replayState.value = null
  }

  /**
   * Subscribe to Supabase Realtime updates for the current game.
   * When the opponent pushes a move, the remote GameState replaces the
   * local state (reconcile). This is safe because the remote snapshot is
   * the authoritative post-reducer result of the opponent's event.
   *
   * Call this once after loadGame. Automatically tears down any previous
   * channel before subscribing.
   */
  function subscribeToUpdates(): void {
    if (!remoteGameId.value) return
    _cleanupChannel()
    realtimeChannel.value = gameService.subscribeToGame(
      remoteGameId.value,
      (remoteState) => {
        // Reconcile: the incoming state is already reduced on the server side
        gameState.value = remoteState
      },
    )
  }

  /** Unsubscribe from Realtime and clear the channel ref. */
  function unsubscribeFromUpdates(): void {
    _cleanupChannel()
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  function _cleanupChannel(): void {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  return {
    // State
    gameState,
    initialState,
    isReplay,
    replayState,
    remoteGameId,
    // Computed
    visibleState,
    // Local actions
    newGame,
    dispatch,
    enterReplay,
    exitReplay,
    // Online actions
    loadGame,
    subscribeToUpdates,
    unsubscribeFromUpdates,
  }
})
