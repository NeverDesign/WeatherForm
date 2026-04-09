import { render, screen } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import AuthPage from './AuthPage.vue'

vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => ({
    error: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('AuthPage', () => {
  it('renders AppLogo above the tab toggle in the form panel', () => {
    const { container } = render(AuthPage, {
      global: { plugins: [router] },
    })
    const formPanel = container.querySelector('.p-auth__form-panel')!
    const logo = formPanel.querySelector('.c-app-logo')
    const tabs = formPanel.querySelector('[role="tablist"]')
    expect(logo).toBeInTheDocument()
    expect(tabs).toBeInTheDocument()
    // DOCUMENT_POSITION_FOLLOWING (4) means tabs comes after logo in the DOM
    expect(logo!.compareDocumentPosition(tabs!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders Sign In and Create Account tabs', () => {
    render(AuthPage, { global: { plugins: [router] } })
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /create account/i })).toBeInTheDocument()
  })
})
