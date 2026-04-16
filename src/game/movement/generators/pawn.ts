import type { MovementContext } from '../types'
import type { MoveCandidate } from '../types'

/**
 * Pawn movement generator.
 *
 * - P1 moves in +y direction (up from P1's bottom-left perspective)
 * - P2 moves in -y direction (down toward P1's bottom-left)
 * - Forward 1 square if unoccupied
 * - Forward 2 squares from starting row if both squares are unoccupied
 *   - P1 starting row: y === 1
 *   - P2 starting row: y === 6
 * - Diagonal captures only (cannot capture forward)
 * - No en passant or promotion (deferred)
 */
export function pawnMoves(ctx: MovementContext): MoveCandidate[] {
  const { piece, board } = ctx
  const { x, y } = piece.position
  const direction = piece.owner === 'P1' ? 1 : -1
  const startingRow = piece.owner === 'P1' ? 1 : 6

  const candidates: MoveCandidate[] = []

  function key(cx: number, cy: number): string {
    return `${cx},${cy}`
  }

  function inBounds(cx: number, cy: number): boolean {
    return cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7
  }

  // Forward 1
  const fwd1y = y + direction
  if (inBounds(x, fwd1y) && !board[key(x, fwd1y)]) {
    candidates.push({ to: { x, y: fwd1y }, isCapture: false })

    // Forward 2 from starting row (only if forward 1 is also clear)
    if (y === startingRow) {
      const fwd2y = y + direction * 2
      if (inBounds(x, fwd2y) && !board[key(x, fwd2y)]) {
        candidates.push({ to: { x, y: fwd2y }, isCapture: false })
      }
    }
  }

  // Diagonal captures
  for (const dx of [-1, 1]) {
    const cx = x + dx
    const cy = y + direction
    if (inBounds(cx, cy)) {
      const occupant = board[key(cx, cy)]
      if (occupant && occupant.owner !== piece.owner) {
        candidates.push({ to: { x: cx, y: cy }, isCapture: true })
      }
    }
  }

  return candidates
}
