# Brand Typography Implementation — Design Spec

**Date:** 2026-04-08
**Status:** Approved
**Scope:** Token layer, font loading, semantic type scale classes. Does not retroactively apply classes to existing pages/components.

---

## 1. Font Family Tokens

New `$wf-font-*` variables are added to `_sizes.scss`. These are the canonical references — everything else points to them.

```scss
$wf-font-standard: 'DM Sans', system-ui, -apple-system, sans-serif;
$wf-font-accent:   'Cinzel', Georgia, serif;
$wf-font-mono:     'Fira Code', 'Courier New', monospace;
```

The existing aliases are updated to point to the new variables so nothing currently referencing them breaks:

```scss
$font-standard: $wf-font-standard;
$font-serif:    $wf-font-accent;
$font-mono:     $wf-font-mono;
```

`_settings.scss` Bootstrap override `$font-family-base` is updated to `$wf-font-standard`.

---

## 2. Font Loading

DM Sans and Cinzel are loaded via Google Fonts in `index.html`. Cinzel was previously referenced in `AppLogo.scss` but not loaded; DM Sans was absent entirely.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
```

The `opsz` axis on DM Sans enables optical sizing, improving legibility at small sizes (8–10px eyebrow text).

---

## 3. Semantic Type Scale Classes

Added to `_typography.scss`. These are additive — they do not modify existing Bootstrap heading styles. Components opt in explicitly.

All `$wf-font-accent` (Cinzel) levels include `text-transform: uppercase`. Colors use existing `$wf-text-*` and `$wf-accent` tokens.

| Class | Font | Size | Weight | Tracking | Line height | Color token |
|---|---|---|---|---|---|---|
| `.wf-type-logo` | `$wf-font-accent` | 36px | 900 | 5px | 1 | `$wf-accent` |
| `.wf-type-display` | `$wf-font-accent` | 22px | 700 | 3px | — | `$wf-text-pri` |
| `.wf-type-heading` | `$wf-font-accent` | 15px | 600 | 2px | — | `$wf-text-pri` |
| `.wf-type-eyebrow` | `$wf-font-accent` | 10px | 600 | 2.5px | — | `$wf-text-muted` |
| `.wf-type-eyebrow--card` | `$wf-font-accent` | 8px | 600 | 2px | — | `$wf-text-muted` |
| `.wf-type-body-lg` | `$wf-font-standard` | 15px | 400 | — | 1.65 | `$wf-text-sec` |
| `.wf-type-body` | `$wf-font-standard` | 13px | 400 | — | 1.6 | `$wf-text-sec` |
| `.wf-type-label` | `$wf-font-standard` | 12px | 700 | 0.3px | — | `$wf-text-pri` |
| `.wf-type-caption` | `$wf-font-standard` | 10px | 500 | — | — | `$wf-text-muted` |

---

## 4. AppLogo Update

`AppLogo.scss` currently hardcodes `'Cinzel'` as the font-family string. It is updated to reference `$wf-font-accent` so the component is token-driven. Visual output is unchanged.

---

## Files Changed

| File | Change |
|---|---|
| `src/assets/styles/_sizes.scss` | Add `$wf-font-standard`, `$wf-font-accent`, `$wf-font-mono`; update aliases |
| `src/assets/styles/_settings.scss` | Update `$font-family-base` to `$wf-font-standard` |
| `src/assets/styles/_typography.scss` | Add `.wf-type-*` semantic classes |
| `index.html` | Add Google Fonts preconnect + stylesheet links |
| `src/components/brand/AppLogo.scss` | Replace hardcoded `'Cinzel'` with `$wf-font-accent` |

---

## Out of Scope

- Applying `.wf-type-*` classes to existing pages and components — that is a separate pass.
- Updating `$font-size-*` tokens (unchanged).
- Any visual changes beyond font family and type scale.
