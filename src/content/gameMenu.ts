export const gameMenuContent = {
  meta: {
    title: 'Game Menu',
  },
  sections: {
    currentGames: 'Your Games',
  },
  gameRow: {
    statusYourTurn: 'YOUR TURN',
    statusWaiting: 'WAITING',
    actionPlay: 'Play',
    actionOpen: 'Open',
  },
  emptyState: {
    heading: 'No games yet',
    body: 'Start a new game or join one with a friend.',
    ctaNew: 'New Game',
    ctaJoin: 'Join Game',
  },
  bottomNav: {
    newGame: 'New Game',
    setManager: 'Set Manager',
  },
  newGameModal: {
    heading: 'New Game',
    opponentLabel: 'Opponent',
    opponentPlaceholder: 'Player tag or friend name',
    elementLabel: 'Your Element',
    submit: 'Start Game',
    cancel: 'Cancel',
    errorNoOpponent: 'Enter an opponent player tag.',
    errorNoElement: 'Choose an element to continue.',
  },
} as const
