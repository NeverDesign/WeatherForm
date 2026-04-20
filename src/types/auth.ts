export interface Account {
  id: string
  displayName: string
  playerTag: string // e.g. "StormWalker#4821" — auto-generated, read-only
  email: string
  createdAt?: string
}

export interface AuthState {
  account: Account | null
  loading: boolean
  error: string | null
  initialized: boolean
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

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'blocked'

export interface FriendRequest {
  id: string
  fromId: string
  toId: string
  status: FriendRequestStatus
  createdAt: string
}

/** A friend_requests row joined with the other party's account info */
export interface FriendEntry {
  requestId: string
  account: Account
  status: FriendRequestStatus
}
