import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/types'
import SplashPage     from '@/pages/SplashPage.vue'
import AuthPage       from '@/pages/AuthPage.vue'
import GameMenuPage   from '@/pages/GameMenuPage.vue'
import GamePage       from '@/pages/GamePage.vue'
import SetManagerPage from '@/pages/SetManagerPage.vue'
import ProfilePage    from '@/pages/ProfilePage.vue'
import FriendsPage    from '@/pages/FriendsPage.vue'
import HelpPage        from '@/pages/HelpPage.vue'
import StyleGuidePage  from '@/pages/StyleGuidePage.vue'
import NotFoundPage    from '@/pages/NotFoundPage.vue'

// Protected route prefixes — use the static prefix before any params
const PROTECTED_PREFIXES = [
  ROUTES.MENU,       // /menu
  '/game',           // /game/:id — match prefix, not the pattern string
  ROUTES.SETS,       // /sets
  ROUTES.PROFILE,    // /profile
  ROUTES.FRIENDS,    // /friends
]

// Routes that authenticated users should not see
const AUTH_ONLY = [ROUTES.SPLASH, ROUTES.AUTH] as string[]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          name: 'splash',      component: SplashPage },
    { path: '/auth',      name: 'auth',        component: AuthPage },
    { path: '/menu',      name: 'menu',        component: GameMenuPage },
    { path: '/game/:id',  name: 'game',        component: GamePage },
    { path: '/sets',      name: 'sets',        component: SetManagerPage },
    { path: '/profile',   name: 'profile',     component: ProfilePage },
    { path: '/friends',   name: 'friends',     component: FriendsPage },
    { path: '/help',             name: 'help',       component: HelpPage },
    { path: '/styles',          name: 'styles',     component: StyleGuidePage },
    { path: '/:pathMatch(.*)*', name: 'not-found',  component: NotFoundPage },
  ],
})

// Navigation guard — deferred import to avoid circular dependency with Pinia
router.beforeEach(async (to) => {
  // Lazy-import the store so Pinia is already installed when router is used
  const { useAuthStore } = await import('@/stores/useAuthStore')
  const authStore = useAuthStore()

  // Wait for the initial session check to complete before making routing decisions
  if (!authStore.initialized) {
    await authStore.initSession()
  }

  const isAuthenticated = !!authStore.account
  const path = to.path

  // Unauthenticated → redirect to /auth for protected routes
  if (!isAuthenticated && PROTECTED_PREFIXES.some(p => path === p || path.startsWith(p + '/'))) {
    return { path: ROUTES.AUTH }
  }

  // Authenticated → redirect away from splash/auth to menu
  if (isAuthenticated && AUTH_ONLY.some(p => path === p || path.startsWith(p + '/'))) {
    return { path: ROUTES.MENU }
  }

  return true
})

export default router
