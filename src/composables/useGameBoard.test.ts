import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useGameBoard } from './useGameBoard'
import { useGameStore, STARTING_HP } from '@/stores/useGameStore'

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Mount a headless component to get a composable instance that runs inside a
 * real Vue app (with Pinia + Router installed so all inject() calls resolve).
 */
function mountComposable() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/menu', component: { template: '<div />' } },
    ],
  })

  let result: ReturnType<typeof useGameBoard>

  const TestComponent = defineComponent({
    setup() {
      result = useGameBoard()
      return {}
    },
    template: '<div />',
  })

  mount(TestComponent, {
    global: { plugins: [pinia, router] },
  })

  return result!
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useGameBoard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ── Initialisation ─────────────────────────────────────────────────────────

  describe('initialisation', () => {
    it('calls newGame on mount and populates boardRows', async () => {
      const board = mountComposable()
      await nextTick()
      // 8 rows after mount
      expect(board.boardRows.value).toHaveLength(8)
      // Each row has 8 tiles
      for (const row of board.boardRows.value) {
        expect(row).toHaveLength(8)
      }
    })

    it('top row (index 0) contains y=7 tiles (P2 back rank)', async () => {
      const board = mountComposable()
      await nextTick()
      const topRow = board.boardRows.value[0]
      for (const tile of topRow) {
        expect(tile.boardY).toBe(7)
      }
    })

    it('bottom row (index 7) contains y=0 tiles (P1 back rank)', async () => {
      const board = mountComposable()
      await nextTick()
      const bottomRow = board.boardRows.value[7]
      for (const tile of bottomRow) {
        expect(tile.boardY).toBe(0)
      }
    })

    it('P1 back rank pieces are on y=0 tiles', async () => {
      const board = mountComposable()
      await nextTick()
      const bottomRow = board.boardRows.value[7] // y=0
      const pieces = bottomRow.map(t => t.piece).filter(Boolean)
      expect(pieces).toHaveLength(8)
      for (const piece of pieces) {
        expect(piece!.owner).toBe('P1')
        expect(piece!.position.y).toBe(0)
      }
    })
  })

  // ── HP computeds ───────────────────────────────────────────────────────────

  describe('HP computeds', () => {
    it('p1HpPercent is 100 at game start', async () => {
      const board = mountComposable()
      await nextTick()
      expect(board.p1HpPercent.value).toBe(100)
    })

    it('p2HpPercent is 100 at game start', async () => {
      const board = mountComposable()
      await nextTick()
      expect(board.p2HpPercent.value).toBe(100)
    })

    it('p1Hp matches STARTING_HP at game start', async () => {
      const board = mountComposable()
      await nextTick()
      expect(board.p1Hp.value).toBe(STARTING_HP)
    })
  })

  // ── Turn state ─────────────────────────────────────────────────────────────

  describe('turn state', () => {
    it('canEndTurn is true at start (P1 goes first)', async () => {
      const board = mountComposable()
      await nextTick()
      expect(board.canEndTurn.value).toBe(true)
    })

    it('handleEndTurn flips turn to P2', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleEndTurn()
      await nextTick()
      const store = useGameStore()
      expect(store.visibleState?.turn).toBe('P2')
    })

    it('canEndTurn is false after turn flips to P2 (local player is always P1)', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleEndTurn()
      await nextTick()
      expect(board.canEndTurn.value).toBe(false)
    })
  })

  // ── Tile click / selection ─────────────────────────────────────────────────

  describe('tile click and selection', () => {
    it('clicking a P1 piece selects it', async () => {
      const board = mountComposable()
      await nextTick()
      // P1 pawn at x=0, y=1
      board.handleTileClick(0, 1)
      await nextTick()
      expect(board.selectedPiece.value).not.toBeNull()
      expect(board.selectedPiece.value?.position).toEqual({ x: 0, y: 1 })
    })

    it('selecting a piece populates validMoves', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleTileClick(0, 1) // P1 pawn
      await nextTick()
      expect(board.validMoves.value.length).toBeGreaterThan(0)
    })

    it('clicking an empty non-move tile deselects the piece', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleTileClick(0, 1) // select pawn
      board.handleTileClick(0, 4) // empty tile that is not a valid move
      await nextTick()
      expect(board.selectedPiece.value).toBeNull()
      expect(board.validMoves.value).toHaveLength(0)
    })

    it('selected tile is marked isSelected in boardRows', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleTileClick(0, 1)
      await nextTick()
      // boardRows[6] is y=1 (rows go 7..0 top-to-bottom)
      const row = board.boardRows.value[6]
      const tile = row[0] // x=0
      expect(tile.isSelected).toBe(true)
    })

    it('valid move tiles are marked isValidMove', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleTileClick(0, 1) // P1 pawn — can move to y=2 or y=3
      await nextTick()
      // y=2 row is boardRows[5]
      const targetTile = board.boardRows.value[5][0]
      expect(targetTile.isValidMove).toBe(true)
    })

    it('clicking a valid move tile dispatches MOVE and deselects', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleTileClick(0, 1) // select pawn at x=0, y=1
      await nextTick()
      board.handleTileClick(0, 2) // move pawn to x=0, y=2
      await nextTick()
      // Piece should now be at y=2
      const store = useGameStore()
      expect(store.visibleState?.board['0,2']).toBeDefined()
      expect(store.visibleState?.board['0,1']).toBeUndefined()
      // Deselected
      expect(board.selectedPiece.value).toBeNull()
    })

    it('clicking a P2 piece on P1\'s turn does not select it', async () => {
      const board = mountComposable()
      await nextTick()
      board.handleTileClick(0, 6) // P2 pawn
      await nextTick()
      expect(board.selectedPiece.value).toBeNull()
    })

    it('board is non-interactive during replay', async () => {
      const board = mountComposable()
      await nextTick()
      const store = useGameStore()
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.enterReplay(0)
      await nextTick()
      board.handleTileClick(0, 1) // should be ignored in replay
      expect(board.selectedPiece.value).toBeNull()
    })
  })

  // ── Move log + replay ──────────────────────────────────────────────────────

  describe('move log and replay', () => {
    it('toggleMoveLog toggles moveLogOpen', async () => {
      const board = mountComposable()
      await nextTick()
      expect(board.moveLogOpen.value).toBe(false)
      board.toggleMoveLog()
      expect(board.moveLogOpen.value).toBe(true)
      board.toggleMoveLog()
      expect(board.moveLogOpen.value).toBe(false)
    })

    it('handleLogRowClick enters replay when not in replay', async () => {
      const board = mountComposable()
      await nextTick()
      const store = useGameStore()
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      await nextTick()
      board.handleLogRowClick(0)
      expect(store.isReplay).toBe(true)
    })

    it('handleLogRowClick exits replay when already in replay', async () => {
      const board = mountComposable()
      await nextTick()
      const store = useGameStore()
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.enterReplay(0)
      await nextTick()
      board.handleLogRowClick(0)
      expect(store.isReplay).toBe(false)
    })

    it('exitReplay clears isReplay', async () => {
      const board = mountComposable()
      await nextTick()
      const store = useGameStore()
      store.dispatch({ type: 'END_TURN', playerId: 'P1' })
      store.enterReplay(0)
      await nextTick()
      board.exitReplay()
      expect(board.isReplay.value).toBe(false)
    })
  })

  // ── eventLabel ─────────────────────────────────────────────────────────────

  describe('eventLabel', () => {
    it('formats END_TURN events', async () => {
      const board = mountComposable()
      await nextTick()
      const label = board.eventLabel({ type: 'END_TURN', playerId: 'P1' })
      expect(label).toContain('P1')
      expect(label).toContain('ended turn')
    })

    it('formats MOVE events', async () => {
      const board = mountComposable()
      await nextTick()
      const label = board.eventLabel({
        type: 'MOVE',
        pieceId: 'p1-pawn-0',
        from: { x: 0, y: 1 },
        to: { x: 0, y: 2 },
      })
      expect(label).toContain('P1')
      expect(label).toContain('moved')
    })

    it('formats RESIGN events', async () => {
      const board = mountComposable()
      await nextTick()
      const label = board.eventLabel({ type: 'RESIGN', playerId: 'P1' })
      expect(label).toContain('P1')
      expect(label).toContain('resigned')
    })
  })
})
