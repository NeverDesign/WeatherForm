<script setup lang="ts">
import { setManagerContent } from '@/content/setManager'
</script>

<template>
  <div class="p-set-manager" data-testid="page-set-manager">
    <h1 class="visually-hidden">{{ setManagerContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./SetManagerPage.scss" />
