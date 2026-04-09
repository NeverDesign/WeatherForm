# Brand System Implementation — Design Spec

**Date:** 2026-04-08
**Status:** Approved — ready for implementation planning

---

## Overview

Implement the WeatherForm brand guidelines across the token system, typography, and all currently-built screens. Scaffold the six unbuilt screens as brand-correct stubs. The implementation resolves a conflict between the wireframes spec (teal accent, cool navy palette, Inter font) and the brand guidelines (amber accent, warm forest-teal palette, Cinzel + DM Sans typography) — the brand guidelines direction has been chosen in full.

---

## Decisions

| Decision | Choice |
|---|---|
| Accent colour | Amber `#F7B731` (brand guidelines) — replaces teal `#2DD4BF` |
| Background/text palette | Brand guidelines warm forest-teal undertone — replaces wireframe cool navy |
| Typography | Cinzel (display/brand) + DM Sans (UI/body) — replaces Inter |
| Scope | Token system + Splash/Auth polish + 6 screen stubs |
| Implementation approach | Backend agent (tokens) → Frontend agent (screens) → QA |

---

## Section 1: Token + Typography Infrastructure

### `index.html`

Add Google Fonts preconnect and stylesheet link:
- Cinzel: weights 600, 700, 900
- DM Sans: weights 400, 500, 700

### `src/assets/styles/_colours.scss`

Replace all background and text tokens with brand guidelines values:

| Token | Old value | New value |
|---|---|---|
| `$wf-ink` | `#050C14` | `#080F0C` |
| `$wf-base` | `#0D1B2A` | `#0F1A1E` |
| `$wf-raised` | `#142236` | `#17272D` |
| `$wf-panel` | `#1E3550` | `#1F3540` |
| `$wf-border` | `#2A4A6B` | `#2B4858` |
| `$wf-text-pri` | `#F0F6FF` | `#EEF2F0` |
| `$wf-text-sec` | `#A8C4D8` | `#A3BDC0` |
| `$wf-text-muted` | `#5A8099` | `#587C80` |

Remove `$wf-teal`. Add amber accent trio:

```scss
$wf-accent:       #F7B731;
$wf-accent-dark:  #C4911A;
$wf-accent-hover: #FFCF5C;
```

Keep unchanged: `$wf-danger`, all `$wf-tide-*`, `$wf-gale-*`, `$wf-dune-*` tokens.

### `src/assets/styles/_sizes.scss`

Add font brand stack and letter-spacing tokens:

```scss
$font-brand: 'Cinzel', serif;

$tracking-logo:        5px;
$tracking-display:     3px;
$tracking-heading:     2px;
$tracking-eyebrow:     2.5px;
$tracking-eyebrow-sm:  2px;
```

Existing tokens (`$font-standard`, `$font-serif`, `$font-mono`, `$space-*`, `$font-size-*`) unchanged.

### `src/assets/styles/_typography.scss`

Full rewrite implementing the brand type scale. No `@import` needed — tokens are auto-injected by Vite.

- `body`: `$font-standard` (DM Sans), `$wf-text-sec`
- Semantic utility classes for the Cinzel scale:

| Class | Font | Size | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| `.wf-wordmark` | `$font-brand` | `$font-size-xxxl` | 900 | `$tracking-logo` | `$wf-accent` |
| `.wf-display` | `$font-brand` | `$font-size-xxl` | 700 | `$tracking-display` | `$wf-text-pri` |
| `.wf-heading` | `$font-brand` | `$font-size-lg` | 600 | `$tracking-heading` | `$wf-text-pri` |
| `.wf-eyebrow` | `$font-brand` | `$font-size-sm` | 600 | `$tracking-eyebrow` | `$wf-text-muted` |
| `.wf-eyebrow-sm` | `$font-brand` | `$font-size-xxs` | 600 | `$tracking-eyebrow-sm` | `$wf-text-muted` |

All classes: `text-transform: uppercase`. Body/UI copy continues to use DM Sans via `$font-standard`.

---

## Section 2: AppLogo Component

**Files:** `src/components/brand/AppLogo.vue`, `src/components/brand/AppLogo.scss`

