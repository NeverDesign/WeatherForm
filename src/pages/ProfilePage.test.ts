import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import ProfilePage from './ProfilePage.vue'

describe('ProfilePage', () => {
  it('renders a heading with the page title', () => {
    render(ProfilePage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Profile')
  })
})
