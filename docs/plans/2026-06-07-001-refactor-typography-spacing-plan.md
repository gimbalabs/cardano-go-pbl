---
date: 2026-06-07
status: completed
type: refactor
origin: docs/ideation/2026-06-06-typography-refinement-ideation.md
---

# refactor: Typography & Spacing Refinement (whole-project)

## Summary

Complete the `:root` design-token system — promote weight, tracking, type-scale, leading, spacing, and measure to tokens beside the existing color + radius — then clean the markup to consume them. The visible result: thinner, large-goes-lighter headings (Geist-only, weight capped at 600), muted body ink, graduated tracking, a capped/load-bearing type scale, role-based leading, one spacing scale applied as tight-intra/generous-inter rhythm, and a unified reading measure with the lesson-heading alignment fixed. Style pass only — no business logic; light and dark stay token-driven (see origin: `docs/ideation/2026-06-06-typography-refinement-ideation.md`).

---

## Problem Frame

The post-restyle app reads heavier and less refined than the `enterprise-demo-resources` target. The heaviness is structural, not stylistic-by-choice: headings get their weight from `font-bold`/`font-semibold` sprinkled across markup (homepage hero, lesson H1, nav, `.assignment-title: 700`), not from the stylesheet — so weight is inconsistent and uncapped. Body text is near-black (`#14171a`) on warm paper, which visually buzzes. Tracking is a single flat `-0.018em` regardless of size. Line-heights are scattered (plugin default, `1.65`, `1.2`, `1.6`, `1.45`) with no tokens. There is no spacing scale at all — paddings are ~20 distinct arbitrary rems plus ad-hoc Tailwind `py/mb`, so vertical rhythm reads "assembled, not designed." The reading measure (`68ch`) is hardcoded in one place and the lesson H1 sits in a wider wrapper than its own body, so it overhangs. Two near-identical sans families (Work Sans + Geist) add load and a tuning surface for almost no perceptible contrast.

The fork-friendly promise ("edit `:root`, everything re-derives") currently holds only for color and radius. Type and space are the gap.

---

## Verified Codebase Facts (post-restyle)

- `src/styles/globals.css`: `--font-heading: "Work Sans"`, `--font-body`/`--font-prose: "Geist"`, `--font-mono: "Go Mono"`. `--text-xs..3xl` exist (ratio ~1.2); `--tracking-heading: -0.018em` applied flatly. `html { font-size: 17px }`. `--ink: #14171a` drives both `--tw-prose-body` and `--tw-prose-headings`. Radius tokens exist; **no weight/leading/spacing/measure tokens**. `.prose-course { max-width: 68ch }` (the only measure). Arbitrary paddings: `.assignment-desc-inner 2.75rem 1.75rem 3rem`, `.assignment-card 1.75rem`, sidebar items `0.625rem 0.5rem`, etc.
- `src/layouts/BaseLayout.astro`: Google Fonts loads `Work+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700`. Go Mono self-hosted via `@font-face` (unchanged).
- Heaviness in markup: `font-bold` (e.g. `src/pages/index.astro` hero, `src/pages/learn/[moduleCode]/[lessonIndex].astro` H1, `src/pages/404.astro`, `src/pages/500.astro`), `font-semibold` (`src/components/layout/Nav.astro` brand, `src/layouts/LearnLayout.astro` module title), `.assignment-title { font-weight: 700 }` in globals. ~55 weight utilities, ~138 size utilities across `src/`.
- `src/pages/index.astro` "Three ways to learn" block is built from **inline `style` attributes** with hardcoded px/rem/weight/line-height — token changes skip it unless migrated.
- Tailwind v4.2.2 via `@tailwindcss/vite`; `@tailwindcss/typography` drives prose through `--tw-prose-*`. Heading/body utilities (`text-mn-text`, `font-heading`, `bg-course`, etc.) are aliased onto semantic tokens in `@theme`.

---

## Key Technical Decisions (target values)

