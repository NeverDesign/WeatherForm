# Set Manager

> **Purpose:** Defines how players build, configure, and save their sets. The Set Manager is a pre-game feature — sets are created outside of active games and selected at game creation.

---

## What Is a Set?

A set is a named configuration that defines the elemental identity and ability loadout of a player's 16-piece army. Players can create multiple sets and choose which to use when starting a new game.

---

## Set Composition

Every game uses a standard 16-piece army:

| Piece Type | Count |
|------------|-------|
| Pawn       | 8     |
| Rook       | 2     |
| Knight     | 2     |
| Bishop     | 2     |
| Queen      | 1     |
| King       | 1     |
| **Total**  | **16**|

---

## Element Assignment — Mono-Elemental Model

A set has **one element** that applies to the entire army. This is chosen once when creating the set and cannot be changed mid-game.

| Choice | Effect |
|--------|--------|
| Tide   | All 16 pieces are Tide — deep blue appearance, Tide abilities |
| Gale   | All 16 pieces are Gale — white/silver appearance, Gale abilities |
| Dune   | All 16 pieces are Dune — sandy gold appearance, Dune abilities |

This is a deliberate design commitment — like picking a race in a strategy game. The element choice is the macro-strategic decision; piece movement and abilities handle the rest.

---

## V1 Ability Configuration

In V1, each piece type has one fixed ability per element. The player's element choice determines all 6 abilities — there is nothing further to configure.

See [`abilities.md`](abilities.md) for the full ability list.

**Example: A Tide set**
| Piece  | Ability        |
|--------|----------------|
| Pawn   | Surge Strike   |
| Knight | Riptide Charge |
| Rook   | Tidal Slam     |
| Bishop | Undertow       |
| Queen  | Flood Venom    |
| King   | Whirlpool Aura |

---

## Future: O/D/S Ability Choice

In a future version, each piece type will offer 3 ability options — one offensive, one defensive, one supportive. The player selects one per piece type when configuring the set.

**Design requirement for V1:** The Set Manager UI must be built to accommodate this expansion — even though V1 only displays one ability per piece type (no choice UI needed yet). The data model should include an ability slot per piece type that can be populated from a list, not hardcoded.

---

## Set Visibility

Sets are **not hidden**. Once a game begins, both players can see each other's element choice via piece appearance. There is no element-reveal mechanic or hidden information layer.

---

## Set Management

- Players can create, name, edit, and delete sets.
- Multiple sets can be saved simultaneously.
- When starting or joining a game, the player selects which saved set to use.
- A set cannot be edited while it is in use in an active game.

---

## Set Manager Screen

The Set Manager is accessible from the Game Menu. See [`screens.md`](screens.md) for the full screen flow and UI spec.
