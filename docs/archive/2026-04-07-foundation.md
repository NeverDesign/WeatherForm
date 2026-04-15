# Weatherform Frontend — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Weatherform frontend — Vite + Vue 3 + TypeScript + Bootstrap 5 + SCSS design tokens, shared types, AppHeader and BottomNav components (with tests), Vue Router with all 8 screen stubs connected.

**Architecture:** Single-page app with Vue Router 4. Design tokens live in `src/assets/styles/_colours.scss` as SCSS variables, auto-injected into every `.scss` file via Vite's `additionalData`. Bootstrap 5 variables are overridden in `_settings.scss` before Bootstrap is imported. Screens are stub components that render their title only — each will be fleshed out in a follow-on plan. Shared layout components (AppHeader, BottomNav) are co-located with their SCSS and test files.

**Tech Stack:** Vite 6, Vue 3 Composition API, TypeScript 5, Bootstrap 5.3, Vue Router 4, Pinia, Vitest, Vue Testing Library

> **Note:** Foundation is complete. Follow-on plans cover each screen group: Auth, Game Menu, Game Screen, Set Manager, Social (Profile + Friends), Help.

---

### Task 1: Scaffold the project ✅

Based on `vue3-starter` — copy core config files, install deps, verify build.

**Key files copied from `/Users/jon/Sites/vue3-starter/`:**
- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
- `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`
- `src/assets/styles/_sizes.scss`, `_typography.scss`, `main.scss`
- `src/stores/useAppStore.ts`
- `.claude/playbooks/` (all 6 agent playbooks)

**Added to `package.json`:**
```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest --run"
},
"devDependencies": {
  "vitest": "^2.1.9",
  "@testing-library/vue": "^8.1.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/user-event": "^14.5.2",
  "jsdom": "^25.0.1"
}
```

**Added to `vite.config.ts`:**
```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
},
```

**`src/test/setup.ts`:**
```ts
import '@testing-library/jest-dom'
```

---

### Task 2: Design tokens ✅

**`src/assets/styles/_colours.scss`** — full Weatherform palette:
```scss
$wf-ink:    #050C14;   $wf-base:   #0D1B2A;  $wf-raised: #142236;
$wf-panel:  #1E3550;   $wf-border: #2A4A6B;
$wf-text-pri: #F0F6FF; $wf-text-sec: #A8C4D8; $wf-text-muted: #5A8099;
$wf-teal:   #2DD4BF;   $wf-danger: #E05A5A;
$wf-tide-base: #0077B6; $wf-tide-accent: #00B4D8; $wf-tide-bg: #0D3D6B;
$wf-gale-base: #CBD5E1; $wf-gale-accent: #F1F5F9; $wf-gale-bg: #2A3A4A;
$wf-dune-base: #A84510; $wf-dune-accent: #D96728; $wf-dune-bg: #3D1A0A;
```

**`src/assets/styles/_settings.scss`** — Bootstrap overrides for dark theme:
```scss
$primary: $wf-teal;  $secondary: $wf-text-muted;  $danger: $wf-danger;
$body-bg: $wf-ink;   $body-color: $wf-text-pri;    $border-color: $wf-border;
$card-bg: $wf-base;  $input-bg: $wf-base;          $modal-content-bg: $wf-raised;
// ... (see file for full list)
```

---

### Task 3: Shared types ✅

**`src/types/index.ts`:**
```ts
export type Element = 'TIDE' | 'GALE' | 'DUNE'

export const ROUTES = {
  SPLASH: '/', AUTH: '/auth', MENU: '/menu', GAME: '/game/:id',
  SETS: '/sets', PROFILE: '/profile', FRIENDS: '/friends', HELP: '/help',
} as const

export const ELEMENT_COLOURS: Record<Element, { base: string; accent: string; bg: string }> = {
  TIDE: { base: '#0077B6', accent: '#00B4D8', bg: '#0D3D6B' },
  GALE: { base: '#CBD5E1', accent: '#F1F5F9', bg: '#2A3A4A' },
  DUNE: { base: '#A84510', accent: '#D96728', bg: '#3D1A0A' },
}
```

**`src/content/nav.ts`:**
```ts
export const navContent = {
  screens: { splash: 'Splash', auth: 'Sign In', menu: 'Game Menu', ... },
  bottomNav: { newGame: 'New Game', setManager: 'Set Manager' },
} as const
```

---

### Task 4: AppHeader component ✅

**`src/components/AppHeader/AppHeader.vue`** — props: `title: string`, `showBack?: boolean`. Emits: `back`, `friends`, `profile`.

```vue
<template>
  <header class="c-app-header">
    <div class="c-app-header__left">
      <button v-if="showBack" class="c-app-header__icon-btn" aria-label="Back" @click="emit('back')">‹</button>
      <div v-else class="c-app-header__logo" aria-label="Weatherform" role="img" />
    </div>
    <span class="c-app-header__title">{{ title }}</span>
    <div class="c-app-header__right">
      <button class="c-app-header__icon-btn" aria-label="Friends" @click="emit('friends')"><!-- svg --></button>
      <button class="c-app-header__icon-btn c-app-header__icon-btn--profile" aria-label="Profile" @click="emit('profile')"><!-- svg --></button>
    </div>
  </header>
</template>
```

Tests: `src/components/AppHeader/AppHeader.test.ts` — 6 tests (title renders, buttons present, back/friends/profile emit correctly, logo shows when no back).

---

### Task 5: BottomNav component ✅

**`src/components/BottomNav/BottomNav.vue`** — Emits: `newGame`, `setManager`.

Three slots: New Game button | tricolour logo mark | Set Manager button.

Tests: `src/components/BottomNav/BottomNav.test.ts` — 4 tests.

---

### Task 6: Vue Router + 8 screen stubs ✅

**`src/router/index.ts`:**
```ts
{ path: '/',         name: 'splash',  component: SplashPage },
{ path: '/auth',     name: 'auth',    component: AuthPage },
{ path: '/menu',     name: 'menu',    component: GameMenuPage },
{ path: '/game/:id', name: 'game',    component: GamePage },
{ path: '/sets',     name: 'sets',    component: SetManagerPage },
{ path: '/profile',  name: 'profile', component: ProfilePage },
{ path: '/friends',  name: 'friends', component: FriendsPage },
{ path: '/help',     name: 'help',    component: HelpPage },
```

Each page stub: `src/pages/[Name]Page.vue` + `[Name]Page.scss` — renders `data-testid="page-[name]"` on `$wf-ink` background.

---

## Verification

```bash
npm run build    # ✅ exits 0, dist/ produced
npm run test:run # ✅ 10 tests passed (6 AppHeader + 4 BottomNav)
npm run dev      # visit / through /help — each shows stub label on dark background
```

*Next plans (to be written): Plan 2 — Auth (Splash + Auth), Plan 3 — Game Menu, Plan 4 — Game Screen, Plan 5 — Set Manager, Plan 6 — Social (Profile + Friends), Plan 7 — Help.*
