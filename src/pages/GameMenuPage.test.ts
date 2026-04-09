import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import GameMenuPage from './GameMenuPage.vue'

describe('GameMenuPage', () => {
  it('renders a heading with the page title', () => {
    render(GameMenuPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Game Menu')
  })
})
