# Brand System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the wireframe-era colour tokens, typography, and teal accent with the brand guidelines system (amber accent, warm forest-teal palette, Cinzel + DM Sans), update the two built screens, and bring all 6 stub pages to brand-correct scaffolds.

**Architecture:** Token changes flow outward: `_colours.scss` and `_sizes.scss` first, then `_settings.scss` (Bootstrap overrides) and the remaining SCSS files that reference `$wf-teal`. Frontend work (AppLogo, AuthPage, stub pages) comes after the token layer is stable. Agent split: Backend handles SCSS tokens and index.html; Frontend handles components and pages.

**Tech Stack:** Vue 3, TypeScript, Vite, SCSS (Sass), Bootstrap 5, Vitest + @testing-library/vue

---

## Files Modified / Created

| File | Change |
|---|---|
| `index.html` | Add Google Fonts (Cinzel + DM Sans) |
| `src/assets/styles/_colours.scss` | Replace 8 tokens, remove $wf-teal, add $wf-accent trio |
| `src/assets/styles/_settings.scss` | $primary + $input-focus-border-color → $wf-accent |
| `src/assets/styles/_sizes.scss` | Add $font-brand + 5 $tracking-* tokens; update $font-standard |
| `src/assets/styles/_typography.scss` | Rewrite: add 5 Cinzel utility classes |
| `src/components/AppHeader/AppHeader.scss` | $wf-teal → $wf-accent (profile button border) |
| `src/components/brand/AppLogo.scss` | $wf-teal → $wf-accent; use $font-brand + $tracking-logo |
| `src/components/brand/AppLogo.test.ts` | Create: wordmark + size prop tests |
| `src/pages/AuthPage.vue` | Add AppLogo above tabs in form panel |
| `src/pages/AuthPage.scss` | $wf-teal → $wf-accent (×4); Cinzel on tab labels |
| `src/pages/AuthPage.test.ts` | Create: logo before tabs in form panel |
| `src/pages/SplashPage.scss` | No $wf-teal found — no change needed |
| `src/content/gameMenu.ts` | Create |
| `src/content/game.ts` | Create |
| `src/content/setManager.ts` | Create |
| `src/content/profile.ts` | Create |
| `src/content/friends.ts` | Create |
| `src/content/help.ts` | Create |
| `src/content/index.ts` | Add 6 re-exports |
| `src/pages/GameMenuPage.vue` | Update stub |
| `src/pages/GameMenuPage.scss` | Update stub |
| `src/pages/GameMenuPage.test.ts` | Create |
| `src/pages/GamePage.vue` | Update stub |
| `src/pages/GamePage.scss` | Update stub |
| `src/pages/GamePage.test.ts` | Create |
| `src/pages/SetManagerPage.vue` | Update stub |
| `src/pages/SetManagerPage.scss` | Update stub |
| `src/pages/SetManagerPage.test.ts` | Create |
| `src/pages/ProfilePage.vue` | Update stub |
| `src/pages/ProfilePage.scss` | Update stub |
| `src/pages/ProfilePage.test.ts` | Create |
| `src/pages/FriendsPage.vue` | Update stub |
| `src/pages/FriendsPage.scss` | Update stub |
| `src/pages/FriendsPage.test.ts` | Create |
| `src/pages/HelpPage.vue` | Update stub |
| `src/pages/HelpPage.scss` | Update stub |
| `src/pages/HelpPage.test.ts` | Create |

---

## Task 1: Replace colour tokens and add amber accent

**Files:**
- Modify: `src/assets/styles/_colours.scss`

- [x] **Step 1: Replace the file contents**

```scss
// ─── Backgrounds ─────────────────────────────────────────────────────────────
$wf-ink:    #080F0C;
$wf-base:   #0F1A1E;
$wf-raised: #17272D;
$wf-panel:  #1F3540;
$wf-border: #2B4858;

// ─── Text ─────────────────────────────────────────────────────────────────────
$wf-text-pri:   #EEF2F0;
$wf-text-sec:   #A3BDC0;
$wf-text-muted: #587C80;

// ─── Brand ───────────────────────────────────────────────────────────────────
$wf-accent:       #F7B731;
$wf-accent-dark:  #C4911A;
$wf-accent-hover: #FFCF5C;
$wf-danger:       #E05A5A;

// ─── Elements ────────────────────────────────────────────────────────────────
$wf-tide-base:   #0077B6;
$wf-tide-accent: #00B4D8;
$wf-tide-bg:     #0D3D6B;

$wf-gale-base:   #CBD5E1;
$wf-gale-accent: #F1F5F9;
$wf-gale-bg:     #2A3A4A;

$wf-dune-base:   #A84510;
$wf-dune-accent: #D96728;
$wf-dune-bg:     #3D1A0A;
```

