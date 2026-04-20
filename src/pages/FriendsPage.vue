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
          @keydown.enter="handleSearch"
        />
        <button
          class="p-friends__search-btn"
          :disabled="searchLoading"
          @click="handleSearch"
        >
          {{ friendsContent.search.submitAction }}
        </button>
      </div>

      <!-- Search feedback -->
      <p
        v-if="searchFeedback"
        class="p-friends__search-feedback"
        :class="searchFeedbackError ? 'p-friends__search-feedback--error' : 'p-friends__search-feedback--success'"
        aria-live="polite"
      >
        {{ searchFeedback }}
      </p>

      <!-- Search results -->
      <ul v-if="searchResults.length > 0" class="p-friends__result-list list-unstyled">
        <li
          v-for="result in searchResults"
          :key="result.id"
          class="p-friends__result-row"
        >
          <div class="p-friends__result-info">
            <span class="p-friends__result-name wf-type-body">{{ result.displayName }}</span>
            <span class="p-friends__result-tag wf-type-caption">{{ result.playerTag }}</span>
          </div>
          <button
            class="p-friends__result-action"
            :disabled="sendingRequests.has(result.id)"
            @click="handleSendRequest(result.id)"
          >
            {{ friendsContent.search.submitAction }}
          </button>
        </li>
      </ul>

      <!-- Pending requests section -->
      <section class="p-friends__section">
        <h2 class="p-friends__section-label wf-type-eyebrow">
          {{ friendsContent.sections.pending }}
        </h2>

        <ul v-if="pendingList.length > 0" class="p-friends__pending-list list-unstyled">
          <li
            v-for="entry in pendingList"
            :key="entry.requestId"
            class="p-friends__pending-row"
          >
            <div class="p-friends__pending-info">
              <span class="p-friends__pending-name wf-type-body">{{ entry.account.displayName }}</span>
              <span class="p-friends__pending-label wf-type-caption">
                {{ friendsContent.pendingRow.incomingLabel }}
              </span>
            </div>
            <div class="p-friends__pending-actions">
              <button
                class="p-friends__pending-accept"
                :disabled="respondingRequests.has(entry.requestId)"
                @click="handleAccept(entry.requestId)"
              >
                {{ friendsContent.pendingRow.acceptAction }}
              </button>
              <button
                class="p-friends__pending-decline"
                :disabled="respondingRequests.has(entry.requestId)"
                @click="handleDecline(entry.requestId)"
              >
                {{ friendsContent.pendingRow.declineAction }}
              </button>
            </div>
          </li>
        </ul>

        <!-- Empty pending state -->
        <p v-else class="p-friends__empty-pending wf-type-caption">
          {{ friendsContent.emptyState.pending.heading }}
        </p>
      </section>

      <!-- Friends section -->
      <section class="p-friends__section">
        <h2 class="p-friends__section-label wf-type-eyebrow">
          {{ friendsContent.sections.friends }}
        </h2>

        <ul v-if="friendsList.length > 0" class="p-friends__friends-list list-unstyled">
          <li
            v-for="entry in friendsList"
            :key="entry.requestId"
            class="p-friends__friend-row"
          >
            <div class="p-friends__friend-info">
              <span class="p-friends__friend-name wf-type-body">{{ entry.account.displayName }}</span>
              <span class="p-friends__friend-tag wf-type-caption">{{ entry.account.playerTag }}</span>
            </div>

            <!-- Block confirm expansion -->
            <template v-if="blockConfirmId === entry.requestId">
              <div class="p-friends__block-confirm" role="region" aria-live="assertive">
                <p class="p-friends__block-confirm-heading wf-type-caption">
                  {{ friendsContent.friendRow.blockConfirmHeading }}
                </p>
                <p class="p-friends__block-confirm-body wf-type-caption">
                  {{ friendsContent.friendRow.blockConfirmBody }}
                </p>
                <div class="p-friends__block-confirm-actions">
                  <button
                    class="p-friends__block-confirm-cta"
                    :disabled="blockingUsers.has(entry.account.id)"
                    @click="handleBlock(entry.account.id)"
                  >
                    {{ friendsContent.friendRow.blockConfirmCta }}
                  </button>
                  <button
                    class="p-friends__block-cancel"
                    @click="blockConfirmId = null"
                  >
                    {{ friendsContent.friendRow.blockCancelCta }}
                  </button>
                </div>
              </div>
            </template>

            <!-- Challenge / Block buttons -->
            <template v-else>
              <!-- Challenge: inline element picker -->
              <template v-if="challengeTargetId === entry.account.id">
                <div class="p-friends__challenge-picker" role="group" aria-label="Choose your element">
                  <button
                    v-for="el in ELEMENTS"
                    :key="el"
                    class="p-friends__element-btn"
                    :class="`p-friends__element-btn--${el.toLowerCase()}`"
                    :disabled="challengingUsers.has(entry.account.id)"
                    @click="handleChallenge(el)"
                  >
                    {{ el }}
                  </button>
                  <button
                    class="p-friends__challenge-cancel"
                    @click="challengeTargetId = null"
                  >
                    {{ friendsContent.friendRow.blockCancelCta }}
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="p-friends__friend-actions">
                  <button
                    class="p-friends__challenge-btn"
                    @click="challengeTargetId = entry.account.id"
                  >
                    {{ friendsContent.friendRow.challengeAction }}
                  </button>
                  <button
                    class="p-friends__block-btn"
                    @click="blockConfirmId = entry.requestId"
                  >
                    {{ friendsContent.friendRow.blockAction }}
                  </button>
                </div>
              </template>
            </template>

          </li>
        </ul>

        <!-- Empty friends state -->
        <div v-else class="p-friends__empty">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import type { Element } from '@/types'
