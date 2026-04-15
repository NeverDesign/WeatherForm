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
              `p-set-manager__element-tab--${el.key}`,
              { 'p-set-manager__element-tab--active': activeElement === el.key }
            ]"
            role="tab"
            :aria-selected="activeElement === el.key"
            @click="activeElement = el.key"
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
            v-for="piece in pieces"
            :key="piece.key"
            class="p-set-manager__ability-row"
          >
            <span class="p-set-manager__piece-icon" aria-hidden="true">{{ piece.icon }}</span>
            <span class="p-set-manager__piece-count wf-type-caption">
              {{ setManagerContent.abilityList.pieceCount[piece.key] }}
            </span>
            <span class="p-set-manager__piece-name wf-type-label">{{ piece.name }}</span>
            <span class="p-set-manager__piece-ability wf-type-body">—</span>
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
            :placeholder="setManagerContent.saveSet.namePlaceholder"
          />
          <button class="p-set-manager__save-btn">
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
        <div class="p-set-manager__empty">
          <p class="p-set-manager__empty-heading wf-type-heading">
            {{ setManagerContent.emptyState.heading }}
          </p>
          <p class="p-set-manager__empty-body wf-type-body">
            {{ setManagerContent.emptyState.body }}
          </p>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { setManagerContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'

const router = useRouter()

const activeElement = ref<'tide' | 'gale' | 'dune'>('tide')
const setName = ref('')

const elements = [
  { key: 'tide' as const, label: setManagerContent.elementSelector.tide },
  { key: 'gale' as const, label: setManagerContent.elementSelector.gale },
  { key: 'dune' as const, label: setManagerContent.elementSelector.dune },
]

const pieces = [
  { key: 'pawn' as const, name: 'Pawn', icon: '♟' },
  { key: 'knight' as const, name: 'Knight', icon: '♞' },
  { key: 'bishop' as const, name: 'Bishop', icon: '♝' },
  { key: 'rook' as const, name: 'Rook', icon: '♜' },
  { key: 'queen' as const, name: 'Queen', icon: '♛' },
  { key: 'king' as const, name: 'King', icon: '♚' },
]

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
