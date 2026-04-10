<template>
  <div class="p-auth" data-testid="page-auth">
    <h1 class="visually-hidden">{{ commonContent.appName }}</h1>

    <!-- Form panel -->
    <div class="p-auth__form-panel">

      <AppLogo size="sm" />

      <!-- Tab toggle -->
      <div class="p-auth__tabs" role="tablist">
        <button
          class="p-auth__tab"
          :class="{ 'p-auth__tab--active': activeTab === 'signin' }"
          role="tab"
          @click="activeTab = 'signin'"
        >{{ authContent.tabs.signIn }}</button>
        <button
          class="p-auth__tab"
          :class="{ 'p-auth__tab--active': activeTab === 'register' }"
          role="tab"
          @click="activeTab = 'register'"
        >{{ authContent.tabs.createAccount }}</button>
      </div>

      <!-- Sign In form -->
      <form v-if="activeTab === 'signin'" class="p-auth__form" @submit.prevent="handleLogin" novalidate>
        <div class="p-auth__field" :class="{ 'p-auth__field--error': loginErrors.email }">
          <label class="p-auth__label" for="signin-email">{{ authContent.signIn.email.label }}</label>
          <input
            id="signin-email"
            v-model="loginForm.email"
            type="email"
            class="p-auth__input"
            :placeholder="authContent.signIn.email.placeholder"
            autocomplete="email"
          />
          <span v-if="loginErrors.email" class="p-auth__error">{{ loginErrors.email }}</span>
        </div>
        <div class="p-auth__field" :class="{ 'p-auth__field--error': loginErrors.password }">
          <label class="p-auth__label" for="signin-password">{{ authContent.signIn.password.label }}</label>
          <input
            id="signin-password"
            v-model="loginForm.password"
            type="password"
            class="p-auth__input"
            :placeholder="authContent.signIn.password.placeholder"
            autocomplete="current-password"
          />
          <span v-if="loginErrors.password" class="p-auth__error">{{ loginErrors.password }}</span>
        </div>
        <p v-if="authStore.error" class="p-auth__api-error">{{ authStore.error }}</p>
        <button type="submit" class="p-auth__submit" :disabled="authStore.loading">
          {{ authContent.signIn.submit }}
        </button>
        <a href="#" class="p-auth__forgot" @click.prevent>{{ authContent.signIn.forgotPassword }}</a>
      </form>

      <!-- Create Account form -->
      <form v-if="activeTab === 'register'" class="p-auth__form" @submit.prevent="handleRegister" novalidate>
        <div class="p-auth__field" :class="{ 'p-auth__field--error': registerErrors.displayName }">
          <label class="p-auth__label" for="reg-displayname">{{ authContent.createAccount.displayName.label }}</label>
          <input
            id="reg-displayname"
            v-model="registerForm.displayName"
            type="text"
            class="p-auth__input"
            :placeholder="authContent.createAccount.displayName.placeholder"
            autocomplete="nickname"
          />
          <span v-if="registerErrors.displayName" class="p-auth__error">{{ registerErrors.displayName }}</span>
        </div>
        <div class="p-auth__field">
          <label class="p-auth__label" for="reg-tag">{{ authContent.createAccount.playerTag.label }}</label>
          <input
            id="reg-tag"
            :value="playerTagPreview"
            type="text"
            class="p-auth__input p-auth__input--readonly"
            readonly
            :placeholder="authContent.createAccount.playerTag.placeholder"
          />
          <span class="p-auth__hint">{{ authContent.createAccount.playerTag.hint }}</span>
        </div>
        <div class="p-auth__field" :class="{ 'p-auth__field--error': registerErrors.email }">
          <label class="p-auth__label" for="reg-email">{{ authContent.createAccount.email.label }}</label>
          <input
            id="reg-email"
            v-model="registerForm.email"
            type="email"
            class="p-auth__input"
            :placeholder="authContent.createAccount.email.placeholder"
            autocomplete="email"
          />
          <span v-if="registerErrors.email" class="p-auth__error">{{ registerErrors.email }}</span>
        </div>
        <div class="p-auth__field" :class="{ 'p-auth__field--error': registerErrors.password }">
          <label class="p-auth__label" for="reg-password">{{ authContent.createAccount.password.label }}</label>
          <input
            id="reg-password"
            v-model="registerForm.password"
            type="password"
            class="p-auth__input"
            :placeholder="authContent.createAccount.password.placeholder"
            autocomplete="new-password"
          />
          <span v-if="registerErrors.password" class="p-auth__error">{{ registerErrors.password }}</span>
        </div>
        <p v-if="authStore.error" class="p-auth__api-error">{{ authStore.error }}</p>
        <button type="submit" class="p-auth__submit" :disabled="authStore.loading">
          {{ authContent.createAccount.submit }}
        </button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/types'
