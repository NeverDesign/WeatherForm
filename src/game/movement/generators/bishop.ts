import type { MovementContext, MoveCandidate } from '../types'
import { slide } from './rook'

/**
 * Bishop movement generator.
 *
 * Slides diagonally in all four diagonal directions.
 * Blocked by any piece in its path.
 * Can capture the first enemy piece encountered; cannot jump over any piece.
 */
export function bishopMoves(ctx: MovementContext): MoveCandidate[] {
  const { piece, board } = ctx

  return slide(piece.position.x, piece.position.y, piece.owner, board, [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ])
}
