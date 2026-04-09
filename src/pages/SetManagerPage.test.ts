import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import SetManagerPage from './SetManagerPage.vue'

describe('SetManagerPage', () => {
  it('renders a heading with the page title', () => {
    render(SetManagerPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Set Manager')
  })
})
