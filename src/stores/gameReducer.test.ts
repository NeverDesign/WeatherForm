import { describe, it, expect } from 'vitest'
import { gameReducer } from './gameReducer'
import type { GameState, GameEvent, Piece } from '@/types/game'

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makePiece(overrides: Partial<Piece> & Pick<Piece, 'id' | 'owner'>): Piece {
  return {
    type: 'PAWN',
    element: 'TIDE',
    position: { x: 0, y: 0 },
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    id: 'test-game',
    phase: 'active',
    turn: 'P1',
    turnNumber: 1,
    players: {
      P1: {
        hp: 100,
        element: 'TIDE',
        pieceIds: ['p1-pawn'],
        abilityCooldowns: {},
      },
      P2: {
        hp: 100,
        element: 'DUNE',
        pieceIds: ['p2-pawn'],
        abilityCooldowns: {},
      },
    },
    board: {
      '0,1': makePiece({ id: 'p1-pawn', owner: 'P1', element: 'TIDE', position: { x: 0, y: 1 } }),
      '0,6': makePiece({ id: 'p2-pawn', owner: 'P2', element: 'DUNE', position: { x: 0, y: 6 } }),
    },
    eventLog: [],
    winner: null,
    ...overrides,
  }
}

// ─── MOVE ────────────────────────────────────────────────────────────────────

describe('MOVE', () => {
  it('moves a piece from one square to another', () => {
    const state = makeState()
    const event: GameEvent = { type: 'MOVE', pieceId: 'p1-pawn', from: { x: 0, y: 1 }, to: { x: 0, y: 2 } }
    const next = gameReducer(state, event)

    expect(next.board['0,1']).toBeUndefined()
    expect(next.board['0,2']).toBeDefined()
    expect(next.board['0,2']!.id).toBe('p1-pawn')
    expect(next.board['0,2']!.position).toEqual({ x: 0, y: 2 })
  })

  it('appends the event to eventLog', () => {
    const state = makeState()
    const event: GameEvent = { type: 'MOVE', pieceId: 'p1-pawn', from: { x: 0, y: 1 }, to: { x: 0, y: 2 } }
    const next = gameReducer(state, event)

    expect(next.eventLog).toHaveLength(1)
    expect(next.eventLog[0]).toEqual(event)
  })

  it('does not mutate original state', () => {
    const state = makeState()
    const originalBoard = JSON.stringify(state.board)
    const event: GameEvent = { type: 'MOVE', pieceId: 'p1-pawn', from: { x: 0, y: 1 }, to: { x: 0, y: 2 } }
    gameReducer(state, event)

    expect(JSON.stringify(state.board)).toBe(originalBoard)
    expect(state.eventLog).toHaveLength(0)
  })

  it('gracefully handles missing piece — logs event and returns state', () => {
    const state = makeState()
    const event: GameEvent = { type: 'MOVE', pieceId: 'ghost', from: { x: 9, y: 9 }, to: { x: 8, y: 8 } }
    const next = gameReducer(state, event)

    // Board unchanged
    expect(Object.keys(next.board)).toEqual(Object.keys(state.board))
    expect(next.eventLog).toHaveLength(1)
  })
})

// ─── ATTACK ──────────────────────────────────────────────────────────────────

