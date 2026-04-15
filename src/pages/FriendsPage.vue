<template>
  <div class="p-friends" data-testid="page-friends">
    <h1 class="visually-hidden">{{ friendsContent.meta.title }}</h1>

    <AppHeader
      :title="friendsContent.meta.title"
      :show-back="true"
      @back="handleBack"
      @friends="() => {}"
      @profile="handleProfile"
    />

    <main class="p-friends__main">

      <!-- Search bar -->
      <div class="p-friends__search">
        <label for="friends-search" class="visually-hidden">{{ friendsContent.search.label }}</label>
        <input
          id="friends-search"
          v-model="searchQuery"
          type="text"
          class="p-friends__search-input"
          :placeholder="friendsContent.search.placeholder"
        />
        <button class="p-friends__search-btn">
          {{ friendsContent.search.submitAction }}
        </button>
      </div>

      <!-- Pending requests section -->
      <section class="p-friends__section">
        <h2 class="p-friends__section-label wf-type-eyebrow">
          {{ friendsContent.sections.pending }}
        </h2>

        <!-- Empty pending state -->
        <p class="p-friends__empty-pending wf-type-caption">
          {{ friendsContent.emptyState.pending.heading }}
        </p>
      </section>

      <!-- Friends section -->
      <section class="p-friends__section">
        <h2 class="p-friends__section-label wf-type-eyebrow">
          {{ friendsContent.sections.friends }}
        </h2>

        <!-- Empty friends state -->
        <div class="p-friends__empty">
          <p class="p-friends__empty-heading wf-type-heading">
            {{ friendsContent.emptyState.friends.heading }}
          </p>
          <p class="p-friends__empty-body wf-type-body">
            {{ friendsContent.emptyState.friends.body }}
          </p>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { friendsContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'

const router = useRouter()
const searchQuery = ref('')

function handleBack(): void {
  router.push(ROUTES.MENU)
}

function handleProfile(): void {
  router.push(ROUTES.PROFILE)
}
</script>

<style lang="scss" src="./FriendsPage.scss" />
