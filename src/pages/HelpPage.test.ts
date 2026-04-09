import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import HelpPage from './HelpPage.vue'

describe('HelpPage', () => {
  it('renders a heading with the page title', () => {
    render(HelpPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Help')
  })
})
