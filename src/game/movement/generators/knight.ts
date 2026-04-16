import type { MovementContext, MoveCandidate } from '../types'

const L_SHAPES: [number, number][] = [
  [2, 1], [2, -1],
  [-2, 1], [-2, -1],
  [1, 2], [1, -2],
  [-1, 2], [-1, -2],
]

/**
 * Knight movement generator.
 *
 * Moves in L-shapes (2+1 squares).
 * Jumps over any pieces in between.
 * Cannot land on a friendly piece; can land on an enemy square (capture).
 */
export function knightMoves(ctx: MovementContext): MoveCandidate[] {
  const { piece, board } = ctx
  const { x, y } = piece.position
  const candidates: MoveCandidate[] = []

  for (const [dx, dy] of L_SHAPES) {
    const cx = x + dx
    const cy = y + dy

    if (cx < 0 || cx > 7 || cy < 0 || cy > 7) continue

    const occupant = board[`${cx},${cy}`]
    if (occupant && occupant.owner === piece.owner) continue

    candidates.push({
      to: { x: cx, y: cy },
      isCapture: occupant !== undefined && occupant.owner !== piece.owner,
    })
  }

  return candidates
}
