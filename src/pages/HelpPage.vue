<script setup lang="ts">
import { helpContent } from '@/content/help'
</script>

<template>
  <div class="p-help" data-testid="page-help">
    <h1 class="visually-hidden">{{ helpContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./HelpPage.scss" />
