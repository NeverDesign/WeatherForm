<template>
  <div class="p-game" data-testid="page-game">
    <h1 class="visually-hidden">{{ gameContent.meta.title }}</h1>

    <!-- ── Opponent info bar ───────────────────────────────────────────────── -->
    <div class="p-game__player-bar p-game__player-bar--opponent">
      <div class="p-game__avatar" aria-hidden="true"></div>
      <div class="p-game__player-info">
        <span class="p-game__player-name wf-type-label">{{ gameContent.players.opponent }}</span>
        <div
          class="p-game__hp-bar"
          role="progressbar"
          :aria-valuenow="p2Hp"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <!-- width is runtime-dynamic (driven by HP percentage) — inline style is intentional -->
          <div class="p-game__hp-fill" :style="{ width: p2HpPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- ── Board area ──────────────────────────────────────────────────────── -->
    <div class="p-game__board-area">

      <!-- Replay badge (shown when reviewing history) -->
      <div
        v-if="isReplay"
        class="p-game__replay-badge"
        role="status"
        aria-live="polite"
      >
        {{ gameContent.hud.replayingBadge }}
      </div>

      <div
        class="p-game__board"
        :class="{ 'p-game__board--replaying': isReplay }"
        role="grid"
        :aria-label="gameContent.meta.title"
      >
        <div
          v-for="(row, rowIndex) in boardRows"
          :key="rowIndex"
          class="p-game__board-row"
          role="row"
        >
          <div
            v-for="tile in row"
            :key="`${tile.boardX},${tile.boardY}`"
            class="p-game__tile"
            :class="[
              tileColourClass(tile.boardX, tile.boardY),
              {
                'p-game__tile--selected':   tile.isSelected,
                'p-game__tile--valid-move': tile.isValidMove && !tile.isCapture,
                'p-game__tile--capture':    tile.isCapture,
              },
            ]"
            role="gridcell"
            :aria-label="`Square ${tile.boardX},${tile.boardY}${tile.piece ? ': ' + tile.piece.element + ' ' + tile.piece.type : ''}`"
            @click="handleTileClick(tile.boardX, tile.boardY)"
          >
            <!-- Pieces layer — pointer-events none on wrapper; auto on each piece element -->
            <div class="p-game__pieces-layer" aria-hidden="true">
              <span
                v-if="tile.piece"
                class="p-game__piece"
                :class="`p-game__piece--${tile.piece.owner.toLowerCase()}`"
                :style="{ color: pieceColour(tile.piece.element) }"
                :data-element="tile.piece.element"
                :data-owner="tile.piece.owner"
                :aria-label="`${tile.piece.element} ${tile.piece.type} (${tile.piece.owner})`"
                @click.stop="handleTileClick(tile.boardX, tile.boardY)"
              >{{ pieceAbbr(tile.piece.type) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop move log panel (≥768px) — slides in from right -->
      <aside
        v-if="moveLogOpen"
        class="p-game__move-log-panel"
        aria-label="Move Log"
      >
        <h2 class="p-game__move-log-heading wf-type-label">{{ gameContent.moveLog.heading }}</h2>
        <p v-if="eventLog.length === 0" class="p-game__move-log-empty wf-type-caption">
          {{ gameContent.moveLog.empty }}
        </p>
        <ol v-else class="p-game__move-log-list">
          <li
            v-for="(event, index) in eventLog"
            :key="index"
            class="p-game__move-log-row"
            :class="{ 'p-game__move-log-row--active': isReplay }"
            role="button"
            tabindex="0"
            @click="handleLogRowClick(index)"
            @keydown.enter="handleLogRowClick(index)"
            @keydown.space.prevent="handleLogRowClick(index)"
          >
            <span class="p-game__move-log-index wf-type-caption">{{ index + 1 }}</span>
            <span class="p-game__move-log-text wf-type-caption">{{ eventLabel(event) }}</span>
          </li>
        </ol>
      </aside>
    </div>

    <!-- ── Player info bar ─────────────────────────────────────────────────── -->
    <div class="p-game__player-bar p-game__player-bar--self">
      <div class="p-game__avatar" aria-hidden="true"></div>
      <div class="p-game__player-info">
        <span class="p-game__player-name wf-type-label">{{ gameContent.players.you }}</span>
        <div
          class="p-game__hp-bar"
          role="progressbar"
          :aria-valuenow="p1Hp"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <!-- width is runtime-dynamic (driven by HP percentage) — inline style is intentional -->
          <div class="p-game__hp-fill" :style="{ width: p1HpPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- ── Floating dock ───────────────────────────────────────────────────── -->
    <div class="p-game__dock" role="toolbar" :aria-label="gameContent.meta.title + ' controls'">

      <!-- 6 ability slots (Phase 5: all disabled placeholders) -->
      <div class="p-game__ability-slots" role="group" aria-label="Abilities">
        <button
          v-for="slot in 6"
          :key="slot"
          class="p-game__dock-btn p-game__dock-btn--ability"
          disabled
          :aria-label="`${gameContent.hud.abilitySlot} (ability ${slot})`"
        >{{ gameContent.hud.abilitySlot }}</button>
      </div>

      <!-- End Turn / Exit Replay -->
      <button
        v-if="isReplay"
        class="p-game__dock-btn p-game__dock-btn--primary"
        @click="exitReplay"
      >
        {{ gameContent.hud.exitReplay }}
      </button>
      <button
        v-else
        class="p-game__dock-btn p-game__dock-btn--primary"
        :disabled="!canEndTurn"
        @click="handleEndTurn"
      >
        {{ gameContent.hud.endTurn }}
      </button>

      <!-- Move Log toggle -->
      <button
        class="p-game__dock-btn"
        :aria-expanded="moveLogOpen"
        :aria-pressed="moveLogOpen"
        @click="toggleMoveLog"
      >
        {{ gameContent.hud.moveLogButton }}
      </button>

      <!-- Resign -->
      <button
        class="p-game__dock-btn p-game__dock-btn--danger"
        @click="handleResign"
      >
        {{ gameContent.hud.resignButton }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { gameContent } from '@/content'
import { ELEMENT_COLOURS } from '@/types'
import type { Element } from '@/types'
import type { PieceType } from '@/types/game'
import { useGameBoard } from '@/composables/useGameBoard'
import { useGameStore } from '@/stores/useGameStore'

const route = useRoute()
const store = useGameStore()

const {
  boardRows,
  handleTileClick,
  p1Hp,
  p2Hp,
  p1HpPercent,
  p2HpPercent,
  canEndTurn,
  handleEndTurn,
  handleResign,
  toggleMoveLog,
  moveLogOpen,
  eventLog,
  isReplay,
  handleLogRowClick,
  exitReplay,
  eventLabel,
} = useGameBoard()

onMounted(async () => {
  const id = route.params.id as string | undefined
  if (!id || id.startsWith('game-')) {
    // No id or local-only game — board is already initialised by the caller
    // (e.g. dev tooling or direct navigation without a real game id).
    return
  }

  // Remote Supabase game
  try {
    await store.loadGame(id)
    store.subscribeToUpdates()
  } catch (e) {
    console.error('[GamePage] Failed to load remote game:', e)
  }
})

onUnmounted(() => {
  store.unsubscribeFromUpdates()
})

// ── Tile helpers ─────────────────────────────────────────────────────────────

/** Returns the checkerboard dark/light class for a board square. */
function tileColourClass(x: number, y: number): string {
  // (0,0) = bottom-left = dark; dark when (x + y) % 2 === 0
  return (x + y) % 2 === 0 ? 'p-game__tile--dark' : 'p-game__tile--light'
}

// ── Piece helpers ────────────────────────────────────────────────────────────

const PIECE_ABBR: Record<PieceType, string> = {
  PAWN:   'P',
  ROOK:   'R',
  KNIGHT: 'N',
  BISHOP: 'B',
  QUEEN:  'Q',
  KING:   'K',
}

function pieceAbbr(type: PieceType): string {
  return PIECE_ABBR[type] ?? '?'
}

/**
 * Returns the base colour for a piece's element.
 * Uses ELEMENT_COLOURS from src/types/index.ts — no hardcoded hex.
 */
function pieceColour(element: Element): string {
  return ELEMENT_COLOURS[element].base
}
</script>

<style lang="scss" src="./GamePage.scss" />
