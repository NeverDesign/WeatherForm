<template>
  <div class="p-set-manager" data-testid="page-set-manager">
    <h1 class="visually-hidden">{{ setManagerContent.meta.title }}</h1>

    <AppHeader
      :title="setManagerContent.meta.title"
      :show-back="true"
      @back="handleBack"
      @friends="handleFriends"
      @profile="handleProfile"
    />

    <main class="p-set-manager__main">

      <!-- Element selector -->
      <section class="p-set-manager__section">
        <h2 class="p-set-manager__section-label wf-type-eyebrow">
          {{ setManagerContent.sections.elementSelector }}
        </h2>
        <div class="p-set-manager__element-tabs" role="tablist">
          <button
            v-for="el in elements"
            :key="el.key"
            class="p-set-manager__element-tab"
            :class="[
              `p-set-manager__element-tab--${el.key.toLowerCase()}`,
              { 'p-set-manager__element-tab--active': activeElement === el.key }
            ]"
            role="tab"
            :aria-selected="activeElement === el.key"
            @click="selectElement(el.key)"
          >
            {{ el.label }}
          </button>
        </div>
      </section>

      <!-- Ability list -->
      <section class="p-set-manager__section">
        <h2 class="p-set-manager__section-label wf-type-eyebrow">
          {{ setManagerContent.sections.abilityList }}
        </h2>
        <ul class="p-set-manager__ability-list list-unstyled">
          <li
            v-for="row in abilityRows"
            :key="row.piece.key"
            class="p-set-manager__ability-row p-set-manager__ability-row--active"
            :aria-label="`${row.piece.name} ability: ${row.ability.name}`"
          >
            <span class="p-set-manager__piece-icon" aria-hidden="true">{{ row.piece.icon }}</span>
            <span class="p-set-manager__piece-count wf-type-caption">
              {{ setManagerContent.abilityList.pieceCount[row.piece.key] }}
            </span>
            <span class="p-set-manager__piece-name wf-type-label">{{ row.piece.name }}</span>
            <span class="p-set-manager__ability-name wf-type-body">{{ row.ability.name }}</span>
            <span class="p-set-manager__ability-desc wf-type-caption">{{ row.ability.description }}</span>
            <span
              class="p-set-manager__cooldown-badge wf-type-caption"
              :title="`Cooldown: ${row.ability.cooldown} turn${row.ability.cooldown === 1 ? '' : 's'}`"
            >
              CD: {{ row.ability.cooldown }}
            </span>
          </li>
        </ul>
        <p class="p-set-manager__army-total wf-type-caption">
          {{ setManagerContent.abilityList.armyTotal }}
        </p>
      </section>

      <!-- Save set form -->
      <section class="p-set-manager__section">
        <div class="p-set-manager__save-form">
          <label class="p-set-manager__save-label wf-type-caption" for="set-name">
            {{ setManagerContent.saveSet.nameLabel }}
          </label>
          <input
            id="set-name"
            v-model="setName"
            type="text"
            class="p-set-manager__save-input"
            :class="{ 'p-set-manager__save-input--error': saveError }"
            :placeholder="setManagerContent.saveSet.namePlaceholder"
            :aria-describedby="saveError ? 'set-name-error' : undefined"
            maxlength="32"
            @input="saveError = null"
          />
          <p
            v-if="saveError"
            id="set-name-error"
            class="p-set-manager__save-error wf-type-caption"
            role="alert"
          >
            {{ saveError }}
          </p>
          <p
            v-if="saveSuccess"
            class="p-set-manager__save-success wf-type-caption"
            role="status"
            aria-live="polite"
          >
            {{ setManagerContent.saveSet.successMessage }}
          </p>
          <button
            class="p-set-manager__save-btn"
            type="button"
            @click="handleSave"
          >
            {{ setManagerContent.saveSet.submit }}
          </button>
        </div>
      </section>

      <!-- Saved sets list -->
      <section class="p-set-manager__section">
        <h2 class="p-set-manager__section-label wf-type-eyebrow">
          {{ setManagerContent.sections.savedSets }}
        </h2>

        <!-- Empty state -->
        <div v-if="setStore.savedSets.length === 0" class="p-set-manager__empty">
          <p class="p-set-manager__empty-heading wf-type-heading">
            {{ setManagerContent.emptyState.heading }}
          </p>
          <p class="p-set-manager__empty-body wf-type-body">
            {{ setManagerContent.emptyState.body }}
          </p>
        </div>

        <!-- Sets list -->
        <ul v-else class="p-set-manager__sets-list list-unstyled">
          <li
            v-for="savedSet in setStore.savedSets"
            :key="savedSet.id"
            class="p-set-manager__set-row"
            :class="{ 'p-set-manager__set-row--confirming': confirmDeleteId === savedSet.id }"
          >
            <div class="p-set-manager__set-row-main">
              <span
                class="p-set-manager__set-element-badge wf-type-caption"
                :class="`p-set-manager__set-element-badge--${savedSet.element.toLowerCase()}`"
              >
                {{ savedSet.element }}
              </span>
              <span class="p-set-manager__set-name wf-type-label">{{ savedSet.name }}</span>
              <span
                v-if="setStore.activeSetId === savedSet.id"
                class="p-set-manager__in-use-badge wf-type-caption"
              >
                {{ setManagerContent.setRow.inUseLabel }}
              </span>
              <div class="p-set-manager__set-actions">
                <button
                  class="p-set-manager__set-action p-set-manager__set-action--edit"
                  type="button"
                  :aria-label="`Edit ${savedSet.name}`"
                >
                  {{ setManagerContent.setRow.editAction }}
                </button>
                <button
                  class="p-set-manager__set-action p-set-manager__set-action--delete"
                  type="button"
                  :aria-label="`Delete ${savedSet.name}`"
                  :aria-expanded="confirmDeleteId === savedSet.id"
                  @click="startDelete(savedSet.id)"
                >
                  {{ setManagerContent.setRow.deleteAction }}
                </button>
              </div>
            </div>

            <!-- Inline delete confirm -->
            <div
              v-if="confirmDeleteId === savedSet.id"
              class="p-set-manager__delete-confirm"
              role="alert"
              aria-live="polite"
            >
              <p class="p-set-manager__delete-confirm-heading wf-type-label">
                {{ setManagerContent.setRow.deleteConfirmHeading }}
              </p>
              <p class="p-set-manager__delete-confirm-body wf-type-caption">
                {{ setManagerContent.setRow.deleteConfirmBody }}
              </p>
              <div class="p-set-manager__delete-confirm-actions">
                <button
                  class="p-set-manager__delete-confirm-btn p-set-manager__delete-confirm-btn--confirm"
                  type="button"
                  @click="confirmDelete(savedSet.id)"
                >
                  {{ setManagerContent.setRow.deleteConfirmCta }}
                </button>
                <button
                  class="p-set-manager__delete-confirm-btn p-set-manager__delete-confirm-btn--cancel"
                  type="button"
                  @click="cancelDelete"
                >
                  {{ setManagerContent.setRow.deleteCancelCta }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES, ABILITY_REGISTRY, ELEMENT_ABILITY_ORDER } from '@/types'
