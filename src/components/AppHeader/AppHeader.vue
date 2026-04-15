<template>
  <header class="c-app-header">
    <div class="c-app-header__left">
      <button
        v-if="showBack"
        class="c-app-header__icon-btn"
        aria-label="Back"
        @click="emit('back')"
      >‹</button>
      <div v-else class="c-app-header__logo" aria-label="Weatherform" role="img" />
    </div>

    <span class="c-app-header__title">{{ title }}</span>

    <div class="c-app-header__right">
      <button class="c-app-header__icon-btn" aria-label="Friends" @click="emit('friends')">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="5" cy="4" r="2.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="11" cy="5" r="1.8" stroke="currentColor" stroke-width="1.2"/>
          <path d="M8.5 12c0-1.4.9-2.6 2.2-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="c-app-header__icon-btn c-app-header__icon-btn--profile" aria-label="Profile" @click="emit('profile')">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  showBack?: boolean
}>()

const emit = defineEmits<{
  back: []
  friends: []
  profile: []
}>()
</script>

<style lang="scss" src="./AppHeader.scss" />
