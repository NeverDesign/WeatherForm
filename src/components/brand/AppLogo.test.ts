import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import AppLogo from './AppLogo.vue'

describe('AppLogo', () => {
  it('renders the WEATHERFORM wordmark', () => {
    render(AppLogo)
    expect(screen.getByText('WEATHERFORM')).toBeInTheDocument()
  })

  it('defaults to md size modifier class', () => {
    const { container } = render(AppLogo)
    expect(container.querySelector('.c-app-logo--md')).toBeInTheDocument()
  })

  it('applies sm size modifier class when size="sm"', () => {
    const { container } = render(AppLogo, { props: { size: 'sm' } })
    expect(container.querySelector('.c-app-logo--sm')).toBeInTheDocument()
  })

  it('applies lg size modifier class when size="lg"', () => {
    const { container } = render(AppLogo, { props: { size: 'lg' } })
    expect(container.querySelector('.c-app-logo--lg')).toBeInTheDocument()
  })
})
