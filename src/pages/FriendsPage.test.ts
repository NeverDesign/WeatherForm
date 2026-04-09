import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import FriendsPage from './FriendsPage.vue'

describe('FriendsPage', () => {
  it('renders a heading with the page title', () => {
    render(FriendsPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Friends')
  })
})
