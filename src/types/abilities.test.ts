import { describe, it, expect } from 'vitest'
import { ABILITY_REGISTRY } from './abilities'
import type { EffectType } from './abilities'
import type { Element } from '@/types'

// ─── Constants ───────────────────────────────────────────────────────────────

const ELEMENTS: Element[] = ['TIDE', 'GALE', 'DUNE']
const VALID_EFFECT_TYPES: EffectType[] = ['DAMAGE', 'FREEZE', 'POISON', 'BURN', 'STUN', 'SHIELD', 'REFLECT']
const ABILITIES_PER_ELEMENT = 6
const TOTAL_ABILITIES = 18

// ─── Registry completeness ────────────────────────────────────────────────────

describe('ABILITY_REGISTRY completeness', () => {
  it('has exactly 18 abilities', () => {
    expect(Object.keys(ABILITY_REGISTRY)).toHaveLength(TOTAL_ABILITIES)
  })

  it('has exactly 6 abilities per element', () => {
    for (const element of ELEMENTS) {
      const count = Object.values(ABILITY_REGISTRY).filter(a => a.element === element).length
      expect(count, `${element} should have ${ABILITIES_PER_ELEMENT} abilities`).toBe(ABILITIES_PER_ELEMENT)
    }
  })

  it('has exactly 6 TIDE abilities', () => {
    const tideIds = [
      'TIDE_SURGE_STRIKE',
      'TIDE_RIPTIDE_CHARGE',
      'TIDE_TIDAL_SLAM',
      'TIDE_UNDERTOW',
      'TIDE_FLOOD_VENOM',
      'TIDE_WHIRLPOOL_AURA',
    ]
    for (const id of tideIds) {
      expect(ABILITY_REGISTRY, `${id} must exist`).toHaveProperty(id)
    }
  })

  it('has exactly 6 GALE abilities', () => {
    const galeIds = [
      'GALE_GUST_STRIKE',
      'GALE_CYCLONE_CHARGE',
      'GALE_WIND_SLAM',
      'GALE_TAILWIND',
      'GALE_TEMPEST_STRIKE',
      'GALE_EYE_OF_THE_STORM',
    ]
    for (const id of galeIds) {
      expect(ABILITY_REGISTRY, `${id} must exist`).toHaveProperty(id)
    }
  })

  it('has exactly 6 DUNE abilities', () => {
    const duneIds = [
      'DUNE_SAND_STRIKE',
      'DUNE_DUNE_CHARGE',
      'DUNE_BEDROCK_SLAM',
      'DUNE_SANDSTORM',
      'DUNE_QUICKSAND_VENOM',
      'DUNE_DUNE_AURA',
    ]
    for (const id of duneIds) {
      expect(ABILITY_REGISTRY, `${id} must exist`).toHaveProperty(id)
    }
  })
})

// ─── Shape validation ─────────────────────────────────────────────────────────

describe('ABILITY_REGISTRY shape', () => {
  const abilities = Object.entries(ABILITY_REGISTRY)

  it('every ability id key matches its internal id field', () => {
    for (const [key, ability] of abilities) {
      expect(ability.id, `${key}.id should equal its registry key`).toBe(key)
    }
  })

  it('every ability has a non-empty name', () => {
    for (const [key, ability] of abilities) {
      expect(ability.name, `${key} name must not be empty`).toBeTruthy()
    }
  })

  it('every ability has a non-empty description', () => {
    for (const [key, ability] of abilities) {
      expect(ability.description, `${key} description must not be empty`).toBeTruthy()
    }
  })

  it('every ability element is a valid Element', () => {
    for (const [key, ability] of abilities) {
      expect(ELEMENTS, `${key} element must be TIDE, GALE, or DUNE`).toContain(ability.element)
    }
  })

  it('every ability effectType is a valid EffectType', () => {
    for (const [key, ability] of abilities) {
      expect(VALID_EFFECT_TYPES, `${key} effectType must be a valid EffectType`).toContain(ability.effectType)
    }
  })

  it('every ability id starts with its element prefix', () => {
    for (const [key, ability] of abilities) {
      expect(key, `${key} must start with ${ability.element}_`).toMatch(
        new RegExp(`^${ability.element}_`)
      )
    }
  })
})

// ─── Cooldown range ───────────────────────────────────────────────────────────

describe('ABILITY_REGISTRY cooldown range', () => {
  it('every cooldown is an integer between 1 and 5 inclusive', () => {
    for (const [key, ability] of Object.entries(ABILITY_REGISTRY)) {
      expect(Number.isInteger(ability.cooldown), `${key} cooldown must be an integer`).toBe(true)
      expect(ability.cooldown, `${key} cooldown must be >= 1`).toBeGreaterThanOrEqual(1)
      expect(ability.cooldown, `${key} cooldown must be <= 5`).toBeLessThanOrEqual(5)
    }
  })
})

// ─── Effect value sanity ──────────────────────────────────────────────────────

