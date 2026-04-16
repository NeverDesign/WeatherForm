import { describe, it, expect } from 'vitest'
import type { Piece, BoardState } from '@/types/game'
import type { MovementContext } from './types'
import { getValidMoves } from './MovementRouter'
import { pawnMoves }   from './generators/pawn'
import { rookMoves }   from './generators/rook'
import { knightMoves } from './generators/knight'
import { bishopMoves } from './generators/bishop'
import { queenMoves }  from './generators/queen'
import { kingMoves }   from './generators/king'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function key(x: number, y: number): string {
  return `${x},${y}`
}

function makePiece(overrides: Partial<Piece> & { x: number; y: number }): Piece {
  return {
    id: 'test-piece',
    type: 'PAWN',
    element: 'TIDE',
    owner: 'P1',
    position: { x: overrides.x, y: overrides.y },
    ...overrides,
  }
}

function emptyBoard(): BoardState {
  return {}
}

function boardWith(pieces: Piece[]): BoardState {
  const board: BoardState = {}
  for (const p of pieces) {
    board[key(p.position.x, p.position.y)] = p
  }
  return board
}

function ctx(piece: Piece, board: BoardState = emptyBoard()): MovementContext {
  return { piece, board, currentPlayer: piece.owner }
}

function toCoords(candidates: { to: { x: number; y: number } }[]): string[] {
  return candidates.map(c => key(c.to.x, c.to.y)).sort()
}

// ─── Pawn ─────────────────────────────────────────────────────────────────────

describe('pawn', () => {
  it('P1 pawn moves forward (+y) from mid-board', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 3 })
    const moves = pawnMoves(ctx(piece))
    expect(toCoords(moves)).toEqual(['3,4'])
  })

  it('P2 pawn moves forward (-y) from mid-board', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P2', x: 3, y: 4 })
    const moves = pawnMoves(ctx(piece, emptyBoard()))
    expect(toCoords(moves)).toEqual(['3,3'])
  })

  it('P1 pawn on starting row (y=1) can move 2 squares', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P1', x: 4, y: 1 })
    const moves = pawnMoves(ctx(piece))
    expect(toCoords(moves)).toEqual(['4,2', '4,3'])
  })

  it('P2 pawn on starting row (y=6) can move 2 squares', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P2', x: 4, y: 6 })
    const moves = pawnMoves(ctx(piece))
    expect(toCoords(moves)).toEqual(['4,4', '4,5'])
  })

  it('P1 pawn blocked by piece directly ahead — cannot advance', () => {
    const piece   = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 3 })
    const blocker = makePiece({ id: 'blocker', type: 'PAWN', owner: 'P2', x: 3, y: 4 })
    const moves = pawnMoves(ctx(piece, boardWith([piece, blocker])))
    expect(moves).toHaveLength(0)
  })

  it('P1 pawn on starting row blocked at first square — cannot advance 2', () => {
    const piece   = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 1 })
    const blocker = makePiece({ id: 'blocker', type: 'PAWN', owner: 'P2', x: 3, y: 2 })
    const moves = pawnMoves(ctx(piece, boardWith([piece, blocker])))
    expect(moves).toHaveLength(0)
  })

  it('P1 pawn on starting row blocked at second square only — can still move 1', () => {
    const piece   = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 1 })
    const blocker = makePiece({ id: 'blocker', type: 'PAWN', owner: 'P2', x: 3, y: 3 })
    const moves = pawnMoves(ctx(piece, boardWith([piece, blocker])))
    expect(toCoords(moves)).toEqual(['3,2'])
  })

  it('P1 pawn captures diagonally', () => {
    const piece   = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 3 })
    const left    = makePiece({ id: 'left',  type: 'PAWN', owner: 'P2', x: 2, y: 4 })
    const right   = makePiece({ id: 'right', type: 'PAWN', owner: 'P2', x: 4, y: 4 })
    const moves = pawnMoves(ctx(piece, boardWith([piece, left, right])))
    const captures = moves.filter(m => m.isCapture)
    expect(toCoords(captures)).toEqual(['2,4', '4,4'])
  })

  it('P1 pawn cannot capture friendly pieces diagonally', () => {
    const piece   = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 3 })
    const friendly = makePiece({ id: 'friendly', type: 'PAWN', owner: 'P1', x: 2, y: 4 })
    const moves = pawnMoves(ctx(piece, boardWith([piece, friendly])))
    const captures = moves.filter(m => m.isCapture)
    expect(captures).toHaveLength(0)
    expect(toCoords(moves)).toEqual(['3,4'])
  })

  it('P1 pawn at top edge (y=7) — no forward moves', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 7 })
    const moves = pawnMoves(ctx(piece))
    expect(moves).toHaveLength(0)
  })

  it('P2 pawn at bottom edge (y=0) — no forward moves', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P2', x: 3, y: 0 })
    const moves = pawnMoves(ctx(piece))
    expect(moves).toHaveLength(0)
  })
})