Two changes only — no layout, size prop, or SVG changes:

1. **Wordmark colour:** `$wf-teal` → `$wf-accent`
2. **Wordmark font:** apply `$font-brand`, `font-weight: 900`, `letter-spacing: $tracking-logo`

The tri-arc emblem SVG uses element colours (`$wf-tide-base`, `$wf-gale-base`, `$wf-dune-base`) which are unchanged.

---

## Section 3: Splash + Auth Screen Polish

### SplashPage (`src/pages/SplashPage.vue` / `SplashPage.scss`)

No direct changes required. The wordmark inherits Cinzel automatically via the updated AppLogo component. Audit `SplashPage.scss` for any stray `$wf-teal` references and replace with `$wf-accent`.

### AuthPage (`src/pages/AuthPage.vue` / `AuthPage.scss`)

Three targeted changes:

1. **Logo above tabs:** Add `<AppLogo size="sm" />` as the first element inside the form panel (`.auth-form` or equivalent), above the tab row
2. **Cinzel tab labels:** Apply `$font-brand`, `font-weight: 600`, `letter-spacing: $tracking-eyebrow-sm` to the SIGN IN / CREATE ACCOUNT tab elements
3. **Token audit:** Replace any remaining `$wf-teal` references in `AuthPage.scss` with `$wf-accent`

No layout, form, validation, or store changes.

---

## Section 4: Screen Stubs (6 Remaining Routes)

Update the existing minimal stubs to be brand-correct. All 6 `.vue` and `.scss` files already exist. Routes are already defined — no router changes needed.

**Screens and file mapping:**

| Screen | Vue file | SCSS file | Content file |
|---|---|---|---|
| GameMenuPage | `src/pages/GameMenuPage.vue` | `GameMenuPage.scss` | `src/content/gameMenu.ts` |
| GamePage | `src/pages/GamePage.vue` | `GamePage.scss` | `src/content/game.ts` |
| SetManagerPage | `src/pages/SetManagerPage.vue` | `SetManagerPage.scss` | `src/content/setManager.ts` |
| ProfilePage | `src/pages/ProfilePage.vue` | `ProfilePage.scss` | `src/content/profile.ts` |
| FriendsPage | `src/pages/FriendsPage.vue` | `FriendsPage.scss` | `src/content/friends.ts` |
| HelpPage | `src/pages/HelpPage.vue` | `HelpPage.scss` | `src/content/help.ts` |

**Required changes per screen:**

`src/pages/[Name]Page.vue` — replace existing stub with:
```vue
<script setup lang="ts">
import { [name]Content } from '@/content/[name]'
</script>

<template>
  <div class="p-[name]">
    <h1 class="visually-hidden">{{ [name]Content.title }}</h1>
    <!-- stub -->
  </div>
</template>

<style lang="scss" src="./[Name]Page.scss" />
```

`src/pages/[Name]Page.scss` — replace existing stub with:
```scss
.p-[name] {
  background: $wf-base;
  color: $wf-text-pri;
  min-height: 100vh;
}
```
Note: existing stubs have a hardcoded `12px` label — remove it entirely.

`src/content/[name].ts` — create (does not yet exist):
```ts
export const [name]Content = {
  title: '[Screen Name]',
} as const
```

These 6 content files must also be re-exported from `src/content/index.ts`.

---

## Agent Responsibilities

| Agent | Files |
|---|---|
| Backend | `index.html`, `_colours.scss`, `_sizes.scss`, `_typography.scss` |
| Frontend | `AppLogo.vue/.scss`, `SplashPage.scss`, `AuthPage.vue/.scss`, 6 × `[Name]Page.vue/.scss`, 6 × `src/content/[name].ts` |
| QA | Build, type-check, SCSS audit, component structure, accessibility, browser validation |

---

## Out of Scope

- No changes to game logic, stores, services, or router
- No wireframe-level layout for the 6 stub screens (they are placeholders only)
- No changes to `AppHeader`, `AppNav`, or any other shared components beyond `AppLogo`
- No changes to element colours or `$wf-danger`
