---
feature: not-found
agent: frontend
status: complete
timestamp: 2026-04-10
---

## Completed
- src/pages/NotFoundPage.vue — 404 page template
- src/pages/NotFoundPage.scss — page styles

## Notes
- `.wf-type-display` is applied to the 404 code element for font family, tracking, and weight, then `color` is overridden to `$wf-teal` and `font-size` is overridden to `$font-size-xxxl` in the paired SCSS rule — both via token, no hardcoded values.
- No AppHeader is used; the page is a standalone escape-hatch centred on the full viewport.
- The container uses Bootstrap's `.container-narrow` class to constrain content width, matching the spec.
- CTA click handler calls `router.push(ROUTES.MENU)` inline in the template per the spec.

## Blocking Issues
none