// ─── Rook ─────────────────────────────────────────────────────────────────────

describe('rook', () => {
  it('rook on empty board generates all horizontal and vertical squares', () => {
    const piece = makePiece({ type: 'ROOK', owner: 'P1', x: 3, y: 3 })
    const moves = rookMoves(ctx(piece))
    // 7 squares in each of 4 directions = 28... minus the piece's own square
    // Actually 3+4+3+4 = 14 along axes... correct: 7 total per axis (0-7 minus own = 7)
    expect(moves).toHaveLength(14)
    expect(moves.every(m => !m.isCapture)).toBe(true)
  })

  it('rook slides until blocked by friendly piece', () => {
    const piece   = makePiece({ type: 'ROOK', owner: 'P1', x: 0, y: 0 })
    const blocker = makePiece({ id: 'b', type: 'PAWN', owner: 'P1', x: 0, y: 3 })
    const moves = rookMoves(ctx(piece, boardWith([piece, blocker])))
    // Up: 0,1 and 0,2 only (blocked at 0,3)
    // Right: 1,0 through 7,0
    const coords = toCoords(moves)
    expect(coords).not.toContain('0,3')
    expect(coords).not.toContain('0,4')
    expect(coords).toContain('0,2')
    expect(coords).toContain('7,0')
  })

  it('rook captures first enemy and stops', () => {
    const piece  = makePiece({ type: 'ROOK', owner: 'P1', x: 0, y: 0 })
    const enemy  = makePiece({ id: 'e', type: 'PAWN', owner: 'P2', x: 0, y: 3 })
    const behind = makePiece({ id: 'behind', type: 'PAWN', owner: 'P2', x: 0, y: 5 })
    const moves = rookMoves(ctx(piece, boardWith([piece, enemy, behind])))
    const coords = toCoords(moves)
    expect(coords).toContain('0,3') // enemy square — capture
    expect(coords).not.toContain('0,4')
    expect(coords).not.toContain('0,5')
    const capture = moves.find(m => m.to.x === 0 && m.to.y === 3)
    expect(capture?.isCapture).toBe(true)
  })

  it('rook at corner (0,0) on empty board has 14 squares', () => {
    const piece = makePiece({ type: 'ROOK', owner: 'P1', x: 0, y: 0 })
    const moves = rookMoves(ctx(piece))
    expect(moves).toHaveLength(14) // 7 right + 7 up
  })
})

// ─── Knight ───────────────────────────────────────────────────────────────────

