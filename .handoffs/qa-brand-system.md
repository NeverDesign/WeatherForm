---
feature: brand-system
agent: qa
status: fail
timestamp: 2026-04-09
---

## Summary

5 issues found across 3 checks (build passes, type check passes, all 22 tests pass; failures are inline styles, hardcoded content strings, and an unlabelled form input).

## Build
- [PASS] npm run build — exits 0, 77 modules transformed
- [PASS] vue-tsc --noEmit — exits 0, no type errors

## Tests
- [PASS] AppLogo.test.ts — 4/4
- [PASS] AppHeader.test.ts — 6/6
- [PASS] BottomNav.test.ts — 4/4
- [PASS] AuthPage.test.ts — 2/2
- [PASS] GameMenuPage.test.ts — 1/1
- [PASS] GamePage.test.ts — 1/1
- [PASS] SetManagerPage.test.ts — 1/1
- [PASS] ProfilePage.test.ts — 1/1
- [PASS] FriendsPage.test.ts — 1/1
- [PASS] HelpPage.test.ts — 1/1
- Total: 22/22 tests passing

## SCSS
- [PASS] No hardcoded hex colors — none (all hex values are in `_colours.scss` as token definitions, which is correct)
- [FAIL] Spacing tokens used — 5 violations in pre-existing component SCSS (AppHeader.scss: `padding: 10px 14px`, `gap: 8px`; BottomNav.scss: `padding: 8px 16px`, `gap: 4px`, `padding: 4px 12px`)
- [PASS] No @import in component SCSS — none
- [FAIL] No inline styles — 2 violations in GamePage.vue (lines 11 and 42: `style="width: 100%"`)
- [PASS] No `<style>` blocks in .vue files — all `<style lang="scss" src="...">` declarations are external file references (correct pattern)

### Additional SCSS findings (warnings, not hard failures per playbook grep scope)
- AppHeader.scss uses raw px for font-size (11px, 14px), width/height (32px, 80px), border-radius (6px), letter-spacing (1px) — pre-existing, not introduced in this work
- BottomNav.scss uses raw px for font-size (8px), letter-spacing (0.8px), width/height (36px) — pre-existing
- All 6 new page SCSS files use `border-radius: 6px` and various fixed dimension px values (24px, 36px, 56px, 80px, 100px, 240px, 480px, 560px, 220px) not covered by spacing tokens
- `_typography.scss` line 103: `letter-spacing: 0.3px` — raw px in global token file
- Note: `$font-size-xxs` (8px) used in `BottomNav.scss` as a literal `8px` (raw value, not the token). This is in a compact game UI context so it would be a warning regardless, but it uses the literal value rather than the token.

### Extra checks
- [PASS] `$wf-teal` completely removed — zero matches in src/
- [PASS] No hardcoded font family strings in SCSS — zero matches

## Component Structure
- [PASS] All .vue/.scss pairs present — none missing
  - `App.vue` has no paired .scss (correct — it contains only `<RouterView />` with no styles)
- [PASS] Correct class prefix conventions — components use `c-`, pages use `p-`
- [PASS] `.wf-type-*` classes defined in `_typography.scss` (9 classes: logo, display, heading, eyebrow, eyebrow--card, body-lg, body, label, caption) and used across all 6 new pages

## Accessibility
- [PASS] All images have alt text — no `<img>` elements in the codebase; inline SVGs use `aria-hidden="true"` where decorative
- [FAIL] Interactive elements labelled — 1 violation: FriendsPage search input has no `<label>`, no `aria-label`, and no `id` — only a `:placeholder` binding
- [PASS] Heading hierarchy correct — all 8 pages have exactly one `<h1>` (visually hidden); subheadings use h2 only, no skips
- [PASS] No tabindex > 0 — none found

## Content
- [FAIL] UI strings from content files — 3 hardcoded prose strings in templates:
  1. `GamePage.vue` line 9: `"Opponent"` — player name label, should come from `gameContent`
  2. `GamePage.vue` line 40: `"You"` — player name label, should come from `gameContent`
  3. `BottomNav.vue` lines 8 and 17: `"New Game"` and `"Set Manager"` — button labels; noted as a known follow-up item in the frontend handoff (`frontend-pages-brand.md`)

---

## Failures (for Orchestrator routing)

| File | Line | Issue | Responsible Agent |
|------|------|-------|-------------------|
| src/pages/GamePage.vue | 11 | `style="width: 100%"` — inline style on HP bar fill (should use a CSS class or scoped variable) | frontend |
| src/pages/GamePage.vue | 42 | `style="width: 100%"` — inline style on HP bar fill (should use a CSS class or scoped variable) | frontend |
| src/pages/GamePage.vue | 9 | Hardcoded prose string `"Opponent"` — must come from `gameContent` | copy + frontend |
| src/pages/GamePage.vue | 40 | Hardcoded prose string `"You"` — must come from `gameContent` | copy + frontend |
| src/components/BottomNav/BottomNav.vue | 8 | Hardcoded prose string `"New Game"` — must come from a content module | copy + frontend |
| src/components/BottomNav/BottomNav.vue | 17 | Hardcoded prose string `"Set Manager"` — must come from a content module | copy + frontend |
| src/pages/FriendsPage.vue | 17 | Search `<input>` has no `<label>`, no `aria-label`, no `id` — only a placeholder | frontend |

---

## Build Quality Score

| Check | Score | Max | Notes |
|-------|-------|-----|-------|
| npm run build | 15 | 15 | Exits 0 |
| vue-tsc --noEmit | 10 | 10 | Exits 0 |
| Tests pass | 15 | 15 | 22/22 tests pass |
| SCSS compliance | 0 | 15 | 7 violations (2 inline style + 5 raw px spacing): 15 − (3 × 7) = −6, floored at 0 |
| Component structure | 10 | 10 | All .vue/.scss pairs present, correct prefixes |
| Accessibility | 10 | 15 | 1 failing item (unlabelled input): 15 − (5 × 1) = 10 |
| Content coverage | 0 | 10 | Hardcoded strings present — fail |
| Browser validation | 0 | 10 | Not run (no Playwright available) |
| **Total** | **60** | **100** | |

---

## Notes for Orchestrator

The inline `style=""` violations and hardcoded content strings were pre-existing in some cases (BottomNav is a pre-existing component) or are placeholder stubs that were intentionally not connected to live data (GamePage player names are placeholder text pending store wiring). The frontend handoff explicitly flagged the BottomNav copy as a follow-up item for the copy agent.

Recommended routing:
1. **Copy agent** — add `gameContent.hud.playerNames.opponent` and `gameContent.hud.playerNames.self` strings, add nav labels to a content module (e.g. `navContent` or `gameMenuContent.bottomNav`)
2. **Frontend agent** — replace inline `style="width: 100%"` in GamePage HP bars with a CSS class for the default full state; replace hardcoded strings in GamePage and BottomNav with content tokens; add `aria-label` or `<label>` to FriendsPage search input; replace raw px values in page SCSS with tokens where token equivalents exist
