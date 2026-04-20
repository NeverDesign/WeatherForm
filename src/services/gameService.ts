import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { GameState, GameEvent } from '@/types/game'
import type { Element } from '@/types'
import { createGame } from '@/stores/useGameStore'
import { gameReducer } from '@/stores/gameReducer'

// ─── DB row shape ─────────────────────────────────────────────────────────────

interface GameRow {
  id: string
  p1_id: string
  p2_id: string | null
  p1_element: Element
  p2_element: Element | null
  state: GameState
  phase: string
  whose_turn: string | null
  created_at: string
  updated_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToState(row: GameRow): GameState {
  return { ...row.state, id: row.id }
}

async function currentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return user.id
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const gameService = {
  /**
   * Create a new game as P1. The game enters 'waiting' phase until an
   * opponent joins. A placeholder initial state is stored — it will be
   * replaced with the real starting board when P2 joins and their element
   * is known.
   */
  async createGame(p1Element: Element): Promise<GameState> {
    const uid = await currentUserId()

    // Placeholder state uses the same element for both sides; replaced on join
    const placeholderState = createGame(p1Element, p1Element)

    const { data, error } = await supabase
      .from('games')
      .insert({
        p1_id: uid,
        p1_element: p1Element,
        state: { ...placeholderState, phase: 'waiting' },
        phase: 'waiting',
        whose_turn: null,
      })
      .select()
      .single<GameRow>()

    if (error) throw error
    return rowToState(data)
  },

  /**
   * Join an open game as P2. Creates the real starting GameState from both
   * elements and transitions the game to 'active'.
   */
  async joinGame(gameId: string, p2Element: Element): Promise<GameState> {
    const uid = await currentUserId()

    // Fetch the game to get P1's element
    const { data: existing, error: fetchError } = await supabase
      .from('games')
      .select()
      .eq('id', gameId)
      .eq('phase', 'waiting')
      .single<GameRow>()

    if (fetchError) throw fetchError
    if (existing.p2_id) throw new Error('Game already has two players')

    const activeState = createGame(existing.p1_element, p2Element)
    const stateWithId: GameState = { ...activeState, id: gameId }

    const { data, error } = await supabase
      .from('games')
      .update({
        p2_id: uid,
        p2_element: p2Element,
        state: stateWithId,
        phase: 'active',
        whose_turn: 'P1',
      })
      .eq('id', gameId)
      .select()
      .single<GameRow>()

    if (error) throw error
    return rowToState(data)
  },

  /**
   * Fetch a single game by ID.
   */
  async getGame(gameId: string): Promise<GameState> {
    const { data, error } = await supabase
      .from('games')
      .select()
      .eq('id', gameId)
      .single<GameRow>()

    if (error) throw error
    return rowToState(data)
  },

  /**
   * List all games the current user is participating in, newest first.
   */
  async listGames(): Promise<GameState[]> {
    const uid = await currentUserId()

    const { data, error } = await supabase
      .from('games')
      .select()
      .or(`p1_id.eq.${uid},p2_id.eq.${uid}`)
      .order('updated_at', { ascending: false })
      .returns<GameRow[]>()

    if (error) throw error
    return (data ?? []).map(rowToState)
  },

  /**
   * Append a GameEvent to the event log, run it through the local reducer,
   * and persist the updated GameState snapshot back to Supabase.
   *
   * Both writes (game_events insert + games update) are independent — a
   * full transaction isn't available on the client; the event log is
   * authoritative and the state column is a cached snapshot.
   */
  async pushEvent(gameId: string, event: GameEvent): Promise<void> {
    // 1 — append to immutable event log
    const { error: insertError } = await supabase
      .from('game_events')
      .insert({ game_id: gameId, event })

    if (insertError) throw insertError

    // 2 — derive next state and update snapshot
    const { data: row, error: fetchError } = await supabase
      .from('games')
      .select()
      .eq('id', gameId)
      .single<GameRow>()

    if (fetchError) throw fetchError

    const currentState = rowToState(row)
    const nextState = gameReducer(currentState, event)

    const { error: updateError } = await supabase
      .from('games')
      .update({
        state: nextState,
        phase: nextState.phase,
        whose_turn: nextState.phase === 'complete' ? null : nextState.turn,
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameId)

    if (updateError) throw updateError
  },

  /**
   * Subscribe to live updates for a game via Supabase Realtime.
   * Calls `cb` with the full updated GameState whenever the game row changes.
   * Returns the channel so the caller can unsubscribe when done.
   *
   * Usage:
   *   const channel = gameService.subscribeToGame(id, state => store.reconcile(state))
   *   // on unmount:
   *   channel.unsubscribe()
   */
  subscribeToGame(
    gameId: string,
    cb: (state: GameState) => void,
  ): RealtimeChannel {
    return supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const row = payload.new as GameRow
          cb(rowToState(row))
        },
      )
      .subscribe()
  },
}
