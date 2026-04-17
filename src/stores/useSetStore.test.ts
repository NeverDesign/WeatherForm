import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSetStore } from './useSetStore'
import type { AbilitySet } from '@/types/abilities'

// ─── localStorage mock ────────────────────────────────────────────────────────

let _lsStore: Record<string, string> = {}

const localStorageMock = {
  getItem: vi.fn((key: string): string | null => _lsStore[key] ?? null),
  setItem: vi.fn((key: string, value: string): void => { _lsStore[key] = value }),
  removeItem: vi.fn((key: string): void => { delete _lsStore[key] }),
  clear: () => { _lsStore = {} },
}

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

const TIDE_ABILITIES: AbilitySet = [
  'TIDE_SURGE_STRIKE',
  'TIDE_RIPTIDE_CHARGE',
  'TIDE_TIDAL_SLAM',
  'TIDE_UNDERTOW',
  'TIDE_FLOOD_VENOM',
  'TIDE_WHIRLPOOL_AURA',
]

const GALE_ABILITIES: AbilitySet = [
  'GALE_GUST_STRIKE',
  'GALE_WIND_SLAM',
  'GALE_CYCLONE_CHARGE',
  'GALE_TAILWIND',
  'GALE_TEMPEST_STRIKE',
  'GALE_EYE_OF_THE_STORM',
]

beforeEach(() => {
  localStorageMock.clear()
  localStorageMock.getItem.mockReset()
  localStorageMock.setItem.mockReset()
  localStorageMock.removeItem.mockReset()
  // Default: return null for any key (empty localStorage)
  localStorageMock.getItem.mockReturnValue(null)
  setActivePinia(createPinia())
})

// ─── saveSet ──────────────────────────────────────────────────────────────────

describe('useSetStore — saveSet', () => {
  it('saves a valid set and returns success', () => {
    const store = useSetStore()
    const result = store.saveSet('My Tide Set', 'TIDE', TIDE_ABILITIES)
    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(store.savedSets).toHaveLength(1)
    expect(store.savedSets[0].name).toBe('My Tide Set')
    expect(store.savedSets[0].element).toBe('TIDE')
  })

  it('persists to localStorage after save', () => {
    const store = useSetStore()
    store.saveSet('Storm', 'GALE', GALE_ABILITIES)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'wf_sets',
      expect.stringContaining('Storm'),
    )
  })

  it('generates a unique id for each set', () => {
    const store = useSetStore()
    store.saveSet('Set A', 'TIDE', TIDE_ABILITIES)
    store.saveSet('Set B', 'GALE', GALE_ABILITIES)
    expect(store.savedSets[0].id).not.toBe(store.savedSets[1].id)
    expect(store.savedSets[0].id).toBeTruthy()
  })

  it('trims whitespace from the name', () => {
    const store = useSetStore()
    store.saveSet('  Trimmed  ', 'TIDE', TIDE_ABILITIES)
    expect(store.savedSets[0].name).toBe('Trimmed')
  })

  it('rejects an empty name', () => {
    const store = useSetStore()
    const result = store.saveSet('', 'TIDE', TIDE_ABILITIES)
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
    expect(store.savedSets).toHaveLength(0)
  })

  it('rejects a name that is only whitespace', () => {
    const store = useSetStore()
    const result = store.saveSet('   ', 'TIDE', TIDE_ABILITIES)
    expect(result.success).toBe(false)
    expect(store.savedSets).toHaveLength(0)
  })

  it('rejects a name longer than 32 characters', () => {
    const store = useSetStore()
    const result = store.saveSet('A'.repeat(33), 'TIDE', TIDE_ABILITIES)
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
    expect(store.savedSets).toHaveLength(0)
  })

  it('accepts a name of exactly 32 characters', () => {
    const store = useSetStore()
    const result = store.saveSet('A'.repeat(32), 'TIDE', TIDE_ABILITIES)
    expect(result.success).toBe(true)
    expect(store.savedSets).toHaveLength(1)
  })
})

// ─── deleteSet ────────────────────────────────────────────────────────────────

describe('useSetStore — deleteSet', () => {
  it('removes a set by id', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    store.saveSet('Beta', 'GALE', GALE_ABILITIES)
    const idToDelete = store.savedSets[0].id
    store.deleteSet(idToDelete)
    expect(store.savedSets).toHaveLength(1)
    expect(store.savedSets[0].name).toBe('Beta')
  })

  it('persists to localStorage after delete', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    localStorageMock.setItem.mockClear()
    store.deleteSet(store.savedSets[0].id)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('wf_sets', expect.any(String))
  })

  it('does nothing for an unknown id', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    store.deleteSet('nonexistent-id')
    expect(store.savedSets).toHaveLength(1)
  })

  it('clears activeSetId when the active set is deleted', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    const id = store.savedSets[0].id
    store.setActive(id)
    expect(store.activeSetId).toBe(id)
    store.deleteSet(id)
    expect(store.activeSetId).toBeNull()
  })

  it('does not clear activeSetId when a different set is deleted', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    store.saveSet('Beta', 'GALE', GALE_ABILITIES)
    const activeId = store.savedSets[0].id
    const otherId = store.savedSets[1].id
    store.setActive(activeId)
    store.deleteSet(otherId)
    expect(store.activeSetId).toBe(activeId)
  })
})

// ─── setActive ────────────────────────────────────────────────────────────────

describe('useSetStore — setActive', () => {
  it('sets activeSetId', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    const id = store.savedSets[0].id
    store.setActive(id)
    expect(store.activeSetId).toBe(id)
  })

  it('persists activeSetId to localStorage', () => {
    const store = useSetStore()
    store.saveSet('Alpha', 'TIDE', TIDE_ABILITIES)
    const id = store.savedSets[0].id
    store.setActive(id)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('wf_active_set', id)
  })
})

// ─── localStorage hydration ───────────────────────────────────────────────────

describe('useSetStore — localStorage hydration', () => {
  it('loads saved sets from localStorage on init', () => {
    const persisted: import('@/types/abilities').SavedSet[] = [
      { id: 'abc', name: 'Restored', element: 'TIDE', abilities: TIDE_ABILITIES },
    ]
    localStorageMock.getItem.mockImplementation((key: string): string | null => {
      if (key === 'wf_sets') return JSON.stringify(persisted)
      return null
    })
    const store = useSetStore()
    expect(store.savedSets).toHaveLength(1)
    expect(store.savedSets[0].name).toBe('Restored')
  })

  it('loads activeSetId from localStorage on init', () => {
    localStorageMock.getItem.mockImplementation((key: string): string | null => {
      if (key === 'wf_active_set') return 'abc'
      if (key === 'wf_sets') return JSON.stringify([
        { id: 'abc', name: 'Restored', element: 'TIDE', abilities: TIDE_ABILITIES },
      ])
      return null
    })
    const store = useSetStore()
    expect(store.activeSetId).toBe('abc')
  })

  it('initialises to empty arrays when localStorage is empty', () => {
    const store = useSetStore()
    expect(store.savedSets).toHaveLength(0)
    expect(store.activeSetId).toBeNull()
  })

  it('handles corrupt localStorage data gracefully', () => {
    localStorageMock.getItem.mockImplementation((key: string): string | null => {
      if (key === 'wf_sets') return 'not valid json{'
      return null
    })
    const store = useSetStore()
    expect(store.savedSets).toHaveLength(0)
  })
})
