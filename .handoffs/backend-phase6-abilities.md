---
feature: phase6-abilities
agent: backend
status: complete
timestamp: 2026-04-16
---

completed:
  types:
    - src/types/abilities.ts
      - EffectType — discriminated union: DAMAGE | FREEZE | POISON | BURN | STUN | SHIELD | REFLECT
      - Ability — id, name, element, description, cooldown, effectType, effectValue
      - AbilitySet — tuple of 6 ability id strings
      - ABILITY_REGISTRY — Record<string, Ability> with all 18 abilities
  tests:
    - src/types/abilities.test.ts — 23 tests, all pass
      - Registry completeness (total count, per-element count, named id checks)
      - Shape validation (id self-match, non-empty fields, valid element/effectType)
      - Cooldown range (integer, 1–5 inclusive)
      - EffectValue sanity (positive integer, calibrated ranges per effectType)
      - JSON-safety (round-trip + structuredClone)
      - Spot-checks on 3 specific abilities

contract_for_frontend:
  types_available:
    - "import type { EffectType, Ability, AbilitySet } from '@/types'"
    - "import { ABILITY_REGISTRY } from '@/types'"
  ability_lookup: "ABILITY_REGISTRY[abilityId] — O(1) by id string"
  ability_id_format: "ELEMENT_SNAKE_NAME — e.g. TIDE_SURGE_STRIKE, GALE_EYE_OF_THE_STORM"
  ability_set_shape: "Tuple [string, string, string, string, string, string] — one id per piece slot"
  element_grouping: "Filter ABILITY_REGISTRY by ability.element for Set Manager display"

blocked_on: null
