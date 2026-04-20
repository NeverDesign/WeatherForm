import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Account, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { authService } from '@/services/authService'
import { errorContent } from '@/content'

export const useAuthStore = defineStore('auth', () => {
  const account = ref<Account | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // ── Session init ────────────────────────────────────────────────────────────
  // Called once on app startup. Restores account from existing Supabase session.

  async function initSession(): Promise<void> {
    try {
      account.value = await authService.getSession()
    } catch {
      account.value = null
    } finally {
      initialized.value = true
    }

    // Keep account in sync with Supabase auth state changes (login/logout/refresh)
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        account.value = null
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Refresh account from DB to pick up any display_name changes
        const refreshed = await authService.getSession()
        if (refreshed) account.value = refreshed
      }
    })
  }

  // ── Auth actions ─────────────────────────────────────────────────────────────

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

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      account.value = null
      error.value = null
    }
  }

  return { account, loading, error, initialized, login, register, logout, initSession }
})