describe('knight', () => {
  it('knight in center generates up to 8 L-shape squares', () => {
    const piece = makePiece({ type: 'KNIGHT', owner: 'P1', x: 3, y: 3 })
    const moves = knightMoves(ctx(piece))
    expect(moves).toHaveLength(8)
  })

  it('knight at corner (0,0) generates only 2 squares', () => {
    const piece = makePiece({ type: 'KNIGHT', owner: 'P1', x: 0, y: 0 })
    const moves = knightMoves(ctx(piece))
    expect(moves).toHaveLength(2)
    expect(toCoords(moves)).toEqual(['1,2', '2,1'])
  })

  it('knight cannot land on friendly piece', () => {
    const piece    = makePiece({ type: 'KNIGHT', owner: 'P1', x: 3, y: 3 })
    const friendly = makePiece({ id: 'f', type: 'PAWN', owner: 'P1', x: 5, y: 4 })
    const moves = knightMoves(ctx(piece, boardWith([piece, friendly])))
    const coords = toCoords(moves)
    expect(coords).not.toContain('5,4')
  })

  it('knight can capture enemy piece', () => {
    const piece  = makePiece({ type: 'KNIGHT', owner: 'P1', x: 3, y: 3 })
    const enemy  = makePiece({ id: 'e', type: 'PAWN', owner: 'P2', x: 5, y: 4 })
    const moves = knightMoves(ctx(piece, boardWith([piece, enemy])))
    const capture = moves.find(m => m.to.x === 5 && m.to.y === 4)
    expect(capture?.isCapture).toBe(true)
  })

  it('knight jumps over intervening pieces', () => {
    const piece    = makePiece({ type: 'KNIGHT', owner: 'P1', x: 3, y: 3 })
    // Fill adjacent squares to confirm knight can still reach L-shape targets
    const blockers = [
      makePiece({ id: 'b1', type: 'PAWN', owner: 'P2', x: 3, y: 4 }),
      makePiece({ id: 'b2', type: 'PAWN', owner: 'P2', x: 4, y: 3 }),
      makePiece({ id: 'b3', type: 'PAWN', owner: 'P2', x: 2, y: 3 }),
      makePiece({ id: 'b4', type: 'PAWN', owner: 'P2', x: 3, y: 2 }),
    ]
    const moves = knightMoves(ctx(piece, boardWith([piece, ...blockers])))
    // Knight still reaches all 8 L-shape squares
    expect(moves).toHaveLength(8)
  })

  it('knight at edge (0,3) generates 4 squares', () => {
    const piece = makePiece({ type: 'KNIGHT', owner: 'P1', x: 0, y: 3 })
    const moves = knightMoves(ctx(piece))
    expect(moves).toHaveLength(4)
  })
})

// ─── Bishop ───────────────────────────────────────────────────────────────────

describe('bishop', () => {
  it('bishop in center on empty board generates 13 diagonal squares', () => {
    const piece = makePiece({ type: 'BISHOP', owner: 'P1', x: 3, y: 3 })
    const moves = bishopMoves(ctx(piece))
    expect(moves).toHaveLength(13)
    expect(moves.every(m => !m.isCapture)).toBe(true)
  })

  it('bishop slides diagonally until blocked by friendly piece', () => {
    const piece   = makePiece({ type: 'BISHOP', owner: 'P1', x: 0, y: 0 })
    const blocker = makePiece({ id: 'b', type: 'PAWN', owner: 'P1', x: 3, y: 3 })
    const moves = bishopMoves(ctx(piece, boardWith([piece, blocker])))
    const coords = toCoords(moves)
    expect(coords).toContain('1,1')
    expect(coords).toContain('2,2')
    expect(coords).not.toContain('3,3') // blocked by friendly
    expect(coords).not.toContain('4,4')
  })

  it('bishop captures first enemy diagonally and stops', () => {
    const piece  = makePiece({ type: 'BISHOP', owner: 'P1', x: 0, y: 0 })
    const enemy  = makePiece({ id: 'e', type: 'PAWN', owner: 'P2', x: 2, y: 2 })
    const moves = bishopMoves(ctx(piece, boardWith([piece, enemy])))
    const coords = toCoords(moves)
    expect(coords).toContain('2,2') // capture
    expect(coords).not.toContain('3,3')
    const capture = moves.find(m => m.to.x === 2 && m.to.y === 2)
    expect(capture?.isCapture).toBe(true)
  })

  it('bishop at corner (0,0) generates 7 squares', () => {
    const piece = makePiece({ type: 'BISHOP', owner: 'P1', x: 0, y: 0 })
    const moves = bishopMoves(ctx(piece))
    expect(moves).toHaveLength(7)
  })
})

