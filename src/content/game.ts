export const gameContent = {
  meta: {
    title: 'Game',
  },
  players: {
    opponent: 'Opponent',
    you: 'You',
  },
  hud: {
    timerLabel: 'Your turn',
    timerExpired: 'Time expired',
    abilityButton: 'Ability',
    moveLogButton: 'Move Log',
    resignButton: 'Resign',
    endTurn: 'End Turn',
    exitReplay: 'Exit Replay',
    abilitySlot: '—',
    replayingBadge: 'Replaying\u2026',
  },
  moveLog: {
    heading: 'Move Log',
    empty: 'No moves yet.',
  },
  statusBadge: {
    yourTurn: 'YOUR TURN',
    waiting: 'WAITING',
    checkLabel: 'CHECK',
  },
  resign: {
    confirmHeading: 'Resign game?',
    confirmBody: 'This will count as a loss. This action cannot be undone.',
    confirmCta: 'Resign',
    cancelCta: 'Cancel',
  },
  result: {
    win: 'Victory',
    loss: 'Defeat',
    draw: 'Draw',
    returnToMenu: 'Back to Menu',
    playAgain: 'Play Again',
  },
  errors: {
    loadFailed: 'Could not load the game. Please try again.',
    moveFailed: 'That move could not be applied.',
    abilityFailed: 'Ability could not be used right now.',
  },
} as const