- **Geist-only.** `--font-heading: var(--font-body)` (Geist). Remove Work Sans from the `@theme` token and the Google Fonts `<link>`. Go Mono remains the sole second voice. Hierarchy comes from size + space + tracking, not a second sans. (origin: Open decision → resolved Geist-only.)
- **Weight strategy (cap 600).** Load Geist `wght@400;500;600` (drop 700). Tokens: `--weight-body: 400`, `--weight-label: 500`, `--weight-heading: 600`, `--weight-display: 500` (large-goes-lighter), `--weight-emphasis: 600`. Base `h1–h6 { font-weight: var(--weight-heading) }`; hero/display use `--weight-display`. `--tw-prose-bold: var(--weight-emphasis)`. Add `font-optical-sizing: auto` on `html`. If Geist 400 renders thin on the warm paper, bump body to `450` (decide visually).
- **Tracking ramp.** `--tracking-display: -0.03em`, `--tracking-heading: -0.02em`, `--tracking-body: 0`, `--tracking-label: 0.08em`. Apply by role; uppercase mono eyebrows/labels use `--tracking-label` (positive); code stays `0`.
- **Type scale, capped + load-bearing.** Keep base 17px, ratio ~1.2. Add `--text-4xl` and treat the existing tokens as the only allowed sizes; cap hero/H1 around `--text-3xl`/`--text-4xl` (≈35–42px), drop `md:text-6xl`. Bind base `h1–h6` font-sizes to scale tokens so a bare heading is correct.
- **Leading tokens.** `--leading-display: 1.1`, `--leading-heading: 1.2`, `--leading-body: 1.7`, `--leading-ui: 1.4`, `--leading-code: 1.55`. Bind in base rules, prose (`--tw-prose` line-heights inherit), `pre`, dense components.
- **Muted body ink.** Add `--ink-body` (light ≈ `#2b2f36`; dark = current muted-ish, slightly brighter than headings). Point `--tw-prose-body` + base `body` at `--ink-body`; keep `--ink` for headings, UI, emphasis. Both themes.
- **Spacing scale.** `--space-1:4px … --space-9:96px` (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96). Replace arbitrary rems; apply tight-intra (heading→body small) / generous-inter (section gaps 48–96px).
- **Measure.** `--measure: 65ch`. Apply to every prose/text-block context; allow code/tables to exceed it. Fix the lesson H1 overhang by constraining the lesson header to the prose column.

---

## System-Wide Impact

- Every text surface re-derives from the new tokens: chrome (nav/footer), lessons, learn sidebar, module cards, assignment two-column, evidence editor, dashboard, 404/500, homepage.
- Affected: learners (cleaner reading), forkers (type + space now reskinnable from `:root`).
- No change to gateway calls, stores, routes, wallet/TX, or `AssignmentInteractive` behavior — CSS + className/markup-structure only.

---

## Implementation Units

Dependency graph: U1 → (U2, U3, U4, U5, U6, U7) → U8. U1 establishes the family/weight foundation; U2–U7 add the remaining token families on top; U8 cleans markup to consume all of them.

### U1. Geist-only family + weight token strategy + font load

**Goal:** Collapse to Geist for all text, cap weight at 600 via tokens, make bare headings correct by default.
**Requirements:** origin idea 1 (weight system) + the resolved Geist-only decision.
**Dependencies:** none
**Files:** `src/styles/globals.css`, `src/layouts/BaseLayout.astro`
**Approach:**
- `@theme`: `--font-heading: var(--font-body)` (Geist); remove the `"Work Sans"` token.
- BaseLayout: change the Google Fonts `<link>` to `Geist:wght@400;500;600` only (drop Work Sans entirely and Geist 700).
- Add `--weight-display/-heading/-body/-label/-emphasis` to `:root`; set base `h1–h6 { font-weight: var(--weight-heading) }`; map `--tw-prose-bold: var(--weight-emphasis)`.
- Add `font-optical-sizing: auto` and confirm `-webkit-font-smoothing: antialiased` on `html`.
**Patterns to follow:** existing `@theme` alias + `:root` token blocks; existing `@font-face` for Go Mono stays.
**Test scenarios:** `Test expectation: none — token/CSS + font-load change; verify visually (headings render Geist, not a fallback) + `npm run typecheck` + Tailwind compile. Manual: no Work Sans request in network panel.`
**Verification:** App renders Geist headings; no Work Sans loaded; bare `<h1>` shows weight 600 with no markup class.

### U2. Tracking-by-size tokens

**Goal:** Replace the flat tracking with a size-graduated ramp.
**Requirements:** origin idea 3.
**Dependencies:** U1
**Files:** `src/styles/globals.css`
**Approach:** Add `--tracking-display/-heading/-body/-label`; apply `--tracking-heading` to base h1–h6 (display/hero gets `--tracking-display`), `--tracking-label` to uppercase mono eyebrows/labels (`.assignment-eyebrow`, code language label, footer/nav mono labels), body stays 0.
**Patterns to follow:** existing `--tracking-heading` usage; the mono eyebrow/label rules added in the restyle.
**Test scenarios:** `Test expectation: none — CSS; verify visually that large headings tighten and small uppercase labels open up.`
**Verification:** h1 visibly tighter than before; eyebrow labels no longer cramped.

