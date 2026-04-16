---
feature: phase3-movement
agent: orchestrator
status: complete
timestamp: 2026-04-15
---
brief: >
  Implement the movement system under src/game/movement/. This is a pure
  TypeScript layer — no Vue, no Pinia, no side effects. The system consists
  of types, one generator function per piece type, and a router that
  dispatches to the correct generator.

screens:
  - none: This phase is engine-only — no UI changes.

entities:
  MoveCandidate:
    to: Square
    isCapture: boolean
  MovementContext:
    piece: Piece
    board: BoardState
    currentPlayer: "'P1' | 'P2'"

interactions:
  - "getValidMoves(ctx) → MoveCandidate[] — all legal target squares for ctx.piece"
  - "Each generator is called with a MovementContext and returns MoveCandidate[]"

constraints:
  - Pure functions only — no Pinia, no Vue, no side effects, no global state
  - All generators return MoveCandidate[] — never mutate input
  - No castling, en passant, or promotion (deferred)
  - Board is 8x8; valid x and y are [0, 7]
  - (0,0) = bottom-left from P1's perspective; x left→right, y bottom→top
  - P1 pawns move in +y direction; P2 pawns move in -y direction
  - Generators must NOT include friendly-piece squares as targets
  - Generators CAN include enemy-piece squares as captures (isCapture: true)
  - Sliding pieces (rook, bishop, queen) stop when blocked by any piece
  - Knight jumps over pieces
  - King moves 1 square in any direction — no castling
  - Types live in src/game/movement/types.ts
  - Generators live in src/game/movement/generators/{pawn,rook,knight,bishop,queen,king}.ts
  - Router lives in src/game/movement/MovementRouter.ts
  - Tests live in src/game/movement/movement.test.ts (or per-file, agent's choice)
  - Existing types imported from src/types/game.ts: Piece, Square, BoardState, PieceType
  - BoardState is Record<string, Piece> keyed by "x,y"

unknowns:
  - none blocking

sequence:
  - backend
