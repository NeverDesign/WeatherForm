<script setup lang="ts">
import { gameMenuContent } from '@/content/gameMenu'
</script>

<template>
  <div class="p-game-menu" data-testid="page-game-menu">
    <h1 class="visually-hidden">{{ gameMenuContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./GameMenuPage.scss" />
