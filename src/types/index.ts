export type Element = 'TIDE' | 'GALE' | 'DUNE'

export type {
  PieceType,
  Square,
  Piece,
  BoardState,
  PlayerState,
  GamePhase,
  GameEvent,
  GameState,
} from './game'

export { ELEMENT_MULTIPLIERS } from './game'

export const ROUTES = {
  SPLASH:  '/',
  AUTH:    '/auth',
  MENU:    '/menu',
  GAME:    '/game/:id',
  SETS:    '/sets',
  PROFILE: '/profile',
  FRIENDS: '/friends',
  HELP:      '/help',
  STYLES:    '/styles',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const

export const ELEMENT_COLOURS: Record<Element, { base: string; accent: string; bg: string }> = {
  TIDE: { base: '#0077B6', accent: '#00B4D8', bg: '#0D3D6B' },
  GALE: { base: '#CBD5E1', accent: '#F1F5F9', bg: '#2A3A4A' },
  DUNE: { base: '#A84510', accent: '#D96728', bg: '#3D1A0A' },
}
