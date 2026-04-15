<template>
  <div class="p-help" data-testid="page-help">
    <h1 class="visually-hidden">{{ helpContent.meta.title }}</h1>

    <AppHeader
      :title="helpContent.meta.title"
      :show-back="true"
      @back="handleBack"
      @friends="handleFriends"
      @profile="handleProfile"
    />

    <div class="p-help__layout">

      <!-- Desktop sidebar nav -->
      <nav class="p-help__sidebar" aria-label="Help navigation">
        <section class="p-help__nav-group">
          <h2 class="p-help__nav-heading wf-type-eyebrow">{{ helpContent.nav.reference }}</h2>
          <ul class="p-help__nav-list list-unstyled">
            <li>
              <button
                class="p-help__nav-btn"
                :class="{ 'p-help__nav-btn--active': activeSection === 'elementAdvantage' }"
                @click="activeSection = 'elementAdvantage'"
              >{{ helpContent.nav.elementAdvantage }}</button>
            </li>
            <li>
              <button
                class="p-help__nav-btn"
                :class="{ 'p-help__nav-btn--active': activeSection === 'abilities' }"
                @click="activeSection = 'abilities'"
              >{{ helpContent.nav.abilities }}</button>
            </li>
            <li>
              <button
                class="p-help__nav-btn"
                :class="{ 'p-help__nav-btn--active': activeSection === 'rulesOverview' }"
                @click="activeSection = 'rulesOverview'"
              >{{ helpContent.nav.rulesOverview }}</button>
            </li>
          </ul>
        </section>

        <section class="p-help__nav-group">
          <h2 class="p-help__nav-heading wf-type-eyebrow">{{ helpContent.nav.gettingStarted }}</h2>
          <ul class="p-help__nav-list list-unstyled">
            <li>
              <button
                class="p-help__nav-btn"
                :class="{ 'p-help__nav-btn--active': activeSection === 'howToPlay' }"
                @click="activeSection = 'howToPlay'"
              >{{ helpContent.nav.howToPlay }}</button>
            </li>
            <li>
              <button
                class="p-help__nav-btn"
                :class="{ 'p-help__nav-btn--active': activeSection === 'buildingASet' }"
                @click="activeSection = 'buildingASet'"
              >{{ helpContent.nav.buildingASet }}</button>
            </li>
          </ul>
        </section>

        <section class="p-help__nav-group">
          <h2 class="p-help__nav-heading wf-type-eyebrow">{{ helpContent.nav.support }}</h2>
          <ul class="p-help__nav-list list-unstyled">
            <li>
              <button class="p-help__nav-btn">{{ helpContent.support.faqAction }}</button>
            </li>
            <li>
              <button class="p-help__nav-btn">{{ helpContent.support.gameManualAction }}</button>
            </li>
          </ul>
        </section>
      </nav>

      <!-- Main content pane -->
      <main class="p-help__content">

        <!-- Element Advantage -->
        <section v-if="activeSection === 'elementAdvantage'" class="p-help__pane">
          <h2 class="p-help__pane-heading wf-type-heading">
            {{ helpContent.elementAdvantage.heading }}
          </h2>
          <p class="p-help__pane-subheading wf-type-body">
            {{ helpContent.elementAdvantage.subheading }}
          </p>
          <ul class="p-help__advantage-list list-unstyled">
            <li class="p-help__advantage-row">
              <span class="p-help__advantage-matchup wf-type-label">{{ helpContent.elementAdvantage.rows.tideBeats }}</span>
              <span class="p-help__advantage-multiplier wf-type-label">{{ helpContent.elementAdvantage.multiplierLabel }}</span>
            </li>
            <li class="p-help__advantage-row">
              <span class="p-help__advantage-matchup wf-type-label">{{ helpContent.elementAdvantage.rows.galeBeats }}</span>
              <span class="p-help__advantage-multiplier wf-type-label">{{ helpContent.elementAdvantage.multiplierLabel }}</span>
            </li>
            <li class="p-help__advantage-row">
              <span class="p-help__advantage-matchup wf-type-label">{{ helpContent.elementAdvantage.rows.duneBeats }}</span>
              <span class="p-help__advantage-multiplier wf-type-label">{{ helpContent.elementAdvantage.multiplierLabel }}</span>
            </li>
          </ul>
          <p class="p-help__pane-note wf-type-body">
            {{ helpContent.elementAdvantage.note }}
          </p>
        </section>

        <!-- Abilities -->
        <section v-else-if="activeSection === 'abilities'" class="p-help__pane">
          <h2 class="p-help__pane-heading wf-type-heading">
            {{ helpContent.abilities.heading }}
          </h2>
          <p class="p-help__pane-subheading wf-type-body">
            {{ helpContent.abilities.subheading }}
          </p>
          <div class="p-help__ability-tabs" role="tablist">
            <button
              v-for="tab in abilityTabs"
              :key="tab.key"
              class="p-help__ability-tab"
              :class="{ 'p-help__ability-tab--active': activeAbilityTab === tab.key }"
              role="tab"
              :aria-selected="activeAbilityTab === tab.key"
              @click="activeAbilityTab = tab.key"
            >{{ tab.label }}</button>
          </div>
        </section>

        <!-- Rules Overview -->
        <section v-else-if="activeSection === 'rulesOverview'" class="p-help__pane">
          <h2 class="p-help__pane-heading wf-type-heading">
            {{ helpContent.rulesOverview.heading }}
          </h2>
          <ul class="p-help__rules-list">
            <li
              v-for="(bullet, i) in helpContent.rulesOverview.bullets"
              :key="i"
              class="p-help__rules-item wf-type-body"
            >{{ bullet }}</li>
          </ul>
        </section>

        <!-- How to Play -->
        <section v-else-if="activeSection === 'howToPlay'" class="p-help__pane">
          <h2 class="p-help__pane-heading wf-type-heading">
            {{ helpContent.howToPlay.heading }}
          </h2>
          <p class="p-help__pane-body wf-type-body-lg">
            {{ helpContent.howToPlay.body }}
          </p>
        </section>

        <!-- Building a Set -->
        <section v-else-if="activeSection === 'buildingASet'" class="p-help__pane">
          <h2 class="p-help__pane-heading wf-type-heading">
            {{ helpContent.buildingASet.heading }}
          </h2>
          <p class="p-help__pane-body wf-type-body-lg">
            {{ helpContent.buildingASet.body }}
          </p>
          <button class="p-help__pane-cta" @click="handleSetManager">
            {{ helpContent.buildingASet.ctaLabel }}
          </button>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { helpContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'

type HelpSection = 'elementAdvantage' | 'abilities' | 'rulesOverview' | 'howToPlay' | 'buildingASet'

const router = useRouter()
const activeSection = ref<HelpSection>('elementAdvantage')
const activeAbilityTab = ref<'tide' | 'gale' | 'dune'>('tide')

const abilityTabs = [
  { key: 'tide' as const, label: helpContent.abilities.elementTabs.tide },
  { key: 'gale' as const, label: helpContent.abilities.elementTabs.gale },
  { key: 'dune' as const, label: helpContent.abilities.elementTabs.dune },
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

function handleSetManager(): void {
  router.push(ROUTES.SETS)
}
</script>

<style lang="scss" src="./HelpPage.scss" />
