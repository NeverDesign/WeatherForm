export const friendsContent = {
  meta: {
    title: 'Friends',
  },
  search: {
    label: 'Search for players',
    placeholder: 'Add by player tag…',
    submitAction: 'Add',
    notFoundError: 'No player found with that tag.',
    alreadyFriendError: 'That player is already in your friends list.',
    selfAddError: 'You cannot add yourself.',
    requestSent: 'Friend request sent.',
    requestFailed: 'Could not send the request. Please try again.',
  },
  sections: {
    pending: 'Pending',
    friends: 'Friends',
  },
  pendingRow: {
    acceptAction: 'Accept',
    declineAction: 'Decline',
    incomingLabel: 'Wants to be friends',
  },
  friendRow: {
    challengeAction: 'Challenge',
    blockAction: 'Block',
    blockConfirmHeading: 'Block this player?',
    blockConfirmBody: 'They will be removed from your friends list and will not be able to contact you.',
    blockConfirmCta: 'Block',
    blockCancelCta: 'Cancel',
  },
  emptyState: {
    friends: {
      heading: 'No friends yet',
      body: 'Search by player tag to add someone.',
    },
    pending: {
      heading: 'No pending requests',
    },
  },
} as const
