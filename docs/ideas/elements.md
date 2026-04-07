# Elements

> **Purpose:** Complete specification of the elemental system. Authoritative reference for combat resolution, visual presentation, and set design.

---

## The Three Elements

| Element | Flavor         | Color            |
|---------|----------------|------------------|
| Tide    | Overwhelms     | Deep blue / ocean blue |
| Gale    | Scours         | White / silver   |
| Dune    | Absorbs        | Sandy gold       |

---

## Advantage Triangle

```
        TIDE
       /    \
   beats      loses to
     |              |
    GALE  ——beats——  DUNE
```

| Attacker | Beats  | Loses To |
|----------|--------|----------|
| Tide     | Gale   | Dune     |
| Gale     | Dune   | Tide     |
| Dune     | Tide   | Gale     |

**Flavor rationale:**
- Tide overwhelms Gale — water's mass and momentum snuffs wind
- Gale scours Dune — wind strips and erodes sand
- Dune absorbs Tide — sand soaks up and diffuses flooding water

---

## Damage Multipliers

All multipliers are stored as integers ×100. Results are always `Math.floor()`'d — deterministic across all environments.

| Matchup              | Multiplier | Integer value |
|----------------------|------------|---------------|
| Advantage (beats)    | 1.5×       | 150           |
| Mirror (same element)| 1.0×       | 100           |
| Disadvantage (loses) | 0.5×       | 50            |

**Formula:**
```
finalDamage = Math.floor(rawDamage × elementMultiplier / 100)
```

There is no neutral matchup — with only three elements and no neutral option, every cross-element combat is either 150 or 50.

---

## Visibility

Element is **always visible**. A piece's appearance — color, texture, and visual treatment — reflects its element. There is no hidden information mechanic around elements.

Both players see each other's element choice from the moment the game begins.

---

## No Neutral Element

By design, every piece has both a strength and a weakness. There is no safe or neutral option. This is intentional:

- Forces commitment — picking an element is a meaningful strategic decision
- Creates asymmetric matchups at the army level (like picking a race in StarCraft)
- Eliminates passive play styles built around avoiding engagement

---

## Future: Ability Choice Layer

In V1, each piece type has one fixed ability per element (see [`abilities.md`](abilities.md)).

A future version will offer 3 ability options per piece type per element — one offensive, one defensive, one supportive — selectable in the Set Manager. The system is designed to support this expansion without structural changes.
