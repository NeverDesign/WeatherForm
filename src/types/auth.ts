export interface Account {
  id: string
  displayName: string
  playerTag: string // e.g. "StormWalker#4821" — auto-generated, read-only
  email: string
}

export interface AuthState {
  account: Account | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  displayName: string
  email: string
  password: string
}
