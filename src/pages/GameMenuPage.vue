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

        <!-- Empty state -->
        <div class="p-game-menu__empty">
          <p class="p-game-menu__empty-heading wf-type-heading">
            {{ gameMenuContent.emptyState.heading }}
          </p>
          <p class="p-game-menu__empty-body wf-type-body">
            {{ gameMenuContent.emptyState.body }}
          </p>
          <div class="p-game-menu__empty-actions">
            <button class="p-game-menu__cta-primary">
              {{ gameMenuContent.emptyState.ctaNew }}
            </button>
            <button class="p-game-menu__cta-secondary">
              {{ gameMenuContent.emptyState.ctaJoin }}
            </button>
          </div>
        </div>
      </section>
    </main>

    <BottomNav @new-game="handleNewGame" @set-manager="handleSetManager" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { gameMenuContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import BottomNav from '@/components/BottomNav/BottomNav.vue'

const router = useRouter()

function handleFriends(): void {
  router.push(ROUTES.FRIENDS)
}

function handleProfile(): void {
  router.push(ROUTES.PROFILE)
}

function handleNewGame(): void {
  // TODO: open new game modal
}

function handleSetManager(): void {
  router.push(ROUTES.SETS)
}
</script>

<style lang="scss" src="./GameMenuPage.scss" />
