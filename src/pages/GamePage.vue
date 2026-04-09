<script setup lang="ts">
import { gameContent } from '@/content/game'
</script>

<template>
  <div class="p-game" data-testid="page-game">
    <h1 class="visually-hidden">{{ gameContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./GamePage.scss" />
