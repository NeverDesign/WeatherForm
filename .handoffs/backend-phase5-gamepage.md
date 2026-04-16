---
feature: phase5-gamepage
agent: backend
status: complete
timestamp: 2026-04-15
---

completed:
  composables:
    - src/composables/useGameBoard.ts
      - boardRows: computed TileState[][] (8×8, y=7 top to y=0 bottom)
      - p1Hp, p2Hp, p1HpPercent, p2HpPercent: HP values and bar widths
      - currentTurn, canEndTurn: turn management
      - selectedPiece, validMoves: selection state
      - handleTileClick(boardX, boardY): selection + move dispatch
      - handleEndTurn, handleResign, toggleMoveLog: dock actions
      - moveLogOpen, eventLog, isReplay: move log panel state
      - handleLogRowClick(index), exitReplay: replay navigation
      - eventLabel(event): human-readable event strings

  tests:
    - src/composables/useGameBoard.test.ts (33 tests, all pass)

contract_for_frontend:
  types_available:
    - TileState: { piece, isSelected, isValidMove, isCapture, boardX, boardY }
      from '@/composables/useGameBoard'
    - ELEMENT_COLOURS: Record<Element, { base, accent, bg }>
      from '@/types' (use .base for piece colour)
    - PieceType: 'PAWN'|'ROOK'|'KNIGHT'|'BISHOP'|'QUEEN'|'KING'
      from '@/types/game'
    - STARTING_HP: 100 — from '@/stores/useGameStore'

  composable_exports:
    boardRows:         "Ref<TileState[][]> — iterate as v-for row in boardRows, tile in row"
    handleTileClick:   "(boardX: number, boardY: number) => void"
    p1Hp:              "Ref<number>"
    p2Hp:              "Ref<number>"
    p1HpPercent:       "Ref<number> — bind as :style=\"{ width: p1HpPercent + '%' }\""
    p2HpPercent:       "Ref<number>"
    canEndTurn:        "Ref<boolean> — disable End Turn button when false"
    handleEndTurn:     "() => void"
    handleResign:      "() => void — dispatches RESIGN + navigates to /menu"
    toggleMoveLog:     "() => void"
    moveLogOpen:       "Ref<boolean>"
    eventLog:          "Ref<GameEvent[]>"
    isReplay:          "Ref<boolean>"
    handleLogRowClick: "(index: number) => void"
    exitReplay:        "() => void"
    eventLabel:        "(event: GameEvent) => string"

  notes:
    - Board renders top-to-bottom: boardRows[0] = y=7, boardRows[7] = y=0
    - Tile key: use `${tile.boardX},${tile.boardY}` for :key
    - Piece colour: ELEMENT_COLOURS[piece.element].base (hex string — bind via :style)
    - Pointer event model: pieces-layer has pointer-events none; piece span has pointer-events auto
    - Piece abbreviations: P/R/N/B/Q/K (standard chess notation)
    - No new content keys needed beyond additions already made to src/content/game.ts

blocked_on: null
