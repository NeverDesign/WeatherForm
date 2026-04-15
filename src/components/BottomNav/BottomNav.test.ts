import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import BottomNav from './BottomNav.vue'

describe('BottomNav', () => {
  it('renders New Game and Set Manager buttons', () => {
    render(BottomNav)
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /set manager/i })).toBeInTheDocument()
  })

  it('emits newGame when New Game is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = render(BottomNav)
    await user.click(screen.getByRole('button', { name: /new game/i }))
    expect(emitted().newGame).toBeTruthy()
  })

  it('emits setManager when Set Manager is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = render(BottomNav)
    await user.click(screen.getByRole('button', { name: /set manager/i }))
    expect(emitted().setManager).toBeTruthy()
  })

  it('renders the centre logo', () => {
    render(BottomNav)
    expect(screen.getByRole('img', { name: /weatherform/i })).toBeInTheDocument()
  })
})
