<template>
  <div class="p-profile" data-testid="page-profile">
    <h1 class="visually-hidden">{{ profileContent.meta.title }}</h1>

    <AppHeader
      :title="profileContent.meta.title"
      :show-back="true"
      @back="handleBack"
      @friends="handleFriends"
      @profile="() => {}"
    />

    <main class="p-profile__main">

      <!-- Avatar -->
      <div class="p-profile__avatar-area">
        <div class="p-profile__avatar" :aria-label="profileContent.avatar.altText" role="img">
          <span class="p-profile__avatar-initial wf-type-display">W</span>
        </div>
        <span class="p-profile__version wf-type-caption">{{ profileContent.version }}</span>
      </div>

      <!-- Account section -->
      <section class="p-profile__section">
        <h2 class="p-profile__section-label wf-type-eyebrow">
          {{ profileContent.sections.account }}
        </h2>
        <ul class="p-profile__field-list list-unstyled">
          <li class="p-profile__field-row">
            <span class="p-profile__field-label wf-type-caption">
              {{ profileContent.account.displayName.label }}
            </span>
            <span class="p-profile__field-value wf-type-body">—</span>
            <button class="p-profile__field-action">
              {{ profileContent.account.displayName.editAction }}
            </button>
          </li>
          <li class="p-profile__field-row">
            <span class="p-profile__field-label wf-type-caption">
              {{ profileContent.account.email.label }}
            </span>
            <span class="p-profile__field-value wf-type-body">—</span>
            <button class="p-profile__field-action">
              {{ profileContent.account.email.editAction }}
            </button>
          </li>
          <li class="p-profile__field-row">
            <span class="p-profile__field-label wf-type-caption">
              {{ profileContent.account.playerTag.label }}
            </span>
            <span class="p-profile__field-value p-profile__field-value--muted wf-type-body">—</span>
          </li>
        </ul>
      </section>

      <!-- App section -->
      <section class="p-profile__section">
        <h2 class="p-profile__section-label wf-type-eyebrow">
          {{ profileContent.sections.app }}
        </h2>
        <ul class="p-profile__link-list list-unstyled">
          <li v-for="link in appLinks" :key="link.key" class="p-profile__link-row">
            <span class="p-profile__link-label wf-type-body">{{ link.label }}</span>
            <span class="p-profile__link-chevron" aria-hidden="true">›</span>
          </li>
        </ul>
      </section>

      <!-- Account actions section -->
      <section class="p-profile__section">
        <h2 class="p-profile__section-label wf-type-eyebrow">
          {{ profileContent.sections.accountActions }}
        </h2>
        <div class="p-profile__actions">
          <button class="p-profile__action-btn">
            {{ profileContent.accountActions.signOut }}
          </button>
          <button class="p-profile__action-btn p-profile__action-btn--danger">
            {{ profileContent.accountActions.deleteAccount }}
          </button>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { profileContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'

const router = useRouter()

const appLinks = [
  { key: 'faq', label: profileContent.app.faqSupport },
  { key: 'manual', label: profileContent.app.gameManual },
  { key: 'terms', label: profileContent.app.termsOfService },
  { key: 'privacy', label: profileContent.app.privacyPolicy },
]

function handleBack(): void {
  router.push(ROUTES.MENU)
}

function handleFriends(): void {
  router.push(ROUTES.FRIENDS)
}
</script>

<style lang="scss" src="./ProfilePage.scss" />
