# Session: Phase 12 — Real Auth, Friends, Profile

**Date:** 2026-04-20
**Agents:** orchestrator (all work done in single pass)
**QA result:** PASS — `npm run build` exits 0, `npm run test:run` 202/202 pass

## What Was Built

Replaced the mock auth stub with real Supabase Auth (signIn/signUp/signOut/getSession). Added session persistence via `onAuthStateChange` and a router guard that blocks unauthenticated users from protected routes. Wired ProfilePage to show real account data with inline display-name editing and account deletion. Wired FriendsPage with player-tag search, friend request send/accept/decline, block with inline confirm, and a challenge flow with an inline element picker.

## Files

| File | Agent | Action |
|------|-------|--------|
| `supabase/migrations/20260420000000_friendships.sql` | backend | created |
| `src/types/auth.ts` | backend | updated — added `createdAt`, `FriendRequest`, `FriendEntry`, `FriendRequestStatus`, `initialized` |
| `src/services/authService.ts` | backend | replaced — real Supabase Auth |
| `src/services/accountService.ts` | backend | created |
| `src/services/friendService.ts` | backend | created |
| `src/stores/useAuthStore.ts` | backend | updated — `initialized`, `initSession`, `onAuthStateChange`, async `logout` |
| `src/router/index.ts` | backend | updated — `beforeEach` guard with auth redirect |
| `src/pages/ProfilePage.vue` | frontend | updated — real account data, inline edit, sign out, delete |
| `src/pages/ProfilePage.scss` | frontend | updated — edit/feedback/confirm styles |
| `src/pages/FriendsPage.vue` | frontend | updated — search, pending, friends, challenge, block |
| `src/pages/FriendsPage.scss` | frontend | updated — all new row/confirm/picker styles |
| `src/pages/ProfilePage.test.ts` | frontend | updated — added Pinia + router to test mount |
| `src/pages/FriendsPage.test.ts` | frontend | updated — added Pinia + router to test mount |
| `docs/plans/implementation-plan.md` | orchestrator | Phase 12 marked done |

## Proposed Git Commit

```
feat: replace mock auth with Supabase Auth; wire ProfilePage and FriendsPage

- Add supabase/migrations/20260420000000_friendships.sql: friend_requests table with RLS, index on to_id, and fix player_tag constraint to allow DisplayName#NNNN format
- Replace authService stub with real signInWithPassword / signUp / signOut / getSession
- Add accountService: getAccount, updateDisplayName, deleteAccount, searchByTag
- Add friendService: sendRequest, acceptRequest, declineRequest, blockUser, listFriends, listPending
- Update useAuthStore: initialized ref, initSession(), onAuthStateChange listener, async logout
- Update router: beforeEach guard waits for initialized, redirects unauthenticated from protected routes, redirects authenticated away from splash/auth
- Wire ProfilePage: real account data, inline display-name edit with validation, sign out, inline delete-account confirm
- Wire FriendsPage: player-tag search, send/accept/decline requests, challenge with inline element picker, block with inline confirm
- Update ProfilePage.test.ts and FriendsPage.test.ts to mount with Pinia + router
```

**Awaiting user approval before commit.**

## Deferred

- Email change in ProfilePage is a no-op (button renders but is disabled) — Supabase email change requires a confirmation-email flow, deferred to post-MVP
- Auth record deletion on `deleteAccount` is server-side only (requires admin API) — client deletes the `accounts` row and signs out; the `auth.users` row persists until cleaned up
- Friend challenge does not auto-invite the recipient — they join via game ID (current design)
- `$wf-teal` is listed in `project-configuration.md` token reference but does not exist in `_colours.scss`; replaced with `$wf-tide-accent`. The token reference should be corrected or the colour added to `_colours.scss`.

## Uncertainty Log

- **player_tag constraint:** The initial schema regex `^[A-Za-z0-9_]{3,16}$` rejects the `#NNNN` suffix the brief specifies. Fixed in the new migration by replacing the constraint with `^[A-Za-z0-9_]{1,16}#[0-9]{4}$`. This means the migration must be applied to the live Supabase project before auth registration will work.
- **blockUser direction:** `blockUser(toAccountId)` inserts/updates from the current user's perspective (from_id = current user). This means the block relationship is directional — the blocked user could still see the blocker in search results. Full bidirectional block would require a separate RLS policy or view. Deferred.
- **authStore.account mutation in ProfilePage:** After `updateDisplayName` succeeds, `authStore.account` is mutated directly (`authStore.account = updated`) rather than calling a dedicated store action. This works because Pinia refs are reactive, but a dedicated `setAccount` action would be cleaner. Noted for future refactor.
- **Dynamic import warning from Vite:** The router uses a dynamic import of `useAuthStore` to avoid circular deps, but pages also statically import it. Vite warns that the dynamic import won't split the chunk. This is harmless — it's a bundle size hint, not a correctness issue.
