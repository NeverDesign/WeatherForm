export const profileContent = {
  meta: {
    title: 'Profile',
  },
  avatar: {
    altText: 'Your avatar',
  },
  sections: {
    account: 'Account',
    app: 'App',
    accountActions: 'Account Actions',
  },
  account: {
    displayName: {
      label: 'Display Name',
      placeholder: 'Your display name',
      editAction: 'Edit',
      saveAction: 'Save',
      cancelAction: 'Cancel',
      successMessage: 'Display name updated.',
      errorRequired: 'Display name is required.',
      errorTooShort: 'Must be at least 2 characters.',
      errorTooLong: 'Must be 32 characters or fewer.',
      errorSaveFailed: 'Could not update your display name.',
    },
    email: {
      label: 'Email',
      placeholder: 'you@example.com',
      editAction: 'Edit',
      saveAction: 'Save',
      cancelAction: 'Cancel',
      successMessage: 'Email updated.',
      errorRequired: 'Email is required.',
      errorInvalid: 'Enter a valid email address.',
      errorSaveFailed: 'Could not update your email.',
    },
    playerTag: {
      label: 'Player Tag',
      hint: 'Read-only — derived from your display name',
    },
  },
  app: {
    faqSupport: 'FAQ / Support',
    gameManual: 'Game Manual',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
  },
  accountActions: {
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
    deleteConfirmHeading: 'Delete your account?',
    deleteConfirmBody: 'All your games and data will be permanently removed. This cannot be undone.',
    deleteConfirmCta: 'Delete Account',
    deleteCancelCta: 'Cancel',
  },
  version: 'Weatherform v0.1.0',
} as const
