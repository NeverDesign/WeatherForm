# Session: 404 Not Found Page
**Date:** 2026-04-10
**QA Result:** PASS (97/100)

---

## What Was Built

A 404 Not Found page with a catch-all Vue Router route. Any unrecognised URL now renders a centred, on-brand error screen with a "Back to menu" CTA instead of a blank screen.

---

## Files Created / Modified

| File | Action | Description |
|---|---|---|
| `src/pages/NotFoundPage.vue` | Created | 404 page component; centred hero layout, no AppHeader |
| `src/pages/NotFoundPage.scss` | Created | Page styles using `$wf-*` tokens; scoped `.container-narrow` rule |
| `src/content/notFound.ts` | Created | UI copy: `code`, `heading`, `body`, `cta`, `meta.title` |
| `src/content/index.ts` | Modified | Added `export * from './notFound'` |
| `src/types/index.ts` | Modified | Added `NOT_FOUND: '/:pathMatch(.*)*'` to `ROUTES` constant |
| `src/router/index.ts` | Modified | Added catch-all route as last entry; imported `NotFoundPage` |

---

## Commit Notes

**Subject:** Add 404 Not Found page with catch-all route

- Add `NotFoundPage.vue` and `NotFoundPage.scss` — centred hero with 404 code, heading, body, and menu CTA
- Add `src/content/notFound.ts` with full UI copy; export from content barrel
- Add `NOT_FOUND` to `ROUTES` constant in `src/types/index.ts`
- Register `/:pathMatch(.*)*` catch-all route (last in router) pointing to `NotFoundPage`

---

## Known Limitations / Deferred

- `$wf-teal` is listed in `CLAUDE.md` as a canonical token but does not exist in `_colours.scss`. The 404 code uses `$wf-accent` (amber) instead. CLAUDE.md token documentation should be reconciled with the actual token file.
- No animation or illustration — the page is functional but minimal. A V2 pass could add the three-dot element animation from SplashPage or a decorative elemental motif.
