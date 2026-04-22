---
feature: phase12-auth-friends-profile
agent: orchestrator
status: complete
timestamp: 2026-04-20
---
brief: >
  Replace mock auth with real Supabase Auth. Wire ProfilePage to show and edit
  real account data. Wire FriendsPage with search, friend requests, and challenge
  flow. Add router guard to protect authenticated routes.

screens:
  - ProfilePage: show displayName/email/playerTag; inline edit displayName; sign out; delete account confirm
  - FriendsPage: search by tag, send request; pending requests (accept/decline); friends list with challenge; block confirm
  - Router guard: all protected routes redirect to AUTH when unauthenticated

entities:
  Account:
    id: string (uuid, matches supabase auth uid)
    displayName: string
    email: string
    playerTag: string (format "DisplayName#NNNN")
    createdAt: string
  FriendRequest:
    id: string (uuid)
    fromId: string (uuid → accounts)
    toId: string (uuid → accounts)
    status: "'pending' | 'accepted' | 'declined' | 'blocked'"
    createdAt: string

interactions:
  - "login(email, password) → session restored, account loaded, redirect to MENU"
  - "register(displayName, email, password) → auth user created, accounts row inserted, redirect to MENU"
  - "logout() → session cleared, redirect to AUTH"
  - "page refresh → onAuthStateChange restores session before router resolves"
  - "edit display name → inline input → save → accountService.updateDisplayName → success feedback"
  - "delete account → inline confirm expansion → delete from accounts + signOut → redirect AUTH"
  - "search by tag → accountService.searchByTag → results list with Add button"
  - "Add → friendService.sendRequest → inline success"
  - "pending list → accept → friendService.acceptRequest → list refresh"
  - "pending list → decline → friendService.declineRequest → list refresh"
  - "friends list → challenge → inline element picker → gameService.createGame → redirect GAME"
  - "friends list → block → inline confirm → friendService.blockUser → list refresh"

constraints:
  - Inline confirm/edit patterns only — no new Vue component files
  - All strings from existing content files (profile.ts, friends.ts)
  - player_tag format: DisplayName#NNNN (4 random digits)
  - Delete account: delete from accounts table + signOut (no server-side auth deletion)
  - _settings.scss must never be @imported manually
  - Pinia setup store style only
  - Do not touch game engine reducer logic
  - Do NOT commit — draft commit notes in session doc

unknowns:
  - Email change deferred to post-MVP (Supabase email confirmation required)
  - Auto-invite friend on challenge deferred — friend joins via game ID for now

sequence:
  - backend
  - frontend
  - qa