import { friendsContent } from '@/content'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import { accountService } from '@/services/accountService'
import { friendService } from '@/services/friendService'
import { gameService } from '@/services/gameService'
import type { Account, FriendEntry } from '@/types/auth'

const ELEMENTS: Element[] = ['TIDE', 'GALE', 'DUNE']

const router = useRouter()

// ── Navigation ────────────────────────────────────────────────────────────────

function handleBack(): void {
  router.push(ROUTES.MENU)
}

function handleProfile(): void {
  router.push(ROUTES.PROFILE)
}

// ── Search ────────────────────────────────────────────────────────────────────

const searchQuery = ref('')
const searchResults = ref<Account[]>([])
const searchLoading = ref(false)
const searchFeedback = ref<string | null>(null)
const searchFeedbackError = ref(false)
const sendingRequests = ref<Set<string>>(new Set())

async function handleSearch(): Promise<void> {
  const query = searchQuery.value.trim()
  if (!query) return

  searchLoading.value = true
  searchFeedback.value = null
  searchResults.value = []

  try {
    const results = await accountService.searchByTag(query)
    searchResults.value = results
    if (results.length === 0) {
      searchFeedback.value = friendsContent.search.notFoundError
      searchFeedbackError.value = true
    }
  } catch {
    searchFeedback.value = friendsContent.search.requestFailed
    searchFeedbackError.value = true
  } finally {
    searchLoading.value = false
  }
}

async function handleSendRequest(accountId: string): Promise<void> {
  const next = new Set(sendingRequests.value)
  next.add(accountId)
  sendingRequests.value = next

  searchFeedback.value = null

  try {
    await friendService.sendRequest(accountId)
    searchFeedback.value = friendsContent.search.requestSent
    searchFeedbackError.value = false
    // Remove the sent account from results
    searchResults.value = searchResults.value.filter(r => r.id !== accountId)
  } catch {
    searchFeedback.value = friendsContent.search.requestFailed
    searchFeedbackError.value = true
  } finally {
    const updated = new Set(sendingRequests.value)
    updated.delete(accountId)
    sendingRequests.value = updated
  }
}

// ── Pending requests ──────────────────────────────────────────────────────────

const pendingList = ref<FriendEntry[]>([])
const respondingRequests = ref<Set<string>>(new Set())

async function loadPending(): Promise<void> {
  try {
    pendingList.value = await friendService.listPending()
  } catch {
    // non-critical — show empty state
  }
}

async function handleAccept(requestId: string): Promise<void> {
  const next = new Set(respondingRequests.value)
  next.add(requestId)
  respondingRequests.value = next
  try {
    await friendService.acceptRequest(requestId)
    await Promise.all([loadPending(), loadFriends()])
  } catch {
    // silent — list stays the same
  } finally {
    const updated = new Set(respondingRequests.value)
    updated.delete(requestId)
    respondingRequests.value = updated
  }
}

async function handleDecline(requestId: string): Promise<void> {
  const next = new Set(respondingRequests.value)
  next.add(requestId)
  respondingRequests.value = next
  try {
    await friendService.declineRequest(requestId)
    await loadPending()
  } catch {
    // silent
  } finally {
    const updated = new Set(respondingRequests.value)
    updated.delete(requestId)
    respondingRequests.value = updated
  }
}

// ── Friends list ──────────────────────────────────────────────────────────────

const friendsList = ref<FriendEntry[]>([])
const blockConfirmId = ref<string | null>(null)
const blockingUsers = ref<Set<string>>(new Set())

async function loadFriends(): Promise<void> {
  try {
    friendsList.value = await friendService.listFriends()
  } catch {
    // non-critical
  }
}

async function handleBlock(accountId: string): Promise<void> {
  const next = new Set(blockingUsers.value)
  next.add(accountId)
  blockingUsers.value = next
  try {
    await friendService.blockUser(accountId)
    blockConfirmId.value = null
    await loadFriends()
  } catch {
    // silent
  } finally {
    const updated = new Set(blockingUsers.value)
    updated.delete(accountId)
    blockingUsers.value = updated
  }
}

// ── Challenge flow ────────────────────────────────────────────────────────────

const challengeTargetId = ref<string | null>(null)
const challengingUsers = ref<Set<string>>(new Set())

async function handleChallenge(element: Element): Promise<void> {
  if (!challengeTargetId.value) return
  const targetId = challengeTargetId.value

  const next = new Set(challengingUsers.value)
  next.add(targetId)
  challengingUsers.value = next

  try {
    const gameState = await gameService.createGame(element)
    challengeTargetId.value = null
    router.push(`/game/${gameState.id}`)
  } catch {
    // silent — element picker stays open
  } finally {
    const updated = new Set(challengingUsers.value)
    updated.delete(targetId)
    challengingUsers.value = updated
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

onMounted(() => {
  loadPending()
  loadFriends()
})
</script>

<style lang="scss" src="./FriendsPage.scss" />