import type { Element } from '@/types'
import { setManagerContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import { useSetStore } from '@/stores/useSetStore'

const router = useRouter()
const setStore = useSetStore()

// ─── Element selector ─────────────────────────────────────────────────────────

const activeElement = ref<Element>('TIDE')

const elements: Array<{ key: Element; label: string }> = [
  { key: 'TIDE', label: setManagerContent.elementSelector.tide },
  { key: 'GALE', label: setManagerContent.elementSelector.gale },
  { key: 'DUNE', label: setManagerContent.elementSelector.dune },
]

function selectElement(el: Element): void {
  activeElement.value = el
}

// ─── Piece slot definitions ───────────────────────────────────────────────────

type PieceKey = 'pawn' | 'knight' | 'rook' | 'bishop' | 'queen' | 'king'

const pieces: Array<{ key: PieceKey; name: string; icon: string }> = [
  { key: 'pawn',   name: 'Pawn',   icon: '♟' },
  { key: 'knight', name: 'Knight', icon: '♞' },
  { key: 'rook',   name: 'Rook',   icon: '♜' },
  { key: 'bishop', name: 'Bishop', icon: '♝' },
  { key: 'queen',  name: 'Queen',  icon: '♛' },
  { key: 'king',   name: 'King',   icon: '♚' },
]

// ─── Ability rows (6 rows, one per slot) ─────────────────────────────────────

const abilityRows = computed(() => {
  const slotIds = ELEMENT_ABILITY_ORDER[activeElement.value]
  return pieces.map((piece, index) => {
    const abilityId = slotIds[index]
    const ability = ABILITY_REGISTRY[abilityId]
    return { piece, ability }
  })
})

// ─── Current ability set (the 6 selected ability IDs) ────────────────────────

const currentAbilitySet = computed(() => ELEMENT_ABILITY_ORDER[activeElement.value])

// ─── Save form ────────────────────────────────────────────────────────────────

const setName = ref('')
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

function handleSave(): void {
  saveSuccess.value = false
  const result = setStore.saveSet(setName.value, activeElement.value, currentAbilitySet.value)
  if (result.success) {
    setName.value = ''
    saveError.value = null
    saveSuccess.value = true
  } else {
    saveError.value = result.error ?? null
  }
}

// ─── Delete with inline confirm ───────────────────────────────────────────────

const confirmDeleteId = ref<string | null>(null)

function startDelete(id: string): void {
  confirmDeleteId.value = id
}

function confirmDelete(id: string): void {
  setStore.deleteSet(id)
  confirmDeleteId.value = null
}

function cancelDelete(): void {
  confirmDeleteId.value = null
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function handleBack(): void {
  router.push(ROUTES.MENU)
}

function handleFriends(): void {
  router.push(ROUTES.FRIENDS)
}

function handleProfile(): void {
  router.push(ROUTES.PROFILE)
}
</script>

<style lang="scss" src="./SetManagerPage.scss" />
