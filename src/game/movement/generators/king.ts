import type { MovementContext, MoveCandidate } from '../types'

const ALL_DIRECTIONS: [number, number][] = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]

/**
 * King movement generator.
 *
 * Moves exactly 1 square in any of the 8 directions.
 * Cannot land on a friendly piece; can capture an adjacent enemy piece.
 * No castling (deferred).
 */
export function kingMoves(ctx: MovementContext): MoveCandidate[] {
  const { piece, board } = ctx
  const { x, y } = piece.position
  const candidates: MoveCandidate[] = []

  for (const [dx, dy] of ALL_DIRECTIONS) {
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