- [x] **Step 2: Commit**

```bash
git add src/assets/styles/_colours.scss
git commit -m "feat: replace colour tokens with brand guidelines palette and amber accent"
```

---

## Task 2: Update Bootstrap overrides and remaining $wf-teal references

**Files:**
- Modify: `src/assets/styles/_settings.scss`
- Modify: `src/components/AppHeader/AppHeader.scss`

- [x] **Step 1: Update `_settings.scss` — replace $wf-teal with $wf-accent**

Change only these two lines (leave all other lines unchanged):

```scss
// Line 17 — was: $primary: $wf-teal;
$primary:              $wf-accent;

// Line 36 — was: $input-focus-border-color: $wf-teal;
$input-focus-border-color: $wf-accent;
```

The full file after edit (only these two values change, everything else is identical):

```scss
// ─── Settings ────────────────────────────────────────────────────────────────
// Zero CSS output — safe to auto-inject into every SCSS file via Vite's
// css.preprocessorOptions.scss.additionalData (see vite.config.ts).
//
// Do NOT import this file manually in component SCSS files — Vite prepends it.
// Do NOT add CSS rules here — variables only.
// ─────────────────────────────────────────────────────────────────────────────

@import "colours";
@import "sizes";

// ─── Bootstrap variable overrides ────────────────────────────────────────────
// These must be defined before Bootstrap is imported (in main.scss).
// Bootstrap reads these at compile time and uses them internally for its
// utility classes (.btn-primary, .text-success, etc.).

$primary:              $wf-accent;
$secondary:            $wf-text-muted;
$danger:               $wf-danger;

$body-bg:              $wf-ink;
$body-color:           $wf-text-pri;
$font-family-base:     $font-standard;
$spacer:               $space;
$border-color:         $wf-border;
$border-radius:        6px;

$card-bg:              $wf-base;
$card-border-color:    $wf-border;
$card-color:           $wf-text-pri;

$input-bg:             $wf-base;
$input-border-color:   $wf-border;
$input-color:          $wf-text-pri;
$input-placeholder-color: $wf-text-muted;
$input-focus-border-color: $wf-accent;

$modal-content-bg:           $wf-raised;
$modal-content-border-color: $wf-border;
$modal-header-border-color:  $wf-border;
$modal-footer-border-color:  $wf-border;
```

- [x] **Step 2: Update AppHeader.scss — profile button border**

In `AppHeader.scss`, find the `&--profile` modifier (around line 49) and change `border-color: $wf-teal` to `border-color: $wf-accent`:

```scss
&--profile {
  border-color: $wf-accent;
}
```

- [x] **Step 3: Verify no remaining $wf-teal outside the files touched in Tasks 3–6**

```bash
grep -rn '\$wf-teal' src/assets/styles/ src/components/AppHeader/
```

Expected: no output (zero matches).

- [x] **Step 4: Commit**

```bash
git add src/assets/styles/_settings.scss src/components/AppHeader/AppHeader.scss
git commit -m "feat: update Bootstrap overrides and AppHeader to use amber accent token"
```

---

## Task 3: Add font brand token and letter-spacing tokens

**Files:**
- Modify: `src/assets/styles/_sizes.scss`

- [x] **Step 1: Update `_sizes.scss`**

Add `$font-brand` after `$font-mono`, and add letter-spacing tokens after the layout section. Also update `$font-standard` to use DM Sans as the primary stack:

```scss
// ─── Spacing ─────────────────────────────────────────────────────────────────
$space:       16px;
$space-xs:    4px;
$space-sm:    8px;
$space-md:    20px;
$space-lg:    32px;
$space-xl:    48px;
$space-xxl:   64px;
$space-xxxl:  80px;

// ─── Font sizes ──────────────────────────────────────────────────────────────
$font-size-xxs:   0.5rem;      //  8px  — compact game-UI labels, tags, chips
$font-size-xs:    0.75rem;   // 12px
$font-size-sm:    0.875rem;  // 14px
$font-size-std:   1rem;      // 16px
$font-size-md:    1.125rem;  // 18px
$font-size-lg:    1.25rem;   // 20px
$font-size-xl:    1.5rem;    // 24px
$font-size-xxl:   2rem;      // 32px
$font-size-xxxl:  2.5rem;    // 40px

// ─── Font stacks ─────────────────────────────────────────────────────────────
$font-standard: 'DM Sans', system-ui, -apple-system, sans-serif;
$font-brand:    'Cinzel', serif;
$font-serif:    Georgia, serif;
$font-mono:     'Fira Code', 'Courier New', monospace;

// ─── Letter-spacing ──────────────────────────────────────────────────────────
$tracking-logo:       5px;
$tracking-display:    3px;
$tracking-heading:    2px;
$tracking-eyebrow:    2.5px;
$tracking-eyebrow-sm: 2px;

// ─── Layout ──────────────────────────────────────────────────────────────────
$container-width:        1200px;
$container-width-narrow: 700px;
```

