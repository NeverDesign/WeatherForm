---
feature: auth-splash
agent: orchestrator
status: complete
timestamp: 2026-04-08
---

## Brief Summary

Build the Splash and Auth screens end-to-end: types, store, service stubs, UI copy, Vue templates, and SCSS. Design is locked — wireframes exist and the brand spec is approved.

---

## Screens

### 1. Splash Screen (`/` → SplashPage.vue)

Single centred composition. No user interaction — auto-redirects to `/auth` after a short timer.

**Components on screen:**
- `AppLogo` (large, centred) — circular tri-arc emblem + WEATHERFORM wordmark
- Tagline — "Elemental Chess. Async Multiplayer." (text muted)
- Loading dots — three animated dots beneath tagline, pulsing in Tide/Gale/Dune colours
- Version string — `v0.1.0` bottom-centre, micro text muted

### 2. Auth Screen (`/auth` → AuthPage.vue)

Entry point for all users. No global header chrome — this is a standalone auth layout.

**Components on screen:**
- `AppLogo` (size varies by breakpoint — see layout section)
- Tagline (mobile only in top half)
- Element chips — TIDE / GALE / DUNE (mobile top half and desktop left panel)
- Tab toggle — SIGN IN / CREATE ACCOUNT (switches active form in place, no route change)
- Sign In form: email + password fields, "Forgot password?" link, submit button
- Create Account form: display name + player tag (auto, read-only) + email + password fields, submit button
- Validation error messages per field (shown below field)
- Generic API error message (shown above submit button)

**Mobile layout (< 768px):**
- Top half: `AppLogo` (medium) + tagline + element chips (TIDE / GALE / DUNE)
- Bottom half: tab toggle + active form + submit button + forgot password link

**Desktop layout (≥ 768px):**
- Left panel (~240px, fixed, Ink background): `AppLogo` only (wordmark + emblem, no tagline, no chips)
- Right panel: tab toggle + active form + submit button + forgot password link

---

## Entities and Shape

Defined in `src/types/auth.ts`:

```ts
interface Account {
  id: string
  displayName: string
  playerTag: string       // e.g. "StormWalker#4821" — auto-generated, read-only
  email: string
}

interface AuthState {
  account: Account | null
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  displayName: string
  email: string
  password: string
}
```

**Player tag derivation:** camelCase of display name + `#` + 4-digit suffix (e.g. `StormWalker#4821`). Tag is auto-generated server-side; shown as read-only in the Create Account form.

---

## Interactions

### Splash
1. On mount: start a timer (2–3 seconds)
2. Timer fires: `router.push('/auth')` (or `/menu` if already authenticated)

### Auth
1. **Tab toggle:** clicking SIGN IN or CREATE ACCOUNT switches the active form ref; no route change, no page reload
2. **Field validation (on blur + on submit):**
   - Display Name: required, 2–32 chars
   - Email: required, valid email format
   - Password: required, min 8 chars
   - Player Tag: not user-editable; displayed as read-only
3. **Create Account submit:** calls `authStore.register(credentials)` — shows loading state, handles error
4. **Sign In submit:** calls `authStore.login(credentials)` — shows loading state, handles error
5. **Success (both forms):** store sets `account`, redirect to `/menu`
6. **Forgot password link:** placeholder only in V1 (no flow implemented)

---

## Constraints

- **No real backend yet.** Auth service is stubs only. Service methods return mock data after a short artificial delay. Each stub must have a `// STUB: replace with real API` comment.
- **Brand teal `#2DD4BF` = `$wf-teal`.** Use this token everywhere — never hardcode hex.
- **Error input border = `#E05A5A`.** Check whether a `$wf-danger` token exists; if it does, use it. If not, note the missing token in your handoff.
- **No `<style>` blocks in `.vue` files.** All SCSS goes in the paired `.scss` file.
- **No hardcoded hex or px values in SCSS.** Use `$wf-*` colour tokens and `$space-*` / `$font-size-*` size tokens only.
- **No inline styles** (`style=""` attributes) in Vue templates.
- **All UI strings from `src/content/`.** No prose hardcoded in templates.
- **Bootstrap first.** Use utility classes before writing custom SCSS.
- **`_settings.scss` is auto-injected** — do not import it manually in component SCSS.

---

## AppLogo Component

Reusable across Splash (large) and Auth (medium/small). Lives at:
- `src/components/brand/AppLogo.vue`
- `src/components/brand/AppLogo.scss`

**Props:** `size` — accepts `'sm' | 'md' | 'lg'` (default `'md'`).

**Visual spec (from wireframes + design spec):**
- **Emblem:** Circular shape segmented into three arcs — Tide (blue `$wf-tide-base`), Gale (silver `$wf-gale-base`), Dune (terracotta `$wf-dune-base`) — separated by thin dark gaps, with a small inner ring. CSS-only or SVG — no image asset.
- **Wordmark:** `WEATHERFORM` in `$wf-teal`, Cinzel or system font fallback, uppercase, letter-spaced, heavy weight.

---

## Wireframe Reference

The approved wireframes for Splash + Auth are at:

```
.superpowers/brainstorm/28889-1775232715/content/onboarding-screens.html
```

This file contains four mockups:
1. Splash — Mobile (black bg, centred logo, loading dots)
2. Auth — Mobile (Sign In tab active)
3. Auth — Mobile (Create Account tab active, shows player tag as read-only)
4. Auth — Desktop (left brand panel + right form panel)

Note: The wireframe uses placeholder colours (`#4a9eff`, `#060c14`). **Always substitute with correct `$wf-*` tokens** per the design spec in `docs/specs/wireframes.md`.

---

## Unknowns / Decisions Deferred

- `$wf-danger` token: may not exist yet. If missing, Frontend should note it in their handoff; do not add to `_colours.scss` without confirming with human.
- Splash timer duration: 2 seconds is reasonable; can be a constant in the script.
- Forgot password route/flow: not in scope for V1. Link renders but does nothing (or logs a console note).
- Studio "presents" text on Splash: the wireframe shows "A game by / STUDIO NAME" — this is placeholder. Omit entirely from V1 implementation; just show the logo and tagline.
- Password field on Create Account: wireframe omits it; the final spec implies it's required. Include it.

---

## Blocking Questions

None. Proceed.