// ─── Queen ────────────────────────────────────────────────────────────────────

describe('queen', () => {
  it('queen in center on empty board generates 27 squares', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 3, y: 3 })
    const moves = queenMoves(ctx(piece))
    expect(moves).toHaveLength(27)
    expect(moves.every(m => !m.isCapture)).toBe(true)
  })

  it('queen at corner (0,0) generates 21 squares', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 0, y: 0 })
    const moves = queenMoves(ctx(piece))
    expect(moves).toHaveLength(21) // 7 right + 7 up + 7 diagonal
  })

  it('queen combines rook and bishop movement', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 0, y: 0 })
    const moves = queenMoves(ctx(piece))
    const coords = toCoords(moves)
    // Horizontal
    expect(coords).toContain('7,0')
    // Vertical
    expect(coords).toContain('0,7')
    // Diagonal
    expect(coords).toContain('7,7')
  })

  it('queen blocked in all directions by friendly pieces returns empty', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 3, y: 3 })
    const surrounds = [
      makePiece({ id: 'n',  type: 'PAWN', owner: 'P1', x: 3, y: 4 }),
      makePiece({ id: 's',  type: 'PAWN', owner: 'P1', x: 3, y: 2 }),
      makePiece({ id: 'e',  type: 'PAWN', owner: 'P1', x: 4, y: 3 }),
      makePiece({ id: 'w',  type: 'PAWN', owner: 'P1', x: 2, y: 3 }),
      makePiece({ id: 'ne', type: 'PAWN', owner: 'P1', x: 4, y: 4 }),
      makePiece({ id: 'nw', type: 'PAWN', owner: 'P1', x: 2, y: 4 }),
      makePiece({ id: 'se', type: 'PAWN', owner: 'P1', x: 4, y: 2 }),
      makePiece({ id: 'sw', type: 'PAWN', owner: 'P1', x: 2, y: 2 }),
    ]
    const moves = queenMoves(ctx(piece, boardWith([piece, ...surrounds])))
    expect(moves).toHaveLength(0)
  })

  it('queen captures enemies in all directions', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 3, y: 3 })
    const enemies = [
      makePiece({ id: 'n',  type: 'PAWN', owner: 'P2', x: 3, y: 5 }),
      makePiece({ id: 'ne', type: 'PAWN', owner: 'P2', x: 5, y: 5 }),
    ]
    const moves = queenMoves(ctx(piece, boardWith([piece, ...enemies])))
    const captures = moves.filter(m => m.isCapture)
    expect(captures.length).toBeGreaterThanOrEqual(2)
    // Does not go beyond the enemy
    expect(toCoords(moves)).not.toContain('3,6')
    expect(toCoords(moves)).not.toContain('6,6')
  })
})

// ─── King ─────────────────────────────────────────────────────────────────────

