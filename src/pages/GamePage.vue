<template>
  <div class="p-game" data-testid="page-game">
    <h1 class="visually-hidden">{{ gameContent.meta.title }}</h1>

    <!-- Opponent info bar -->
    <div class="p-game__player-bar p-game__player-bar--opponent">
      <div class="p-game__avatar" aria-hidden="true"></div>
      <div class="p-game__player-info">
        <span class="p-game__player-name wf-type-label">{{ gameContent.players.opponent }}</span>
        <div class="p-game__hp-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          <!-- width is runtime-dynamic (driven by HP percentage) — inline style is intentional -->
          <div class="p-game__hp-fill" :style="{ width: '100%' }"></div>
        </div>
      </div>
    </div>

    <!-- Board area -->
    <div class="p-game__board-area">
      <div class="p-game__board" role="grid" :aria-label="gameContent.meta.title">
        <div
          v-for="row in 8"
          :key="row"
          class="p-game__board-row"
          role="row"
        >
          <div
            v-for="col in 8"
            :key="col"
            class="p-game__tile"
            :class="getTileClass(row, col)"
            role="gridcell"
          ></div>
        </div>
      </div>
    </div>

    <!-- Player info bar -->
    <div class="p-game__player-bar p-game__player-bar--self">
      <div class="p-game__avatar" aria-hidden="true"></div>
      <div class="p-game__player-info">
        <span class="p-game__player-name wf-type-label">{{ gameContent.players.you }}</span>
        <div class="p-game__hp-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          <!-- width is runtime-dynamic (driven by HP percentage) — inline style is intentional -->
          <div class="p-game__hp-fill" :style="{ width: '100%' }"></div>
        </div>
      </div>
    </div>

    <!-- Floating dock -->
    <div class="p-game__dock" role="toolbar">
      <button class="p-game__dock-btn">
        {{ gameContent.hud.abilityButton }}
      </button>
      <div class="p-game__dock-timer">
        <span class="p-game__dock-timer-label wf-type-caption">
          {{ gameContent.hud.timerLabel }}
        </span>
        <span class="p-game__dock-timer-value wf-type-label">—</span>
      </div>
      <button class="p-game__dock-btn">
        {{ gameContent.hud.moveLogButton }}
      </button>
      <button class="p-game__dock-btn p-game__dock-btn--danger">
        {{ gameContent.hud.resignButton }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gameContent } from '@/content'

function getTileClass(row: number, col: number): string {
  // (0,0) = bottom-left = dark; dark when (row + col) % 2 === 1
  // In the template rows go 1–8 from top. To get board coords: boardRow = 8 - row
  const boardRow = 8 - row
  const boardCol = col - 1
  return (boardRow + boardCol) % 2 === 1
    ? 'p-game__tile--dark'
    : 'p-game__tile--light'
}
</script>

<style lang="scss" src="./GamePage.scss" />
