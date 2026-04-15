---
feature: style-guide
agent: frontend
status: complete
timestamp: 2026-04-12
---

## Completed
- src/pages/StyleGuidePage.vue
- src/pages/StyleGuidePage.scss

## Notes
- The page is a self-contained scrollable reference at `/styles` (router already wired).
- Dynamic swatch colours use the `--swatch-color` CSS custom property pattern via `:style` binding; `--bar-width` used the same way for spacing bars.
- `specimenClasses()` helper in the script handles the BEM modifier case: `wf-type-eyebrow--card` needs both the base class and modifier applied so the SCSS compound selector resolves correctly.
- Element display names in Section 6 use `--element-color` CSS variable to override `wf-type-display` colour per element.
- AppHeader and BottomNav are shown in bordered preview frames (not wrapping the whole page); two AppHeader variants shown (default and showBack).
- No `@import` statements in the SCSS — all tokens auto-injected by Vite.
- `$font-size-xxs` used for swatch labels and element swatch labels (compact density required).

## Blocking Issues
none
