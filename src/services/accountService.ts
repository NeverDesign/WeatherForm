import { supabase } from '@/lib/supabase'
import type { Account } from '@/types/auth'

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface AccountRow {
  id: string
  display_name: string
  player_tag: string
  created_at: string
}

function generatePlayerTag(displayName: string): string {
  const base = displayName.replace(/\s+/g, '').slice(0, 16) || 'Player'
  const digits = String(Math.floor(1000 + Math.random() * 9000))
  return `${base}#${digits}`
}

async function currentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return user.id
}

async function currentUserEmail(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email ?? ''
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

export const accountService = {
  async getAccount(userId: string): Promise<Account> {
    const email = await currentUserEmail()
    const { data, error } = await supabase
      .from('accounts')
      .select('id, display_name, player_tag, created_at')
      .eq('id', userId)
      .single<AccountRow>()

    if (error) throw new Error(error.message)
    return rowToAccount(data, email)
  },

  async updateDisplayName(newName: string): Promise<Account> {
    const uid = await currentUserId()
    const email = await currentUserEmail()
    const newTag = generatePlayerTag(newName)

    const { data, error } = await supabase
      .from('accounts')
      .update({ display_name: newName, player_tag: newTag })
      .eq('id', uid)
      .select('id, display_name, player_tag, created_at')
      .single<AccountRow>()

    if (error) throw new Error(error.message)
    return rowToAccount(data, email)
  },

  async deleteAccount(): Promise<void> {
    const uid = await currentUserId()

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', uid)

    if (error) throw new Error(error.message)

    // Client-side: sign out after deleting the accounts row.
    // Auth record deletion requires server-side admin access.
    await supabase.auth.signOut()
  },

  async searchByTag(tag: string): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('id, display_name, player_tag, created_at')
      .ilike('player_tag', `%${tag}%`)
      .limit(20)
      .returns<AccountRow[]>()

    if (error) throw new Error(error.message)

    // We don't have emails for other users — omit them
    return (data ?? []).map(row => ({
      id: row.id,
      displayName: row.display_name,
      playerTag: row.player_tag,
      email: '',
      createdAt: row.created_at,
    }))
  },
}
