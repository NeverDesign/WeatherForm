# Session: Phase 6 — Ability Design + Types
**Date:** 2026-04-16
**Agents:** orchestrator, copy (handoff authored by orchestrator from design docs), backend (executed by orchestrator)
**QA result:** PASS — 179 tests pass, build exits 0

## What Was Built

All 18 abilities (6 per element — TIDE, GALE, DUNE) are now defined as a fully-typed TypeScript registry. The `EffectType` discriminated union, `Ability` interface, and `AbilitySet` tuple type are exported from `src/types/index.ts`. The `ABILITY_REGISTRY` constant maps ability id to `Ability` for O(1) lookup. The ability design was sourced directly from `docs/ideas/abilities.md`, which already contained complete names, effects, and mechanical intent for all 18 slots. No reducer changes were made — USE_ABILITY wiring is deferred to after Phase 7.

## Files

| File | Agent | Action |
|------|-------|--------|
| `src/types/abilities.ts` | backend | Created — EffectType, Ability, AbilitySet, ABILITY_REGISTRY |
| `src/types/abilities.test.ts` | backend | Created — 23 tests covering completeness, shape, ranges, JSON-safety |
| `src/types/index.ts` | backend | Edited — re-exports EffectType, Ability, AbilitySet, ABILITY_REGISTRY |
| `.handoffs/kickoff-phase6-abilities.md` | orchestrator | Created |
| `.handoffs/copy-abilities.md` | orchestrator | Created — ability table for all 18 abilities |
| `.handoffs/backend-phase6-abilities.md` | backend | Created |
| `docs/plans/implementation-plan.md` | orchestrator | Phase 6 marked [x] done |

## Git Commit

Subject: `feat: add ability types and ABILITY_REGISTRY for all 18 abilities (Phase 6)`

Body:
- Add `src/types/abilities.ts` with EffectType discriminated union, Ability interface, AbilitySet tuple, and ABILITY_REGISTRY constant containing all 18 abilities (6 per element)
- Add `src/types/abilities.test.ts` with 23 tests — registry completeness, shape validation, cooldown range, effectValue sanity, JSON round-trip safety
- Re-export EffectType, Ability, AbilitySet, ABILITY_REGISTRY from `src/types/index.ts`
- Mark Phase 6 done in `docs/plans/implementation-plan.md`

**Awaiting user approval before committing.**

## Deferred

- USE_ABILITY reducer wiring — the reducer placeholder already exists; effect resolution connects to the registry in a later pass after Phase 7
- AbilitySet stored per player — currently typed but not persisted; Phase 7 (Set Manager) adds localStorage persistence
- Balance pass — effectValues are design estimates; real tuning happens during playtesting

## Uncertainty Log

- `AbilitySet` is typed as a fixed-length tuple `[string, string, string, string, string, string]` with implied order matching PAWN/KNIGHT/ROOK/BISHOP/QUEEN/KING piece slots. The Phase 6 spec said "array of 6 chosen ability IDs" without specifying ordering convention. Tuple ordering is documented in the file comment; Phase 7 Set Manager will confirm or revise.
- Combo abilities (TIDE_FLOOD_VENOM, GALE_TEMPEST_STRIKE, DUNE_QUICKSAND_VENOM) apply both direct damage (25) and a status effect — the registry stores only the status effectValue. The direct damage component is implicit in the design doc and will need an explicit field or convention when USE_ABILITY is wired in the reducer. Deferred to that phase.
- SHIELD (TIDE_WHIRLPOOL_AURA, GALE_EYE_OF_THE_STORM) vs REFLECT (DUNE_DUNE_AURA) are mechanically distinct but both use SHIELD/REFLECT EffectType. The reducer will need to branch on effectType when implementing defensive auras.
