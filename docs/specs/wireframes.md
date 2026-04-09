# Weatherform Wireframes — Design Spec

**Date:** 2026-04-07
**Status:** Approved
**Scope:** All 8 app screens, both mobile (390px) and desktop (1280px) breakpoints

---

## 1. Context

Weatherform is an async multiplayer chess variant with elemental armies. Three elements — Tide, Gale, Dune — form an RPS triangle. Players commit to a mono-elemental army (a "set") before each game. Each piece type has a unique ability determined by its element (18 abilities total across 6 piece types × 3 elements).

The wireframes cover the full screen surface area required to play and manage the game.

---

## 2. Design System

### Colours

| Token      | Hex       | Use                          |
|------------|-----------|------------------------------|
| Ink        | `#050C14` | Page / frame backgrounds     |
| Base       | `#0D1B2A` | Card / list row backgrounds  |
| Raised     | `#142236` | Elevated surfaces, hover     |
| Panel      | `#1E3550` | Sidebar panels, avatars      |
| Border     | `#2A4A6B` | All borders and dividers     |
| Text Pri   | `#F0F6FF` | Headings, labels             |
| Text Sec   | `#A8C4D8` | Body copy, descriptions      |
| Text Muted | `#5A8099` | Section labels, metadata     |
| Brand Teal | `#2DD4BF` | Primary CTA, active states   |

**Element colours:**

| Element | Base       | Accent     |
|---------|------------|------------|
| Tide    | `#0077B6`  | `#00B4D8`  |
| Gale    | `#CBD5E1`  | `#F1F5F9`  |
| Dune    | `#A84510`  | `#D96728`  |

### Typography

All text uses the system monospace/sans stack. Key scale (at standard DPI):

| Role           | Size  | Weight | Treatment             |
|----------------|-------|--------|-----------------------|
| Screen title   | 11px  | 700    | Uppercase, 1px spacing |
| Section label  | 8px   | 700    | Uppercase, 1.5px spacing, muted |
| Body           | 10px  | 400    | —                     |
| Sub / metadata | 8px   | 400    | Muted colour          |
| Micro / tag    | 7px   | 400    | Muted, caps           |

### Spacing & Shape

- Border radius: `6px` (cards/rows), `12px` (desktop frames), `22px` (mobile phone frame)
- Standard card padding: `9–12px` vertical, `12–14px` horizontal
- Gap between sections: `12–16px`

### Design System Base
- Bootstrap (latest version)

---

## 3. Navigation Chrome

**Mobile & Desktop — global header:**
- Left: app logo / back button (screen-dependent)
- Centre: screen title (uppercase, letter-spaced)
- Right: Friends icon button + Profile icon button (32×32px, `#0D1B2A` background, `#2A4A6B` border; Profile has teal border to indicate active user)

No bottom tab bar at the global level; the Game Menu has its own bottom navigation element for primary game actions.

---

## 4. Screens

### 4.1 Splash

Single centred composition on the Ink background.

- **Logo mark:** Circular emblem, segmented into three arcs coloured Tide/Gale/Dune, separated by thin dark gaps, with a small inner ring
- **Wordmark:** `WEATHERFORM` in Brand Teal, 18px, heavy weight, letter-spaced
- **Tagline:** `Elemental Chess. Async Multiplayer.` in Text Muted, 10px
- **Loading indicator:** Three small dots beneath the tagline, animated (pulsing in element colours)
- **Version:** `v0.1.0` bottom-centre in Text Muted, micro

No interactive elements — auto-transitions to Auth or Game Menu.

---

### 4.2 Auth

Split-panel layout on desktop; stacked on mobile.

**Mobile:**
- Top half: logo mark + wordmark + tagline + element chips (TIDE / GALE / DUNE)
- Bottom half: Sign In / Create Account tab toggle, email + password fields, primary action button, "Forgot password?" link

**Desktop:**
- Left panel (fixed width ~240px): logo mark, wordmark only (no tagline or element chips)
- Right panel: auth form (same fields as mobile, slightly larger)

**Form details:**
- Input fields: `#0D1B2A` background, `#2A4A6B` border, `#F0F6FF` text, `#5A8099` placeholder
- Primary button: `#2DD4BF` background, `#050C14` text, full-width
- Error state: border shifts to `#E05A5A`; error message below field in `#E05A5A`

---

### 4.3 Game Menu

The primary home screen after authentication.

**Structure:**
- Global header (logo left, Friends + Profile icons right)
- Current Games section: list of active/waiting games, each showing opponent avatar, element chip, turn indicator, and Play / Waiting button
- Empty state: illustrated prompt with New Game + Join Game CTAs
- **Bottom navigation bar** (Spotify/Netflix style): New Game | [app logo] | Set Manager — always visible; tapping triggers respective flows

**Game row (active / waiting):**
- Opponent avatar with element-coloured ring
- Opponent display name + game status badge (`YOUR TURN` in teal; `WAITING` muted)
- Players can open Waiting games to view the board (read-only)
- `Play` / `Open` button (right-aligned, teal CTA / muted secondary)