### U3. Type scale: cap display + make load-bearing

**Goal:** Bring all heading sizes onto the token scale and cap the display size.
**Requirements:** origin idea 4.
**Dependencies:** U1
**Files:** `src/styles/globals.css` (scale tokens, base h1–h6 sizes)
**Approach:** Add `--text-4xl`; set base `h1–h6` font-sizes from `--text-*`; cap hero/h1 at ~`--text-3xl`/`--text-4xl`. (Markup that currently uses `text-2xl/3xl/6xl` is reconciled in U8.)
**Patterns to follow:** existing `--text-*` tokens.
**Test scenarios:** `Test expectation: none — CSS; verify hero no longer oversized; headings step cleanly.`
**Verification:** No on-screen heading larger than the capped display token; bare headings size correctly.

### U4. Leading tokens by role

**Goal:** One leading policy via tokens.
**Requirements:** origin idea 5.
**Dependencies:** U1
**Files:** `src/styles/globals.css`
**Approach:** Add `--leading-display/-heading/-body/-ui/-code`; bind to base h1–h6, `body`, `pre`, prose vars, and dense components (sidebar, cards); remove now-redundant scattered `line-height` literals where a token applies.
**Patterns to follow:** existing prose/editor line-height rules being consolidated.
**Test scenarios:** `Test expectation: none — CSS; verify prose ~1.7, headings tight, dashboard/sidebar tighter.`
**Verification:** Prose and UI leading visibly differ by role; no element left on browser-default 1.2.

### U5. Muted body ink

**Goal:** Soften long-form body color; reserve near-black for headings/emphasis.
**Requirements:** origin idea 2.
**Dependencies:** U1
**Files:** `src/styles/globals.css`
**Approach:** Add `--ink-body` (light + dark values); point `--tw-prose-body` and base `body` color at it; keep `--ink` for headings/UI/`--tw-prose-bold`/`--tw-prose-headings`.
**Patterns to follow:** existing `:root` / `[data-theme="dark"]` token blocks.
**Test scenarios:** `Test expectation: none — token; verify body text softer than headings in both themes; confirm AA contrast on `--bg`.`
**Verification:** Body reads softer; headings/links remain full-contrast; AA holds.

### U6. Spacing scale + non-uniform rhythm

**Goal:** One spacing scale replacing arbitrary rems; tight-intra/generous-inter rhythm.
**Requirements:** origin idea 6.
**Dependencies:** U1
**Files:** `src/styles/globals.css`
**Approach:** Add `--space-1..9` (4px grid). Replace arbitrary paddings in `.assignment-*`, sidebar, editor, prose spacing with scale steps; widen section gaps (48–96px), keep intra-block gaps small. (Markup `py/mb` utilities reconciled in U8.)
**Patterns to follow:** radius-scale token pattern already in the file.
**Test scenarios:** `Test expectation: none — CSS; audit that remaining padding/margin values are scale steps; verify section breathing increased.`
**Verification:** No arbitrary off-scale rem left in globals; section rhythm visibly more generous.

### U7. Unify measure + fix lesson-heading alignment

**Goal:** One reading measure everywhere; lesson H1 aligns to its body.
**Requirements:** origin idea 7.
**Dependencies:** U1
**Files:** `src/styles/globals.css`, `src/pages/learn/[moduleCode]/[lessonIndex].astro`, `src/pages/learn/[moduleCode]/assignment.astro`
**Approach:** Add `--measure: 65ch`; apply to `.prose-course` and assignment description; constrain the lesson header (title/eyebrow) to the same column as the prose body so it no longer overhangs (wrap header + article in a shared `--measure` container, or cap the header). Code/tables may exceed measure.
**Patterns to follow:** the existing `max-w-5xl` lesson wrapper + `.prose-course` max-width.
**Test scenarios:** `Test expectation: none — layout CSS; verify lesson H1 right edge aligns with body; prose ~65ch; code can still exceed.`
**Verification:** Lesson header and body share a left edge and max width; no heading overhang.

### U8. Markup cleanup — consume the tokens