describe('ATTACK', () => {
  it('applies base damage when elements are neutral (×100)', () => {
    // Both TIDE — 100 multiplier
    const state = makeState({
      players: {
        P1: { hp: 100, element: 'TIDE', pieceIds: ['p1-pawn'], abilityCooldowns: {} },
        P2: { hp: 100, element: 'TIDE', pieceIds: ['p2-pawn'], abilityCooldowns: {} },
      },
      board: {
        '0,1': makePiece({ id: 'p1-pawn', owner: 'P1', element: 'TIDE', position: { x: 0, y: 1 } }),
        '0,2': makePiece({ id: 'p2-pawn', owner: 'P2', element: 'TIDE', position: { x: 0, y: 2 } }),
      },
    })
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p1-pawn',
      targetId: 'p2-pawn',
      from: { x: 0, y: 1 },
      to: { x: 0, y: 2 },
      damage: 20,
    }
    const next = gameReducer(state, event)

    // Math.floor(20 * 100 / 100) = 20
    expect(next.players.P2.hp).toBe(80)
  })

  it('applies advantage multiplier (TIDE attacks DUNE → 150)', () => {
    const state = makeState()
    // P1 is TIDE piece, P2 is DUNE piece — already set in fixture
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p1-pawn',
      targetId: 'p2-pawn',
      from: { x: 0, y: 1 },
      to: { x: 0, y: 6 },
      damage: 20,
    }
    const next = gameReducer(state, event)

    // Math.floor(20 * 150 / 100) = 30
    expect(next.players.P2.hp).toBe(70)
  })

  it('applies disadvantage multiplier (DUNE attacks TIDE → 50)', () => {
    const state = makeState({
      board: {
        '0,6': makePiece({ id: 'p2-pawn', owner: 'P2', element: 'DUNE', position: { x: 0, y: 6 } }),
        '0,1': makePiece({ id: 'p1-pawn', owner: 'P1', element: 'TIDE', position: { x: 0, y: 1 } }),
      },
    })
    // P2 DUNE attacks P1 TIDE
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p2-pawn',
      targetId: 'p1-pawn',
      from: { x: 0, y: 6 },
      to: { x: 0, y: 1 },
      damage: 20,
    }
    const next = gameReducer(state, event)

    // Math.floor(20 * 50 / 100) = 10
    expect(next.players.P1.hp).toBe(90)
  })

  it('uses integer math — no floats (odd damage × odd multiplier)', () => {
    const state = makeState()
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p1-pawn',
      targetId: 'p2-pawn',
      from: { x: 0, y: 1 },
      to: { x: 0, y: 6 },
      damage: 7, // 7 * 150 / 100 = 10.5 → floor = 10
    }
    const next = gameReducer(state, event)
    expect(next.players.P2.hp).toBe(90) // 100 - 10
  })

  it('removes captured piece from board and target pieceIds', () => {
    const state = makeState()
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p1-pawn',
      targetId: 'p2-pawn',
      from: { x: 0, y: 1 },
      to: { x: 0, y: 6 },
      damage: 70,
    }
    const next = gameReducer(state, event)

    expect(next.board['0,6']).toBeDefined() // attacker moved here
    expect(next.board['0,6']!.id).toBe('p1-pawn') // it's the attacker now
    expect(next.board['0,1']).toBeUndefined()
    expect(next.players.P2.pieceIds).not.toContain('p2-pawn')
  })

  it('triggers GAME_OVER when HP reaches zero', () => {
    const state = makeState({
      players: {
        P1: { hp: 100, element: 'TIDE', pieceIds: ['p1-pawn'], abilityCooldowns: {} },
        P2: { hp: 10, element: 'DUNE', pieceIds: ['p2-pawn'], abilityCooldowns: {} },
      },
    })
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p1-pawn',
      targetId: 'p2-pawn',
      from: { x: 0, y: 1 },
      to: { x: 0, y: 6 },
      damage: 100, // 100 * 150 / 100 = 150 → overkill
    }
    const next = gameReducer(state, event)

    expect(next.players.P2.hp).toBe(0)
    expect(next.phase).toBe('complete')
    expect(next.winner).toBe('P1')
  })

  it('clamps HP at 0 — never goes negative', () => {
    const state = makeState({
      players: {
        P1: { hp: 100, element: 'TIDE', pieceIds: ['p1-pawn'], abilityCooldowns: {} },
        P2: { hp: 5, element: 'DUNE', pieceIds: ['p2-pawn'], abilityCooldowns: {} },
      },
    })
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'p1-pawn',
      targetId: 'p2-pawn',
      from: { x: 0, y: 1 },
      to: { x: 0, y: 6 },
      damage: 1000,
    }
    const next = gameReducer(state, event)
    expect(next.players.P2.hp).toBeGreaterThanOrEqual(0)
  })

  it('gracefully handles missing attacker or target', () => {
    const state = makeState()
    const event: GameEvent = {
      type: 'ATTACK',
      attackerId: 'ghost',
      targetId: 'ghost2',
      from: { x: 9, y: 9 },
      to: { x: 8, y: 8 },
      damage: 20,
    }
    const next = gameReducer(state, event)

    // HP unchanged
    expect(next.players.P1.hp).toBe(100)
    expect(next.players.P2.hp).toBe(100)
    expect(next.eventLog).toHaveLength(1)
  })
})

// ─── USE_ABILITY ─────────────────────────────────────────────────────────────

describe('USE_ABILITY', () => {
  it('sets a cooldown for the used ability', () => {
    const state = makeState()
    const event: GameEvent = { type: 'USE_ABILITY', abilityId: 'tide-surge', playerId: 'P1' }
    const next = gameReducer(state, event)

    expect(next.players.P1.abilityCooldowns['tide-surge']).toBeGreaterThan(0)
  })

  it('does not override an already active cooldown', () => {
    const state = makeState({
      players: {
        P1: {
          hp: 100,
          element: 'TIDE',
          pieceIds: ['p1-pawn'],
          abilityCooldowns: { 'tide-surge': 3 },
        },
        P2: { hp: 100, element: 'DUNE', pieceIds: ['p2-pawn'], abilityCooldowns: {} },
      },
    })
    const event: GameEvent = { type: 'USE_ABILITY', abilityId: 'tide-surge', playerId: 'P1' }
    const next = gameReducer(state, event)

    // Cooldown should remain at 3, not be reset
    expect(next.players.P1.abilityCooldowns['tide-surge']).toBe(3)
  })

  it('appends the event to eventLog', () => {
    const state = makeState()
    const event: GameEvent = { type: 'USE_ABILITY', abilityId: 'tide-surge', playerId: 'P1', targetSquare: { x: 3, y: 3 } }
    const next = gameReducer(state, event)

    expect(next.eventLog).toHaveLength(1)
    expect(next.eventLog[0]).toEqual(event)
  })

  it('does not mutate original state', () => {
    const state = makeState()
    const original = JSON.stringify(state)
    gameReducer(state, { type: 'USE_ABILITY', abilityId: 'tide-surge', playerId: 'P1' })
    expect(JSON.stringify(state)).toBe(original)
  })
})

