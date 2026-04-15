<template>
  <nav class="c-bottom-nav">
    <button class="c-bottom-nav__btn" :aria-label="navContent.bottomNav.newGame" @click="emit('newGame')">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.2"/>
        <path d="M9 5v8M5 9h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      {{ navContent.bottomNav.newGame }}
    </button>

    <div class="c-bottom-nav__logo" role="img" aria-label="Weatherform" />

    <button class="c-bottom-nav__btn" :aria-label="navContent.bottomNav.setManager" @click="emit('setManager')">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 5h12M3 9h12M3 13h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      {{ navContent.bottomNav.setManager }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import { navContent } from '@/content'

const emit = defineEmits<{
  newGame: []
  setManager: []
}>()
</script>

<style lang="scss" src="./BottomNav.scss" />
