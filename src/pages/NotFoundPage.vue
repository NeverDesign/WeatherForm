<template>
  <main class="p-not-found" data-testid="page-not-found">
    <section class="p-not-found__hero">
      <div class="container-narrow">
        <p class="p-not-found__code wf-type-display">{{ notFoundContent.hero.code }}</p>
        <h1 class="p-not-found__heading">{{ notFoundContent.hero.heading }}</h1>
        <p class="p-not-found__body">{{ notFoundContent.hero.body }}</p>
        <button class="btn btn-primary" @click="router.push(ROUTES.MENU)">
          {{ notFoundContent.hero.cta }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { notFoundContent } from '@/content'

const router = useRouter()
</script>

<style lang="scss" src="./NotFoundPage.scss" />
