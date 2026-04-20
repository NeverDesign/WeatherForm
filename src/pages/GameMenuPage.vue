<template>
  <div class="p-game-menu" data-testid="page-game-menu">
    <h1 class="visually-hidden">{{ gameMenuContent.meta.title }}</h1>

    <AppHeader
      :title="gameMenuContent.meta.title"
      @friends="handleFriends"
      @profile="handleProfile"
    />

    <main class="p-game-menu__main">
      <section class="p-game-menu__section">
        <h2 class="p-game-menu__section-label wf-type-eyebrow">
          {{ gameMenuContent.sections.currentGames }}
        </h2>

        <!-- Loading skeleton -->
        <div v-if="loading" class="p-game-menu__skeleton" aria-busy="true" :aria-label="gameMenuContent.sections.loadingGames">
          <div class="p-game-menu__skeleton-row" v-for="n in 3" :key="n"></div>
        </div>

        <!-- Game list -->
        <template v-else-if="games.length > 0">
          <ul class="p-game-menu__game-list" aria-label="Your games">
            <li
              v-for="game in games"
              :key="game.id"
              class="p-game-menu__game-row"
            >
              <!-- Element badge -->
              <span
                class="p-game-menu__element-badge"
                :style="{ backgroundColor: elementColour(game.players.P1.element) }"
                :aria-label="`${gameMenuContent.gameRow.elementBadgeLabel} ${game.players.P1.element}`"
              >{{ game.players.P1.element }}</span>

              <!-- Game info -->
              <div class="p-game-menu__game-info">
                <span class="p-game-menu__opponent wf-type-label">
                  {{ game.phase === 'waiting' ? gameMenuContent.gameRow.opponentWaiting : gameMenuContent.gameRow.opponentActive }}
                </span>
                <span
                  class="p-game-menu__turn-badge wf-type-caption"
                  :class="game.turn === 'P1' ? 'p-game-menu__turn-badge--your-turn' : 'p-game-menu__turn-badge--waiting'"
                >
                  {{ game.turn === 'P1' ? gameMenuContent.gameRow.statusYourTurn : gameMenuContent.gameRow.statusWaiting }}
                </span>
              </div>

              <!-- Action button -->
              <button
                class="p-game-menu__row-action"
                :class="game.turn === 'P1' ? 'p-game-menu__row-action--play' : ''"
                @click="openGame(game.id)"
              >
                {{ game.turn === 'P1' ? gameMenuContent.gameRow.actionPlay : gameMenuContent.gameRow.actionOpen }}
              </button>
            </li>
          </ul>
        </template>

        <!-- Empty state -->
        <div v-else class="p-game-menu__empty">
          <p class="p-game-menu__empty-heading wf-type-heading">
            {{ gameMenuContent.emptyState.heading }}
          </p>
          <p class="p-game-menu__empty-body wf-type-body">
            {{ gameMenuContent.emptyState.body }}
          </p>
          <div class="p-game-menu__empty-actions">
            <button class="p-game-menu__cta-primary" @click="openNewGameModal">
              {{ gameMenuContent.emptyState.ctaNew }}
            </button>
            <button class="p-game-menu__cta-secondary" @click="openJoinGameModal">
              {{ gameMenuContent.emptyState.ctaJoin }}
            </button>
          </div>
        </div>
      </section>
    </main>

    <BottomNav @new-game="openNewGameModal" @set-manager="handleSetManager" />

    <!-- ── New Game Modal ──────────────────────────────────────────────────── -->
    <div
      v-if="showNewGameModal"
      class="p-game-menu__modal-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="gameMenuContent.newGameModal.heading"
      @click.self="closeNewGameModal"
    >
      <div class="p-game-menu__modal">
        <h2 class="p-game-menu__modal-heading wf-type-heading">
          {{ gameMenuContent.newGameModal.heading }}
        </h2>

        <!-- Element selector -->
        <fieldset class="p-game-menu__fieldset">
          <legend class="p-game-menu__fieldset-legend wf-type-label">
            {{ gameMenuContent.newGameModal.elementLabel }}
          </legend>
          <div class="p-game-menu__element-selector" role="group" :aria-label="gameMenuContent.newGameModal.elementLabel">
            <button
              v-for="el in ELEMENTS"
              :key="el"
              class="p-game-menu__element-btn"
              :class="{ 'p-game-menu__element-btn--selected': newGameElement === el }"
              :style="{ borderColor: newGameElement === el ? elementColour(el) : 'transparent', color: elementColour(el) }"
              :aria-pressed="newGameElement === el"
              @click="newGameElement = el"
            >{{ el }}</button>
          </div>
        </fieldset>

        <!-- Inline error -->
        <p
          v-if="newGameError"
          class="p-game-menu__modal-error wf-type-caption"
          role="alert"
          aria-live="polite"
        >{{ newGameError }}</p>

        <!-- Actions -->
        <div class="p-game-menu__modal-actions">
          <button
            class="p-game-menu__cta-primary"
            :disabled="newGameSubmitting"
            @click="submitNewGame"
          >
            {{ newGameSubmitting ? '…' : gameMenuContent.newGameModal.submit }}
          </button>
          <button
            class="p-game-menu__cta-secondary"
            :disabled="newGameSubmitting"
            @click="closeNewGameModal"
          >
            {{ gameMenuContent.newGameModal.cancel }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Join Game Modal ─────────────────────────────────────────────────── -->
    <div
      v-if="showJoinGameModal"
      class="p-game-menu__modal-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="gameMenuContent.joinGameModal.heading"
      @click.self="closeJoinGameModal"
    >
      <div class="p-game-menu__modal">
        <h2 class="p-game-menu__modal-heading wf-type-heading">
          {{ gameMenuContent.joinGameModal.heading }}
        </h2>

        <!-- Game ID input -->
        <div class="p-game-menu__field">
          <label
            class="p-game-menu__field-label wf-type-label"
            for="join-game-id"
          >{{ gameMenuContent.joinGameModal.gameIdLabel }}</label>
          <input
            id="join-game-id"
            v-model="joinGameId"
            class="p-game-menu__field-input"
            type="text"
            :placeholder="gameMenuContent.joinGameModal.gameIdPlaceholder"
            :aria-describedby="joinGameError ? 'join-game-error' : undefined"
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <!-- Element selector -->
        <fieldset class="p-game-menu__fieldset">
          <legend class="p-game-menu__fieldset-legend wf-type-label">
            {{ gameMenuContent.joinGameModal.elementLabel }}
          </legend>
          <div class="p-game-menu__element-selector" role="group" :aria-label="gameMenuContent.joinGameModal.elementLabel">
            <button
              v-for="el in ELEMENTS"
              :key="el"
              class="p-game-menu__element-btn"
              :class="{ 'p-game-menu__element-btn--selected': joinGameElement === el }"
              :style="{ borderColor: joinGameElement === el ? elementColour(el) : 'transparent', color: elementColour(el) }"
              :aria-pressed="joinGameElement === el"
              @click="joinGameElement = el"
            >{{ el }}</button>
          </div>
        </fieldset>

        <!-- Inline error -->
        <p
          v-if="joinGameError"
          id="join-game-error"
          class="p-game-menu__modal-error wf-type-caption"
          role="alert"
          aria-live="polite"
        >{{ joinGameError }}</p>

        <!-- Actions -->
        <div class="p-game-menu__modal-actions">
          <button
            class="p-game-menu__cta-primary"
            :disabled="joinGameSubmitting"
            @click="submitJoinGame"
          >
            {{ joinGameSubmitting ? '…' : gameMenuContent.joinGameModal.submit }}
          </button>
          <button
            class="p-game-menu__cta-secondary"
            :disabled="joinGameSubmitting"
            @click="closeJoinGameModal"
          >
            {{ gameMenuContent.joinGameModal.cancel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES, ELEMENT_COLOURS } from '@/types'
import type { Element } from '@/types'
import { gameMenuContent } from '@/content'
import { gameService } from '@/services/gameService'
import { useGameList } from '@/composables/useGameList'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import BottomNav from '@/components/BottomNav/BottomNav.vue'

const router = useRouter()

const ELEMENTS: Element[] = ['TIDE', 'GALE', 'DUNE']

function elementColour(element: Element): string {
  return ELEMENT_COLOURS[element].base
}

// ── Game list ────────────────────────────────────────────────────────────────

const { games, loading } = useGameList()

function openGame(id: string): void {
  router.push(ROUTES.GAME.replace(':id', id))
}

// ── Navigation ───────────────────────────────────────────────────────────────

function handleFriends(): void {
  router.push(ROUTES.FRIENDS)
}

function handleProfile(): void {
  router.push(ROUTES.PROFILE)
}

function handleSetManager(): void {
  router.push(ROUTES.SETS)
}

// ── New Game modal ───────────────────────────────────────────────────────────

const showNewGameModal = ref(false)
const newGameElement = ref<Element | null>(null)
const newGameError = ref<string | null>(null)
const newGameSubmitting = ref(false)

function openNewGameModal(): void {
  newGameElement.value = null
  newGameError.value = null
  newGameSubmitting.value = false
  showNewGameModal.value = true
}

function closeNewGameModal(): void {
  showNewGameModal.value = false
}

async function submitNewGame(): Promise<void> {
  if (!newGameElement.value) {
    newGameError.value = gameMenuContent.newGameModal.errorNoElement
    return
  }

  newGameError.value = null
  newGameSubmitting.value = true

  try {
    const game = await gameService.createGame(newGameElement.value)
    showNewGameModal.value = false
    router.push(ROUTES.GAME.replace(':id', game.id))
  } catch {
    newGameError.value = gameMenuContent.newGameModal.errorCreateFailed
  } finally {
    newGameSubmitting.value = false
  }
}

// ── Join Game modal ──────────────────────────────────────────────────────────

const showJoinGameModal = ref(false)
const joinGameId = ref('')
const joinGameElement = ref<Element | null>(null)
const joinGameError = ref<string | null>(null)
const joinGameSubmitting = ref(false)

function openJoinGameModal(): void {
  joinGameId.value = ''
  joinGameElement.value = null
  joinGameError.value = null
  joinGameSubmitting.value = false
  showJoinGameModal.value = true
}

function closeJoinGameModal(): void {
  showJoinGameModal.value = false
}

async function submitJoinGame(): Promise<void> {
  if (!joinGameId.value.trim()) {
    joinGameError.value = gameMenuContent.joinGameModal.errorNoGameId
    return
  }
  if (!joinGameElement.value) {
    joinGameError.value = gameMenuContent.joinGameModal.errorNoElement
    return
  }

  joinGameError.value = null
  joinGameSubmitting.value = true

  try {
    const game = await gameService.joinGame(joinGameId.value.trim(), joinGameElement.value)
    showJoinGameModal.value = false
    router.push(ROUTES.GAME.replace(':id', game.id))
  } catch {
    joinGameError.value = gameMenuContent.joinGameModal.errorJoinFailed
  } finally {
    joinGameSubmitting.value = false
  }
}
</script>

<style lang="scss" src="./GameMenuPage.scss" />
