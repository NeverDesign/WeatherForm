import type { GameState, GameEvent, PlayerState } from '@/types/game'
import { ELEMENT_MULTIPLIERS } from '@/types/game'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function posKey(x: number, y: number): string {
  return `${x},${y}`
}

/** Apply element damage multiplier using integer math — never floats. */
function scaleDamage(baseDamage: number, attackerElement: string, defenderElement: string): number {
  const key = `${attackerElement}_vs_${defenderElement}`
  const multiplier = ELEMENT_MULTIPLIERS[key] ?? 100
  return Math.floor((baseDamage * multiplier) / 100)
}

/** Decrement all ability cooldowns by 1, removing any that reach 0. */
function tickCooldowns(player: PlayerState): PlayerState {
  const updated: Record<string, number> = {}
  for (const [abilityId, turns] of Object.entries(player.abilityCooldowns)) {
    const next = turns - 1
    if (next > 0) {
      updated[abilityId] = next
    }
  }
  return { ...player, abilityCooldowns: updated }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

/**
 * Pure game reducer.
 *
 * (GameState, GameEvent) → GameState
 *
 * - No side effects
 * - Never mutates the input state (structuredClone for deep copies)
 * - Integer damage math only: Math.floor(baseDamage * multiplier / 100)
 * - Unknown event types return state unchanged
 */
export function gameReducer(state: GameState, event: GameEvent): GameState {
  switch (event.type) {
    case 'MOVE': {
      const next = structuredClone(state)
      const fromKey = posKey(event.from.x, event.from.y)
      const toKey   = posKey(event.to.x,   event.to.y)

      const piece = next.board[fromKey]
      if (!piece) {
        // No piece at source — log and return unchanged
        next.eventLog.push(event)
        return next
      }

      // Move piece to new square
      delete next.board[fromKey]
      next.board[toKey] = { ...piece, position: { x: event.to.x, y: event.to.y } }
      next.eventLog.push(event)
      return next
    }

    case 'ATTACK': {
      const next = structuredClone(state)

      const attackerKey = posKey(event.from.x, event.from.y)
      const targetKey   = posKey(event.to.x,   event.to.y)

      const attacker = next.board[attackerKey]
      const target   = next.board[targetKey]

      if (!attacker || !target) {
        next.eventLog.push(event)
        return next
      }

      const targetOwner = target.owner // 'P1' | 'P2'
      const targetPlayer = next.players[targetOwner]

      // Scale damage by attacker vs. defender element
      const scaledDamage = scaleDamage(event.damage, attacker.element, target.element)

      // Deduct HP — clamp at 0
      const newHp = Math.max(0, targetPlayer.hp - scaledDamage)
      next.players[targetOwner] = {
        ...targetPlayer,
        hp: newHp,
        pieceIds: targetPlayer.pieceIds.filter(id => id !== target.id),
      }

      // Remove captured piece from board
      delete next.board[targetKey]

      // Move attacker to target square
      delete next.board[attackerKey]
      next.board[targetKey] = { ...attacker, position: { x: event.to.x, y: event.to.y } }

      next.eventLog.push(event)

      // Auto-trigger GAME_OVER if HP reaches zero
      if (newHp === 0) {
        const winner = targetOwner === 'P1' ? 'P2' : 'P1'
        const gameOverEvent: GameEvent = { type: 'GAME_OVER', winner, reason: 'HP_ZERO' }
        return gameReducer(next, gameOverEvent)
      }

      return next
    }

    case 'USE_ABILITY': {
      const next = structuredClone(state)
      const player = next.players[event.playerId]

      // Set cooldown for the ability (cooldown value comes from the ability registry in Phase 6;
      // for Phase 2 we record a fixed 2-turn cooldown as a placeholder so the structure is correct)
      const existingCooldown = player.abilityCooldowns[event.abilityId]
      if (!existingCooldown || existingCooldown <= 0) {
        next.players[event.playerId] = {
          ...player,
          abilityCooldowns: {
            ...player.abilityCooldowns,
            [event.abilityId]: 2,
          },
        }
      }
      // Effect application is deferred to Phase 6 when abilities are designed

      next.eventLog.push(event)
      return next
    }

    case 'END_TURN': {
      const next = structuredClone(state)

      // Flip turn
      next.turn = next.turn === 'P1' ? 'P2' : 'P1'
      next.turnNumber += 1

      // Decrement cooldowns for both players
      next.players.P1 = tickCooldowns(next.players.P1)
      next.players.P2 = tickCooldowns(next.players.P2)

      next.eventLog.push(event)
      return next
    }

    case 'RESIGN': {
      const next = structuredClone(state)
      const winner = event.playerId === 'P1' ? 'P2' : 'P1'
      next.winner = winner
      next.phase  = 'complete'
      next.eventLog.push(event)
      return next
    }

    case 'GAME_OVER': {
      const next = structuredClone(state)
      next.winner = event.winner
      next.phase  = 'complete'
      next.eventLog.push(event)
      return next
    }

    default: {
      // Exhaustiveness guard — unknown events return state unchanged
      const next = structuredClone(state)
      return next
    }
  }
}
