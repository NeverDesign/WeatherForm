# Game Rules

> **Purpose:** Authoritative rule definitions. Deterministic — given identical inputs, outcomes are always identical. Adapted from weatherform-0.0 with async multiplayer and mono-elemental system applied.

---

## 1. Turn Flow

1. `GameState.activePlayer` is `'P1'` or `'P2'`.
2. The active player may move any of their pieces that have `canActThisTurn: true`.
3. Each piece may act at most once per turn.
4. The active player dispatches `END_TURN` when done.
5. On `END_TURN`:
   - `activePlayer` toggles (`P1 ↔ P2`)
   - `turn` counter increments by 1
   - Status effects tick for the **newly active** player's pieces (BURN/POISON deal damage; FREEZE/STUN reduce duration)
   - All pieces belonging to the new active player have `canActThisTurn` reset to `true`

### Async Turn Timer
Each player has a time limit per turn. If the timer expires before `END_TURN` is dispatched, a `TIMEOUT_FORFEIT` event is automatically emitted, ending the game in favour of the waiting player.

Timer duration is a game configuration value (e.g., 72 hours) set at game creation.

---

## 2. Movement Rules

### Coordinate System
- Board is 8×8.
- Origin `(0, 0)` is the bottom-left from P1's perspective.
- `x` increases left → right; `y` increases bottom → top.
- From each player's perspective, their own pieces are always at the bottom of the board (UI orientation, not engine coordinates).

### Piece Movement Patterns

| Piece  | Movement Pattern |
|--------|-----------------|
| PAWN   | 1 square forward (2 from starting row); diagonal captures only |
| KNIGHT | L-shape (2+1 offset); ignores blocking pieces |
| ROOK   | Any distance along rank or file; blocked by pieces |
| BISHOP | Any distance diagonally; blocked by pieces |
| QUEEN  | Rook + Bishop combined |
| KING   | 1 square in any direction |

### Move Validation
- A piece cannot move out of bounds (`x` or `y` outside 0–7).
- A piece cannot move to a tile occupied by a **friendly** piece.
- Moving to an enemy-occupied tile triggers combat (see Section 3).
- A piece with `canActThisTurn: false` may not be selected or moved.

---

## 3. Combat Rules

### Initiation
Combat is triggered automatically when a `MOVE` event places a piece on a tile occupied by an opposing piece. An internal `COMBAT_TRIGGERED` event is emitted by the reducer in the same state transition.

### Resolution

```
finalDamage = Math.floor(rawDamage × elementMultiplier / 100)
```

- `rawDamage` — base attack value of the attacking piece type.
- `elementMultiplier` — 150 (advantage), 100 (mirror), or 50 (disadvantage). See [`elements.md`](elements.md).
- Result is always a non-negative integer (minimum 0).

### Outcome
- Target's `hp` is reduced by `finalDamage`.
- If `targetHpAfter <= 0`: target is defeated, removed from `pieces`, ID added to `capturedPieces`.
- A `CombatEntry` is appended to `combatLog` regardless of outcome.
- The attacker's ability status effect (if any) is applied to the defender post-combat.

### Abilities
See [`abilities.md`](abilities.md) for the full list. Each piece type has one ability per element; the ability is fixed by the set's element choice.

---

## 4. Status Effect Rules

Status effects are processed at the **start** of the affected player's turn via `processStatusEffects`.

| Effect  | Mechanical Result                             | Removed When   |
|---------|-----------------------------------------------|----------------|
| BURN    | Deals `damagePerTurn` to piece HP each turn   | `duration` → 0 |
| POISON  | Deals `damagePerTurn` to piece HP each turn   | `duration` → 0 |
| FREEZE  | `canActThisTurn` set to `false`               | `duration` → 0 |
| STUN    | Piece skips its action this turn              | `duration` → 0 |

Re-applying an effect of the same kind **refreshes duration** — effects do not stack.

---

## 5. Contested Tiles

A **contested tile** exists when two opposing pieces occupy the same `(x, y)` position after a `COMBAT_TRIGGERED` event where neither piece is defeated.

- Both pieces remain in `GameState.pieces` at the same `pos`.
- The active player may re-select their piece on the contested tile.
- Re-selecting initiates another combat resolution on the next valid action.
- No special engine flag — derived by checking for multiple pieces at the same position.
- UI renders both pieces side-by-side with scaled-down visuals.

---

## 6. Element Advantage (Combat)

Element determines both the damage multiplier and the ability used. See [`elements.md`](elements.md) for the full multiplier table. The attacker's element is compared to the defender's element at the moment of combat resolution.

All pieces in a player's army share the same element (mono-elemental model — see [`set-manager.md`](set-manager.md)).

---

## 7. Win Conditions

| Condition | Result |
|-----------|--------|
| Opponent's King HP reaches 0 | Current player wins; `GameState.winner` set; `status` → `'FINISHED'` |
| `FORFEIT` event dispatched | Opposing player wins |
| `TIMEOUT_FORFEIT` event emitted | Waiting player wins (active player exceeded turn timer) |
