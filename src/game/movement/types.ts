import type { BoardState, Piece, Square } from '@/types/game'

// ─── MoveCandidate ────────────────────────────────────────────────────────────

/**
 * A valid target square for a piece.
 * isCapture is true when an enemy piece occupies the target square.
 */
export interface MoveCandidate {
  to: Square
  isCapture: boolean
}

// ─── MovementContext ──────────────────────────────────────────────────────────

/**
 * All inputs a movement generator needs.
 * - piece: the piece being moved
 * - board: current full board state
 * - currentPlayer: who is taking the turn ('P1' | 'P2')
 */
export interface MovementContext {
  piece: Piece
  board: BoardState
  currentPlayer: 'P1' | 'P2'
}
