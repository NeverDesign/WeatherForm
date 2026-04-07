# Abilities

> **Purpose:** Defines the 18 V1 abilities — one per piece type per element. Names and flavor concepts are design intent and subject to revision. Damage values and precise status effect durations are to be balanced during development.

---

## Structure

Each ability has:
- **Name** — thematic to the element and piece role
- **Status effect** — the condition applied to the target on hit (if any)
- **Notes** — flavor or mechanical intent

Damage values are not defined here — they follow the same base-attack-per-piece-type model as weatherform-0.0, modified by the element multiplier at resolution time.

---

## Tide Abilities

*Theme: overwhelming, flooding, eroding. Tide abilities tend toward control and attrition.*

| Piece  | Ability Name   | Effect          | Notes |
|--------|----------------|-----------------|-------|
| Pawn   | Surge Strike   | Basic damage    | No status effect — Tide's expendable wave |
| Knight | Riptide Charge | Basic damage    | No status effect — fast and hard-hitting |
| Rook   | Tidal Slam     | FREEZE          | Weight of water immobilizes — locks a piece in place |
| Bishop | Undertow       | POISON          | Slow corrosion — ongoing damage over turns |
| Queen  | Flood Venom    | POISON + damage | High-damage strike that also poisons — Tide's most dangerous piece |
| King   | Whirlpool Aura | Defensive       | Creates a damaging field around the King; attackers take chip damage |

---

## Gale Abilities

*Theme: sharp, fast, disorienting. Gale abilities tend toward disruption and burst.*

| Piece  | Ability Name     | Effect          | Notes |
|--------|------------------|-----------------|-------|
| Pawn   | Gust Strike      | Basic damage    | No status effect — quick and light |
| Knight | Cyclone Charge   | STUN            | Disorienting spin on impact — skips the target's next action |
| Rook   | Wind Slam        | STUN            | Concentrated gale force — stops the target cold |
| Bishop | Tailwind         | BURN            | Friction and heat from scoured air |
| Queen  | Tempest Strike   | BURN + damage   | Storm surge — high damage and scorching |
| King   | Eye of the Storm | Defensive       | Calm at the center; reduces incoming damage for adjacent friendly pieces |

---

## Dune Abilities

*Theme: heavy, smothering, patient. Dune abilities tend toward sustained pressure and entrapment.*

| Piece  | Ability Name     | Effect          | Notes |
|--------|------------------|-----------------|-------|
| Pawn   | Sand Strike      | Basic damage    | No status effect — gritty, grinding |
| Knight | Dune Charge      | POISON          | Buried under sand — suffocating damage over time |
| Rook   | Bedrock Slam     | STUN            | Crushing weight — immobilizes on impact |
| Bishop | Sandstorm        | BURN            | Abrasive heat — sand scours exposed surfaces |
| Queen  | Quicksand Venom  | FREEZE + damage | Sinking and trapped — high damage, movement locked |
| King   | Dune Aura        | Defensive       | Absorbs and redistributes incoming force; reflects a portion of damage back to attacker |

---

## Status Effect Reference

| Effect | Mechanical Result                              | Removed When     |
|--------|------------------------------------------------|------------------|
| BURN   | Deals `damagePerTurn` to piece HP each turn    | `duration` → 0   |
| POISON | Deals `damagePerTurn` to piece HP each turn    | `duration` → 0   |
| FREEZE | `canActThisTurn` set to `false`                | `duration` → 0   |
| STUN   | Piece skips its action this turn               | `duration` → 0   |

Re-applying the same effect kind refreshes duration — effects do not stack.

---

## Future: O/D/S Ability Choice

In a future version, each cell in the table above becomes a choice of three: one offensive variant, one defensive variant, one supportive variant. The V1 ability for each slot is intended to be the balanced "default" that the future variants branch from.

See [`set-manager.md`](set-manager.md) for how this expansion is accommodated in the Set Manager UI.
