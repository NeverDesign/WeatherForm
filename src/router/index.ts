import { createRouter, createWebHistory } from 'vue-router'
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

export default router
