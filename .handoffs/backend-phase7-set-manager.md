---
feature: phase7-set-manager
agent: backend
status: complete
timestamp: 2026-04-16
---

completed:
  types:
    - SavedSet interface added to src/types/abilities.ts
    - ELEMENT_ABILITY_ORDER constant added to src/types/abilities.ts (maps Element → AbilitySet, slot order PAWN/KNIGHT/ROOK/BISHOP/QUEEN/KING)
    - Both re-exported from src/types/index.ts
  stores:
    - src/stores/useSetStore.ts — Pinia setup store with:
        savedSets: ref<SavedSet[]> (hydrated from localStorage 'wf_sets')
        activeSetId: ref<string | null> (hydrated from localStorage 'wf_active_set')
        saveSet(name, element, abilities) → SaveSetResult ({ success, error? })
        deleteSet(id) — removes by id; clears activeSetId if it was the active set
        setActive(id) — marks a set as active, persists to localStorage
  tests:
    - src/stores/useSetStore.test.ts — 19 tests, all pass

contract_for_frontend:
  types_available:
    - "import type { SavedSet, AbilitySet } from '@/types/abilities'"
    - "import type { SavedSet } from '@/types'"
    - "import { ABILITY_REGISTRY, ELEMENT_ABILITY_ORDER } from '@/types'"
    - "import { ELEMENT_ABILITY_ORDER } from '@/types/abilities'"
  store_state:
    - savedSets: SavedSet[]         — reactive list of persisted sets
    - activeSetId: string | null    — id of the "In use" set
  store_actions:
    - saveSet(name: string, element: Element, abilities: AbilitySet): SaveSetResult
        Returns { success: true } or { success: false, error: string }
        Validation error strings come from setManagerContent (no need to import separately)
    - deleteSet(id: string): void
    - setActive(id: string): void
  notes:
    - ELEMENT_ABILITY_ORDER[element] gives the default AbilitySet for any element
    - ABILITY_REGISTRY keyed by ability id — filter with Object.values(ABILITY_REGISTRY).filter(a => a.element === element) for the list view
    - Ability slot order for rows (PAWN→index 0 … KING→index 5) matches ELEMENT_ABILITY_ORDER tuple positions
    - activeElement in the component should use uppercase Element type ('TIDE'|'GALE'|'DUNE'), not lowercase — the existing stub uses lowercase keys ('tide'|'gale'|'dune') which will need reconciling in the template

blocked_on: null
