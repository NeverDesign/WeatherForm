import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProfilePage from './ProfilePage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: ProfilePage }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ProfilePage', () => {
  it('renders a heading with the page title', () => {
    render(ProfilePage, {
      global: {
        plugins: [createPinia(), makeRouter()],
      },
    })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Profile')
  })
})
