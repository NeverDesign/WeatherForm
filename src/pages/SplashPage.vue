<template>
  <div class="p-splash" data-testid="page-splash">
    <h1 class="visually-hidden">{{ commonContent.appName }}</h1>
    <AppLogo size="lg" />
    <p class="p-splash__tagline">{{ splashContent.tagline }}</p>
    <div class="p-splash__dots" aria-hidden="true">
      <span class="p-splash__dot p-splash__dot--tide"></span>
      <span class="p-splash__dot p-splash__dot--gale"></span>
      <span class="p-splash__dot p-splash__dot--dune"></span>
    </div>
    <span class="p-splash__version">{{ splashContent.version }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { useAuthStore } from '@/stores/useAuthStore'
import { splashContent, commonContent } from '@/content'
import AppLogo from '@/components/brand/AppLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const SPLASH_DELAY_MS = 2000

onMounted(() => {
  if (authStore.account) {
    router.push(ROUTES.MENU)
    return
  }
  setTimeout(() => {
    router.push(ROUTES.AUTH)
  }, SPLASH_DELAY_MS)
})
</script>

<style lang="scss" src="./SplashPage.scss" />
