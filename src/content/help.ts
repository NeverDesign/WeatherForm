export const helpContent = {
  meta: {
    title: 'Help',
  },
  nav: {
    reference: 'Reference',
    elementAdvantage: 'Element Advantage',
    abilities: 'Abilities',
    rulesOverview: 'Rules Overview',
    gettingStarted: 'Getting Started',
    howToPlay: 'How to Play',
    buildingASet: 'Building a Set',
    support: 'Support',
    faq: 'FAQ',
    gameManual: 'Game Manual',
  },
  elementAdvantage: {
    heading: 'Element Advantage',
    subheading: 'Elements form a rock-paper-scissors triangle.',
    rows: {
      tideBeats: 'TIDE › DUNE',
      galeBeats: 'GALE › TIDE',
      duneBeats: 'DUNE › GALE',
    },
    multiplierLabel: '×1.5 dmg',
    note: 'Attacks against the weaker element deal 1.5× damage. Attacks against the stronger element deal 0.5× damage.',
  },
  abilities: {
    heading: 'Abilities',
    subheading: 'Each element gives every piece a unique ability.',
    elementTabs: {
      tide: 'TIDE',
      gale: 'GALE',
      dune: 'DUNE',
    },
  },
  rulesOverview: {
    heading: 'Rules Overview',
    bullets: [
      'On your turn, move one piece. Chess movement rules apply.',
      'If your timer expires, you forfeit the game.',
      'Reduce your opponent\'s King HP to zero to win.',
      'Each player commits to one element before the game starts.',
    ],
  },
  howToPlay: {
    heading: 'How to Play',
    body: 'Move pieces to attack your opponent\'s army. Use your element\'s abilities to gain an edge. The player who reduces the enemy King\'s HP to zero wins.',
  },
  buildingASet: {
    heading: 'Building a Set',
    body: 'Go to Set Manager and choose an element. Your chosen element determines each piece\'s ability. Save your set, then select it when starting a new game.',
    ctaLabel: 'Open Set Manager',
  },
  support: {
    faqAction: 'FAQ / Support',
    gameManualAction: 'Game Manual',
  },
} as const
