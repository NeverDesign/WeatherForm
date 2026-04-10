---
feature: brand-stubs
agent: copy
status: complete
timestamp: 2026-04-08
---

## Completed

- `src/content/gameMenu.ts` — 20 strings (meta title, section heading, game row status badges + actions, empty state, bottom nav labels, new game modal)
- `src/content/game.ts` — 23 strings (meta title, HUD labels, move log, status badges, resign confirmation, result screen, error messages)
- `src/content/setManager.ts` — 28 strings (meta title, section headings, element selector, piece counts, set row actions + delete confirmation, save form, empty state)
- `src/content/profile.ts` — 38 strings (meta title, avatar alt, section headings, display name + email + player tag fields with edit/save/error states, app links, account action labels + delete confirmation, version string)
- `src/content/friends.ts` — 22 strings (meta title, search placeholder + errors + success, section headings, pending row actions, friend row actions + block confirmation, empty states)
- `src/content/help.ts` — 31 strings (meta title, sidebar nav labels, element advantage section, abilities tabs, rules bullets, how to play, building a set, support links)

`src/content/index.ts` — already exports all 6 modules; no changes needed.

## Items marked for review

None flagged as `[NEEDS BRAND INPUT]`. The following decisions were made and should be confirmed with product/brand:

- **`helpContent.rulesOverview.bullets`** — Four bullet points covering the turn loop, timer/forfeit, win condition, and mono-elemental model. These summarise the game design docs. Verify they match the intended rules exactly, especially timer mechanics (the wireframe says "forfeit" but no specific duration is defined).
- **`helpContent.elementAdvantage.note`** — Expanded explanation of the 1.5×/0.5× multiplier. Confirm this matches engine integer math (150/100/50).
- **`gameContent.result.*`** — "Victory", "Defeat", "Draw" as end-state headings. Confirm the game can end in a draw, or remove that string if not applicable in V1.
- **`profileContent.version`** — Matches the splash screen value `v0.1.0`. Keep in sync if the version changes.

## Notes for Frontend Agent

### Import pattern

```ts
import {
  gameMenuContent,
  gameContent,
  setManagerContent,
  profileContent,
  friendsContent,
  helpContent,
} from '@/content'
```

### gameMenuContent

```ts
gameMenuContent.meta.title                    // page <title>
gameMenuContent.sections.currentGames         // "Your Games" section heading
gameMenuContent.gameRow.statusYourTurn        // "YOUR TURN" badge (teal)
gameMenuContent.gameRow.statusWaiting         // "WAITING" badge (muted)
gameMenuContent.gameRow.actionPlay            // primary CTA on active games
gameMenuContent.gameRow.actionOpen            // secondary CTA on waiting games
gameMenuContent.emptyState.heading            // no-games empty state
gameMenuContent.emptyState.body
gameMenuContent.emptyState.ctaNew             // "New Game" button
gameMenuContent.emptyState.ctaJoin            // "Join Game" button
gameMenuContent.newGameModal.*                // modal for starting a new game
```

### gameContent

```ts
gameContent.hud.timerLabel                    // "Your turn" label above countdown
gameContent.hud.abilityButton                 // dock button label
gameContent.hud.moveLogButton                 // dock button label
gameContent.hud.resignButton                  // dock button label
gameContent.statusBadge.yourTurn              // overlay badge
gameContent.statusBadge.checkLabel            // "CHECK" badge
gameContent.resign.*                          // confirmation dialog strings
gameContent.result.*                          // win/loss/draw screen strings
gameContent.errors.*                          // error toasts / inline errors
```

### setManagerContent

```ts
setManagerContent.sections.*                  // three section headings
setManagerContent.elementSelector.*           // TIDE / GALE / DUNE tab labels
setManagerContent.abilityList.armyTotal       // "16 pieces total" summary line
setManagerContent.abilityList.pieceCount.*    // ×8, ×2 etc. count badges
setManagerContent.setRow.*                    // saved set row actions + delete confirm
setManagerContent.saveSet.namePlaceholder     // set name input
setManagerContent.saveSet.submit              // "Save Set" CTA
setManagerContent.saveSet.successMessage      // inline success after save
setManagerContent.saveSet.error*              // inline validation/API errors
setManagerContent.emptyState.*               // no saved sets state
```

### profileContent

```ts
profileContent.sections.*                     // "Account", "App", "Account Actions"
profileContent.account.displayName.*          // label, placeholder, edit/save actions, errors
profileContent.account.email.*                // label, placeholder, edit/save actions, errors
profileContent.account.playerTag.label        // read-only field label
profileContent.account.playerTag.hint         // hint shown below the field
profileContent.app.*                          // four chevron-row labels
profileContent.accountActions.signOut         // sign-out button
profileContent.accountActions.deleteAccount   // destructive delete button
profileContent.accountActions.deleteConfirm*  // delete confirmation dialog
profileContent.version                        // bottom version string
```

### friendsContent

```ts
friendsContent.search.placeholder             // search input placeholder
friendsContent.search.submitAction            // "Add" button
friendsContent.search.*Error                  // inline errors (notFound, alreadyFriend, selfAdd)
friendsContent.search.requestSent             // success state
friendsContent.sections.pending               // "Pending" section heading (show count badge next to it)
friendsContent.sections.friends               // "Friends" section heading
friendsContent.pendingRow.*                   // "Accept" / "Decline" buttons + incoming label
friendsContent.friendRow.challengeAction      // opens new game modal pre-filled with opponent
friendsContent.friendRow.blockAction          // "Block" button
friendsContent.friendRow.blockConfirm*        // block confirmation dialog
friendsContent.emptyState.friends.*           // empty friends list
friendsContent.emptyState.pending.heading     // empty pending section
```

### helpContent

```ts
helpContent.nav.*                             // desktop sidebar nav labels
helpContent.elementAdvantage.*                // RPS triangle section
helpContent.elementAdvantage.rows.*           // "TIDE › DUNE" etc. display strings
helpContent.elementAdvantage.multiplierLabel  // "×1.5 dmg" callout
helpContent.abilities.elementTabs.*           // TIDE / GALE / DUNE tab labels
helpContent.rulesOverview.heading
helpContent.rulesOverview.bullets             // array — iterate with v-for
helpContent.howToPlay.*                       // body copy for Getting Started section
helpContent.buildingASet.*                    // body copy + CTA that links to /sets
helpContent.support.*                         // FAQ / Game Manual row labels
```

## Tone applied

- **Second person throughout:** "Your Games", "Your Sets", "Your turn", "Your element"
- **Verb-first CTAs under 4 words:** "Save Set", "Play", "Challenge", "Accept", "Resign"
- **Direct errors:** Each error says what went wrong, not just "error"
- **Minimal body copy:** Empty states and help text are one or two sentences maximum
- **Element names in caps:** TIDE, GALE, DUNE match the established pattern from `commonContent`
- **Status badges in caps:** YOUR TURN, WAITING, CHECK match the pattern established by `navContent`

## Blocking issues

None. All 6 files are ready for Frontend implementation.
