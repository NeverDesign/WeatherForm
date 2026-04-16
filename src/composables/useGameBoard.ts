import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore, STARTING_HP } from '@/stores/useGameStore'
import { getValidMoves } from '@/game/movement/MovementRouter'
import type { Piece } from '@/types/game'
import type { MoveCandidate } from '@/game/movement/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TileState {
  piece: Piece | null
  isSelected: boolean
  isValidMove: boolean
  isCapture: boolean
  boardX: number
  boardY: number
}

// ─── Composable ───────────────────────────────────────────────────────────────

/**
 * All reactive logic for the GamePage.
 * The template never reads from store directly — everything comes through here.
 * All UI reads from visibleState as required by project-overrides.md.
 */
export function useGameBoard() {
  const store = useGameStore()
  const router = useRouter()

  // ── Selection state ────────────────────────────────────────────────────────

  /** The currently selected piece, or null if none. */
  const selectedPiece = ref<Piece | null>(null)

  /** Valid move candidates for the selected piece. */
  const validMoves = ref<MoveCandidate[]>([])

  // ── Move log panel ─────────────────────────────────────────────────────────

  /** Whether the move log panel is open (desktop only). */
  const moveLogOpen = ref(false)

  // ── Board initialisation ───────────────────────────────────────────────────

  onMounted(() => {
    store.newGame('TIDE', 'GALE')
  })

  // ── HP computeds ──────────────────────────────────────────────────────────

  const p1Hp = computed(() => store.visibleState?.players.P1.hp ?? STARTING_HP)
  const p2Hp = computed(() => store.visibleState?.players.P2.hp ?? STARTING_HP)

  /** HP as a 0–100 percentage for the HP bar width binding. */
  const p1HpPercent = computed(() => Math.max(0, (p1Hp.value / STARTING_HP) * 100))
  const p2HpPercent = computed(() => Math.max(0, (p2Hp.value / STARTING_HP) * 100))

  // ── Turn state ─────────────────────────────────────────────────────────────

  /** The player whose turn it is. */
  const currentTurn = computed(() => store.visibleState?.turn ?? 'P1')

  /**
   * End Turn is enabled only when it is the local player's turn.
   * For Phase 5 (local only) P1 is always the local player.
   */
  const canEndTurn = computed(() => !store.isReplay && currentTurn.value === 'P1')

  // ── Board grid ─────────────────────────────────────────────────────────────

  /**
   * 8×8 grid of TileState values, row-major from top (y=7) to bottom (y=0).
   * Each row is an array of 8 tiles, left (x=0) to right (x=7).
   *
   * Rendering order: rows descend so y=7 is the top row on screen and y=0 is
   * the bottom row (P1's back rank, closest to P1).
   */
  const boardRows = computed<TileState[][]>(() => {
    const board = store.visibleState?.board ?? {}
    const selectedId = selectedPiece.value?.id ?? null

    // Build a set of valid-move squares for O(1) lookup
    const validMoveSet = new Set<string>()
    const captureSet = new Set<string>()
    for (const m of validMoves.value) {
      const key = `${m.to.x},${m.to.y}`
      validMoveSet.add(key)
      if (m.isCapture) captureSet.add(key)
    }

    const rows: TileState[][] = []
    for (let y = 7; y >= 0; y--) {
      const row: TileState[] = []
      for (let x = 0; x < 8; x++) {
        const key = `${x},${y}`
        const piece = board[key] ?? null
        row.push({
          piece,
          isSelected: piece !== null && piece.id === selectedId,
          isValidMove: validMoveSet.has(key),
          isCapture: captureSet.has(key),
          boardX: x,
          boardY: y,
        })
      }
      rows.push(row)
    }
    return rows
  })

  // ── Event log (for move log panel) ────────────────────────────────────────

  const eventLog = computed(() => store.visibleState?.eventLog ?? [])

  // ── Replay ────────────────────────────────────────────────────────────────

  const isReplay = computed(() => store.isReplay)

  function handleLogRowClick(index: number): void {
    if (store.isReplay) {
      store.exitReplay()
    } else {
      store.enterReplay(index)
    }
  }

  // ── Tile click handler ─────────────────────────────────────────────────────

  /**
   * Central handler for all board tile clicks.
   * Coordinates are board coordinates: (0,0) = bottom-left from P1's view.
   */
  function handleTileClick(boardX: number, boardY: number): void {
    // Replay mode — board is non-interactive
    if (store.isReplay) return

    const state = store.visibleState
    if (!state) return

    const key = `${boardX},${boardY}`
    const clickedPiece = state.board[key] ?? null

    // ── Case 1: A valid move target is clicked ────────────────────────────
    if (selectedPiece.value && validMoves.value.length > 0) {
      const matchingMove = validMoves.value.find(
        m => m.to.x === boardX && m.to.y === boardY,
      )
      if (matchingMove) {
        _applyMove(selectedPiece.value, matchingMove)
        _deselect()
        return
      }
    }

    // ── Case 2: A friendly piece is clicked ───────────────────────────────
    if (clickedPiece && clickedPiece.owner === state.turn) {
      selectedPiece.value = clickedPiece
      validMoves.value = getValidMoves({
        piece: clickedPiece,
        board: state.board,
        currentPlayer: state.turn,
      })
      return
    }

    // ── Case 3: Anything else — deselect ─────────────────────────────────
    _deselect()
  }

  function _deselect(): void {
    selectedPiece.value = null
    validMoves.value = []
  }

  function _applyMove(piece: Piece, move: MoveCandidate): void {
    const state = store.visibleState
    if (!state) return

    const targetKey = `${move.to.x},${move.to.y}`
    const targetPiece = state.board[targetKey] ?? null

    if (move.isCapture && targetPiece) {
      store.dispatch({
        type: 'ATTACK',
        attackerId: piece.id,
        targetId: targetPiece.id,
        from: piece.position,
        to: move.to,
        damage: 10, // Phase 5 placeholder — Phase 6 computes real damage
      })
    } else {
      store.dispatch({
        type: 'MOVE',
        pieceId: piece.id,
        from: piece.position,
        to: move.to,
      })
    }
  }

  // ── Dock actions ───────────────────────────────────────────────────────────

  function handleEndTurn(): void {
    if (!canEndTurn.value) return
    const state = store.visibleState
    if (!state) return
    store.dispatch({ type: 'END_TURN', playerId: state.turn })
  }

  function handleResign(): void {
    store.dispatch({ type: 'RESIGN', playerId: 'P1' })
    router.push('/menu')
  }

  function toggleMoveLog(): void {
    moveLogOpen.value = !moveLogOpen.value
  }

  function exitReplay(): void {
    store.exitReplay()
  }

  // ── Human-readable event label helper ─────────────────────────────────────

  /**
   * Returns a human-readable string for a single GameEvent.
   * Used by the move log panel.
   */
  function eventLabel(event: (typeof eventLog.value)[number]): string {
    switch (event.type) {
      case 'MOVE':
        return `${_pieceOwnerFromId(event.pieceId)} moved to ${event.to.x},${event.to.y}`
      case 'ATTACK':
        return `${_pieceOwnerFromId(event.attackerId)} attacked at ${event.to.x},${event.to.y} (${event.damage} dmg)`
      case 'END_TURN':
        return `${event.playerId} ended turn`
      case 'RESIGN':
        return `${event.playerId} resigned`
      case 'GAME_OVER':
        return `Game over — winner: ${event.winner}`
      case 'USE_ABILITY':
        return `${event.playerId} used ability ${event.abilityId}`
      default:
        return 'Unknown event'
    }
  }

  /** Extract owner label from a piece ID like "p1-pawn-3" → "P1" */
  function _pieceOwnerFromId(pieceId: string): string {
    return pieceId.startsWith('p1') ? 'P1' : 'P2'
  }

  // ── Expose ─────────────────────────────────────────────────────────────────

  return {
    // Board
    boardRows,
    handleTileClick,
    // HP
    p1Hp,
    p2Hp,
    p1HpPercent,
    p2HpPercent,
    // Turn
    currentTurn,
    canEndTurn,
    // Selection
    selectedPiece,
    validMoves,
    // Dock
    handleEndTurn,
    handleResign,
    toggleMoveLog,
    moveLogOpen,
    // Move log + replay
    eventLog,
    isReplay,
    handleLogRowClick,
    exitReplay,
    eventLabel,
  }
}
