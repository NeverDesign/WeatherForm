import type { Account, LoginCredentials, RegisterCredentials } from '@/types/auth'

function toCamelCase(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) =>
      i === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<Account> {
    // STUB: replace with real API
    await new Promise(r => setTimeout(r, 800))
    return {
      id: 'mock-user-001',
      displayName: 'Storm Walker',
      playerTag: 'StormWalker#4821',
      email: credentials.email,
    }
  },

  async register(credentials: RegisterCredentials): Promise<Account> {
    // STUB: replace with real API
    await new Promise(r => setTimeout(r, 800))
    const tag = `${toCamelCase(credentials.displayName)}#4821`
    return {
      id: 'mock-user-001',
      displayName: credentials.displayName,
      playerTag: tag,
      email: credentials.email,
    }
  },

  logout(): void {
    // STUB: replace with real API
  },
}
