---
feature: phase2-reducer
agent: orchestrator
status: complete
timestamp: 2026-04-15
---
brief: >
  Implement the pure game reducer for WeatherForm. This is the core state
  transition function (GameState, GameEvent) → GameState for the chess variant.
  All game logic — moves, attacks, abilities, turn ending, resignation, and
  game over — flows through this function. No side effects, no framework
  dependencies.

screens: []

entities:
  GameState: { id: string, phase: GamePhase, turn: 'P1'|'P2', turnNumber: number, players: { P1: PlayerState, P2: PlayerState }, board: BoardState, eventLog: GameEvent[], winner: 'P1'|'P2'|'DRAW'|null }
  PlayerState: { hp: number, element: Element, pieceIds: string[], abilityCooldowns: Record<string,number> }
  GameEvent: "discriminated union — MOVE | ATTACK | USE_ABILITY | END_TURN | RESIGN | GAME_OVER"
  BoardState: "Record<string, Piece> keyed by 'x,y'"

interactions:
  - "MOVE → moves piece on board, updates position, appends event to log"
  - "ATTACK → applies element-scaled damage to target player HP, removes captured piece from board and pieceIds, appends event"
  - "USE_ABILITY → sets/decrements ability cooldown on acting player, applies target effect if targetSquare provided, appends event"
  - "END_TURN → flips turn (P1↔P2), increments turnNumber, decrements all active cooldowns by 1, appends event"
  - "RESIGN → sets winner to opponent, sets phase to 'complete', appends event"
  - "GAME_OVER → sets winner and phase, appends event"

constraints:
  - Pure function — no Pinia, Vue, or any side effects
  - structuredClone for all state copies — no mutation of input
  - Integer damage math only: Math.floor(baseDamage * multiplier / 100)
  - ELEMENT_MULTIPLIERS key format: "${attacker}_vs_${defender}" e.g. "TIDE_vs_DUNE"
  - ELEMENT_MULTIPLIERS imported from src/types/game.ts (not src/types/index.ts)
  - Starting HP is 100 per player
  - state must be safe for JSON round-trips — no class instances
  - Unknown events must not throw — return state unchanged

unknowns:
  - USE_ABILITY effect application is open-ended (abilities not yet designed in Phase 6); for Phase 2, record the cooldown and log the event only — effect logic is deferred

sequence:
  - backend
  - qa