- [x] **Step 2: Commit**

```bash
git add src/assets/styles/_sizes.scss
git commit -m "feat: add Cinzel font-brand token and letter-spacing tokens"
```

---

## Task 4: Rewrite typography file with brand type scale

**Files:**
- Modify: `src/assets/styles/_typography.scss`

- [x] **Step 1: Replace `_typography.scss` contents**

```scss
// ─── Typography ──────────────────────────────────────────────────────────────
// App-level type styles. Bootstrap's reboot handles the baseline reset.
// Tokens are auto-injected by Vite — no @import needed here.
// ─────────────────────────────────────────────────────────────────────────────

body {
  font-family: $font-standard;
  color: $wf-text-sec;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
}

// ─── Font stack utilities ─────────────────────────────────────────────────────
.font-standard { font-family: $font-standard; }
.font-brand    { font-family: $font-brand; }
.font-serif    { font-family: $font-serif; }
.font-mono     { font-family: $font-mono; }

// ─── Font size utilities (supplement Bootstrap's fs- classes) ─────────────────
.text-xs   { font-size: $font-size-xs; }
.text-sm   { font-size: $font-size-sm; }
.text-std  { font-size: $font-size-std; }
.text-md   { font-size: $font-size-md; }
.text-lg   { font-size: $font-size-lg; }
.text-xl   { font-size: $font-size-xl; }
.text-xxl  { font-size: $font-size-xxl; }
.text-xxxl { font-size: $font-size-xxxl; }

// ─── Brand type scale (Cinzel) ────────────────────────────────────────────────
// All Cinzel classes are always uppercase — do not use with sentence-case text.

.wf-wordmark {
  font-family: $font-brand;
  font-size: $font-size-xxxl;
  font-weight: 900;
  letter-spacing: $tracking-logo;
  color: $wf-accent;
  text-transform: uppercase;
  line-height: 1;
}

.wf-display {
  font-family: $font-brand;
  font-size: $font-size-xxl;
  font-weight: 700;
  letter-spacing: $tracking-display;
  color: $wf-text-pri;
  text-transform: uppercase;
  line-height: 1.1;
}

.wf-heading {
  font-family: $font-brand;
  font-size: $font-size-lg;
  font-weight: 600;
  letter-spacing: $tracking-heading;
  color: $wf-text-pri;
  text-transform: uppercase;
  line-height: 1.2;
}

.wf-eyebrow {
  font-family: $font-brand;
  font-size: $font-size-sm;
  font-weight: 600;
  letter-spacing: $tracking-eyebrow;
  color: $wf-text-muted;
  text-transform: uppercase;
  line-height: 1;
}

.wf-eyebrow-sm {
  font-family: $font-brand;
  font-size: $font-size-xxs;
  font-weight: 600;
  letter-spacing: $tracking-eyebrow-sm;
  color: $wf-text-muted;
  text-transform: uppercase;
  line-height: 1;
}
```

- [x] **Step 2: Commit**

```bash
git add src/assets/styles/_typography.scss
git commit -m "feat: add Cinzel brand type scale utility classes"
```

---

## Task 5: Add Google Fonts to index.html

**Files:**
- Modify: `index.html`

