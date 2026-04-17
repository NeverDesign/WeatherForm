import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import SetManagerPage from './SetManagerPage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: SetManagerPage }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('SetManagerPage', () => {
  it('renders a heading with the page title', () => {
    render(SetManagerPage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Set Manager')
  })

  it('renders element tabs for TIDE, GALE, and DUNE', () => {
    render(SetManagerPage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    expect(screen.getByRole('tab', { name: 'TIDE' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'GALE' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'DUNE' })).toBeTruthy()
  })

  it('shows 6 ability rows for the active element', () => {
    render(SetManagerPage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    // Default element is TIDE — should show 6 list items
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(6)
  })

  it('shows empty state when no sets are saved', () => {
    render(SetManagerPage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    expect(screen.getByText('No sets saved')).toBeTruthy()
  })

  it('shows the save set form with name input and submit button', () => {
    render(SetManagerPage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    expect(screen.getByLabelText('Set Name')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save Set' })).toBeTruthy()
  })
})
