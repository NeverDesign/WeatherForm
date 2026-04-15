---
feature: auth-splash
agent: qa
status: pass
timestamp: 2026-04-08
---

## Summary

All checks passed. 0 failures across 7 runnable checks; Browser Validation (Check 6) could not be run due to sandbox restrictions on `npx` commands — scored 0/10 accordingly.

## Build
- [PASS] npm run build — exits with exactly one error: the pre-existing unused `vi` import in `src/components/AppHeader/AppHeader.test.ts`. No new type errors. Treated as PASS per the known pre-existing issue exclusion.
- [PASS] vue-tsc --noEmit — same output as above (vue-tsc is the first step of `npm run build`); only the pre-existing AppHeader.test.ts error.

## Tests
- 10/10 tests passed (2 test files)
  - `src/components/BottomNav/BottomNav.test.ts` — 4 passed
  - `src/components/AppHeader/AppHeader.test.ts` — 6 passed

## SCSS
- [PASS] No hardcoded hex colors — none in component/page SCSS; hex values appear only in `src/assets/styles/_colours.scss` (the token definition file, correct location)
- [PASS] Spacing tokens used — no `padding: Npx`, `margin: Npx`, or `gap: Npx` violations in any new SCSS files; existing violations in `AppHeader.scss` and `BottomNav.scss` pre-date this work
- [PASS] No @import in component SCSS — none found
- [PASS] No inline styles — no `style=""` attributes found in any .vue files
- [PASS] No <style> blocks in .vue files — all .vue files use `<style lang="scss" src="./FileName.scss" />` references only
- [WARN] `src/pages/AuthPage.scss` line 209: `width: 240px` — one-off layout constant from the kickoff spec with no matching token. Documented as intentional. WARNING, not FAIL.

## Component Structure
- [PASS] All .vue/.scss pairs present — none missing
- [PASS] Correct class prefix conventions — `c-app-logo` (component), `p-splash` (page), `p-auth` (page) all correct

## Accessibility
- [PASS] All images have alt text — no `<img>` elements found; AppLogo SVG has `aria-hidden="true"`, loading dots have `aria-hidden="true"`
- [PASS] Interactive elements labelled — all buttons have text content or `aria-label`; tab buttons in AuthPage have text content via content bindings
- [PASS] Heading hierarchy correct — SplashPage and AuthPage each have exactly one `<h1 class="visually-hidden">`, no other headings; no skips
- [PASS] No tabindex > 0 — none found
- [PASS] All form inputs have labels — all 6 inputs in AuthPage.vue use `for`/`id` pairing with associated `<label>` elements

## Content
- [PASS] UI strings from content files — no hardcoded English prose found in any template; all text is bound to `splashContent.*`, `authContent.*`, `commonContent.*`, or `errorContent.*`

---

## Changes Since Last QA Run — Verification

| Change | Expected | Verified |
|--------|----------|----------|
| `useAuthStore.ts` catch blocks use `errorContent.api.loginFailed` / `registrationFailed` | Hardcoded strings replaced | PASS — lines 18 and 29 use `errorContent.api.loginFailed` and `errorContent.api.registrationFailed` |
| `_sizes.scss` — new `$font-size-xxs: 0.5rem` token | Token added | PASS — line 12 of `_sizes.scss` |
| `AuthPage.scss` chip border-radius: `$space-xs` | Token used | PASS — line 35 |
| `AuthPage.scss` brand bg mobile: `$wf-base` | Token used | PASS — line 15 |
| `AuthPage.scss` active tab bg: `$wf-panel` | Token used | PASS — line 93 |
| `AuthPage.scss` label/tab/chip font-size: `$font-size-xxs` | Token used | PASS — lines 36, 84, 121 |

Previous warning resolved: `useAuthStore.ts` fallback error strings now route through `errorContent.api.*` — no longer a warning.

---

## Browser Validation (Check 6)

NOT RUN — the `npx playwright` commands required by the playbook could not be executed in the current sandbox environment (only `npm run ...` scripts are permitted). The preview server was started (`npm run preview` background task), but Playwright screenshot commands were denied.

Scoring: 0/10 per playbook rubric ("0 not run").

---

## Build Quality Score

| Check | Score | Max | Notes |
|-------|-------|-----|-------|
| npm run build | 15 | 15 | Only pre-existing error; treated as pass |
| vue-tsc --noEmit | 10 | 10 | Same — pre-existing error only |
| Tests pass | 15 | 15 | 10/10 tests passed |
| SCSS compliance | 15 | 15 | 0 violations (240px one-off is documented warning, not deducted) |
| Component structure | 10 | 10 | All pairs present, correct prefixes |
| Accessibility | 15 | 15 | 0 failing items |
| Content coverage | 10 | 10 | All strings from content files |
| Browser validation | 0 | 10 | Not run (sandbox restriction) |
| **Total** | **90** | **100** | |
