---
feature: brand-stubs
agent: frontend
status: complete
timestamp: 2026-04-08
---

## Completed pages

All 6 stub pages replaced with brand-correct scaffolds:

- `GameMenuPage.vue` + `GameMenuPage.scss`
- `GamePage.vue` + `GamePage.scss`
- `SetManagerPage.vue` + `SetManagerPage.scss`
- `ProfilePage.vue` + `ProfilePage.scss`
- `FriendsPage.vue` + `FriendsPage.scss`
- `HelpPage.vue` + `HelpPage.scss`

## Test results

All 22 tests pass (`npm run test:run`). Each page's test confirms the `h1` renders the correct title string from the content module.

```
Test Files  10 passed (10)
      Tests  22 passed (22)
```

Router injection warnings appear in stderr for pages that use `useRouter()` (GameMenuPage, SetManagerPage, ProfilePage, FriendsPage, HelpPage) — these are expected because the test harness does not provide a router. The warnings do not cause test failures.

GamePage does not call `useRouter()` so it renders without warnings.

## What each page includes

### GameMenuPage
- AppHeader + BottomNav wired to router navigation
- "Your Games" section heading (eyebrow)
- Empty state with heading, body copy, New Game and Join Game CTAs
- Desktop layout: max-width container

### GamePage
- Opponent info bar (avatar, name, HP bar)
- 8×8 board grid with correct dark/light tile pattern (`(boardRow + boardCol) % 2 === 1` = dark)
- Self info bar
- Floating dock: Ability, timer display, Move Log, Resign buttons
- Desktop: dock gets rounded panel treatment

### SetManagerPage
- AppHeader with back button
- Element selector tabs (TIDE / GALE / DUNE) with element-colour accent on active
- Ability list (6 piece rows: icon, count badge, piece name, ability placeholder)
- Army total line
- Save set form (name input + Save Set CTA)
- Saved sets section with empty state
- Desktop: two-column grid (editor left, saved sets right)

### ProfilePage
- AppHeader with back button
- Avatar circle with teal ring and initial letter
- Account section: Display Name, Email, Player Tag field rows with edit actions
- App section: FAQ / Support, Game Manual, Terms of Service, Privacy Policy chevron rows
- Account Actions: Sign Out + Delete Account (danger)
- Version string below avatar
- Desktop: left column (avatar + version) / right column (sections)

### FriendsPage
- AppHeader with back button
- Search input + Add button
- Pending section with empty state
- Friends section with empty state (heading + body copy)
- Desktop: full-width with max-width container

### HelpPage
- AppHeader with back button
- Desktop sidebar nav: Reference (Element Advantage, Abilities, Rules Overview), Getting Started (How to Play, Building a Set), Support (FAQ, Game Manual)
- Sidebar hidden on mobile; shown at ≥768px as left column
- Content panes for all 5 sections, default: Element Advantage
- Element Advantage: 3 matchup rows with ×1.5 dmg label + explanatory note
- Abilities: element tab switcher
- Rules Overview: bulleted list from `helpContent.rulesOverview.bullets`
- How to Play: body copy paragraph
- Building a Set: body copy + "Open Set Manager" CTA linking to `/sets`

## Conventions applied

- All copy imported from `@/content` barrel — no hardcoded strings in templates
- All colours via `$wf-*` tokens; all spacing via `$space-*`; all type sizes via `$font-size-*`
- No `<style>` blocks in `.vue` files — all styles in paired `.scss` files
- No `@import` at top of SCSS files — Vite auto-injects `_settings.scss`
- `.wf-type-*` semantic classes applied for headings, eyebrows, body copy, labels, captions
- Page root classes use `p-` prefix; component root classes use `c-` prefix
- Bootstrap utility classes used where applicable (`list-unstyled`, `visually-hidden`)

## Items for follow-up

- **Router warnings in tests:** Pages using `useRouter()` emit Vue warnings in the test environment. If test coverage expands beyond the heading assertion, consider providing a stub router via `global.plugins` in the test setup.
- **GameMenuPage BottomNav copy:** The BottomNav component has hardcoded "New Game" / "Set Manager" strings in its template. The copy agent should update it to use content tokens from `gameMenuContent.bottomNav.*`.
- **Ability data not yet available:** `SetManagerPage` and `HelpPage` ability sections show placeholder dashes. These need real ability data wired in once the game engine types are defined.
- **Active user state not connected:** ProfilePage shows a hardcoded "W" initial and placeholder "—" values. These need to be wired to `useAuthStore` when the store provides user profile data.
- **No router instance in tests:** Tests render pages without Vue Router. If interactive navigation needs testing, the test helpers will need to provide `createRouter` / `createMemoryHistory`.
