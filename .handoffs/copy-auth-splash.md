---
feature: auth-splash
agent: copy
status: complete
timestamp: 2026-04-08
---

## Completed

- `src/content/splash.ts` — 2 strings (tagline, version)
- `src/content/auth.ts` — 24 strings (form labels, placeholders, buttons, hints, API errors)
- `src/content/common.ts` — 14 strings (app name, element names, shared actions and status states)
- `src/content/errors.ts` — 14 strings (validation errors for all fields, API errors)
- `src/content/index.ts` — re-export index for all content modules

## Notes for Frontend Agent

### Import pattern
```ts
import { splashContent, authContent, commonContent, errorContent } from '@/content'
```

### Key export paths

**Splash screen:**
- `splashContent.tagline`
- `splashContent.version`

**Auth screen — tabs:**
- `authContent.tabs.signIn`
- `authContent.tabs.createAccount`

**Auth screen — Sign In form:**
- `authContent.signIn.heading`
- `authContent.signIn.email.label`
- `authContent.signIn.email.placeholder`
- `authContent.signIn.password.label`
- `authContent.signIn.password.placeholder`
- `authContent.signIn.submit`
- `authContent.signIn.forgotPassword`
- `authContent.signIn.apiError`

**Auth screen — Create Account form:**
- `authContent.createAccount.heading`
- `authContent.createAccount.displayName.label`
- `authContent.createAccount.displayName.placeholder`
- `authContent.createAccount.playerTag.label`
- `authContent.createAccount.playerTag.hint`
- `authContent.createAccount.playerTag.placeholder`
- `authContent.createAccount.email.label`
- `authContent.createAccount.email.placeholder`
- `authContent.createAccount.password.label`
- `authContent.createAccount.password.placeholder`
- `authContent.createAccount.submit`
- `authContent.createAccount.apiError`

**Common:**
- `commonContent.appName` (use for page titles, headers)
- `commonContent.elements.tide`, `.gale`, `.dune` (for element chips)
- `commonContent.actions.*` (Cancel, Close, Delete, Confirm, Retry)
- `commonContent.status.*` (Loading, Saving, Saved)

**Errors — Validation:**
All validation errors live under `errorContent.validation.*`:
- `displayName.required` / `.tooShort` / `.tooLong`
- `email.required` / `.invalid`
- `password.required` / `.tooShort`

Show validation errors below the affected field only on blur or submit attempt.

**Errors — API:**
- `errorContent.api.generic` — fallback for unexpected errors
- `errorContent.api.loginFailed` — show above Sign In button on login failure
- `errorContent.api.registrationFailed` — show above Create Account button on registration failure

## Tone applied

- **Clear and direct:** "Your password must be at least 8 characters." not "Invalid password"
- **Verb-first CTAs:** "Sign In", "Create Account" (not "Login" or "Submit")
- **No marketing fluff:** Splash is minimal; Auth is purely functional
- **Second person:** "Your display name" not "The display name"
- **Specific errors:** Each validation failure tells the user what went wrong and what to fix

## Blocking issues

None. All content is ready for Frontend implementation.
