import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, GameEvent, Piece, PieceType, BoardState } from '@/types/game'
import type { Element } from '@/types'
import { gameReducer } from './gameReducer'

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
   * The single source of truth for all UI rendering.
   * Returns replayState during replay, gameState during live play.
   * Matches the `visibleState` pattern from project-overrides.md.
   */
  const visibleState = computed<GameState | null>(() =>
    isReplay.value ? replayState.value : gameState.value,
  )

  // ─── Actions ───────────────────────────────────────────────────────────────

  /** Start a new game between two elements. */
  function newGame(p1Element: Element, p2Element: Element): void {
    const state = createGame(p1Element, p2Element)
    initialState.value = structuredClone(state)
    gameState.value = state
    isReplay.value = false
    replayState.value = null
  }

  /**
   * Apply a GameEvent to the live state.
   * Calls the pure reducer and replaces the state ref.
   *
   * JSON round-trip strips the Vue reactive Proxy wrapper so the reducer's
   * structuredClone receives a plain object (GameState is JSON-safe by design).
   */
  function dispatch(event: GameEvent): void {
    if (!gameState.value) return
    const plain = JSON.parse(JSON.stringify(gameState.value)) as GameState
    gameState.value = gameReducer(plain, event)
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

  return {
    gameState,
    initialState,
    isReplay,
    replayState,
    visibleState,
    newGame,
    dispatch,
    enterReplay,
    exitReplay,
  }
})
