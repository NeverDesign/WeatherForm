---
feature: phase7-set-manager
agent: orchestrator
status: complete
timestamp: 2026-04-16
---

brief: >
  Wire the SetManagerPage stub to the real ABILITY_REGISTRY and add
  localStorage persistence for saved ability sets via a new Pinia setup store
  (useSetStore). No new copy strings are needed — all strings already exist
  in src/content/setManager.ts.

screens:
  - SetManagerPage: Element tab filter → ability rows with real data; save set
      form → persists to localStorage; saved sets list → real data with delete
      (inline confirm) and "In use" badge

entities:
  SavedSet:
    id: string        # nanoid or crypto.randomUUID()
    name: string      # 1–32 chars
    element: Element  # 'TIDE' | 'GALE' | 'DUNE'
    abilities: AbilitySet  # [string, string, string, string, string, string]

interactions:
  - "Click element tab → filter ABILITY_REGISTRY by element, show 6 rows ordered PAWN/KNIGHT/ROOK/BISHOP/QUEEN/KING"
  - "Click ability row → cycle selected ability (only 1 per slot currently — show as selected/active)"
  - "Type name + click Save Set → validate (required, ≤32 chars), saveSet(), clear form on success"
  - "Click Delete → show inline confirm row expansion → confirm → deleteSet(id)"
  - "Active set shows 'In use' badge when activeSetId matches"

constraints:
  - SavedSet type defined in src/types/abilities.ts, re-exported from src/types/index.ts
  - No modal components — inline confirm only (row expands with confirm/cancel)
  - All validation error strings from setManagerContent in src/content/setManager.ts
  - Pinia setup store style only — no options API
  - localStorage key: wf_sets (savedSets array) and wf_active_set (activeSetId)
  - Ability rows ordered: PAWN, KNIGHT, ROOK, BISHOP, QUEEN, KING
  - _settings.scss is auto-injected by Vite — never @import it manually
  - Do NOT commit — draft commit message in session doc

unknowns:
  - AbilitySet is a 6-tuple of ability IDs; the default set for a given element
    should be the 6 abilities for that element in registry insertion order
    (PAWN→first, KNIGHT→second, etc.). Backend agent should define the
    ELEMENT_ABILITY_ORDER constant mapping element → 6 ability IDs in slot order.

sequence:
  - backend
  - frontend
