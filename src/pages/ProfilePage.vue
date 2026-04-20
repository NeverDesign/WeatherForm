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
          <span class="p-profile__avatar-initial wf-type-display">{{ avatarInitial }}</span>
        </div>
        <span class="p-profile__version wf-type-caption">{{ profileContent.version }}</span>
      </div>

      <!-- Account section -->
      <section class="p-profile__section">
        <h2 class="p-profile__section-label wf-type-eyebrow">
          {{ profileContent.sections.account }}
        </h2>
        <ul class="p-profile__field-list list-unstyled">

          <!-- Display Name row — inline edit -->
          <li class="p-profile__field-row" :class="{ 'p-profile__field-row--editing': editingName }">
            <span class="p-profile__field-label wf-type-caption">
              {{ profileContent.account.displayName.label }}
            </span>
            <template v-if="editingName">
              <input
                id="profile-display-name"
                v-model="nameInput"
                type="text"
                class="p-profile__field-input"
                :placeholder="profileContent.account.displayName.placeholder"
                :aria-describedby="nameFeedbackError && nameFeedback ? 'profile-name-error' : undefined"
                maxlength="32"
                @keydown.enter="saveDisplayName"
                @keydown.escape="cancelEditName"
              />
              <div class="p-profile__field-inline-actions">
                <button
                  class="p-profile__field-action"
                  :disabled="savingName"
                  @click="saveDisplayName"
                >
                  {{ profileContent.account.displayName.saveAction }}
                </button>
                <button
                  class="p-profile__field-action p-profile__field-action--cancel"
                  @click="cancelEditName"
                >
                  {{ profileContent.account.displayName.cancelAction }}
                </button>
              </div>
            </template>
            <template v-else>
              <span class="p-profile__field-value wf-type-body">
                {{ authStore.account?.displayName ?? '—' }}
              </span>
              <button class="p-profile__field-action" @click="startEditName">
                {{ profileContent.account.displayName.editAction }}
              </button>
            </template>
          </li>

          <!-- Name feedback row -->
          <li v-if="nameFeedback" class="p-profile__feedback-row" aria-live="polite">
            <span
              id="profile-name-error"
              class="p-profile__feedback"
              :class="nameFeedbackError ? 'p-profile__feedback--error' : 'p-profile__feedback--success'"
            >
              {{ nameFeedback }}
            </span>
          </li>

          <!-- Email row — no-op edit (post-MVP) -->
          <li class="p-profile__field-row">
            <span class="p-profile__field-label wf-type-caption">
              {{ profileContent.account.email.label }}
            </span>
            <span class="p-profile__field-value wf-type-body">
              {{ authStore.account?.email ?? '—' }}
            </span>
            <button class="p-profile__field-action" disabled aria-disabled="true">
              {{ profileContent.account.email.editAction }}
            </button>
          </li>

          <!-- Player Tag row — read-only -->
          <li class="p-profile__field-row">
            <span class="p-profile__field-label wf-type-caption">
              {{ profileContent.account.playerTag.label }}
            </span>
            <span
              class="p-profile__field-value p-profile__field-value--muted wf-type-body"
              :title="profileContent.account.playerTag.hint"
            >
              {{ authStore.account?.playerTag ?? '—' }}
            </span>
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

          <button class="p-profile__action-btn" @click="handleSignOut">
            {{ profileContent.accountActions.signOut }}
          </button>

          <!-- Delete account — inline confirm expansion -->
          <template v-if="confirmingDelete">
            <div class="p-profile__delete-confirm" role="region" aria-live="assertive">
              <p class="p-profile__delete-confirm-heading wf-type-body">
                {{ profileContent.accountActions.deleteConfirmHeading }}
              </p>
              <p class="p-profile__delete-confirm-body wf-type-caption">
                {{ profileContent.accountActions.deleteConfirmBody }}
              </p>
              <div class="p-profile__delete-confirm-actions">
                <button
                  class="p-profile__action-btn p-profile__action-btn--danger"
                  :disabled="deletingAccount"
                  @click="handleDeleteAccount"
                >
                  {{ profileContent.accountActions.deleteConfirmCta }}
                </button>
                <button
                  class="p-profile__action-btn"
                  @click="confirmingDelete = false"
                >
                  {{ profileContent.accountActions.deleteCancelCta }}
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <button
              class="p-profile__action-btn p-profile__action-btn--danger"
              @click="confirmingDelete = true"
            >
              {{ profileContent.accountActions.deleteAccount }}
            </button>
          </template>

        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { profileContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { accountService } from '@/services/accountService'

const router = useRouter()
const authStore = useAuthStore()

// ── Avatar ────────────────────────────────────────────────────────────────────

const avatarInitial = computed(() => {
  const name = authStore.account?.displayName ?? ''
  return name.charAt(0).toUpperCase() || 'W'
})

// ── App links ─────────────────────────────────────────────────────────────────

const appLinks = [
  { key: 'faq', label: profileContent.app.faqSupport },
  { key: 'manual', label: profileContent.app.gameManual },
  { key: 'terms', label: profileContent.app.termsOfService },
  { key: 'privacy', label: profileContent.app.privacyPolicy },
]

// ── Navigation ────────────────────────────────────────────────────────────────

function handleBack(): void {
  router.push(ROUTES.MENU)
}

function handleFriends(): void {
  router.push(ROUTES.FRIENDS)
}

// ── Inline display name edit ──────────────────────────────────────────────────

const editingName = ref(false)
const nameInput = ref('')
const savingName = ref(false)
const nameFeedback = ref<string | null>(null)
const nameFeedbackError = ref(false)

function startEditName(): void {
  nameInput.value = authStore.account?.displayName ?? ''
  nameFeedback.value = null
  editingName.value = true
}

function cancelEditName(): void {
  editingName.value = false
  nameFeedback.value = null
}

async function saveDisplayName(): Promise<void> {
  const trimmed = nameInput.value.trim()
  nameFeedback.value = null

  if (!trimmed) {
    nameFeedback.value = profileContent.account.displayName.errorRequired
    nameFeedbackError.value = true
    return
  }
  if (trimmed.length < 2) {
    nameFeedback.value = profileContent.account.displayName.errorTooShort
    nameFeedbackError.value = true
    return
  }
  if (trimmed.length > 32) {
    nameFeedback.value = profileContent.account.displayName.errorTooLong
    nameFeedbackError.value = true
    return
  }

  savingName.value = true
  try {
    const updated = await accountService.updateDisplayName(trimmed)
    authStore.account = updated
    editingName.value = false
    nameFeedback.value = profileContent.account.displayName.successMessage
    nameFeedbackError.value = false
  } catch {
    nameFeedback.value = profileContent.account.displayName.errorSaveFailed
    nameFeedbackError.value = true
  } finally {
    savingName.value = false
  }
}

// ── Sign out ──────────────────────────────────────────────────────────────────

async function handleSignOut(): Promise<void> {
  await authStore.logout()
  router.push(ROUTES.AUTH)
}

// ── Delete account ────────────────────────────────────────────────────────────

const confirmingDelete = ref(false)
const deletingAccount = ref(false)

async function handleDeleteAccount(): Promise<void> {
  deletingAccount.value = true
  try {
    await accountService.deleteAccount()
    authStore.account = null
    router.push(ROUTES.AUTH)
  } catch {
    // deleteAccount calls signOut internally, so we still redirect
    authStore.account = null
    router.push(ROUTES.AUTH)
  } finally {
    deletingAccount.value = false
  }
}
</script>

<style lang="scss" src="./ProfilePage.scss" />