- [x] **Step 1: Add preconnect and font link tags to `<head>`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weatherform</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [x] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add Cinzel and DM Sans via Google Fonts"
```

---

## Task 6: Update AppLogo — tests + SCSS

**Files:**
- Create: `src/components/brand/AppLogo.test.ts`
- Modify: `src/components/brand/AppLogo.scss`

- [x] **Step 1: Write the failing tests**

Create `src/components/brand/AppLogo.test.ts`:

```ts
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
```

- [x] **Step 2: Run tests to confirm the component structure is already correct**

```bash
npx vitest run src/components/brand/AppLogo.test.ts
```

Expected: all 4 tests PASS. `AppLogo.vue` already exists and renders the wordmark with size modifier classes. These tests lock in the existing behaviour so any regression from the SCSS edit is caught.

- [x] **Step 3: Update `AppLogo.scss` — wordmark colour and font tokens**

Change the `&__wordmark` block to use brand tokens. Find this block (around line 31–39):

```scss
&__wordmark {
  display: block;
  color: $wf-teal;
  font-family: 'Cinzel', #{$font-serif};
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1;
}
```

Replace with:

```scss
&__wordmark {
  display: block;
  color: $wf-accent;
  font-family: $font-brand;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: $tracking-logo;
  line-height: 1;
}
```

- [x] **Step 4: Run tests to verify they still pass**

```bash
npx vitest run src/components/brand/AppLogo.test.ts
```

Expected: all 4 tests PASS.

- [x] **Step 5: Commit**

```bash
git add src/components/brand/AppLogo.test.ts src/components/brand/AppLogo.scss
git commit -m "feat: update AppLogo wordmark to amber accent and Cinzel brand tokens"
```

---

## Task 7: Update AuthPage — tests + Vue template + SCSS

**Files:**
- Create: `src/pages/AuthPage.test.ts`
- Modify: `src/pages/AuthPage.vue`
- Modify: `src/pages/AuthPage.scss`

- [x] **Step 1: Write the failing test**

Create `src/pages/AuthPage.test.ts`:

```ts
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
```

- [x] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/pages/AuthPage.test.ts
```

Expected: first test FAIL ("AppLogo not found in form panel") because the logo is currently only in the brand panel. Second test should PASS.

- [x] **Step 3: Add AppLogo to form panel in `AuthPage.vue`**

In `AuthPage.vue`, find the form panel div:

```html
<!-- Bottom / Right panel: form -->
<div class="p-auth__form-panel">

  <!-- Tab toggle -->
  <div class="p-auth__tabs" role="tablist">
```

Add `<AppLogo size="sm" />` as the first child of the form panel, before the tabs:

```html
<!-- Bottom / Right panel: form -->
<div class="p-auth__form-panel">

  <AppLogo size="sm" />

  <!-- Tab toggle -->
  <div class="p-auth__tabs" role="tablist">
```

No other template changes.

