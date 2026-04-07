# Screens

> **Purpose:** Full app screen flow and UI specification. Describes each screen's purpose, content, and states.

---

## Screen Flow

```
Splash → Auth → Game Menu → (Game Screen | Set Manager | Profile | Friends | Help)
```

---

## 1. Splash Screen

Displayed on app launch.

- Black background
- White publisher "presents" text (animated)
- Developer logo placement
- Transitions automatically to Auth

---

## 2. Authentication Screen

Entry point for all users.

**Content:**
- Game logo / title
- Create account form:
  - Display name
  - Player tag — camelCased/trimmed version of display name + `#0000` (4-digit suffix)
  - Email address
- Sign in form
- Forgot password flow
- Standard auth behaviour (validation, errors, loading states)

**Future:**
- MFA support

---

## 3. Game Menu Screen

Main hub post-authentication. Contains the game logo/title consistent with the Auth screen.

**States / Navigation:**

| Item | Type | Description |
|------|------|-------------|
| New Game | Modal | Create a public or private game. Private games use a unique code or friend invite. Future: play vs. computer. |
| Join Game | Modal | Join a public game, enter a code, or accept an invitation from the invitations list. |
| Current Games | List | All active games. Each item shows: opponent, whose turn it is, days remaining before turn timer expires. |
| Set Manager | Screen link | Navigate to Set Manager. |
| Profile | Icon link | Profile icon (top or bottom corner — Gmail/Spotify/Instagram pattern). |
| Friends | Icon link | Adjacent to Profile icon. |

---

## 4. Profile Screen

Account management and app settings.

**Content:**
- Manage account: change display name, email address
- Delete account
- Terms of Service / Privacy Policy links
- App version information
- FAQ / Support / Game Manual link
- Sign out

**Future:**
- Manage / fund account
- Customize app appearance
- Purchase history

---

## 5. Friends Screen

View and manage the player's friend list.

**Content:**
- Friend list with options per friend:
  - Invite / block
  - Challenge to a game
- View match history or win rate against a friend (future)

---

## 6. Game Screen

The active game view.

**Board:**
- Standard 8×8 chess board
- Player's own pieces always displayed at the bottom regardless of color assignment (same orientation as real-life chess — two players sitting across from each other)
- Piece appearance reflects element (color and visual treatment)
- Contested tiles render both pieces side-by-side at reduced scale

**Header:**
- Whose turn it is
- Turn timer countdown (time remaining before auto-forfeit)

**Footer:**
- End Turn button
- Toggle buttons for modals:
  - Replay controls
  - Move log

**Future:**
- Player emotes / reactions (e.g., Hearthstone-style) — TBD

---

## 7. Set Manager Screen

Pre-game set configuration. Accessible from Game Menu.

**Content:**
- Create / name a set
- Choose element (Tide / Gale / Dune)
- View the ability assigned to each piece type for that element
- Save set
- List of saved sets (edit / delete)

**V1:** Element choice is the only configuration — abilities are fixed per element.

**Future:** Ability choice per piece type (O/D/S options) once V1 ability set is proven.

See [`set-manager.md`](set-manager.md) for full set configuration rules.

---

## 8. Game Help Screen

Reference for new and returning players.

**Content:**
- Rules overview (movement, combat, elements, abilities)
- Getting started guide (creating a game, inviting friends)
- Element advantage quick reference
- Ability list per element
- FAQ / Support link
