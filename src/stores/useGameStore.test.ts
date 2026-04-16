import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore, createGame, STARTING_HP } from './useGameStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

// ─── createGame factory ───────────────────────────────────────────────────────

describe('createGame', () => {
  it('creates a game with the correct initial phase and turn', () => {
    const state = createGame('TIDE', 'GALE')
    expect(state.phase).toBe('active')
    expect(state.turn).toBe('P1')
    expect(state.turnNumber).toBe(1)
    expect(state.winner).toBeNull()
  })

  it('assigns elements to each player', () => {
    const state = createGame('TIDE', 'DUNE')
    expect(state.players.P1.element).toBe('TIDE')
    expect(state.players.P2.element).toBe('DUNE')
  })

  it('sets starting HP for both players', () => {
    const state = createGame('GALE', 'DUNE')
    expect(state.players.P1.hp).toBe(STARTING_HP)
    expect(state.players.P2.hp).toBe(STARTING_HP)
  })

  it('places 16 pieces per player on the board', () => {
    const state = createGame('TIDE', 'GALE')
    const p1Pieces = Object.values(state.board).filter(p => p.owner === 'P1')
    const p2Pieces = Object.values(state.board).filter(p => p.owner === 'P2')
    expect(p1Pieces).toHaveLength(16)
    expect(p2Pieces).toHaveLength(16)
  })

  it('places P1 back rank on y=0', () => {
    const state = createGame('TIDE', 'GALE')
    for (let x = 0; x < 8; x++) {
      expect(state.board[`${x},0`]).toBeDefined()
      expect(state.board[`${x},0`].owner).toBe('P1')
    }
  })

  it('places P1 pawns on y=1', () => {
    const state = createGame('TIDE', 'GALE')
    for (let x = 0; x < 8; x++) {
      expect(state.board[`${x},1`]).toBeDefined()
      expect(state.board[`${x},1`].type).toBe('PAWN')
      expect(state.board[`${x},1`].owner).toBe('P1')
    }
  })

  it('places P2 back rank on y=7', () => {
    const state = createGame('TIDE', 'GALE')
    for (let x = 0; x < 8; x++) {
      expect(state.board[`${x},7`]).toBeDefined()
      expect(state.board[`${x},7`].owner).toBe('P2')
    }
  })

  it('places P2 pawns on y=6', () => {
    const state = createGame('TIDE', 'GALE')
    for (let x = 0; x < 8; x++) {
      expect(state.board[`${x},6`]).toBeDefined()
      expect(state.board[`${x},6`].type).toBe('PAWN')
      expect(state.board[`${x},6`].owner).toBe('P2')
    }
  })

  it('places king and queen correctly in back rank', () => {
    const state = createGame('TIDE', 'GALE')
    expect(state.board['3,0'].type).toBe('QUEEN')
    expect(state.board['4,0'].type).toBe('KING')
    expect(state.board['3,7'].type).toBe('QUEEN')
    expect(state.board['4,7'].type).toBe('KING')
  })

  it('registers all piece IDs in player pieceIds', () => {
    const state = createGame('TIDE', 'GALE')
    const p1BoardIds = Object.values(state.board).filter(p => p.owner === 'P1').map(p => p.id)
    expect(state.players.P1.pieceIds.sort()).toEqual(p1BoardIds.sort())
  })

  it('starts with empty event log', () => {
    const state = createGame('TIDE', 'GALE')
    expect(state.eventLog).toHaveLength(0)
  })

  it('is safe for JSON round-trip', () => {
    const state = createGame('DUNE', 'GALE')
    const roundTripped = JSON.parse(JSON.stringify(state))
    expect(roundTripped).toEqual(state)
  })
})

// ─── useGameStore ─────────────────────────────────────────────────────────────

describe('useGameStore', () => {
  it('initialises with null gameState', () => {
    const store = useGameStore()
    expect(store.gameState).toBeNull()
    expect(store.visibleState).toBeNull()
  })

  describe('newGame', () => {
    it('sets gameState and initialState', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      expect(store.gameState).not.toBeNull()
      expect(store.initialState).not.toBeNull()
    })

    it('clears replay mode', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      expect(store.isReplay).toBe(false)
      expect(store.replayState).toBeNull()
    })

    it('visibleState equals gameState when not in replay', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      expect(store.visibleState).toEqual(store.gameState)
    })
  })

  describe('dispatch', () => {
    it('applies an END_TURN event to gameState', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      expect(store.gameState?.turn).toBe('P2')
      expect(store.gameState?.turnNumber).toBe(2)
    })

    it('accumulates events in the event log', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.dispatch({ type: 'END_TURN', playerId: 'P2' })
      expect(store.gameState?.eventLog).toHaveLength(2)
    })

    it('does nothing when gameState is null', () => {
      const store = useGameStore()
      // Should not throw
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      expect(store.gameState).toBeNull()
    })

    it('does not mutate the previous state object', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      const before = store.gameState!
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      // The store ref is replaced — the old object is unchanged
      expect(before.turn).toBe('P1')
    })
  })

  describe('replay', () => {
    it('enterReplay sets isReplay and builds replayState', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.dispatch({ type: 'END_TURN', playerId: 'P2' })

      store.enterReplay(1) // after first END_TURN
      expect(store.isReplay).toBe(true)
      expect(store.replayState?.turn).toBe('P2')
      expect(store.replayState?.turnNumber).toBe(2)
    })

    it('visibleState returns replayState during replay', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })

      store.enterReplay(0) // before any events — initial board
      expect(store.visibleState?.turn).toBe('P1')
      expect(store.visibleState?.turnNumber).toBe(1)
    })

    it('enterReplay(0) returns initial board state', () => {
      const store = useGameStore()
      store.newGame('GALE', 'DUNE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })

      store.enterReplay(0)
      expect(store.replayState?.eventLog).toHaveLength(0)
      expect(store.replayState?.turn).toBe('P1')
    })

    it('exitReplay clears replay mode', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.enterReplay(1)

      store.exitReplay()
      expect(store.isReplay).toBe(false)
      expect(store.replayState).toBeNull()
    })

    it('visibleState returns live gameState after exitReplay', () => {
      const store = useGameStore()
      store.newGame('TIDE', 'GALE')
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.enterReplay(0)
      store.exitReplay()

      // Live state has 1 event; replay was showing 0
      expect(store.visibleState?.turn).toBe('P2')
    })

    it('does nothing if gameState is null', () => {
      const store = useGameStore()
      store.enterReplay(0) // should not throw
      expect(store.isReplay).toBe(false)
    })
  })
})
