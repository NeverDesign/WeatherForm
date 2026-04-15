# WeatherForm

Async multiplayer chess variant — Vue 3 SPA. Players choose TIDE, GALE, or DUNE. Rock-paper-scissors element triangle (150/100/50 multipliers). Asynchronous turns like correspondence chess.

## Commands
```bash
npm run dev          # Dev server (Vite)
npm run build        # Type-check + production build
npm run test:run     # Vitest single-run (CI)
npx vitest run src/components/Foo/Foo.test.ts  # Single file
```

## Agent System
Available agents: `@orchestrator` `@backend` `@frontend` `@design` `@copy` `@qa`

Start any task: use the `new-task` skill or invoke `@orchestrator` directly.

## Key Context Files
| File | Purpose |
|------|---------|
| `.ai/project-overrides.md` | Project-specific rules — **check first** |
| `.ai/project-configuration.md` | Stack reference — grep for your section |
| `.ai/ai-philosophy.md` | Decision principles and communication protocol |
| `docs/specs/wireframes.md` | Approved wireframes (all 8 screens) |
| `docs/specs/brand-guidelines.md` | Colour system, typography, art direction |
| `docs/plans/` | Active implementation plans |
| `.handoffs/` | Agent-to-agent communication |
| `docs/sessions/` | Session summaries and QA reports |

## Settled Decisions
See `.ai/project-overrides.md`. Do not refactor game engine patterns without explicit approval.

## Agents — start here
1. Check `.claude/agent-memory/[your-role]/MEMORY.md` first
2. Read `.ai/project-overrides.md`
3. Grep `.ai/project-configuration.md` for your section only
4. Read `.ai/ai-philosophy.md` for communication protocol
