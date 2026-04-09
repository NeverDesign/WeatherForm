export const errorContent = {
  validation: {
    displayName: {
      required: 'Display name is required.',
      tooShort: 'Display name must be at least 2 characters.',
      tooLong: 'Display name must be 32 characters or fewer.',
    },
    email: {
      required: 'Email is required.',
      invalid: 'Enter a valid email address.',
    },
    password: {
      required: 'Password is required.',
      tooShort: 'Password must be at least 8 characters.',
    },
  },
  api: {
    generic: 'Something went wrong. Please try again.',
    loginFailed: 'Incorrect email or password.',
    registrationFailed: 'This email address is already in use.',
  },
} as const
