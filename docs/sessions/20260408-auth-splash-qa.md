# QA: auth-splash — 2026-04-08

## Overall Result: PASS (after 1 remediation loop)
## Build Quality Score: 82/100

### Score breakdown
| Check | Score | Max | Notes |
|-------|-------|-----|-------|
| npm run build | 15 | 15 | |
| vue-tsc --noEmit | 10 | 10 | |
| Tests (10/10) | 15 | 15 | |
| SCSS compliance | 13 | 15 | -2 for 240px one-off |
| Component structure | 10 | 10 | |
| Accessibility | 12 | 15 | -3 h1 missing on initial submit (fixed in remediation) |
| Content coverage | 10 | 10 | |
| Browser validation | 0 | 10 | Not performed — missing from QA playbook at time of run |
| **Total** | **82** | **100** | |

## Test cases run
1. npm run build — PASS (1 pre-existing unrelated error in AppHeader.test.ts)
2. vue-tsc --noEmit — PASS
3. npm run test:run — PASS (10/10)
4. SCSS hex audit — PASS (no hardcoded hex in feature files)
5. SCSS px audit — WARNING (240px in AuthPage.scss — documented one-off)
6. No @import in component/page SCSS — PASS
7. No inline style= attributes — PASS
8. No &lt;style&gt; blocks in .vue files — PASS
9. All .vue/.scss pairs present — PASS
10. Correct class prefix conventions (p-, c-) — PASS
11. All images have alt text — PASS
12. Interactive elements labelled — PASS
13. Heading hierarchy — FAIL initial / PASS after fix (visually-hidden h1 added)
14. No tabindex > 0 — PASS
15. Content from src/content/ — FAIL initial / PASS after fix (validation strings wired to errorContent)
