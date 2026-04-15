# Session: auth-splash — 2026-04-08

## What was built
- Splash screen (auto-redirect, animated loading dots, AppLogo)
- Auth screen (tab toggle Sign In / Create Account, validation, store integration)
- AppLogo component (SVG tri-arc emblem, size sm/md/lg prop)

## Files created
| File | Description |
|------|-------------|
| src/types/auth.ts | Account, AuthState, LoginCredentials, RegisterCredentials |
| src/stores/useAuthStore.ts | Pinia store — login, register, logout |
| src/services/authService.ts | Stub service (800ms mock delay) |
| src/content/splash.ts | Splash copy |
| src/content/auth.ts | Auth form copy |
| src/content/common.ts | App name, element names |
| src/content/errors.ts | Validation + API error messages |
| src/content/index.ts | Re-export index |
| src/components/brand/AppLogo.vue | Reusable logo component |
| src/components/brand/AppLogo.scss | Logo styles |

## Files modified
| File | Changes |
|------|---------|
| src/pages/SplashPage.vue | Full template + 2s redirect script |
| src/pages/SplashPage.scss | Ink bg, pulsing dots, version pinned bottom |
| src/pages/AuthPage.vue | Full template + form state + validation |
| src/pages/AuthPage.scss | Mobile/desktop layout, form styles |

## Git commit suggestion

Subject: `feat: add Splash and Auth screens`

Body (bullet list):
- Add auth types: Account, AuthState, LoginCredentials, RegisterCredentials
- Add useAuthStore with login/register/logout actions
- Add authService stubs (replace with real API when backend is ready)
- Add UI copy to src/content/ (splash, auth, common, errors)
- Add reusable AppLogo component (SVG tri-arc emblem, sm/md/lg)
- Build SplashPage: centred logo, animated element-coloured dots, 2s auto-redirect
- Build AuthPage: tab toggle, mobile stacked / desktop split-panel layout
- Wire all content from src/content/, all validation via errorContent.validation.*

## Known limitations / deferred
- 240px desktop brand panel width hardcoded (no token maps to this)
- Forgot password link renders but has no flow (V1 scope)
- Auth screen layout deviates from wireframes (tracked in process-improvements session)
