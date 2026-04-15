# Project Configuration — WeatherForm

Agents grep for their section rather than reading this whole file.
- Backend: grep `## Backend`
- Frontend: grep `## Frontend`
- Design: grep `## Design`
- QA: grep `## QA`
- Orchestrator: grep `## Orchestration`

---

## Orchestration

**Agents available:** orchestrator, backend, frontend, design, copy, qa

**Standard sequence:**
1. design (if new UI)
2. backend (parallel with design when data shape is clear)
3. copy (after design)
4. frontend (after design + backend + copy)
5. qa (always last)

**Handoffs:** `.handoffs/[role]-[feature].md`
**Session summaries:** `docs/sessions/`
**Specs:** `docs/specs/` — wireframes.md (Approved), brand-guidelines.md (Working concept)
**Plans:** `docs/plans/`

---

## Stack

- Frontend: Vue 3 + TypeScript
- Build: Vite
- State: Pinia (setup store style only — not options API)
- Router: Vue Router
- Styling: Bootstrap 5 + SCSS
- Testing: Vitest + @testing-library/vue
- Type check: vue-tsc

```bash
npm run dev          # Dev server
npm run build        # Type-check + production build (vue-tsc && vite build)
npm run test         # Vitest watch mode
npm run test:run     # Vitest single-run (CI)
npx vitest run src/components/Foo/Foo.test.ts  # Single file
```

---

## Backend

### Directory Layout
```
src/
├── types/          — TypeScript interfaces and constants
├── stores/         — Pinia setup stores
├── composables/    — Reusable reactive logic
├── services/       — API clients and external service wrappers
└── router/
    └── index.ts    — Route definitions
```

### Order of Work
Types → Store → Service → Script setup
Define types before any implementation. Types are the contract with the frontend agent.

### Type File Pattern
```ts
// src/types/[feature].ts
export interface FeatureItem {
  id: string
  // fields...
}
export interface FeatureState {
  items: FeatureItem[]
  selected: FeatureItem | null
  loading: boolean
  error: string | null
}
```

### Pinia Store Pattern (setup style only)
```ts
// src/stores/use[Feature]Store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FeatureItem } from '@/types/feature'
import { featureService } from '@/services/featureService'

export const useFeatureStore = defineStore('feature', () => {
  const items = ref<FeatureItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => items.value.length)

  async function fetchItems() {
    loading.value = true
    error.value = null
    try {
      items.value = await featureService.getAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, itemCount, fetchItems }
})
```

### Service Pattern
Thin wrappers over fetch. No reactive state. Typed errors.
```ts
// src/services/[feature]Service.ts
export const featureService = {
  async getAll(): Promise<FeatureItem[]> {
    const res = await fetch('/api/[feature]')
    if (!res.ok) throw new Error(`Failed: ${res.status}`)
    return res.json()
  }
}
```

### Composable Pattern
```ts
// src/composables/use[Feature].ts
export function useFeature() {
  const store = useFeatureStore()
  onMounted(() => { if (!store.items.length) store.fetchItems() })
  return { items: store.items, loading: store.loading, error: store.error }
}
```

### Script Setup Pattern
```vue
<script setup lang="ts">
const props = defineProps<{ itemId: string; variant?: 'compact' | 'full' }>()
const emit = defineEmits<{ select: [item: FeatureItem]; close: [] }>()
</script>
```

### File Ownership
**Own:** `<script setup>` blocks, `src/composables/`, `src/stores/`, `src/services/`, `src/types/`, `src/router/index.ts`
**Never touch:** `<template>` blocks, `*.scss`, `src/assets/`, `src/content/`

---

## Frontend

### Directory Layout
```
src/
├── pages/          — PageNamePage.vue + PageNamePage.scss (flat, not nested)
├── components/     — ComponentName/ComponentName.vue + .scss + .test.ts
├── content/        — UI copy strings (exported as const)
└── assets/
    └── styles/     — _settings.scss, _colours.scss, _sizes.scss, main.scss
```

### Component Structure
- Every component: `ComponentName.vue` + `ComponentName.scss` in `src/components/ComponentName/`
- Always create both files together — never one without the other
- Component root class: `c-component-name`
- Page root class: `p-page-name`
- Page section class: `p-page-name__section`

