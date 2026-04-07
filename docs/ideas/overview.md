# Weatherform — Overview

> **Purpose:** Entry point for developers and AI agents starting cold. Read this first, then follow the links to each topic file.

---

## What Is Weatherform?

Weatherform is an async multiplayer chess variant where each player's army is bound to a natural element — Tide, Gale, or Dune. Elements form a rock-paper-scissors advantage triangle that creates army-level strategic commitment, while piece abilities and chess movement create the tactical layer.

Players take turns asynchronously (over hours or days), managed through accounts, game invites, and turn timers.

---

## Design Philosophy

**Commit to a force, win through tactics.**

The core design reference is StarCraft: you pick a race before the game starts and cannot change it. Your element is your race. The macro question (which element beats theirs?) is answered at setup. The micro question (how do I win this game with what I have?) is answered during play.

This means:
- No neutral element — every piece has a strength and a weakness
- Element advantage is army-wide, not piece-by-piece
- Depth comes from ability use, positioning, and chess movement — not from counter-picking individual pieces

---

## How It Differs from Weatherform-0.0

| Aspect | Weatherform-0.0 | Weatherform (this) |
|--------|-----------------|---------------------|
| Players | Local 2-player | Async multiplayer with accounts |
| Elements | 6 (FIRE/WATER/EARTH/AIR/LIGHTNING/NEUTRAL) | 3 (Tide/Gale/Dune) |
| Set model | Per-piece element assignment | Mono-elemental (one element per army) |
| Ability scope | 6 fixed abilities (one per piece type) | 18 abilities (one per piece type per element) |
| Persistence | localStorage | Server-side (auth, game state, notifications) |
| Turn flow | Synchronous, local | Async with turn timer + auto-forfeit |

---

## File Index

| File | What It Covers |
|------|---------------|
| [`elements.md`](elements.md) | Element triangle, colors, multipliers, visibility |
| [`abilities.md`](abilities.md) | The 18 V1 abilities (one per piece type per element) |
| [`game-rules.md`](game-rules.md) | Turn flow, movement, combat, status effects, win conditions |
| [`set-manager.md`](set-manager.md) | How players build and configure a set |
| [`screens.md`](screens.md) | Full app screen flow and UI spec |
| [`technical-decisions.md`](technical-decisions.md) | Architecture decisions (what's inherited, what's new) |
| [`influences.md`](influences.md) | Gameplay and artistic references that inform design decisions |
