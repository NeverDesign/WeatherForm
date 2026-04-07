# WeatherForm — Brand Guidelines Concept

> **Status: Working concept.** Colour and typography decisions are intentional but this document will evolve as the logo, visual assets, and Figma/Bootstrap design system are built. Treat as a design brief and reference, not a finished brand standard.

---

## Overview

WeatherForm is an async multiplayer chess variant with three elemental armies — Tide, Gale, and Dune. The brand should feel like a premium strategy game: serious enough to convey tactical depth, alive enough to convey elemental personality. The visual language draws from Moebius (flat, bold, elemental), Wind Waker (saturated, cel-shaded, timeless), and Sea of Stars (dark, rich, atmospheric), with UI clarity informed by Hearthstone.

---

## Tonal Direction

**Dark & Rich.** Deep midnight backgrounds, warm-tinted dark neutrals, gilded amber accent. Feels like a premium board game that also lives on a screen. Not grimdark — the element colours and amber accent keep it alive and warm.

---

## Colour System

### Backgrounds

| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#080F0C` | Deepest surface: navbar, splash, footers |
| Base | `#0F1A1E` | Default app background |
| Raised | `#17272D` | Cards, panels, modals |
| Panel | `#1F3540` | Secondary panels, input backgrounds |
| Border | `#2B4858` | Dividers, strokes, separators |

> The backgrounds carry a subtle warm-teal undertone (not pure navy) — this gives the dark surfaces a living, environmental feel rather than a flat digital darkness.

### Text

| Token | Hex | Use |
|-------|-----|-----|
| Primary | `#EEF2F0` | Headings, labels, primary body |
| Secondary | `#A3BDC0` | Supporting text, metadata, subtitles |
| Muted | `#587C80` | Placeholders, timestamps, disabled states |

### Brand Accent

The accent is used for the logo lockup, primary CTAs, active states, and brand highlights. It does not belong to any element — it is the game's identity colour.

| Token | Hex | Use |
|-------|-----|-----|
| Accent Dark | `#C4911A` | Pressed/active states |
| Accent | `#F7B731` | Primary buttons, logo background, active indicators |
| Accent Hover | `#FFCF5C` | Hover states |

### Element Colours

Each element has a base (used for pieces, primary element identity) and a light variant (used for glows, highlights, active states, and readable text on dark backgrounds).

| Element | Base | Light | Flavour |
|---------|------|-------|---------|
| Tide | `#0077B6` | `#00B4D8` | Ocean blue — overwhelms |
| Gale | `#CBD5E1` | `#F1F5F9` | Ice silver — scours |
| Dune | `#A84510` | `#D96728` | Deep terracotta — absorbs |

**Key constraint:** The brand accent (`#F7B731`) is warm amber, which is close to Dune's terracotta family. They must not be used in direct proximity without care — amber is the brand/UI layer, terracotta is Dune's piece identity. They are distinct enough in hue and saturation to coexist, but avoid placing them side-by-side in UI components.

---

## Typography

### Typefaces

| Role | Family | Weight | Notes |
|------|--------|--------|-------|
| Logo, display headings, element names, section labels | Cinzel | 900 (logo), 700 (display), 600 (heading) | Uppercase, generous letter-spacing. Draws on Roman inscription proportions — feels carved and elemental. |
| Body copy, UI labels, buttons, captions | DM Sans | 400 (body), 500 (UI), 700 (buttons/labels) | Friendly, sharp, highly legible at small sizes. |

### Type Scale (reference)

| Level | Family | Size | Weight | Tracking |
|-------|--------|------|--------|----------|
| Logo | Cinzel | 36px+ | 900 | 5px |
| Display | Cinzel | 22px | 700 | 3px |
| Heading | Cinzel | 15px | 600 | 2px |
| Section eyebrow | Cinzel | 9–10px | 600 | 2.5px |
| Body large | DM Sans | 15px | 400 | — |
| Body | DM Sans | 13px | 400 | — |
| UI label | DM Sans | 12px | 700 | 0.3px |
| Caption | DM Sans | 10px | 500 | — |

### Usage notes
- Cinzel is always uppercase. Do not use sentence case with Cinzel.
- Cinzel at small sizes (eyebrows, section labels) should be used sparingly — it carries visual weight even at 9px.
- DM Sans handles all running text, form inputs, button labels, and navigation links.
- The pairing creates a deliberate contrast: Cinzel establishes the world's identity, DM Sans keeps the interface human and readable.

---

## Art Direction

### Visual influences (in priority order)

1. **Moebius** — The primary tonal reference. Clean linework, bold flat colour, strange-but-grounded environments. Elemental landscapes (desert, ocean, sky) rendered with economy and authority.
2. **Wind Waker** — Cel-shading, bold outlines, expressive flat shading. Shows how strong outlines and limited colour can feel timeless and emotionally resonant.
3. **Sea of Stars** — Dark rich backgrounds, pixel-meets-painterly aesthetic. The closest reference for the overall UI mood.
4. **OlliOlli World** — Bold flat vector shapes, strong silhouettes. A reference for piece and character design energy.
5. **Adventure Time** — Elemental biomes defined by colour and shape language alone. Useful reference for board theme and seasonal variation.

### Shape language
- Prefer clean geometric forms with bold outlines
- Avoid gradients except for glow/aura effects on element abilities
- Rounded corners on UI elements (cards, buttons) — not sharp/angular, not pill-shaped
- Pieces should read clearly as silhouettes from above (top-down chess perspective)

### Board themes
Boards may be skinned seasonally (as in Advance Wars and Wargroove) or by environment. Each theme must:
- Remain legible — piece colours must maintain contrast against the board surface
- Not use element accent colours for board terrain (terrain is neutral world, elements are armies)
- Draw from the Moebius/Adventure Time palette logic: distinct environments defined by a limited, intentional colour set

---

## Future Directions

The following are explicitly out of scope for this concept document and will be developed separately:

- **Logo** — A wordmark and/or icon lockup using Cinzel + amber accent. To be generated and refined as a dedicated asset.
- **Piece design** — Top-down piece silhouettes per element. Visual language informed by Moebius linework and OlliOlli World silhouettes.
- **Board tile design** — Base tile set plus seasonal theme variants.
- **Figma file** — Full design system file mapping this concept to Bootstrap components for use in UI design. Will include colour tokens, typography styles, component specs, and layout grids.
- **Asset library** — Splash screens, splash art, app icon, social assets.

---

## Reference Images

All visual reference images are stored in [`/docs/influences/art/`](/docs/influences/art/).

Key images to consult when developing assets:
- `moebius-art-*.{jpg,png,webp}` — Tonal and linework reference
- `WindWaker-art_style-*.jpg` — Palette and cel-shading reference
- `SeaOfStars-splash.jpg` — Overall UI mood reference
- `OllieOllieWorld-art_style.jpg` — Shape and silhouette energy
- `AdventureTime-art-*.jpg` — Elemental biome colour logic
- `Hearthstone-gameboard-*.{jpg,webp}` — UI layout and board composition reference
