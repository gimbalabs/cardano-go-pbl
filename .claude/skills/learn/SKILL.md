name: learn
description: "Learn to build on Cardano with Go — take the course, get lessons
  delivered, do exercises, submit assignments, and track progress across 10 modules
  (45 SLTs). Start with /learn."

# /learn — Cardano Go PBL Course Orchestrator

Orchestrates the full "Cardano Go PBL" course journey. Routes learners to lessons
(via instructor agent) or assignments (via assessor agent), tracks progress, and
manages module gating.

## Triggers

`/learn`, "start the course", "take lesson 201.1", "submit assignment for module 102"

## Phase 1: Context check

1. Read `progress.json` (see `references/progress-schema.md` for schema)
2. If no progress file exists, initialize one with module 099 unlocked
3. Determine current state: which modules completed, which in progress, which locked

## Phase 2: Route

Based on the learner's request:

- **"Start" / no specific request** → show progress overview, suggest next lesson
- **"Lesson {code}.{n}"** → deliver lesson via instructor agent
- **"Assignment {code}"** → assess submission via assessor agent
- **"Progress" / "Status"** → show current progress

## Phase 3a: Deliver lesson

1. Verify the module is unlocked
2. Spawn the **instructor** agent (use opus model) with:
   - Module code and lesson number
   - Learner's progress context
   - Path to lesson file: `content/cardano-go-pbl/lessons/module-{code}/{slt}-{slug}.md`
3. On completion, update progress.json: mark lesson as completed

## Phase 3b: Assess assignment

1. Verify all lessons in the module are completed
2. Accept the learner's evidence submission
3. Spawn the **assessor** agent (use opus model) with:
   - Module code
   - Assignment rubric from `content/cardano-go-pbl/assignments/m{code}-assignment.md`
   - Learner's submission
4. On Accept: mark module as completed, unlock next module
5. On Revise: provide feedback, keep module in progress

### On-chain submission (optional)

After an assignment is accepted, offer on-chain submission:

```
Your assignment for module {code} has been accepted!

Would you like to submit this on-chain for a verifiable credential?
If you have the Andamio CLI installed and authenticated:
  andamio course assignment commit --course-id <id> --module-code {code}

Or submit via the web app at the assignment page.
```

If the learner is not authenticated, point them to the GitHub issues page
(from `src/config/branding.ts` → `links.githubIssues`).

## Module gating

- **Module 099** — always unlocked (Go fundamentals prerequisite)
- **Modules 100–302** — unlock sequentially when the prior module's assignment is accepted

## Course structure

| Module | Name | SLTs | Lessons |
|--------|------|------|---------|
| 099 | Go Fundamentals for Cardano | 4 | 4 |
| 100 | What is Cardano? | 4 | 4 |
| 101 | Cardano Addresses and Keys | 5 | TBD |
| 102 | Build and Submit Transactions | 5 | 3 |
| 201 | Chain Indexing with Adder | 6 | 5 |
| 202 | Persistent Indexing | 5 | 4 |
| 203 | Node Communication with gOuroboros | 5 | TBD |
| 204 | Protocol Deep Dive | 5 | 1 |
| 301 | Performance and Debugging | 3 | 1 |
| 302 | Production Architecture | 3 | TBD |

## Rules

- Never fabricate lesson content — always read from the content files
- If a lesson file doesn't exist yet, tell the learner and suggest the next available lesson
- Track progress honestly — don't mark lessons completed unless the learner engaged with the material
