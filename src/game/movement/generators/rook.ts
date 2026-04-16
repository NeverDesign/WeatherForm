import type { MovementContext, MoveCandidate } from '../types'

/**
 * Rook movement generator.
 *
 * Slides horizontally and vertically.
 * Blocked by any piece in its path.
 * Can capture the first enemy piece encountered; cannot jump over any piece.
 */
export function rookMoves(ctx: MovementContext): MoveCandidate[] {
  const { piece, board } = ctx

  return slide(piece.position.x, piece.position.y, piece.owner, board, [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])
}

/** Shared sliding logic used by rook, bishop, and queen generators. */
export function slide(
  startX: number,
  startY: number,
  owner: 'P1' | 'P2',
  board: Record<string, import('@/types/game').Piece>,
  directions: [number, number][],
): MoveCandidate[] {
  const candidates: MoveCandidate[] = []

  for (const [dx, dy] of directions) {
    let cx = startX + dx
    let cy = startY + dy

    while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
      const occupant = board[`${cx},${cy}`]

      if (occupant) {
        if (occupant.owner !== owner) {
          // Enemy piece — can capture, then stop
          candidates.push({ to: { x: cx, y: cy }, isCapture: true })
        }
        // Friendly or enemy — stop sliding in this direction
        break
      }

      candidates.push({ to: { x: cx, y: cy }, isCapture: false })
      cx += dx
      cy += dy
    }
  }

  return candidates
}