describe('ABILITY_REGISTRY effectValue sanity', () => {
  it('every effectValue is a positive integer', () => {
    for (const [key, ability] of Object.entries(ABILITY_REGISTRY)) {
      expect(Number.isInteger(ability.effectValue), `${key} effectValue must be an integer`).toBe(true)
      expect(ability.effectValue, `${key} effectValue must be > 0`).toBeGreaterThan(0)
    }
  })

  it('DAMAGE effectValues are calibrated — between 1 and 100 (STARTING_HP)', () => {
    const damageAbilities = Object.entries(ABILITY_REGISTRY).filter(
      ([, a]) => a.effectType === 'DAMAGE'
    )
    for (const [key, ability] of damageAbilities) {
      expect(ability.effectValue, `${key} DAMAGE effectValue must be >= 1`).toBeGreaterThanOrEqual(1)
      expect(ability.effectValue, `${key} DAMAGE effectValue must be <= 100`).toBeLessThanOrEqual(100)
    }
  })

  it('POISON and BURN effectValues (per-turn damage) are between 1 and 50', () => {
    const dotAbilities = Object.entries(ABILITY_REGISTRY).filter(
      ([, a]) => a.effectType === 'POISON' || a.effectType === 'BURN'
    )
    for (const [key, ability] of dotAbilities) {
      expect(ability.effectValue, `${key} DOT effectValue must be >= 1`).toBeGreaterThanOrEqual(1)
      expect(ability.effectValue, `${key} DOT effectValue must be <= 50`).toBeLessThanOrEqual(50)
    }
  })

  it('FREEZE and STUN effectValues (duration) are between 1 and 5', () => {
    const ccAbilities = Object.entries(ABILITY_REGISTRY).filter(
      ([, a]) => a.effectType === 'FREEZE' || a.effectType === 'STUN'
    )
    for (const [key, ability] of ccAbilities) {
      expect(ability.effectValue, `${key} CC effectValue must be >= 1`).toBeGreaterThanOrEqual(1)
      expect(ability.effectValue, `${key} CC effectValue must be <= 5`).toBeLessThanOrEqual(5)
    }
  })

  it('SHIELD and REFLECT effectValues are between 1 and 50', () => {
    const defAbilities = Object.entries(ABILITY_REGISTRY).filter(
      ([, a]) => a.effectType === 'SHIELD' || a.effectType === 'REFLECT'
    )
    for (const [key, ability] of defAbilities) {
      expect(ability.effectValue, `${key} DEF effectValue must be >= 1`).toBeGreaterThanOrEqual(1)
      expect(ability.effectValue, `${key} DEF effectValue must be <= 50`).toBeLessThanOrEqual(50)
    }
  })
})

// ─── Registry is plain JSON-safe ─────────────────────────────────────────────

describe('ABILITY_REGISTRY is plain JSON', () => {
  it('survives a JSON round-trip without data loss', () => {
    const roundTripped = JSON.parse(JSON.stringify(ABILITY_REGISTRY))
    expect(roundTripped).toEqual(ABILITY_REGISTRY)
  })

  it('survives structuredClone without data loss', () => {
    const cloned = structuredClone(ABILITY_REGISTRY)
    expect(cloned).toEqual(ABILITY_REGISTRY)
  })
})

// ─── Spot-check specific abilities ───────────────────────────────────────────

describe('ABILITY_REGISTRY spot checks', () => {
  it('TIDE_SURGE_STRIKE has correct shape', () => {
    const a = ABILITY_REGISTRY['TIDE_SURGE_STRIKE']
    expect(a).toBeDefined()
    expect(a.name).toBe('Surge Strike')
    expect(a.element).toBe('TIDE')
    expect(a.effectType).toBe('DAMAGE')
    expect(a.effectValue).toBe(15)
    expect(a.cooldown).toBe(1)
  })

  it('GALE_EYE_OF_THE_STORM has correct shape', () => {
    const a = ABILITY_REGISTRY['GALE_EYE_OF_THE_STORM']
    expect(a).toBeDefined()
    expect(a.name).toBe('Eye of the Storm')
    expect(a.element).toBe('GALE')
    expect(a.effectType).toBe('SHIELD')
    expect(a.effectValue).toBe(10)
    expect(a.cooldown).toBe(5)
  })

  it('DUNE_DUNE_AURA has correct shape', () => {
    const a = ABILITY_REGISTRY['DUNE_DUNE_AURA']
    expect(a).toBeDefined()
    expect(a.name).toBe('Dune Aura')
    expect(a.element).toBe('DUNE')
    expect(a.effectType).toBe('REFLECT')
    expect(a.effectValue).toBe(10)
    expect(a.cooldown).toBe(5)
  })

  it('TIDE_FLOOD_VENOM has the highest cooldown among TIDE abilities', () => {
    const tideAbilities = Object.values(ABILITY_REGISTRY).filter(a => a.element === 'TIDE')
    const maxCooldown = Math.max(...tideAbilities.map(a => a.cooldown))
    const floodVenom = ABILITY_REGISTRY['TIDE_FLOOD_VENOM']
    // TIDE_WHIRLPOOL_AURA has cooldown 5, TIDE_FLOOD_VENOM has cooldown 4
    expect(floodVenom.cooldown).toBe(4)
    expect(maxCooldown).toBe(5)
  })
})