**Desktop:** Current games displayed as a two-column grid of cards; bottom nav becomes a persistent sidebar or remains as a bottom bar.

---

### 4.4 Game Screen

Full-board chess experience with integrated HUD.

**Mobile (Hearthstone-style):**
- Board fills the full screen width
- Top gradient overlay: opponent info (avatar + element ring, display name, HP bar, turn timer)
- Bottom gradient overlay: player info (avatar + element ring, display name, HP bar) + ability button
- Move log accessible via a modal (triggered from a small icon/button)

**Desktop:**
- Board centred in the content area, scaled to fill available space
- **Floating dock** (macOS-dock style, bottom-centre): ability button, timer display, move log button, resign button — `rgba(13,27,42,0.92)` background, `border-radius:16px`, subtle drop shadow. Dock sits below the board in document flow (not `position:absolute`) to prevent overlap.
- Player/opponent info panels sit outside the board at top and bottom edges

**Board:**
- Standard 8×8 chess grid
- Dark squares: `#0D1B2A`; Light squares: `#142236`
- Correct alternating pattern: dark when `(row + col) % 2 === 1` (a1 = bottom-left = dark)
- Piece icons rendered as text characters or SVG

---

### 4.5 Set Manager

Create and manage elemental army sets.

**Structure:**
- Element selector: segmented control — TIDE | GALE | DUNE (selecting changes the ability list below)
- Ability list: 6 rows (Pawn, Knight, Rook, Bishop, Queen, King), each showing:
  - Piece icon
  - Count badge (`×8` / `×2` / `×1`)
  - Ability name (element-dependent)
  - Effect description (e.g., `Slow · 1 turn`)
- Army total: `16 pieces total` summary line below the ability list
- **Save Set** button (primary teal CTA, full-width)
- Saved sets list below: each row shows set name, element chip, and edit/delete actions
- In-use sets show a lock icon and cannot be deleted

**Mobile:** Single-column scroll. **Desktop:** Two-column — ability editor left, saved sets list right.

---

### 4.6 Profile

Account management and app info.

**Structure:**
- Avatar: circular, initial letter, teal ring (no photo upload in V1)
- Display name + player tag (e.g., `StormWalker#4821`) — tag is read-only, derived from display name
- **Account section:** Display Name (editable), Email (editable)
- **App section:** FAQ / Support, Game Manual, Terms of Service, Privacy Policy (all chevron rows)
- **Account Actions:** Sign Out, Delete Account (destructive red, requires confirmation dialog)
- App version: `Weatherform v0.1.0` (bottom of avatar column on desktop; footer on mobile)

**Desktop:** Left panel = avatar + version; Right panel = settings sections.

---

### 4.7 Friends

View and manage the friend list.

**Structure:**
- Search bar at top: `Add by player tag…` placeholder
- **Pending section:** incoming friend requests with Accept / Decline actions; badge shows count
- **Friends section:** confirmed friends list with Challenge + Block per row
- Avatar rings reflect the friend's most-used element colour; neutral grey when unknown
- Challenge button opens the New Game modal pre-filled with the selected friend as opponent

**Friend row layout:**
- *Top row:* avatar (28px circle with element ring) + display name + player tag
- *Second row:* action buttons (`padding-left: 36px` to align under the name text)

**Desktop:** Two-column split — Pending (left) and Friends (right).

---

### 4.8 Help

In-app reference guide.

**Structure:**
- **Element Advantage:** RPS triangle displayed as three rows — `TIDE › DUNE`, `GALE › TIDE`, `DUNE › GALE`, each with `×1.5 dmg` callout
- **Abilities:** Element tabs (TIDE / GALE / DUNE); selected tab shows 6 piece rows (piece + count + ability name)
- **Rules Overview:** 4-bullet quick reference (turn loop, timer/forfeit, win condition, mono-elemental model)
- **FAQ / Support:** tappable row (mobile) / footer button (desktop)

**Desktop:** Persistent left sidebar nav with sections — Reference (Element Advantage, Abilities, Rules Overview), Getting Started (How to Play, Building a Set), Support (FAQ, Game Manual). Right pane shows selected content; Element Advantage is the default.

---

## 5. Wireframe Artifacts

HTML mockups (mobile + desktop) are saved in:

```
.superpowers/brainstorm/71657-1775578387/content/
  set-manager.html
  profile.html
  friends.html
  help.html
```

Earlier screens (Splash, Auth, Game Menu, Game Screen) were produced in a prior brainstorm session:

```
.superpowers/brainstorm/66835-1775535955/content/
  (splash, auth, game-menu, game-screen files)
```

---

## 6. Open Questions / V2 Considerations

- Move log: currently a modal; consider a persistent collapsible panel on desktop in V2
- Ability tooltips: full effect text on long-press (mobile) / hover (desktop) — not yet wired in wireframes
- Online presence indicators on friend avatars (green dot) — not included in V1
- Set naming: free-text input not shown in current wireframes, assumed present in save flow
- Notification badges on Friends / Profile header icons — not included in V1
