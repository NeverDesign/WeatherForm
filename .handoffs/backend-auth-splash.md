---
feature: auth-splash
agent: backend
status: complete
timestamp: 2026-04-08
---

## Completed

- `src/types/auth.ts` — `Account`, `AuthState`, `LoginCredentials`, `RegisterCredentials`
- `src/stores/useAuthStore.ts` — state: `account`, `loading`, `error`; actions: `login()`, `register()`, `logout()`
- `src/services/authService.ts` — stubs: `login()`, `register()`, `logout()` (all with `// STUB: replace with real API` and 800ms mock delay)
- `src/pages/SplashPage.vue` — `<script setup>` added: mounts a 2-second timer → `router.push(ROUTES.AUTH)`; skips timer and goes to `ROUTES.MENU` if already authenticated
- `src/pages/AuthPage.vue` — `<script setup>` added: full form state, validation, store calls, redirect on success

---

## Contract for Frontend Agent

### Types (`src/types/auth.ts`)

- `Account`: `{ id: string, displayName: string, playerTag: string, email: string }`
- `AuthState`: `{ account: Account | null, loading: boolean, error: string | null }`
- `LoginCredentials`: `{ email: string, password: string }`
- `RegisterCredentials`: `{ displayName: string, email: string, password: string }`

### Auth Store (`useAuthStore`)

Imported as: `import { useAuthStore } from '@/stores/useAuthStore'`

State:
- `authStore.account` — `Account | null` — truthy when signed in
- `authStore.loading` — `boolean` — true during async login/register
- `authStore.error` — `string | null` — set on failure, cleared on new attempt

Actions:
- `authStore.login(credentials)` — async, sets `account` on success, sets `error` on failure
- `authStore.register(credentials)` — async, sets `account` on success, sets `error` on failure
- `authStore.logout()` — sync, clears `account`

### SplashPage refs/constants (no template bindings needed — logic is self-contained on mount)

### AuthPage template bindings

All of the following are top-level in `<script setup>` and auto-exposed to the template:

| Binding | Type | Purpose |
|---|---|---|
| `activeTab` | `Ref<'signin' \| 'register'>` | Drive tab toggle; set to `'signin'` or `'register'` |
| `loginForm` | `reactive LoginCredentials` | v-model target for sign-in form fields |
| `registerForm` | `reactive RegisterCredentials` | v-model target for create account form fields |
| `playerTagPreview` | `ComputedRef<string>` | Read-only display string (e.g. `StormWalker#0000`) |
| `loginErrors` | `reactive Record<string, string>` | Field error messages; keys: `email`, `password` |
| `registerErrors` | `reactive Record<string, string>` | Field error messages; keys: `displayName`, `email`, `password` |
| `authStore.loading` | `boolean` | Disable submit buttons during async |
| `authStore.error` | `string \| null` | Generic API error shown above submit button |
| `handleLogin()` | `async () => void` | Bind to sign-in form `@submit.prevent` |
| `handleRegister()` | `async () => void` | Bind to create account form `@submit.prevent` |

Validation runs on submit. Frontend should also call `validateLogin()` / `validateRegister()` on `@blur` events if desired (both functions are available in the script scope).

---

## Notes / Issues

- **`$wf-danger` token exists** (`#E05A5A` in `_colours.scss`). No missing tokens.
- **Pre-existing TS build error:** `src/components/AppHeader/AppHeader.test.ts` has an unused `vi` import (`noUnusedLocals: true`). This error existed before this work.
- **Expected TS errors until Frontend wires the template:** `vue-tsc` with `noUnusedLocals: true` will flag `activeTab`, `playerTagPreview`, `handleLogin`, and `handleRegister` as unused until the AuthPage template is updated to reference them. These are not regressions — they resolve automatically once the template binds to these values.
- **Auth redirect on success:** Both `handleLogin` and `handleRegister` push to `ROUTES.MENU` on success. If the post-auth destination should be configurable (e.g. a `redirect` query param), that can be added later.
- **Forgot password:** No action is implemented per V1 spec. Frontend should render the link with no `@click` handler or a console-note handler.
