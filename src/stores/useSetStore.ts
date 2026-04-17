import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Element } from '@/types'
import type { SavedSet, AbilitySet } from '@/types/abilities'
import { setManagerContent } from '@/content'

// ─── localStorage keys ────────────────────────────────────────────────────────

const LS_SETS_KEY = 'wf_sets'
const LS_ACTIVE_KEY = 'wf_active_set'

// ─── Validation ───────────────────────────────────────────────────────────────

export interface SaveSetResult {
  success: boolean
  error?: string
}

function validateName(name: string): string | null {
  if (!name.trim()) return setManagerContent.saveSet.errorNameRequired
  if (name.length > 32) return setManagerContent.saveSet.errorNameTooLong
  return null
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadSets(): SavedSet[] {
  try {
    const raw = localStorage.getItem(LS_SETS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistSets(sets: SavedSet[]): void {
  localStorage.setItem(LS_SETS_KEY, JSON.stringify(sets))
}

function loadActiveId(): string | null {
  try {
    return localStorage.getItem(LS_ACTIVE_KEY)
  } catch {
    return null
  }
}

function persistActiveId(id: string | null): void {
  if (id === null) {
    localStorage.removeItem(LS_ACTIVE_KEY)
  } else {
    localStorage.setItem(LS_ACTIVE_KEY, id)
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSetStore = defineStore('sets', () => {
  const savedSets = ref<SavedSet[]>(loadSets())
  const activeSetId = ref<string | null>(loadActiveId())

  function saveSet(name: string, element: Element, abilities: AbilitySet): SaveSetResult {
    const nameError = validateName(name)
    if (nameError) return { success: false, error: nameError }

    try {
      const id = crypto.randomUUID()
      const newSet: SavedSet = { id, name: name.trim(), element, abilities }
      savedSets.value = [...savedSets.value, newSet]
      persistSets(savedSets.value)
      return { success: true }
    } catch {
      return { success: false, error: setManagerContent.saveSet.errorSaveFailed }
    }
  }

  function deleteSet(id: string): void {
    savedSets.value = savedSets.value.filter(s => s.id !== id)
    persistSets(savedSets.value)

    // Clear activeSetId if the deleted set was active
    if (activeSetId.value === id) {
      activeSetId.value = null
      persistActiveId(null)
    }
  }

  function setActive(id: string): void {
    activeSetId.value = id
    persistActiveId(id)
  }

  return { savedSets, activeSetId, saveSet, deleteSet, setActive }
})
