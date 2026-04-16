---
feature: phase3-movement
agent: backend
status: complete
timestamp: 2026-04-15
---
completed:
  types:
    - src/game/movement/types.ts — MoveCandidate, MovementContext
  generators:
    - src/game/movement/generators/pawn.ts — pawnMoves(ctx)
    - src/game/movement/generators/rook.ts — rookMoves(ctx); exports shared slide()
    - src/game/movement/generators/knight.ts — knightMoves(ctx)
    - src/game/movement/generators/bishop.ts — bishopMoves(ctx)
    - src/game/movement/generators/queen.ts — queenMoves(ctx)
    - src/game/movement/generators/king.ts — kingMoves(ctx)
  router:
    - src/game/movement/MovementRouter.ts — getValidMoves(ctx): MoveCandidate[]
  tests:
    - src/game/movement/movement.test.ts — 43 tests, all passing

contract_for_frontend:
  types_available:
    - "import type { MoveCandidate, MovementContext } from '@/game/movement/types'"
    - "import { getValidMoves } from '@/game/movement/MovementRouter'"
    - "MoveCandidate: { to: Square; isCapture: boolean }"
    - "MovementContext: { piece: Piece; board: BoardState; currentPlayer: 'P1' | 'P2' }"
  router_api:
    - "getValidMoves(ctx: MovementContext): MoveCandidate[] — all valid target squares for ctx.piece"
  notes:
    - All generators are pure functions — safe to call in computed properties
    - isCapture is true when the target square holds an enemy piece
    - Generators never mutate board or piece inputs

blocked_on: null
