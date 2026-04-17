import type { Element } from '@/types'

// ─── Effect Types ─────────────────────────────────────────────────────────────

/**
 * Discriminated union of all ability effect categories.
 *
 * DAMAGE  — direct integer damage to target
 * FREEZE  — locks target in place; effectValue = duration in turns
 * POISON  — ongoing damage per turn; effectValue = damage per turn (duration fixed at 2)
 * BURN    — ongoing damage per turn; effectValue = damage per turn (duration fixed at 2)
 * STUN    — skips target's action; effectValue = duration in turns
 * SHIELD  — defensive aura; effectValue = integer damage absorbed or dealt as chip per hit
 * REFLECT — defensive aura; effectValue = integer damage returned to attacker per hit
 */
export type EffectType = 'DAMAGE' | 'FREEZE' | 'POISON' | 'BURN' | 'STUN' | 'SHIELD' | 'REFLECT'

// ─── Ability ─────────────────────────────────────────────────────────────────

/**
 * A single ability entry in the registry.
 *
 * All numeric values are integers — no floats.
 * effectValue meaning depends on effectType (see EffectType above).
 * cooldown is the number of turns the ability is unavailable after use (1–5).
 */
export interface Ability {
  id: string
  name: string
  element: Element
  description: string
  /** Turns this ability is on cooldown after use. Integer in range 1–5 inclusive. */
  cooldown: number
  effectType: EffectType
  /** Integer. Interpretation varies by effectType — damage dealt, turns of duration, damage per turn, etc. */
  effectValue: number
}

// ─── Ability Set ──────────────────────────────────────────────────────────────

/**
 * The 6 ability IDs chosen for a player's game.
 * Keyed by piece type slot; order matches: PAWN, KNIGHT, ROOK, BISHOP, QUEEN, KING.
 */
export type AbilitySet = [string, string, string, string, string, string]

// ─── Saved Set ────────────────────────────────────────────────────────────────

/**
 * A named, persisted ability set belonging to the local player.
 * Stored in localStorage under key `wf_sets`.
 */
export interface SavedSet {
  id: string
  name: string
  element: Element
  abilities: AbilitySet
}

// ─── Element Ability Order ────────────────────────────────────────────────────

/**
 * Default slot assignment for each element's abilities.
 * Ordered: PAWN, KNIGHT, ROOK, BISHOP, QUEEN, KING.
 * Used to build the default AbilitySet when a player picks an element.
 */
export const ELEMENT_ABILITY_ORDER: Record<Element, AbilitySet> = {
  TIDE: [
    'TIDE_SURGE_STRIKE',
    'TIDE_RIPTIDE_CHARGE',
    'TIDE_TIDAL_SLAM',
    'TIDE_UNDERTOW',
    'TIDE_FLOOD_VENOM',
    'TIDE_WHIRLPOOL_AURA',
  ],
  GALE: [
    'GALE_GUST_STRIKE',
    'GALE_WIND_SLAM',
    'GALE_CYCLONE_CHARGE',
    'GALE_TAILWIND',
    'GALE_TEMPEST_STRIKE',
    'GALE_EYE_OF_THE_STORM',
  ],
  DUNE: [
    'DUNE_SAND_STRIKE',
    'DUNE_BEDROCK_SLAM',
    'DUNE_DUNE_CHARGE',
    'DUNE_SANDSTORM',
    'DUNE_QUICKSAND_VENOM',
    'DUNE_DUNE_AURA',
  ],
} as const

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Complete registry of all 18 abilities — 6 per element.
 * Keyed by ability id. Intended for O(1) lookup by id throughout the app.
 *
 * Values calibrated to STARTING_HP = 100:
 * - Basic damage strikes: 15 (tier 1), 20 (tier 2)
 * - Combo strikes (damage + status): effectValue is the status component; base damage = 25
 * - DOT (BURN/POISON): 8 per turn × 2 turns = 16 total exposure
 * - Defensive (SHIELD/REFLECT): 10 chip/reflect per hit
 */
