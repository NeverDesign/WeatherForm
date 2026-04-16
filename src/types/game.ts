import type { Element } from '@/types'

// ─── Piece ───────────────────────────────────────────────────────────────────

export type PieceType = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING'

export interface Square {
  x: number // 0 = left from P1's perspective
  y: number // 0 = bottom from P1's perspective
}

export interface Piece {
  id: string
  type: PieceType
  element: Element
  position: Square
  owner: 'P1' | 'P2'
}

// ─── Board ───────────────────────────────────────────────────────────────────

/** Keyed by "x,y" string — e.g. "3,4" */
export type BoardState = Record<string, Piece>

// ─── Players ─────────────────────────────────────────────────────────────────

export interface PlayerState {
  hp: number
  element: Element
  /** IDs of pieces still on the board */
  pieceIds: string[]
  /** Ability cooldowns keyed by ability id */
  abilityCooldowns: Record<string, number>
}

// ─── Events ──────────────────────────────────────────────────────────────────

export type GamePhase = 'waiting' | 'active' | 'complete'

export type GameEvent =
  | { type: 'MOVE';        pieceId: string; from: Square; to: Square }
  | { type: 'ATTACK';      attackerId: string; targetId: string; from: Square; to: Square; damage: number }
  | { type: 'USE_ABILITY'; abilityId: string; playerId: 'P1' | 'P2'; targetSquare?: Square }
  | { type: 'END_TURN';    playerId: 'P1' | 'P2' }
  | { type: 'RESIGN';      playerId: 'P1' | 'P2' }
  | { type: 'GAME_OVER';   winner: 'P1' | 'P2' | 'DRAW'; reason: 'RESIGN' | 'HP_ZERO' | 'STALEMATE' }

// ─── Game State ───────────────────────────────────────────────────────────────

export interface GameState {
  id: string
  phase: GamePhase
  turn: 'P1' | 'P2'
  turnNumber: number
  players: {
    P1: PlayerState
    P2: PlayerState
  }
  board: BoardState
  eventLog: GameEvent[]
  winner: 'P1' | 'P2' | 'DRAW' | null
}

// ─── Element multipliers ─────────────────────────────────────────────────────

/**
 * Integer damage multipliers (×100 scale).
 * TIDE beats DUNE, GALE beats TIDE, DUNE beats GALE.
 * Apply as: Math.floor(baseDamage * multiplier / 100)
 */
export const ELEMENT_MULTIPLIERS: Record<string, number> = {
  TIDE_vs_DUNE: 150,
  TIDE_vs_GALE:  50,
  TIDE_vs_TIDE: 100,
  GALE_vs_TIDE: 150,
  GALE_vs_DUNE:  50,
  GALE_vs_GALE: 100,
  DUNE_vs_GALE: 150,
  DUNE_vs_TIDE:  50,
  DUNE_vs_DUNE: 100,
}
