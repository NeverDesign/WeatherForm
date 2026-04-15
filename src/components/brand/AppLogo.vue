<template>
  <div class="c-app-logo" :class="`c-app-logo--${size}`">
    <svg
      class="c-app-logo__emblem"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- Tide arc: 270° → 30° (120°) -->
      <path class="c-app-logo__arc c-app-logo__arc--tide"
        d="M50,50 L50,5 A45,45 0 0,1 88.97,27.5 Z" />
      <!-- Gale arc: 30° → 150° (120°) -->
      <path class="c-app-logo__arc c-app-logo__arc--gale"
        d="M50,50 L88.97,72.5 A45,45 0 0,1 11.03,72.5 Z" />
      <!-- Dune arc: 150° → 270° (120°) -->
      <path class="c-app-logo__arc c-app-logo__arc--dune"
        d="M50,50 L11.03,27.5 A45,45 0 0,1 50,5 Z" />
      <!-- Inner circle (ink gap / hub) -->
      <circle class="c-app-logo__hub" cx="50" cy="50" r="18" />
    </svg>
    <span class="c-app-logo__wordmark">{{ appName }}</span>
  </div>
</template>

<script setup lang="ts">
import { commonContent } from '@/content'

withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const appName = commonContent.appName
</script>

<style lang="scss" src="./AppLogo.scss" />
