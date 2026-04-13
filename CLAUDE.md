# Cardano Go PBL

Course app for "Cardano Go PBL — Build on Cardano with Go". Ten modules (099–302) teaching Go developers to build on Cardano using gOuroboros, Bursa, Apollo, Adder, and Snek.

## Three uses

1. **Deployed web app** — Astro 6 hybrid, prerendered lessons, SSR assignments/dashboard
2. **Agent-consumable course** — `/learn` skill with instructor + assessor sub-agents
3. **Open-source template** — fork, edit `src/config/branding.ts` + `src/styles/globals.css`, deploy your own

## Content

All course content lives in `content/cardano-go-pbl/`. This is the single source of truth.

```
content/cardano-go-pbl/
  00-course.md              # Course metadata and module overview
  01-slts.md                # Canonical SLT definitions (45 SLTs, 10 modules)
  04-readiness-assessment.md
  05-delegation-map.md
  lessons/
    module-099/             # Go Fundamentals for Cardano
    module-100/             # What is Cardano?
    module-101/             # Cardano Addresses and Keys
    module-102/             # Build and Submit Transactions
    module-201/             # Chain Indexing with Adder
    module-202/             # Persistent Indexing
    module-203/             # Node Communication
    module-204/             # Protocol Deep Dive
    module-301/             # Performance and Debugging
    module-302/             # Production Architecture
  assignments/              # Per-module assignment rubrics
```

## Architecture

- **Astro 6** with `output: "server"`, Node adapter (standalone)
- **React 19** islands for interactive components (wallet, dashboard, assignments)
- **Zustand** for cross-island state (auth + TX stores)
- **TipTap** for evidence editor (rich text → markdown)
- **Mesh SDK** for CIP-30 wallet integration
- **Tailwind CSS v4** — theme tokens in `src/styles/globals.css`

## Config layer (edit these when forking)

| File | What to change |
|------|----------------|
| `src/config/branding.ts` | Course name, tagline, links, logo paths |
| `src/config/course.ts` | Title, module count, route helpers |
| `src/config/networks.ts` | Course IDs (preprod + mainnet), gateway URLs |
| `src/styles/globals.css` | Colors, fonts (the `@theme` and `:root` blocks) |

## Agent harness

- `.claude/agents/instructor.md` — delivers lessons conversationally
- `.claude/agents/assessor.md` — evaluates assignment submissions
- `.claude/skills/learn/` — orchestrates the course journey

## Commands

```bash
npm run dev          # Local dev server on :3000
npm run build        # Production build (needs ANDAMIO_API_KEY)
npm run typecheck    # astro check + tsc --noEmit
```

## Environment

```
ANDAMIO_API_KEY=           # Server secret — Andamio API key
PUBLIC_ANDAMIO_NETWORK=    # "preprod" or "mainnet"
```

## Guardrails

- Never commit `.env` or wallet signing keys
- Never force push
- Content changes: edit `content/`, compile with `andamio course import-all`, trigger rebuild