- [x] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/pages/AuthPage.test.ts
```

Expected: both tests PASS.

- [x] **Step 5: Update `AuthPage.scss` — replace all $wf-teal and apply Cinzel to tabs**

Four `$wf-teal` references need replacing, plus Cinzel applied to the tab font. Find and make the following changes:

**Tab base styles** — find `&__tab {` block and add `$font-brand` + update tracking:

```scss
&__tab {
  flex: 1;
  padding: $space-sm $space-xs;
  background-color: transparent;
  border: none;
  color: $wf-text-muted;
  font-family: $font-brand;
  font-size: $font-size-xxs;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: $tracking-eyebrow-sm;
  transition: background-color 0.15s ease, color 0.15s ease;

  &--active {
    background-color: $wf-panel;
    color: $wf-accent;
    font-weight: 700;
  }
}
```

**Input focus** — find `&__input {` and change `:focus` border:

```scss
&:focus {
  border-color: $wf-accent;
}
```

**Submit button** — find `&__submit {` and change background:

```scss
&__submit {
  width: 100%;
  background-color: $wf-accent;
  color: $wf-ink;
  font-weight: 700;
  font-size: $font-size-sm;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: $space-sm $space-md;
  border: none;
  border-radius: $space-xs;
  cursor: pointer;
  margin-top: $space-xs;
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

**Forgot password link** — find `&__forgot {` and change colour:

```scss
&__forgot {
  color: $wf-accent;
  font-size: $font-size-xs;
  text-align: right;
  text-decoration: none;
  display: block;

  &:hover {
    text-decoration: underline;
  }
}
```

**Logo spacing in form panel** — add to `&__form-panel {` block:

```scss
&__form-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: $space-md;
  background-color: $wf-base;

  > .c-app-logo {
    align-self: center;
    margin-bottom: $space-sm;
  }
}
```

- [x] **Step 6: Verify no $wf-teal remains in AuthPage.scss**

```bash
grep -n '\$wf-teal' src/pages/AuthPage.scss
```

Expected: no output.

- [x] **Step 7: Run all tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [x] **Step 8: Commit**

```bash
git add src/pages/AuthPage.test.ts src/pages/AuthPage.vue src/pages/AuthPage.scss
git commit -m "feat: add AppLogo to auth form panel and apply amber accent + Cinzel tabs"
```

---

## Task 8: Create content files for stub pages

**Files:**
- Create: `src/content/gameMenu.ts`
- Create: `src/content/game.ts`
- Create: `src/content/setManager.ts`
- Create: `src/content/profile.ts`
- Create: `src/content/friends.ts`
- Create: `src/content/help.ts`
- Modify: `src/content/index.ts`

- [x] **Step 1: Create `src/content/gameMenu.ts`**

```ts
export const gameMenuContent = {
  title: 'Game Menu',
} as const
```

- [x] **Step 2: Create `src/content/game.ts`**

```ts
export const gameContent = {
  title: 'Game',
} as const
```

- [x] **Step 3: Create `src/content/setManager.ts`**

```ts
export const setManagerContent = {
  title: 'Set Manager',
} as const
```

- [x] **Step 4: Create `src/content/profile.ts`**

```ts
export const profileContent = {
  title: 'Profile',
} as const
```

- [x] **Step 5: Create `src/content/friends.ts`**

```ts
export const friendsContent = {
  title: 'Friends',
} as const
```

- [x] **Step 6: Create `src/content/help.ts`**

```ts
export const helpContent = {
  title: 'Help',
} as const
```

- [x] **Step 7: Update `src/content/index.ts`**

```ts
export * from './splash'
export * from './auth'
export * from './common'
export * from './errors'
export * from './nav'
export * from './gameMenu'
export * from './game'
export * from './setManager'
export * from './profile'
export * from './friends'
export * from './help'
```

- [x] **Step 8: Commit**

```bash
git add src/content/
git commit -m "feat: add content files for six stub pages"
```

---

## Task 9: Update stub pages

**Files (per page):** `.vue`, `.scss`, `.test.ts` × 6

- [x] **Step 1: Write tests for all 6 stub pages**

Create `src/pages/GameMenuPage.test.ts`:

```ts
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import GameMenuPage from './GameMenuPage.vue'

describe('GameMenuPage', () => {
  it('renders a heading with the page title', () => {
    render(GameMenuPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Game Menu')
  })
})
```

Create `src/pages/GamePage.test.ts`:

```ts
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import GamePage from './GamePage.vue'

describe('GamePage', () => {
  it('renders a heading with the page title', () => {
    render(GamePage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Game')
  })
})
```

Create `src/pages/SetManagerPage.test.ts`:

```ts
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import SetManagerPage from './SetManagerPage.vue'

describe('SetManagerPage', () => {
  it('renders a heading with the page title', () => {
    render(SetManagerPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Set Manager')
  })
})
```

Create `src/pages/ProfilePage.test.ts`:

```ts
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import ProfilePage from './ProfilePage.vue'

describe('ProfilePage', () => {
  it('renders a heading with the page title', () => {
    render(ProfilePage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Profile')
  })
})
```

Create `src/pages/FriendsPage.test.ts`:

```ts
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import FriendsPage from './FriendsPage.vue'

describe('FriendsPage', () => {
  it('renders a heading with the page title', () => {
    render(FriendsPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Friends')
  })
})
```

Create `src/pages/HelpPage.test.ts`:

```ts
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import HelpPage from './HelpPage.vue'

describe('HelpPage', () => {
  it('renders a heading with the page title', () => {
    render(HelpPage)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Help')
  })
})
```

- [x] **Step 2: Run tests to verify they all fail**

```bash
npx vitest run src/pages/GameMenuPage.test.ts src/pages/GamePage.test.ts src/pages/SetManagerPage.test.ts src/pages/ProfilePage.test.ts src/pages/FriendsPage.test.ts src/pages/HelpPage.test.ts
```

Expected: all 6 tests FAIL — headings not found (stubs have no h1).

- [x] **Step 3: Replace `GameMenuPage.vue`**

```vue
<script setup lang="ts">
import { gameMenuContent } from '@/content/gameMenu'
</script>

<template>
  <div class="p-game-menu" data-testid="page-game-menu">
    <h1 class="visually-hidden">{{ gameMenuContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./GameMenuPage.scss" />
```

- [x] **Step 4: Replace `GameMenuPage.scss`**

```scss
.p-game-menu {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```

- [x] **Step 5: Replace `GamePage.vue`**

```vue
<script setup lang="ts">
import { gameContent } from '@/content/game'
</script>

<template>
  <div class="p-game" data-testid="page-game">
    <h1 class="visually-hidden">{{ gameContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./GamePage.scss" />
```

- [x] **Step 6: Replace `GamePage.scss`**

```scss
.p-game {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```

- [x] **Step 7: Replace `SetManagerPage.vue`**

```vue
<script setup lang="ts">
import { setManagerContent } from '@/content/setManager'
</script>

<template>
  <div class="p-set-manager" data-testid="page-set-manager">
    <h1 class="visually-hidden">{{ setManagerContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./SetManagerPage.scss" />
```

- [x] **Step 8: Replace `SetManagerPage.scss`**

```scss
.p-set-manager {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```

- [x] **Step 9: Replace `ProfilePage.vue`**

```vue
<script setup lang="ts">
import { profileContent } from '@/content/profile'
</script>

<template>
  <div class="p-profile" data-testid="page-profile">
    <h1 class="visually-hidden">{{ profileContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./ProfilePage.scss" />
```

- [x] **Step 10: Replace `ProfilePage.scss`**

```scss
.p-profile {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```

- [x] **Step 11: Replace `FriendsPage.vue`**

```vue
<script setup lang="ts">
import { friendsContent } from '@/content/friends'
</script>

<template>
  <div class="p-friends" data-testid="page-friends">
    <h1 class="visually-hidden">{{ friendsContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./FriendsPage.scss" />
```

- [x] **Step 12: Replace `FriendsPage.scss`**

```scss
.p-friends {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```

- [x] **Step 13: Replace `HelpPage.vue`**

```vue
<script setup lang="ts">
import { helpContent } from '@/content/help'
</script>

<template>
  <div class="p-help" data-testid="page-help">
    <h1 class="visually-hidden">{{ helpContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./HelpPage.scss" />
```

- [x] **Step 14: Replace `HelpPage.scss`**

```scss
.p-help {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```

- [x] **Step 15: Run stub tests to verify they pass**

```bash
npx vitest run src/pages/GameMenuPage.test.ts src/pages/GamePage.test.ts src/pages/SetManagerPage.test.ts src/pages/ProfilePage.test.ts src/pages/FriendsPage.test.ts src/pages/HelpPage.test.ts
```

Expected: all 6 tests PASS.

- [x] **Step 16: Run all tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [x] **Step 17: Commit**

```bash
git add src/pages/GameMenuPage.vue src/pages/GameMenuPage.scss src/pages/GameMenuPage.test.ts
git add src/pages/GamePage.vue src/pages/GamePage.scss src/pages/GamePage.test.ts
git add src/pages/SetManagerPage.vue src/pages/SetManagerPage.scss src/pages/SetManagerPage.test.ts
git add src/pages/ProfilePage.vue src/pages/ProfilePage.scss src/pages/ProfilePage.test.ts
git add src/pages/FriendsPage.vue src/pages/FriendsPage.scss src/pages/FriendsPage.test.ts
git add src/pages/HelpPage.vue src/pages/HelpPage.scss src/pages/HelpPage.test.ts
git commit -m "feat: update stub pages to brand-correct scaffolds with visually-hidden h1"
```

---

## Task 10: Build validation and token audit

- [x] **Step 1: Run full type check**

```bash
npx vue-tsc --noEmit
```

Expected: exits 0, no errors.

- [x] **Step 2: Run production build**

```bash
npm run build
```

Expected: exits 0, no errors or warnings about missing tokens.

- [x] **Step 3: Verify $wf-teal is fully removed**

```bash
grep -rn '\$wf-teal' src/
```

Expected: no output (zero matches).

- [x] **Step 4: Verify no hardcoded hex colours in component SCSS**

```bash
grep -rn '#[0-9a-fA-F]\{3,6\}\b' src --include="*.scss"
```

Expected: zero matches. Any match is a violation — replace with the appropriate `$wf-*` token.

- [x] **Step 5: Verify no inline styles in templates**

```bash
grep -rn 'style="' src/components --include="*.vue"
grep -rn 'style="' src/pages --include="*.vue"
```

Expected: zero matches.

- [x] **Step 6: Run all tests one final time**

```bash
npx vitest run
```

Expected: all tests PASS.

- [x] **Step 7: Commit if any fixes were needed in steps 3–5**

If any violations were found and fixed in steps 3–5, commit them:

```bash
git add -p
git commit -m "fix: resolve remaining token violations from brand audit"
```

If no violations, no commit needed.
