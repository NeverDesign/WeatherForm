---
feature: phase12-auth-friends-profile
agent: backend
status: complete
timestamp: 2026-04-20
---
completed:
  types:
    - src/types/auth.ts — added createdAt to Account, FriendRequest, FriendEntry, FriendRequestStatus, initialized to AuthState
  stores:
    - src/stores/useAuthStore.ts — added initialized ref, initSession(), onAuthStateChange listener, logout is now async
  services:
    - src/services/authService.ts — replaced stub with real Supabase Auth (signInWithPassword, signUp + accounts insert, signOut, getSession)
    - src/services/accountService.ts — new: getAccount, updateDisplayName, deleteAccount, searchByTag
    - src/services/friendService.ts — new: sendRequest, acceptRequest, declineRequest, blockUser, listFriends, listPending
  router:
    - src/router/index.ts — added beforeEach guard, waits for authStore.initialized, redirects unauthenticated from protected routes, redirects authenticated away from splash/auth
  migration:
    - supabase/migrations/20260420000000_friendships.sql — friend_requests table + RLS + index; also fixes player_tag constraint to allow DisplayName#NNNN format

contract_for_frontend:
  types_available:
    - "import type { Account, FriendEntry, FriendRequestStatus } from '@/types/auth'"
  store_state:
    - "authStore.account: Account | null"
    - "authStore.loading: boolean"
    - "authStore.error: string | null"
    - "authStore.initialized: boolean"
  store_actions:
    - "authStore.login(credentials: LoginCredentials): Promise<void>"
    - "authStore.register(credentials: RegisterCredentials): Promise<void>"
    - "authStore.logout(): Promise<void>"
    - "authStore.initSession(): Promise<void>"
  service_actions:
    - "accountService.updateDisplayName(newName: string): Promise<Account>"
    - "accountService.deleteAccount(): Promise<void>"
    - "accountService.searchByTag(tag: string): Promise<Account[]>"
    - "friendService.sendRequest(toAccountId: string): Promise<FriendRequest>"
    - "friendService.acceptRequest(requestId: string): Promise<void>"
    - "friendService.declineRequest(requestId: string): Promise<void>"
    - "friendService.blockUser(toAccountId: string): Promise<void>"
    - "friendService.listFriends(): Promise<FriendEntry[]>"
    - "friendService.listPending(): Promise<FriendEntry[]>"

blocked_on: null

notes:
  - player_tag regex in initial schema was ^[A-Za-z0-9_]{3,16}$ which rejects the #NNNN suffix. The new migration drops and replaces this constraint with ^[A-Za-z0-9_]{1,16}#[0-9]{4}$.
  - deleteAccount deletes from accounts table then calls signOut. The auth.users record persists server-side (requires admin API to delete).
  - blockUser checks for an existing outgoing request and updates it; otherwise inserts a new blocked record.
