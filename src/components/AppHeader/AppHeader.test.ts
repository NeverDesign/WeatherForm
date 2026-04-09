import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  it('renders the screen title', () => {
    render(AppHeader, { props: { title: 'FRIENDS' } })
    expect(screen.getByText('FRIENDS')).toBeInTheDocument()
  })

  it('renders Friends and Profile icon buttons', () => {
    render(AppHeader, { props: { title: 'GAME MENU' } })
    expect(screen.getByRole('button', { name: /friends/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument()
  })

  it('renders back button when showBack is true and emits back on click', async () => {
    const user = userEvent.setup()
    const { emitted } = render(AppHeader, { props: { title: 'HELP', showBack: true } })
    const backBtn = screen.getByRole('button', { name: /back/i })
    await user.click(backBtn)
    expect(emitted().back).toBeTruthy()
  })

  it('renders the logo when showBack is false', () => {
    render(AppHeader, { props: { title: 'GAME MENU', showBack: false } })
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: /weatherform/i })).toBeInTheDocument()
  })

  it('emits friends when Friends button is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = render(AppHeader, { props: { title: 'MENU' } })
    await user.click(screen.getByRole('button', { name: /friends/i }))
    expect(emitted().friends).toBeTruthy()
  })

  it('emits profile when Profile button is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = render(AppHeader, { props: { title: 'MENU' } })
    await user.click(screen.getByRole('button', { name: /profile/i }))
    expect(emitted().profile).toBeTruthy()
  })
})
