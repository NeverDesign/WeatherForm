<script setup lang="ts">
import { profileContent } from '@/content/profile'
</script>

<template>
  <div class="p-profile" data-testid="page-profile">
    <h1 class="visually-hidden">{{ profileContent.title }}</h1>
  </div>
</template>

<style lang="scss" src="./ProfilePage.scss" />
