import { supabase } from '@/lib/supabase'
import type { FriendEntry, FriendRequest } from '@/types/auth'

// ─── DB row shapes ────────────────────────────────────────────────────────────

interface FriendRequestRow {
  id: string
  from_id: string
  to_id: string
  status: string
  created_at: string
}

interface FriendRequestWithAccount {
  id: string
  from_id: string
  to_id: string
  status: string
  created_at: string
  from_account: {
    id: string
    display_name: string
    player_tag: string
    created_at: string
  } | null
  to_account: {
    id: string
    display_name: string
    player_tag: string
    created_at: string
  } | null
}

async function currentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return user.id
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const friendService = {
  async sendRequest(toAccountId: string): Promise<FriendRequest> {
    const uid = await currentUserId()

    const { data, error } = await supabase
      .from('friend_requests')
      .insert({ from_id: uid, to_id: toAccountId, status: 'pending' })
      .select('id, from_id, to_id, status, created_at')
      .single<FriendRequestRow>()

    if (error) throw new Error(error.message)
    return {
      id: data.id,
      fromId: data.from_id,
      toId: data.to_id,
      status: data.status as FriendRequest['status'],
      createdAt: data.created_at,
    }
  },

  async acceptRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId)

    if (error) throw new Error(error.message)
  },

  async declineRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'declined' })
      .eq('id', requestId)

    if (error) throw new Error(error.message)
  },

  async blockUser(toAccountId: string): Promise<void> {
    const uid = await currentUserId()

    // Upsert: if a request exists (either direction from this user), update it to blocked.
    // Try to update an existing outgoing request first.
    const { data: existing } = await supabase
      .from('friend_requests')
      .select('id')
      .eq('from_id', uid)
      .eq('to_id', toAccountId)
      .maybeSingle<{ id: string }>()

    if (existing) {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'blocked' })
        .eq('id', existing.id)
      if (error) throw new Error(error.message)
    } else {
      // Insert a new blocked request
      const { error } = await supabase
        .from('friend_requests')
        .insert({ from_id: uid, to_id: toAccountId, status: 'blocked' })
      if (error) throw new Error(error.message)
    }
  },

  async listFriends(): Promise<FriendEntry[]> {
    const uid = await currentUserId()

    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id,
        from_id,
        to_id,
        status,
        created_at,
        from_account:accounts!friend_requests_from_id_fkey(id, display_name, player_tag, created_at),
        to_account:accounts!friend_requests_to_id_fkey(id, display_name, player_tag, created_at)
      `)
      .eq('status', 'accepted')
      .or(`from_id.eq.${uid},to_id.eq.${uid}`)
      .returns<FriendRequestWithAccount[]>()

    if (error) throw new Error(error.message)

    return (data ?? []).map(row => {
      const isFrom = row.from_id === uid
      const otherAccount = isFrom ? row.to_account : row.from_account
      return {
        requestId: row.id,
        account: {
          id: otherAccount?.id ?? '',
          displayName: otherAccount?.display_name ?? '',
          playerTag: otherAccount?.player_tag ?? '',
          email: '',
          createdAt: otherAccount?.created_at,
        },
        status: 'accepted' as const,
      }
    })
  },

  async listPending(): Promise<FriendEntry[]> {
    const uid = await currentUserId()

    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id,
        from_id,
        to_id,
        status,
        created_at,
        from_account:accounts!friend_requests_from_id_fkey(id, display_name, player_tag, created_at)
      `)
      .eq('status', 'pending')
      .eq('to_id', uid)
      .returns<FriendRequestWithAccount[]>()

    if (error) throw new Error(error.message)

    return (data ?? []).map(row => ({
      requestId: row.id,
      account: {
        id: row.from_account?.id ?? '',
        displayName: row.from_account?.display_name ?? '',
        playerTag: row.from_account?.player_tag ?? '',
        email: '',
        createdAt: row.from_account?.created_at,
      },
      status: 'pending' as const,
    }))
  },
}
