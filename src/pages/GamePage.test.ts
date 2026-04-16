import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'
import GamePage from './GamePage.vue'

// ── Test router (memory history — no real navigation) ─────────────────────────

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/menu', component: { template: '<div />' } },
      { path: '/game/:id', component: GamePage },
    ],
  })
}

// ── Render helper ─────────────────────────────────────────────────────────────

function renderGamePage() {
  const pinia = createPinia()
  const router = makeRouter()
  return render(GamePage, {
    global: {
      plugins: [pinia, router],
    },
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('GamePage', () => {
  it('renders a heading with the page title', () => {
    renderGamePage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Game')
  })

  it('renders the 8×8 game board', () => {
    renderGamePage()
    const grid = screen.getByRole('grid')
    expect(grid).toBeTruthy()
    const cells = screen.getAllByRole('gridcell')
    expect(cells).toHaveLength(64)
  })

  it('renders pieces on the board after mount', async () => {
    const { container } = renderGamePage()
    await nextTick() // wait for onMounted → newGame() → reactive update
    const pieces = container.querySelectorAll('.p-game__piece')
    expect(pieces.length).toBeGreaterThan(0)
  })

  it('renders P1 HP bar with aria-valuenow bound to HP', () => {
    renderGamePage()
    const progressBars = screen.getAllByRole('progressbar')
    // Two bars: opponent (P2) and self (P1)
    expect(progressBars).toHaveLength(2)
    // Both should have aria-valuenow set (not undefined)
    for (const bar of progressBars) {
      const val = bar.getAttribute('aria-valuenow')
      expect(val).not.toBeNull()
      expect(Number(val)).toBeGreaterThanOrEqual(0)
    }
  })

  it('renders End Turn button in the dock', () => {
    renderGamePage()
    expect(screen.getByRole('button', { name: /End Turn/i })).toBeTruthy()
  })

  it('renders Resign button in the dock', () => {
    renderGamePage()
    expect(screen.getByRole('button', { name: /Resign/i })).toBeTruthy()
  })

  it('renders Move Log button in the dock', () => {
    renderGamePage()
    expect(screen.getByRole('button', { name: /Move Log/i })).toBeTruthy()
  })

  it('renders 6 disabled ability slot buttons', () => {
    const { container } = renderGamePage()
    const abilityBtns = container.querySelectorAll('.p-game__dock-btn--ability')
    expect(abilityBtns).toHaveLength(6)
    for (const btn of abilityBtns) {
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    }
  })

  it('End Turn button is enabled when it is P1\'s turn', () => {
    renderGamePage()
    const endTurnBtn = screen.getByRole('button', { name: /End Turn/i })
    // P1 goes first — button should be enabled
    expect((endTurnBtn as HTMLButtonElement).disabled).toBe(false)
  })
})
