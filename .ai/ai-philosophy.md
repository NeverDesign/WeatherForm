# AI Philosophy — WeatherForm

Decision-making principles and communication protocols for all agents. Read before starting any work.

---

## Coding Values

**Match the Room**
Follow existing patterns. Don't impose a style the codebase doesn't use. If you think a pattern should change, note it in your session summary Observations — don't change it without permission.

**Correctness Over Cleverness**
Simple, readable, and maintainable beats clever. Write code the next agent can understand without help.

**Convention Is Documentation**
Following project patterns consistently IS a form of documentation. Deviation requires an explicit note in the session summary.

**Minimalism**
Only change what was asked for. Unrelated improvements go in Observations — not in the code.

**Security by Default**
Never expose secrets. Validate inputs at every boundary.

**Accessibility Is Not Optional**
WCAG 2.2 AA minimum. Every interactive element must be keyboard-reachable. Every image needs alt text or `role="presentation"`. Every form input needs a label. Game-specific: board squares need `role="gridcell"`, pieces need descriptive `aria-label`.

---

## Decision-Making Principles

### When to Proceed
- Task is clear with no blocking ambiguity
- Change is small, localised, and reversible
- Direct precedent exists in the codebase
- Purely technical, no user-facing behaviour change

### When to Ask
- Requirements are ambiguous with significant consequences
- Change affects the game engine (see settled decisions in `.ai/project-overrides.md`)
- Task deviates from established convention
- Deleting or renaming something that might be in use elsewhere

### Priority Order (when rules conflict)
1. `.ai/project-overrides.md` (highest)
2. Security
3. Accessibility
4. Correctness
5. Convention
6. Performance
7. Elegance

### Reversibility Bias
Prefer reversible actions. If two approaches achieve the same outcome, choose the one easier to undo.

### Scope Discipline
Do only what was asked. Note unrelated issues in Observations. Never fix unrelated things without permission.

---

## Agent Communication Protocol

### Handoff Format
Every agent writes a handoff before the next agent can start.
File: `.handoffs/[role]-[feature].md`

```
---
feature: [name]
agent: [role]
status: complete | blocked
timestamp: YYYY-MM-DD
---
[structured content per agent playbook]
```

### Backend → Frontend Contract
Must include:
- Types defined and where to import them
- Store state and actions available
- Any data passed through template data attributes
- New content keys added (if any)

### Reviewer → Originating Agent
```
Verdict: PASS | PASS WITH NOTES | REVISIONS REQUIRED

Blockers: (functionality broken, hard rule violated)
  - [File:Line] Description. Fix: concrete instruction.

Major: (accessibility AA, responsive failure, wrong pattern)
  - [File:Line] Description. Fix: concrete instruction.

Minor: (style inconsistency, naming nit)
  - [File:Line] Description. Fix: concrete instruction.
```

### Escalation Protocol
If blocked:
1. Stop work on the affected part
2. Set `status: blocked` in the handoff
3. Add `[ESCALATION]` with clear description of what decision is needed
4. The orchestrator surfaces this to the human

---

## Session Summaries

Every agent writes a session summary. Not optional.

**File:** `docs/sessions/YYYY-MM-DD-[agent]-[task].md`

```markdown
# Session: [Task]
**Agent:** [role]
**Date:** YYYY-MM-DD

## Actions Taken
- [every file created, modified, or deleted]

## Decisions
- [non-trivial choices: options considered, what was chosen and why]

## Observations
- [unrelated issues noticed but not fixed]

## [Frontend/Design] Accessibility
- [WCAG checks and results]

## [Frontend] Responsive
- [breakpoints checked]

## Uncertainty Log
- [anything the agent was unsure about — /learn reads this]

## Commit Notes
- [bullets for git commit body]

## Commit Subject
feat/fix/chore: [description]
```

The **Uncertainty Log** is critical. If you made a choice you weren't confident about, log it. The `/learn` skill uses this to surface potential corrections.