**Goal:** Remove the markup-level heaviness/ad-hoc sizes so the token system is the single source.
**Requirements:** origin ideas 1,4,6 (markup side) + "Three ways" migration.
**Dependencies:** U1, U2, U3, U4, U5, U6, U7
**Files:** `src/pages/index.astro` (incl. inline-style "Three ways" block), `src/pages/learn/[moduleCode]/[lessonIndex].astro`, `src/pages/learn/[moduleCode]/assignment.astro`, `src/pages/404.astro`, `src/pages/500.astro`, `src/components/layout/Nav.astro`, `src/components/layout/Footer.astro`, `src/components/course/ModuleCard.astro`, `src/layouts/LearnLayout.astro`, `src/components/dashboard/*`, `src/components/ui/button.tsx`
**Approach:**
- Remove `font-bold`/`font-semibold` where the base h1–h6 (U1) now sets weight; keep explicit weight only where a non-heading intentionally needs `--weight-label`/`-emphasis`.
- Replace ad-hoc `text-2xl/3xl/4xl/5xl/6xl` with the scale tokens / capped sizes from U3.
- Migrate the homepage "Three ways to learn" inline `style` attributes to token-driven classes (weights, sizes, leading, spacing, ink).
- Spot-fix any remaining hardcoded leading/spacing in markup to U4/U6 tokens.
**Patterns to follow:** token utilities already aliased in `@theme` (`text-mn-text`, etc.); the restyle's existing className conventions.
**Test scenarios:** `Test expectation: none — markup/className changes; verify each page (home, lesson, assignment, dashboard, 404/500) in light + dark renders with capped weights/sizes and no inline-style island; `npm run typecheck` + Tailwind compile.`
**Verification:** Grep shows no `font-bold`/`font-semibold` on headings and no inline-style typography in `index.astro`; pages visually consistent.

---

## Scope Boundaries

- No business logic, data, routing, store, or wallet/TX changes — CSS tokens + className/markup-structure only.
- Light + dark both remain token-driven; no theme behavior change.
- No new content; unrelated to the mainnet course-content gap.

### Deferred to Follow-Up Work

- Density-as-attribute (`data-density="compact|comfortable"`) toggle.
- Financial-terminal dashboard density + tabular figures (`tnum`).
- Newspaper-deck / museum-wall-label metadata hierarchy concepts.
- Golden-ratio / canon page placement.

---

## Risks & Mitigation

- **Geist 400 renders thin on warm paper** — mitigate by bumping body to `450` (decide visually in U5/U1); `font-optical-sizing` + antialiasing already help.
- **Removing markup weights makes something disappear/under-weight** — base h1–h6 weight (U1) must land before U8 strips classes; verify each page after U8.
- **Capping the scale under-differentiates a heading level** — verify h1/h2/h3 remain distinguishable with weight equalized (size+tracking+space carrying it).
- **Measure container refactor (U7) shifts lesson layout** — verify the existing two-column assignment and lesson nav still align; keep changes to wrappers, not the island.
- **Tailit v4 `@theme` var aliasing** — already proven in the restyle; new tokens follow the same pattern.

---

## Success Criteria

- The app reads noticeably cleaner/lighter/editorial in both themes — no `font-bold` headings, no oversized hero, softer body ink, generous section rhythm — visibly closer to `enterprise-demo-resources`.
- Weight, tracking, scale, leading, spacing, and measure are all `:root` tokens; a bare heading/paragraph/section is correct with no markup classes; a fork retunes type + space from `:root` alone.
- No business logic or behavior changed; `npm run typecheck` + Tailwind compile pass; every `AssignmentInteractive` state and route works as before.
- The homepage "Three ways" section is token-driven (no inline-style island).
- An implementer needed no further product decisions — family, weights, ratio, measure, and spacing grain are settled here.

---

## Outstanding Questions

### Deferred to Implementation

- [Affects U1/U5][Technical] Final Geist body weight — 400 vs 450 — decided visually on the warm paper in both themes.
- [Affects U3][Technical] Exact capped display size (`--text-3xl` ~35px vs a new `--text-4xl` ~42px) for the homepage hero, tuned against the reference.
- [Affects U6][Technical] Exact mapping of each current arbitrary padding to the nearest `--space-*` step (and which gaps become the "generous-inter" 48–96px).
- [Affects U7][Technical] Whether to wrap lesson header+article in a shared measure container vs cap the header — pick the lower-risk DOM change during implementation.
