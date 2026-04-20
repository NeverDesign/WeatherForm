import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import FriendsPage from './FriendsPage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: FriendsPage }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('FriendsPage', () => {
  it('renders a heading with the page title', () => {
    render(FriendsPage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Friends')
  })
})
