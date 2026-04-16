import type { MovementContext, MoveCandidate } from './types'
import { pawnMoves }   from './generators/pawn'
import { rookMoves }   from './generators/rook'
import { knightMoves } from './generators/knight'
import { bishopMoves } from './generators/bishop'
import { queenMoves }  from './generators/queen'
import { kingMoves }   from './generators/king'

/**
 * Dispatches to the correct movement generator by piece type.
 *
 * Returns all valid MoveCandidate[] for the piece in ctx.
 * Never mutates the context or board.
 */
export function getValidMoves(ctx: MovementContext): MoveCandidate[] {
  switch (ctx.piece.type) {
    case 'PAWN':   return pawnMoves(ctx)
    case 'ROOK':   return rookMoves(ctx)
    case 'KNIGHT': return knightMoves(ctx)
    case 'BISHOP': return bishopMoves(ctx)
    case 'QUEEN':  return queenMoves(ctx)
    case 'KING':   return kingMoves(ctx)
    default: {
      // Exhaustiveness guard — unknown piece type returns no moves
      const _exhaustive: never = ctx.piece.type
      void _exhaustive
      return []
    }
  }
}
