---
feature: phase12-auth-friends-profile
agent: frontend
status: complete
timestamp: 2026-04-20
---
completed:
  pages:
    - src/pages/ProfilePage.vue — wired to useAuthStore; inline display name edit; sign out; inline delete confirm
    - src/pages/FriendsPage.vue — search by tag; send request; pending list (accept/decline); friends list (challenge with inline element picker, block with inline confirm)
  styles:
    - src/pages/ProfilePage.scss — added field-row--editing, field-input, field-inline-actions, feedback rows, delete confirm expansion
    - src/pages/FriendsPage.scss — added search feedback, result list, pending rows, friends list, block confirm, challenge picker
  tests:
    - src/pages/ProfilePage.test.ts — updated to include Pinia + router plugins (store now required)
    - src/pages/FriendsPage.test.ts — updated to include Pinia + router plugins (store now required)

states_implemented:
  - ProfilePage: display name view | edit | saving | success/error feedback
  - ProfilePage: delete account — collapsed | confirm expanded | deleting
  - FriendsPage: search — idle | loading | results | not found error
  - FriendsPage: pending list — populated | empty state
  - FriendsPage: friends list — populated | empty state
  - FriendsPage: block — collapsed | confirm expanded | blocking
  - FriendsPage: challenge — collapsed | element picker open | creating game

deviations_from_spec:
  - Email edit button is rendered but has disabled + aria-disabled="true" (post-MVP — email change requires Supabase confirmation flow)
  - $wf-teal does not exist in _colours.scss despite being listed in project-configuration.md; replaced with $wf-tide-accent throughout

missing_copy_keys: []

notes_for_qa:
  - All strings sourced from profileContent and friendsContent — no hardcoded prose
  - Avatar initial is computed from account.displayName (first char, uppercased)
  - authStore.account is mutated directly on successful display name save (keeps store in sync without requiring a full re-fetch)
  - Challenge flow: element picker inline → gameService.createGame(element) → router.push('/game/:id')
  - Block confirm uses blockConfirmId (request row id) to identify which row is expanded

blocked_on: null