describe('king', () => {
  it('king in center generates 8 squares on empty board', () => {
    const piece = makePiece({ type: 'KING', owner: 'P1', x: 3, y: 3 })
    const moves = kingMoves(ctx(piece))
    expect(moves).toHaveLength(8)
  })

  it('king at corner (0,0) generates 3 squares', () => {
    const piece = makePiece({ type: 'KING', owner: 'P1', x: 0, y: 0 })
    const moves = kingMoves(ctx(piece))
    expect(moves).toHaveLength(3)
    expect(toCoords(moves)).toEqual(['0,1', '1,0', '1,1'])
  })

  it('king at edge (0,3) generates 5 squares', () => {
    const piece = makePiece({ type: 'KING', owner: 'P1', x: 0, y: 3 })
    const moves = kingMoves(ctx(piece))
    expect(moves).toHaveLength(5)
  })

  it('king cannot move onto friendly piece', () => {
    const piece    = makePiece({ type: 'KING', owner: 'P1', x: 3, y: 3 })
    const friendly = makePiece({ id: 'f', type: 'PAWN', owner: 'P1', x: 4, y: 4 })
    const moves = kingMoves(ctx(piece, boardWith([piece, friendly])))
    expect(toCoords(moves)).not.toContain('4,4')
    expect(moves).toHaveLength(7)
  })

  it('king captures adjacent enemy', () => {
    const piece  = makePiece({ type: 'KING', owner: 'P1', x: 3, y: 3 })
    const enemy  = makePiece({ id: 'e', type: 'PAWN', owner: 'P2', x: 4, y: 4 })
    const moves = kingMoves(ctx(piece, boardWith([piece, enemy])))
    const capture = moves.find(m => m.to.x === 4 && m.to.y === 4)
    expect(capture?.isCapture).toBe(true)
    expect(moves).toHaveLength(8)
  })

  it('king surrounded by friendly pieces has no moves', () => {
    const piece = makePiece({ type: 'KING', owner: 'P1', x: 3, y: 3 })
    const surrounds = [
      makePiece({ id: 'n',  type: 'PAWN', owner: 'P1', x: 3, y: 4 }),
      makePiece({ id: 's',  type: 'PAWN', owner: 'P1', x: 3, y: 2 }),
      makePiece({ id: 'e',  type: 'PAWN', owner: 'P1', x: 4, y: 3 }),
      makePiece({ id: 'w',  type: 'PAWN', owner: 'P1', x: 2, y: 3 }),
      makePiece({ id: 'ne', type: 'PAWN', owner: 'P1', x: 4, y: 4 }),
      makePiece({ id: 'nw', type: 'PAWN', owner: 'P1', x: 2, y: 4 }),
      makePiece({ id: 'se', type: 'PAWN', owner: 'P1', x: 4, y: 2 }),
      makePiece({ id: 'sw', type: 'PAWN', owner: 'P1', x: 2, y: 2 }),
    ]
    const moves = kingMoves(ctx(piece, boardWith([piece, ...surrounds])))
    expect(moves).toHaveLength(0)
  })
})

// ─── MovementRouter ───────────────────────────────────────────────────────────

describe('MovementRouter.getValidMoves', () => {
  it('dispatches to pawn generator', () => {
    const piece = makePiece({ type: 'PAWN', owner: 'P1', x: 3, y: 3 })
    const moves = getValidMoves(ctx(piece))
    expect(toCoords(moves)).toEqual(['3,4'])
  })

  it('dispatches to rook generator', () => {
    const piece = makePiece({ type: 'ROOK', owner: 'P1', x: 0, y: 0 })
    const moves = getValidMoves(ctx(piece))
    expect(moves).toHaveLength(14)
  })

  it('dispatches to knight generator', () => {
    const piece = makePiece({ type: 'KNIGHT', owner: 'P1', x: 0, y: 0 })
    const moves = getValidMoves(ctx(piece))
    expect(moves).toHaveLength(2)
  })

  it('dispatches to bishop generator', () => {
    const piece = makePiece({ type: 'BISHOP', owner: 'P1', x: 0, y: 0 })
    const moves = getValidMoves(ctx(piece))
    expect(moves).toHaveLength(7)
  })

  it('dispatches to queen generator', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 0, y: 0 })
    const moves = getValidMoves(ctx(piece))
    expect(moves).toHaveLength(21)
  })

  it('dispatches to king generator', () => {
    const piece = makePiece({ type: 'KING', owner: 'P1', x: 0, y: 0 })
    const moves = getValidMoves(ctx(piece))
    expect(moves).toHaveLength(3)
  })

  it('never mutates the board', () => {
    const piece = makePiece({ type: 'QUEEN', owner: 'P1', x: 3, y: 3 })
    const board = boardWith([piece])
    const boardSnapshot = JSON.stringify(board)
    getValidMoves({ piece, board, currentPlayer: 'P1' })
    expect(JSON.stringify(board)).toBe(boardSnapshot)
  })
})
