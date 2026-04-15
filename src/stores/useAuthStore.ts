import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { authService } from '@/services/authService'
import { errorContent } from '@/content'

export const useAuthStore = defineStore('auth', () => {
  const account = ref<Account | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null
    try {
      account.value = await authService.login(credentials)
    } catch (e) {
      error.value = e instanceof Error ? e.message : errorContent.api.loginFailed
    } finally {
      loading.value = false
    }
  }

  async function register(credentials: RegisterCredentials): Promise<void> {
    loading.value = true
    error.value = null
    try {
      account.value = await authService.register(credentials)
    } catch (e) {
      error.value = e instanceof Error ? e.message : errorContent.api.registrationFailed
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    authService.logout()
    account.value = null
    error.value = null
  }

  return { account, loading, error, login, register, logout }
})