export const ABILITY_REGISTRY: Record<string, Ability> = {
  // ─── TIDE ──────────────────────────────────────────────────────────────────

  TIDE_SURGE_STRIKE: {
    id: 'TIDE_SURGE_STRIKE',
    name: 'Surge Strike',
    element: 'TIDE',
    description: 'A rushing wave of force deals direct damage to the target.',
    cooldown: 1,
    effectType: 'DAMAGE',
    effectValue: 15,
  },

  TIDE_RIPTIDE_CHARGE: {
    id: 'TIDE_RIPTIDE_CHARGE',
    name: 'Riptide Charge',
    element: 'TIDE',
    description: 'A fast, hard-hitting charge deals heavy direct damage to the target.',
    cooldown: 2,
    effectType: 'DAMAGE',
    effectValue: 20,
  },

  TIDE_TIDAL_SLAM: {
    id: 'TIDE_TIDAL_SLAM',
    name: 'Tidal Slam',
    element: 'TIDE',
    description: 'The weight of water immobilizes the target, locking it in place for 2 turns.',
    cooldown: 3,
    effectType: 'FREEZE',
    effectValue: 2,
  },

  TIDE_UNDERTOW: {
    id: 'TIDE_UNDERTOW',
    name: 'Undertow',
    element: 'TIDE',
    description: 'Slow corrosion eats away at the target, dealing 8 damage per turn for 2 turns.',
    cooldown: 3,
    effectType: 'POISON',
    effectValue: 8,
  },

  TIDE_FLOOD_VENOM: {
    id: 'TIDE_FLOOD_VENOM',
    name: 'Flood Venom',
    element: 'TIDE',
    description: 'A devastating strike deals 25 damage and poisons the target for 10 damage per turn for 2 turns.',
    cooldown: 4,
    effectType: 'POISON',
    effectValue: 10,
  },

  TIDE_WHIRLPOOL_AURA: {
    id: 'TIDE_WHIRLPOOL_AURA',
    name: 'Whirlpool Aura',
    element: 'TIDE',
    description: 'Creates a damaging field around the King; any piece that attacks it takes 10 chip damage.',
    cooldown: 5,
    effectType: 'SHIELD',
    effectValue: 10,
  },

  // ─── GALE ──────────────────────────────────────────────────────────────────

  GALE_GUST_STRIKE: {
    id: 'GALE_GUST_STRIKE',
    name: 'Gust Strike',
    element: 'GALE',
    description: 'A quick, light strike deals direct damage to the target.',
    cooldown: 1,
    effectType: 'DAMAGE',
    effectValue: 15,
  },

  GALE_CYCLONE_CHARGE: {
    id: 'GALE_CYCLONE_CHARGE',
    name: 'Cyclone Charge',
    element: 'GALE',
    description: 'A disorienting spin on impact stuns the target, skipping its next action.',
    cooldown: 3,
    effectType: 'STUN',
    effectValue: 1,
  },

  GALE_WIND_SLAM: {
    id: 'GALE_WIND_SLAM',
    name: 'Wind Slam',
    element: 'GALE',
    description: 'Concentrated gale force stops the target cold, stunning it for 1 turn.',
    cooldown: 2,
    effectType: 'STUN',
    effectValue: 1,
  },

  GALE_TAILWIND: {
    id: 'GALE_TAILWIND',
    name: 'Tailwind',
    element: 'GALE',
    description: 'Friction and scorched air ignites the target, dealing 8 damage per turn for 2 turns.',
    cooldown: 3,
    effectType: 'BURN',
    effectValue: 8,
  },

  GALE_TEMPEST_STRIKE: {
    id: 'GALE_TEMPEST_STRIKE',
    name: 'Tempest Strike',
    element: 'GALE',
    description: 'A storm surge deals 25 damage and burns the target for 10 damage per turn for 2 turns.',
    cooldown: 4,
    effectType: 'BURN',
    effectValue: 10,
  },

  GALE_EYE_OF_THE_STORM: {
    id: 'GALE_EYE_OF_THE_STORM',
    name: 'Eye of the Storm',
    element: 'GALE',
    description: 'Calm at the center — reduces incoming damage to adjacent friendly pieces by 10 for 2 turns.',
    cooldown: 5,
    effectType: 'SHIELD',
    effectValue: 10,
  },

  // ─── DUNE ──────────────────────────────────────────────────────────────────

  DUNE_SAND_STRIKE: {
    id: 'DUNE_SAND_STRIKE',
    name: 'Sand Strike',
    element: 'DUNE',
    description: 'A gritty, grinding blow deals direct damage to the target.',
    cooldown: 1,
    effectType: 'DAMAGE',
    effectValue: 15,
  },

  DUNE_DUNE_CHARGE: {
    id: 'DUNE_DUNE_CHARGE',
    name: 'Dune Charge',
    element: 'DUNE',
    description: 'A suffocating assault poisons the target, dealing 8 damage per turn for 2 turns.',
    cooldown: 3,
    effectType: 'POISON',
    effectValue: 8,
  },

  DUNE_BEDROCK_SLAM: {
    id: 'DUNE_BEDROCK_SLAM',
    name: 'Bedrock Slam',
    element: 'DUNE',
    description: 'Crushing weight stuns the target, preventing it from acting this turn.',
    cooldown: 2,
    effectType: 'STUN',
    effectValue: 1,
  },

  DUNE_SANDSTORM: {
    id: 'DUNE_SANDSTORM',
    name: 'Sandstorm',
    element: 'DUNE',
    description: 'Abrasive heat scours the target, dealing 8 damage per turn for 2 turns.',
    cooldown: 3,
    effectType: 'BURN',
    effectValue: 8,
  },

  DUNE_QUICKSAND_VENOM: {
    id: 'DUNE_QUICKSAND_VENOM',
    name: 'Quicksand Venom',
    element: 'DUNE',
    description: 'The target sinks and is trapped — takes 25 damage and is frozen for 2 turns.',
    cooldown: 4,
    effectType: 'FREEZE',
    effectValue: 2,
  },

  DUNE_DUNE_AURA: {
    id: 'DUNE_DUNE_AURA',
    name: 'Dune Aura',
    element: 'DUNE',
    description: 'Absorbs incoming force and reflects 10 damage back to any attacker.',
    cooldown: 5,
    effectType: 'REFLECT',
    effectValue: 10,
  },
}