import { useAuthStore } from '@/stores/useAuthStore'
import type { LoginCredentials, RegisterCredentials } from '@/types/auth'
import { authContent, commonContent, errorContent } from '@/content'
import AppLogo from '@/components/brand/AppLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

// ── Tab ──────────────────────────────────────────────────────────────────────

const activeTab = ref<'signin' | 'register'>('signin')

// ── Form state ───────────────────────────────────────────────────────────────

const loginForm = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const registerForm = reactive<RegisterCredentials>({
  displayName: '',
  email: '',
  password: '',
})

// ── Player tag preview ───────────────────────────────────────────────────────

const playerTagPreview = computed<string>(() => {
  if (!registerForm.displayName.trim()) return '#0000'
  const camel = registerForm.displayName
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  return `${camel}#0000`
})

// ── Validation errors ─────────────────────────────────────────────────────────

const loginErrors = reactive<Record<string, string>>({})
const registerErrors = reactive<Record<string, string>>({})

function validateLogin(): boolean {
  const errors: Record<string, string> = {}
  if (!loginForm.email.trim()) {
    errors.email = errorContent.validation.email.required
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
    errors.email = errorContent.validation.email.invalid
  }
  if (!loginForm.password) {
    errors.password = errorContent.validation.password.required
  } else if (loginForm.password.length < 8) {
    errors.password = errorContent.validation.password.tooShort
  }
  Object.assign(loginErrors, errors)
  // Clear keys not present in new errors
  for (const key of Object.keys(loginErrors)) {
    if (!(key in errors)) delete loginErrors[key]
  }
  return Object.keys(errors).length === 0
}

function validateRegister(): boolean {
  const errors: Record<string, string> = {}
  if (!registerForm.displayName.trim()) {
    errors.displayName = errorContent.validation.displayName.required
  } else if (registerForm.displayName.trim().length < 2) {
    errors.displayName = errorContent.validation.displayName.tooShort
  } else if (registerForm.displayName.trim().length > 32) {
    errors.displayName = errorContent.validation.displayName.tooLong
  }
  if (!registerForm.email.trim()) {
    errors.email = errorContent.validation.email.required
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    errors.email = errorContent.validation.email.invalid
  }
  if (!registerForm.password) {
    errors.password = errorContent.validation.password.required
  } else if (registerForm.password.length < 8) {
    errors.password = errorContent.validation.password.tooShort
  }
  Object.assign(registerErrors, errors)
  for (const key of Object.keys(registerErrors)) {
    if (!(key in errors)) delete registerErrors[key]
  }
  return Object.keys(errors).length === 0
}

// ── Submit handlers ───────────────────────────────────────────────────────────

async function handleLogin(): Promise<void> {
  if (!validateLogin()) return
  await authStore.login(loginForm)
  if (!authStore.error) {
    router.push(ROUTES.MENU)
  }
}

async function handleRegister(): Promise<void> {
  if (!validateRegister()) return
  await authStore.register(registerForm)
  if (!authStore.error) {
    router.push(ROUTES.MENU)
  }
}
</script>

<style lang="scss" src="./AuthPage.scss" />
