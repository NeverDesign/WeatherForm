import { supabase } from '@/lib/supabase'
import type { Account, LoginCredentials, RegisterCredentials } from '@/types/auth'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generatePlayerTag(displayName: string): string {
  const base = displayName.replace(/\s+/g, '').slice(0, 16) || 'Player'
  const digits = String(Math.floor(1000 + Math.random() * 9000))
  return `${base}#${digits}`
}

interface AccountRow {
  id: string
  display_name: string
  player_tag: string
  created_at: string
}

function rowToAccount(row: AccountRow, email: string): Account {
  return {
    id: row.id,
    displayName: row.display_name,
    playerTag: row.player_tag,
    email,
    createdAt: row.created_at,
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const authService = {
  async login(credentials: LoginCredentials): Promise<Account> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Login failed: no user returned')

    const { data: row, error: rowError } = await supabase
      .from('accounts')
      .select('id, display_name, player_tag, created_at')
      .eq('id', data.user.id)
      .single<AccountRow>()

    if (rowError) throw new Error(rowError.message)
    return rowToAccount(row, data.user.email ?? credentials.email)
  },

  async register(credentials: RegisterCredentials): Promise<Account> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Registration failed: no user returned')

    const playerTag = generatePlayerTag(credentials.displayName)

    const { data: row, error: insertError } = await supabase
      .from('accounts')
      .insert({
        id: data.user.id,
        display_name: credentials.displayName,
        player_tag: playerTag,
      })
      .select('id, display_name, player_tag, created_at')
      .single<AccountRow>()

    if (insertError) throw new Error(insertError.message)
    return rowToAccount(row, data.user.email ?? credentials.email)
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async getSession(): Promise<Account | null> {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session?.user) return null

    const { data: row, error: rowError } = await supabase
      .from('accounts')
      .select('id, display_name, player_tag, created_at')
      .eq('id', session.user.id)
      .single<AccountRow>()

    if (rowError || !row) return null
    return rowToAccount(row, session.user.email ?? '')
  },
}
