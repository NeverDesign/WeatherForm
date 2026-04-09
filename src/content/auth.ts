export const authContent = {
  tabs: {
    signIn: 'Sign In',
    createAccount: 'Create Account',
  },
  signIn: {
    heading: 'Sign In',
    email: {
      label: 'Email',
      placeholder: 'you@example.com',
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
    },
    submit: 'Sign In',
    forgotPassword: 'Forgot password?',
    apiError: 'Incorrect email or password.',
  },
  createAccount: {
    heading: 'Create Account',
    displayName: {
      label: 'Display Name',
      placeholder: 'Your display name',
    },
    playerTag: {
      label: 'Player Tag',
      hint: '(auto-generated)',
      placeholder: 'StormWalker#4821',
    },
    email: {
      label: 'Email',
      placeholder: 'you@example.com',
    },
    password: {
      label: 'Password',
      placeholder: 'At least 8 characters',
    },
    submit: 'Create Account',
    apiError: 'This email address is already in use.',
  },
} as const
