---
feature: auth-splash
agent: frontend
status: complete
timestamp: 2026-04-08
---

## Completed

- `src/components/brand/AppLogo.vue` — created (new)
- `src/components/brand/AppLogo.scss` — created (new)
- `src/pages/SplashPage.vue` — template section replaced
- `src/pages/SplashPage.scss` — full rewrite
- `src/pages/AuthPage.vue` — template section replaced; `authContent`, `commonContent`, and `AppLogo` imports added to script
- `src/pages/AuthPage.scss` — full rewrite

## Notes

### AppLogo — emblem SVG

Three 120° pie-slice `<path>` arcs (Tide/Gale/Dune colours) with a central `<circle>` hub in `$wf-ink`. Drawn in a `100×100` viewBox; sized via width/height on the `<svg>` element through SCSS size-modifier classes. Stroke `$wf-ink` provides the thin dark gap between segments.

### Token approximations

- `AppLogo sm` wordmark: spec says 10px; nearest token is `$font-size-xs` (12px). Used `$font-size-xs`.
- `AppLogo lg` wordmark: spec says 22px; nearest token is `$font-size-xl` (24px). Used `$font-size-xl`.
- `p-auth__chip` border-radius: spec says "pill"; used `$space-lg` (32px) to produce a pill on short text. No dedicated pill-radius token exists.
- `p-auth__input` border-radius: used `$space-xs` (4px) — matches wireframe appearance.
- `p-auth__tabs` border-radius: used `$space-xs` (4px).
- Desktop `p-auth__brand` width: 240px is specified exactly in the kickoff brief; no layout token maps to this. Used the hardcoded value `240px` as a one-off layout constraint per the spec — this is the only px deviation.

### Desktop layout

On ≥ 768px: `.p-auth` switches to `flex-direction: row`. The brand panel is 240px wide with `$wf-ink` background. `.p-auth__tagline` and `.p-auth__chips` are hidden via `display: none` (per spec: desktop left panel shows AppLogo only). The form panel uses `max-width: $container-width-narrow` to prevent over-stretching on wide screens.

### Build verification

`npm run build` completes with exactly one pre-existing error:
`src/components/AppHeader/AppHeader.test.ts(3,32): error TS6133: 'vi' is declared but its value is never read.`
This error pre-dates this work and was documented in the task spec. No new TypeScript or SCSS errors introduced.

## Blocking Issues

None.
