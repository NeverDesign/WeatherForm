---
feature: phase6-abilities
agent: copy
status: complete
timestamp: 2026-04-16
---

# Ability Names and Descriptions

Source of truth: `docs/ideas/abilities.md`
All 18 abilities are defined below, ready for backend to encode in ABILITY_REGISTRY.

---

## TIDE Abilities (6)

Theme: overwhelming, flooding, eroding. Control and attrition.

| id                    | name             | description                                                                 | effectType | effectValue | cooldown |
|-----------------------|------------------|-----------------------------------------------------------------------------|------------|-------------|----------|
| TIDE_SURGE_STRIKE     | Surge Strike     | A rushing wave of force deals direct damage to the target.                  | DAMAGE     | 15          | 1        |
| TIDE_RIPTIDE_CHARGE   | Riptide Charge   | A fast, hard-hitting charge deals heavy direct damage to the target.        | DAMAGE     | 20          | 2        |
| TIDE_TIDAL_SLAM       | Tidal Slam       | The weight of water immobilizes the target, locking it in place for 2 turns. | FREEZE    | 2           | 3        |
| TIDE_UNDERTOW         | Undertow         | Slow corrosion eats away at the target, dealing 8 damage per turn for 2 turns. | POISON  | 8           | 3        |
| TIDE_FLOOD_VENOM      | Flood Venom      | A devastating strike deals 25 damage and poisons the target for 10 damage per turn for 2 turns. | POISON | 10 | 4 |
| TIDE_WHIRLPOOL_AURA   | Whirlpool Aura   | Creates a damaging field around the King; any piece that attacks it takes 10 chip damage. | SHIELD | 10 | 5 |

---

## GALE Abilities (6)

Theme: sharp, fast, disorienting. Disruption and burst.

| id                    | name               | description                                                                     | effectType | effectValue | cooldown |
|-----------------------|--------------------|---------------------------------------------------------------------------------|------------|-------------|----------|
| GALE_GUST_STRIKE      | Gust Strike        | A quick, light strike deals direct damage to the target.                        | DAMAGE     | 15          | 1        |
| GALE_CYCLONE_CHARGE   | Cyclone Charge     | A disorienting spin on impact stuns the target, skipping its next action.       | STUN       | 1           | 3        |
| GALE_WIND_SLAM        | Wind Slam          | Concentrated gale force stops the target cold, stunning it for 1 turn.          | STUN       | 1           | 2        |
| GALE_TAILWIND         | Tailwind           | Friction and scorched air ignites the target, dealing 8 damage per turn for 2 turns. | BURN  | 8           | 3        |
| GALE_TEMPEST_STRIKE   | Tempest Strike     | A storm surge deals 25 damage and burns the target for 10 damage per turn for 2 turns. | BURN | 10 | 4 |
| GALE_EYE_OF_THE_STORM | Eye of the Storm   | Calm at the center — reduces incoming damage to adjacent friendly pieces by 10 for 2 turns. | SHIELD | 10 | 5 |

---

## DUNE Abilities (6)

Theme: heavy, smothering, patient. Sustained pressure and entrapment.

| id                    | name               | description                                                                     | effectType | effectValue | cooldown |
|-----------------------|--------------------|---------------------------------------------------------------------------------|------------|-------------|----------|
| DUNE_SAND_STRIKE      | Sand Strike        | A gritty, grinding blow deals direct damage to the target.                      | DAMAGE     | 15          | 1        |
| DUNE_DUNE_CHARGE      | Dune Charge        | A suffocating assault poisons the target, dealing 8 damage per turn for 2 turns. | POISON    | 8           | 3        |
| DUNE_BEDROCK_SLAM     | Bedrock Slam       | Crushing weight stuns the target, preventing it from acting this turn.           | STUN       | 1           | 2        |
| DUNE_SANDSTORM        | Sandstorm          | Abrasive heat scours the target, dealing 8 damage per turn for 2 turns.          | BURN       | 8           | 3        |
| DUNE_QUICKSAND_VENOM  | Quicksand Venom    | The target sinks and is trapped — takes 25 damage and is frozen for 2 turns.     | FREEZE     | 2           | 4        |
| DUNE_DUNE_AURA        | Dune Aura          | Absorbs incoming force and reflects 10 damage back to any attacker.              | REFLECT    | 10          | 5        |

---

## EffectType Notes

| effectType | Meaning in registry |
|------------|-------------------|
| DAMAGE     | Direct hit — effectValue is the integer damage dealt |
| FREEZE     | Locks target — effectValue is duration in turns |
| POISON     | Ongoing — effectValue is integer damage per turn (duration = 2 turns fixed) |
| BURN       | Ongoing — effectValue is integer damage per turn (duration = 2 turns fixed) |
| STUN       | Skips action — effectValue is duration in turns |
| SHIELD     | Defensive — effectValue is the integer damage absorbed/reflected per hit |
| REFLECT    | Defensive — effectValue is the integer damage returned to attacker |

---

## Calibration Notes

- STARTING_HP = 100
- Basic damage strikes: 15 (tier 1), 20 (tier 2), 25 (tier 3 with status)
- DOT effects: 8 per turn × 2 turns = 16 total (before element multipliers)
- Defensive effectValues: 10 (chip/reflect/shield) — meaningful but not overpowered
- All values are integers — no floats

blocked_on: null
needs_brand_input: []
