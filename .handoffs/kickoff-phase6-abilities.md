---
feature: phase6-abilities
agent: orchestrator
status: complete
timestamp: 2026-04-16
---

brief: >
  Phase 6 defines all 18 abilities (6 per element) as TypeScript types and a
  complete ABILITY_REGISTRY constant. The ability design already exists in
  docs/ideas/abilities.md and is authoritative. This phase makes that design
  machine-readable so Phase 7 (Set Manager) and the game UI can reference real
  ability data. The reducer's USE_ABILITY handler is already a stub and is NOT
  touched here.

screens: []

entities:
  EffectType: "discriminated union — 'DAMAGE' | 'FREEZE' | 'POISON' | 'BURN' | 'STUN' | 'SHIELD' | 'REFLECT'"
  Ability:
    id: "string — format: ELEMENT_SNAKE_NAME e.g. TIDE_SURGE_STRIKE"
    name: "string — 1-2 word evocative name"
    element: "Element — TIDE | GALE | DUNE"
    description: "string — one sentence, what it does in-game"
    cooldown: "number (integer, 1–5 turns)"
    effectType: "EffectType"
    effectValue: "number (integer only, calibrated to STARTING_HP = 100)"
  AbilitySet: "string[] — array of 6 ability IDs chosen for a player's game"
  ABILITY_REGISTRY: "Record<string, Ability> — all 18 abilities keyed by id"

interactions:
  - "Phase 7 Set Manager reads ABILITY_REGISTRY to display choosable abilities"
  - "Game UI reads ABILITY_REGISTRY by id to show ability name/description/cooldown in dock"
  - "Reducer reads abilityCooldowns keyed by ability id (already exists in PlayerState)"

constraints:
  - "Effect values are integers only — no floats"
  - "Cooldowns must be integers 1–5 inclusive"
  - "Exactly 6 abilities per element, 18 total"
  - "Ability id format: ELEMENT_SNAKE_NAME e.g. TIDE_SURGE_STRIKE, GALE_GUST_STRIKE"
  - "Re-export ABILITY_REGISTRY and AbilitySet from src/types/index.ts"
  - "Do NOT touch gameReducer.ts — USE_ABILITY wiring is deferred to after Phase 7"
  - "Integer math: STARTING_HP = 100; damage values should be meaningful fractions of that"
  - "Plain JSON — no class instances"

unknowns:
  - "Defensive ability effectValues (SHIELD, REFLECT) are design estimates; balance is deferred"

sequence:
  - copy
  - backend

source_of_truth:
  - "docs/ideas/abilities.md — complete ability design, all 18 abilities defined"
  - "docs/ideas/game-rules.md — status effect mechanics (BURN/POISON/FREEZE/STUN)"
  - "src/types/game.ts — PlayerState.abilityCooldowns shape"
  - "src/stores/useGameStore.ts — STARTING_HP = 100"
