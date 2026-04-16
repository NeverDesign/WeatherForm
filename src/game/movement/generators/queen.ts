import type { MovementContext, MoveCandidate } from '../types'
import { slide } from './rook'

/**
 * Queen movement generator.
 *
 * Combines rook (horizontal + vertical) and bishop (diagonal) sliding.
 * Blocked by any piece in its path.
 * Can capture the first enemy piece encountered in any direction.
 */
export function queenMoves(ctx: MovementContext): MoveCandidate[] {
  const { piece, board } = ctx

  return slide(piece.position.x, piece.position.y, piece.owner, board, [
    // Rook directions
    [1, 0], [-1, 0], [0, 1], [0, -1],
    // Bishop directions
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ])
}
