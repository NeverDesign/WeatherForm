import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import GamePage from './GamePage.vue'

describe('GamePage', () => {
  it('renders a heading with the page title', () => {
    render(GamePage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Game')
  })
})