// ─── END_TURN ────────────────────────────────────────────────────────────────

describe('END_TURN', () => {
  it('flips turn from P1 to P2', () => {
    const state = makeState({ turn: 'P1' })
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })
    expect(next.turn).toBe('P2')
  })

  it('flips turn from P2 to P1', () => {
    const state = makeState({ turn: 'P2' })
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P2' })
    expect(next.turn).toBe('P1')
  })

  it('increments turnNumber', () => {
    const state = makeState({ turnNumber: 5 })
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })
    expect(next.turnNumber).toBe(6)
  })

  it('decrements active cooldowns by 1', () => {
    const state = makeState({
      players: {
        P1: { hp: 100, element: 'TIDE', pieceIds: [], abilityCooldowns: { 'tide-surge': 3, 'tide-pull': 1 } },
        P2: { hp: 100, element: 'DUNE', pieceIds: [], abilityCooldowns: { 'dune-wall': 2 } },
      },
    })
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })

    expect(next.players.P1.abilityCooldowns['tide-surge']).toBe(2)
    expect(next.players.P2.abilityCooldowns['dune-wall']).toBe(1)
  })

  it('removes cooldowns that reach 0', () => {
    const state = makeState({
      players: {
        P1: { hp: 100, element: 'TIDE', pieceIds: [], abilityCooldowns: { 'tide-pull': 1 } },
        P2: { hp: 100, element: 'DUNE', pieceIds: [], abilityCooldowns: {} },
      },
    })
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })

    expect(next.players.P1.abilityCooldowns['tide-pull']).toBeUndefined()
  })

  it('appends event to log', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })
    expect(next.eventLog).toHaveLength(1)
  })
})

// ─── RESIGN ──────────────────────────────────────────────────────────────────

describe('RESIGN', () => {
  it('sets phase to complete and winner to opponent when P1 resigns', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'RESIGN', playerId: 'P1' })

    expect(next.phase).toBe('complete')
    expect(next.winner).toBe('P2')
  })

  it('sets winner to P1 when P2 resigns', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'RESIGN', playerId: 'P2' })

    expect(next.winner).toBe('P1')
  })

  it('appends event to log', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'RESIGN', playerId: 'P1' })
    expect(next.eventLog).toHaveLength(1)
  })

  it('does not mutate original state', () => {
    const state = makeState()
    const original = JSON.stringify(state)
    gameReducer(state, { type: 'RESIGN', playerId: 'P1' })
    expect(JSON.stringify(state)).toBe(original)
  })
})

// ─── GAME_OVER ───────────────────────────────────────────────────────────────

describe('GAME_OVER', () => {
  it('sets phase to complete and records winner', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'GAME_OVER', winner: 'P2', reason: 'HP_ZERO' })

    expect(next.phase).toBe('complete')
    expect(next.winner).toBe('P2')
  })

  it('handles DRAW', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'GAME_OVER', winner: 'DRAW', reason: 'STALEMATE' })

    expect(next.winner).toBe('DRAW')
    expect(next.phase).toBe('complete')
  })

  it('handles RESIGN reason', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'GAME_OVER', winner: 'P1', reason: 'RESIGN' })

    expect(next.winner).toBe('P1')
    expect(next.phase).toBe('complete')
  })

  it('appends event to log', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'GAME_OVER', winner: 'P1', reason: 'HP_ZERO' })
    expect(next.eventLog).toHaveLength(1)
  })
})

// ─── Event log accumulation ───────────────────────────────────────────────────

describe('event log accumulation', () => {
  it('preserves prior events across multiple reducer calls', () => {
    let state = makeState()

    state = gameReducer(state, { type: 'MOVE', pieceId: 'p1-pawn', from: { x: 0, y: 1 }, to: { x: 0, y: 2 } })
    state = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })
    state = gameReducer(state, { type: 'RESIGN', playerId: 'P2' })

    expect(state.eventLog).toHaveLength(3)
    expect(state.eventLog[0].type).toBe('MOVE')
    expect(state.eventLog[1].type).toBe('END_TURN')
    expect(state.eventLog[2].type).toBe('RESIGN')
  })
})

// ─── JSON round-trip safety ──────────────────────────────────────────────────

describe('JSON round-trip safety', () => {
  it('resulting state survives JSON stringify/parse without data loss', () => {
    const state = makeState()
    const next = gameReducer(state, { type: 'END_TURN', playerId: 'P1' })
    const roundTripped = JSON.parse(JSON.stringify(next)) as GameState

    expect(roundTripped.turn).toBe('P2')
    expect(roundTripped.turnNumber).toBe(2)
    expect(roundTripped.players.P1.hp).toBe(100)
  })
})