### SCSS Rules (no exceptions)
- ❌ No hardcoded hex colours — use `$wf-*` tokens
- ❌ No hardcoded `px` for spacing — use `$space-*` tokens
- ❌ No `style=""` inline attributes (exception: truly runtime-dynamic values — add a comment)
- ❌ No `<style>` blocks inside `.vue` files — styles go in the paired `.scss`
- ❌ No `@import` in component SCSS — `_settings.scss` is auto-injected by Vite
- ✅ Bootstrap utilities first; custom SCSS only for what Bootstrap can't do

### Token Reference
```scss
// Colours
$wf-ink, $wf-base, $wf-raised, $wf-panel, $wf-border
$wf-text-pri, $wf-text-sec, $wf-text-muted
$wf-teal, $wf-danger
$wf-tide-base, $wf-tide-accent, $wf-tide-bg
$wf-gale-base, $wf-gale-accent, $wf-gale-bg
$wf-dune-base, $wf-dune-accent, $wf-dune-bg

// Spacing
$space, $space-xs, $space-sm, $space-md, $space-lg, $space-xl, $space-xxl, $space-xxxl

// Typography
$font-standard, $font-serif, $font-mono
$font-size-xs through $font-size-xxxl

// Layout
$container-width (1200px), $container-width-narrow (700px)
```

### Content Rules
- All UI strings live in `src/content/` — no hardcoded prose in templates
- Content files export `as const`
- Import and use; never write directly to content files (that's the copy agent's job)

### Routes
| Path | Name | Page |
|------|------|------|
| `/` | splash | SplashPage |
| `/auth` | auth | AuthPage |
| `/menu` | menu | GameMenuPage |
| `/game/:id` | game | GamePage |
| `/sets` | sets | SetManagerPage |
| `/profile` | profile | ProfilePage |
| `/friends` | friends | FriendsPage |
| `/help` | help | HelpPage |

Route name constants: `ROUTES` in `src/types/index.ts`

### File Ownership
**Own:** `<template>` blocks, all `*.scss` files, `src/assets/styles/`
**Read but never write:** `src/content/` (read to use; write is copy agent's domain)
**Never touch:** `<script setup>` blocks, composables, stores, services, types

---

## Design

### Approved Specs
- `docs/specs/wireframes.md` — **Approved.** Full wireframe spec for all 8 screens. Read before designing any screen.
- `docs/specs/brand-guidelines.md` — **Working concept.** Colour system, typography, art direction.

### Brand Summary
- Typography: Cinzel (display/logo, 600–900 weight, uppercase, letter-spaced) + DM Sans (body/UI, 400–700)
- Tone: Dark & Rich — Moebius, Wind Waker, Sea of Stars, Hearthstone
- Component prefix: `c-` (reusable), `p-` (page sections)

### Figma
Use Figma MCP (`get_design_context`, `generate_diagram`) if available.

### Screens Inventory
| Screen | Route | Status |
|--------|-------|--------|
| Splash | `/` | designed |
| Auth | `/auth` | designed |
| Menu | `/menu` | designed |
| Game | `/game/:id` | designed |
| Sets | `/sets` | designed |
| Profile | `/profile` | designed |
| Friends | `/friends` | designed |
| Help | `/help` | designed |

---

## QA

### Pass Thresholds (all must be true)
- `npm run build` exits 0
- `npx vue-tsc --noEmit` exits 0
- Zero hardcoded hex colours in SCSS
- Zero `style=""` inline attributes in templates
- Every `.vue` in `src/components/` has a paired `.scss`
- All `<img>` have `alt` attributes
- Each page has exactly one `<h1>`

### Quality Score (100 pts)
| Check | Points | Deduction |
|-------|--------|-----------|
| npm run build | 15 | -15 if fail |
| vue-tsc --noEmit | 10 | -10 if fail |
| npm run test:run | 15 | proportional |
| SCSS compliance | 15 | -3 per violation |
| Component structure | 10 | -5 per missing pair |
| Accessibility | 15 | -5 per failing item |
| Content coverage | 10 | -5 per hardcoded string |
| Browser validation | 10 | -10 if not run |

### Commands
```bash
npm run build
npx vue-tsc --noEmit
npm run test:run

# SCSS compliance
grep -rn "#[0-9a-fA-F]\{3,6\}" src --include="*.scss"
grep -rn 'style="' src --include="*.vue"

# Content coverage
grep -rn '"[A-Z][a-z ]\{10,\}"' src/components src/pages
```

### QA Does Not Fix
Routes failures to the correct agent with file, line, and fix instruction.
