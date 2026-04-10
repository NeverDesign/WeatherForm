export const setManagerContent = {
  meta: {
    title: 'Set Manager',
  },
  sections: {
    elementSelector: 'Element',
    abilityList: 'Abilities',
    savedSets: 'Your Sets',
  },
  elementSelector: {
    tide: 'TIDE',
    gale: 'GALE',
    dune: 'DUNE',
  },
  abilityList: {
    armyTotal: '16 pieces total',
    pieceCount: {
      pawn: '×8',
      knight: '×2',
      bishop: '×2',
      rook: '×2',
      queen: '×1',
      king: '×1',
    },
  },
  setRow: {
    inUseLabel: 'In use',
    editAction: 'Edit',
    deleteAction: 'Delete',
    deleteConfirmHeading: 'Delete this set?',
    deleteConfirmBody: 'This cannot be undone.',
    deleteConfirmCta: 'Delete',
    deleteCancelCta: 'Cancel',
  },
  saveSet: {
    namePlaceholder: 'Name your set',
    nameLabel: 'Set Name',
    submit: 'Save Set',
    successMessage: 'Set saved.',
    errorNameRequired: 'Give your set a name.',
    errorNameTooLong: 'Set name must be 32 characters or fewer.',
    errorSaveFailed: 'Could not save the set. Please try again.',
  },
  emptyState: {
    heading: 'No sets saved',
    body: 'Build an elemental army and save it here.',
  },
} as const
