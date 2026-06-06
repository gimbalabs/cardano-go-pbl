---
date: 2026-06-06
status: completed
type: refactor
origin: docs/brainstorms/2026-06-06-restyle-requirements.md
---

# refactor: Cardano Go PBL Visual Restyle

## Summary

Restyle the whole app onto one semantic token layer that drives a warm-paper **light** default and a refined **dark** theme via a toggle (light is the front door). New type system (Work Sans / Geist Sans / self-hosted Go Mono), `@tailwindcss/typography`-driven prose at a 66ch measure, a shared dark code-slab + multi-color syntax palette, a hairline/radius refresh, Go×Cardano dual-accent chrome, and the assignment page rebuilt as a two-column description / cobalt-field layout. Style pass only — no business logic, data, or route changes (see origin: `docs/brainstorms/2026-06-06-restyle-requirements.md`).

---

## Problem Frame

The deployed app reads as a generic dark dev-tool theme: dark-only navy, Go cyan used for everything, flat 2px radius, four loaded typefaces (one mono referenced but never loaded), small hand-rolled serif prose, and a TipTap editor hardcoded light that flashes white inside the dark app. Color values are duplicated across `@theme` and `:root` and scattered as ~20 one-off hex literals, quietly breaking the template's central promise — that a fork is reskinnable by editing `src/config/branding.ts` + the token block in `src/styles/globals.css`. For a product whose substance is long-form technical reading and evidence authoring, the reading and assignment surfaces are the weakest part of the experience and don't match the warm, editorial aesthetic of the `enterprise-demo-resources` reference or the Go/Cardano/Gimbalabs brand family.

---

## Verified Codebase Facts

- **Tailwind v4.2.2** via `@tailwindcss/vite` (`astro.config.mjs`); theme tokens live in the `@theme` block of `src/styles/globals.css` (662 lines). **`@tailwindcss/typography` is NOT installed** — must be added.
- Existing markup binds to token-named Tailwind utilities: `bg-course`, `text-mn-text`, `text-mn-text-muted`, `border-course-border`, `font-heading`, `font-body`, `font-mono`. Renaming tokens would break these across many components — hence the alias strategy in U1.
- Two syntax-highlight systems, both emitting `hljs-*` classes: `marked-highlight` + `highlight.js` for server-rendered lesson/assignment prose (`src/lib/markdown.ts`), and `lowlight` + `@tiptap/extension-code-block-lowlight` for the editor. One `hljs-*` CSS palette covers both.
- Fonts loaded via Google Fonts `<link>` in `src/layouts/BaseLayout.astro` (Outfit/Urbanist/Lora). `--font-mono` references "Geist Mono" but it is never loaded.
- `:root` hardcodes `color-scheme: dark` and `html { font-size: 17px }`.
- Assignment page `src/pages/learn/[moduleCode]/assignment.astro` is a single `max-w-4xl` column: header → `.prose-course` content → `<AssignmentInteractive client:only="react">` stacked below. The island is self-contained (own `QueryClientProvider`) and renders all auth/commit/claim states internally — it can move into a column unchanged.
- `.prose-course` (~250 lines) and `.evidence-editor-content` (hardcoded light: `#1a1a1a`, `#f3f4f6`, `#0090b3`) are both hand-rolled in `src/styles/globals.css`.
- Reference model: `enterprise-demo-resources` `/practicum/[course_id]/[credential_hash]` page + its `.practicum*` CSS (grid `1fr 1fr`, scrollable left with sticky `--progress` bar, saturated `--ca-blue` right field with dotted-radial texture + floating `.practicum__card`, collapses to block `@media (max-width: 900px)`). Visual model only — nothing imported (Next.js vs Astro).

---

## Key Technical Decisions

- **Single source + compatibility aliases.** Define one canonical semantic token set in `:root` (light values) with a `:root[data-theme="dark"]` override block. Re-point the existing `@theme` color tokens and `--mn-*`/`--c-*` vars at the semantic tokens (e.g. `--color-course: var(--bg)`, `--color-mn-text: var(--ink)`) so existing `bg-course`/`text-mn-text` utilities keep working with zero component rewrites while all values flow from one place. (origin R1, R23)
- **oklch + color-mix derivation.** Base hues in oklch; hover/soft/active/border variants derived via `color-mix`. Baseline-available since 2024 — no fallbacks for the target audience. (origin R3)
- **Light default, dark via toggle, no FOUC.** `:root` = light; `[data-theme="dark"]` = refined navy. A tiny inline `<head>` script applies stored/`prefers-color-scheme` theme before first paint (theme state only — not business logic). `color-scheme` set per theme. (origin R2, R6)
- **Code is a dark slab in both themes.** A `--code-bg` token: dark-navy island on paper in light; a differentiated raised dark surface (border + value shift from page) in dark. One multi-color `hljs-*` palette serves prose and editor in both themes. (origin R7, R13)
- **Typography plugin via CSS.** Add `@tailwindcss/typography`, load with `@plugin "@tailwindcss/typography"`, override `--tw-prose-*` from semantic tokens; keep only genuinely custom prose bits (code-block language label). Apply `prose` to lesson + assignment prose at a 66ch measure. (origin R11, R12)
- **Self-hosted Go Mono.** Go Mono (BSD-3-Clause, redistributable) self-hosted in `public/fonts/` via `@font-face`; JetBrains Mono in the fallback stack. Keeps Go identity in code and stays fork-safe. (origin R9)
- **Pure-CSS reading progress.** Left-column progress bar uses `animation-timeline: scroll()`; degrades to a static bar where unsupported. No JS island, honoring the no-business-logic constraint. (origin R15, F1)

---

## System-Wide Impact

- **All visual surfaces** re-skin from the token layer: chrome (`Nav`, `Footer`), lesson pages, learn sidebar, module cards, assignment page, the TipTap editor, buttons/badges/cards.
- **Affected parties:** learners (A1) get the new reading/assignment experience; forkers (A2) get a cleaner, single-edit reskin contract — both must stay satisfied.
- **No change** to gateway calls, stores, routes, wallet/TX flows, or the `AssignmentInteractive` state machine — markup may be re-structured (assignment two-column) but component behavior is reused as-is.

---

## Implementation Units

Dependency graph: U1 → everything. U2, U3 depend on U1. U4 depends on U1+U3. U5 depends on U1. U6 depends on U1+U5. U7 depends on U1+U3. U8 depends on U1+U3+U5+U6.

### U1. Semantic token foundation + light/dark + compatibility aliases

**Goal:** Replace the duplicated/ scattered color system with one canonical semantic token set driving light (default) and dark, with existing Tailwind utility names aliased onto it. App renders coherently in warm-paper light after this unit.
**Requirements:** origin R1, R2, R3, R5, R6, R8, R20 (radius scale), R23
**Dependencies:** none
**Files:** `src/styles/globals.css`
**Approach:**
- Define canonical semantic tokens in `:root` (light): `--bg` (#F4F3ED/#F8F8F5), `--surface`, `--card`, `--ink` (#14171A), `--ink-muted` (#74766E), `--line` (#E5E2D9), `--accent` (Go cyan, oklch), `--accent-structure` (Cardano cobalt #0033AD), `--accent-ink`, `--link` (AA-passing blue, since #00ADD8 fails AA on white), `--code-bg`, plus success/warning/error in oklch. Derive `*-hover`/`*-soft`/active-tint/border via `color-mix`.
- Add `:root[data-theme="dark"]` overriding the same names with refined navy (raise card contrast, visible borders).
- Re-point existing `@theme` color tokens and `:root --mn-*` vars at the semantic tokens (alias layer) so `bg-course`/`text-mn-text`/`border-course-border` etc. keep working.
- Radius scale: `--radius-xl/lg` ≈ 10px, `--radius-md` ≈ 6px, `--radius-sm` ≈ 4px (replace the flat 2px).
- Remove hardcoded `color-scheme: dark`; set `color-scheme` per theme block. Update body bg/text + scrollbar + focus-ring to semantic tokens.
**Patterns to follow:** `enterprise-demo-resources` `src/app/globals.css` `:root` semantic-token + oklch + `color-mix` model.
**Test scenarios:** `Test expectation: none — token/CSS refactor with no behavioral change; verified visually and via U2's toggle.` Manual: every page renders in light with no missing-color regressions; existing utility classes still resolve.
**Verification:** App loads in warm-paper light; `npm run typecheck` passes; no component still shows the old navy except code blocks (U5).

### U2. Theme toggle + no-FOUC bootstrap

**Goal:** Let users switch light/dark; respect OS preference on first visit; persist override; no flash.
**Requirements:** origin R2, R19 (toggle), F2
**Dependencies:** U1
**Files:** `src/layouts/BaseLayout.astro` (inline head script), `src/components/layout/Nav.astro` (toggle control), `src/styles/globals.css` (toggle styles)
**Approach:**
- Inline `is:inline` head script (runs before paint): read `localStorage` theme; else `matchMedia('(prefers-color-scheme: dark)')`; default light; set `data-theme` on `<html>`.
- Nav toggle button flips `data-theme` and writes `localStorage`. Sun/moon affordance using Go Mono / icon.
**Patterns to follow:** existing `is:inline` process-shim script already in `BaseLayout.astro`.
**Test scenarios:**
- Covers F2/AE3. Fresh visit, OS=light → renders light; OS=dark → renders dark.
- Toggle flips theme; reload preserves the chosen theme over OS preference.
- No white/dark flash on load (theme applied pre-paint).
**Verification:** Toggle works on every page; chosen theme persists; no FOUC.

### U3. Type system: Work Sans + Geist Sans + self-hosted Go Mono + modular scale

**Goal:** Replace the four-font zoo with three role fonts and a named type scale.
**Requirements:** origin R9, R10
**Dependencies:** U1
**Files:** `src/layouts/BaseLayout.astro` (font `<link>` swap), `public/fonts/` (Go Mono woff2 + license), `src/styles/globals.css` (`@font-face`, `--font-*` tokens, type scale, base size, heading tracking)
**Approach:**
- Google Fonts `<link>`: Work Sans + Geist Sans (drop Outfit/Urbanist/Lora). Self-host Go Mono via `@font-face` from `public/fonts/`; include the BSD-3 `LICENSE`. Fallback stack ends in JetBrains Mono / `ui-monospace`.
- `--font-heading: "Work Sans"`, `--font-body: "Geist Sans"`, `--font-mono: "Go Mono", …`. Drop `--font-prose` (prose uses body now) or alias to body.
- Named scale tokens `--text-xs … --text-3xl` off a base (≈17px) + ratio (~1.2); heading tracking ≈ `-0.018em`.
**Patterns to follow:** existing Google Fonts `<link>` block; reference's Geist + scale discipline.
**Test scenarios:** `Test expectation: none — font/token swap; verified visually.` Manual: headings render Work Sans, body Geist, code Go Mono (not a system fallback); no unstyled-text flash beyond `display=swap`.
**Verification:** All three faces load; `--font-prose` references resolve; typecheck passes.

### U4. Prose via @tailwindcss/typography + 66ch measure + print

**Goal:** Replace hand-rolled `.prose-course` with the typography plugin token-wired to the theme; beautiful measure; printable lessons.
**Requirements:** origin R11, R12, R22
**Dependencies:** U1, U3
**Files:** `package.json` (+`@tailwindcss/typography`), `src/styles/globals.css` (`@plugin`, prose token overrides, print block, trimmed `.prose-course`), `src/pages/learn/[moduleCode]/[lessonIndex].astro` + `src/pages/learn/[moduleCode]/assignment.astro` (apply `prose` classes), `src/lib/markdown.ts` (only if class hooks needed)
**Approach:**
- Add dep; `@plugin "@tailwindcss/typography";` after `@import "tailwindcss";`.
- Map `--tw-prose-*` (body, headings, links, code, pre-bg, quotes, hr, th) to semantic tokens; set measure ~66ch / 720px; body ~16px/1.7; `text-wrap: pretty` on `p`, `balance` on headings.
- Reduce `.prose-course` to genuinely custom bits (code-block language label, table overflow). Keep the class name as a thin modifier layer over `prose` so existing markup/`set:html` keeps working.
- `@media print`: single column on white, hide chrome (nav/sidebar/footer/toggle), code blocks as light bordered boxes, expand link hrefs.
**Patterns to follow:** reference's `@plugin "@tailwindcss/typography"` + `--tw-prose-*` overrides and 720px measure.
**Test scenarios:**
- Covers R12. A lesson renders within the ~66ch measure with correct body size/line-height; markdown elements (lists, tables, blockquotes, hr) all styled with no new bespoke CSS.
- Covers AE2 (prep). Same markdown renders identically in lesson and (after U6) editor.
- Print preview of a lesson is a clean single-column handout with chrome hidden.
**Verification:** Lessons + assignment prose look editorial in both themes; print preview is clean; typecheck passes.

### U5. Code blocks + shared two-theme syntax palette

**Goal:** Code as a refined dark slab in both themes with differentiated, scannable highlighting shared by prose and editor.
**Requirements:** origin R7, R13
**Dependencies:** U1
**Files:** `src/styles/globals.css` (`--code-bg`, `pre`/inline-code rules, `hljs-*` palette)
**Approach:**
- `--code-bg`: dark navy in light theme; in dark theme a surface differentiated from page bg via value + 1px border.
- Replace the all-cyan `hljs-*` set with a restrained palette (keywords cobalt/blue, strings terracotta, comments muted, types/functions distinct) legible on the dark slab in both themes.
- Refine inline code (token bg, no cyan-on-everything), language-label chip, 6px radius, hairline border (no heavy left-bar unless kept intentionally).
**Patterns to follow:** existing `.prose-course pre .hljs-*` block (rework, don't extend); editor `pre` shares the palette.
**Test scenarios:** `Test expectation: none — CSS palette; verified visually.` Manual: a Go snippet shows differentiated keyword/string/comment colors in both themes; identical rendering in lesson prose and editor code blocks.
**Verification:** Code blocks are dark slabs with readable multi-color highlighting in light and dark; inline code legible.

### U6. Tokenize the TipTap evidence editor

**Goal:** Make the editor inherit the active theme instead of being a hardcoded-light island; true WYSIWYG vs published prose.
**Requirements:** origin R4
**Dependencies:** U1, U5
**Files:** `src/styles/globals.css` (`.evidence-editor-content` rules)
**Approach:** Replace hardcoded `#1a1a1a`/`#111`/`#f3f4f6`/`#0090b3`/`#1e1e2e` with semantic tokens (`--ink`, `--surface`, `--link`, `--code-bg`) and reuse the prose/code tokens so editor output matches lesson rendering in both themes.
**Patterns to follow:** the prose token mapping from U4; the code palette from U5.
**Test scenarios:**
- Covers AE2. In dark theme, text typed in the editor visually matches the same markdown rendered in a lesson; neither is a light island.
- Light theme: editor is paper-consistent with the page.
**Verification:** Editor follows the theme toggle; no white flashbang; WYSIWYG holds.

### U7. Chrome, hairlines & Go×Cardano brand identity

**Goal:** Dual-accent zoning, hairline/radius refresh across chrome, and real brand identity.
**Requirements:** origin R19, R20, R21, R23
**Dependencies:** U1, U3
**Files:** `src/components/layout/Nav.astro`, `src/components/layout/Footer.astro`, `src/components/course/ModuleCard.astro`, `src/components/ui/*` (Card/Badge/Button), `src/styles/globals.css` (sidebar + card rules), `src/config/branding.ts`
**Approach:**
- Zoning: Cardano cobalt `--accent-structure` for nav active / module numbers / wayfinding; Go cyan `--accent` for code/interactive accents.
- Replace flat-2px + 3-tier surface stack + sidebar box-shadow with hairlines + whitespace + the new radius scale.
- Module numbers (099–302) as Go Mono ID tags; mono section eyebrows; typographic wordmark (retire favicon-as-wordmark); footer as a spec block (stack/license/network).
- `branding.ts`: add accent-role hints + wordmark text as needed; keep the fork contract (chrome reads from branding + tokens).
**Patterns to follow:** reference hairline/`.btn`/`.card`/`.badge` variants; reference footer/topbar spec shape.
**Test scenarios:** `Test expectation: none — presentational; verified visually.` Manual: nav/footer/cards use hairlines not shadows; cobalt vs cyan used by role; module IDs in mono; editing `branding.ts` wordmark/accent updates chrome with no component edits.
**Verification:** Chrome reads as editorial Go×Cardano in both themes; fork contract intact.

### U8. Assignment two-column layout (description left, cobalt field right)

**Goal:** Rebuild the assignment page as the reference's two-column practicum layout, reusing `AssignmentInteractive` unchanged.
**Requirements:** origin R14, R15, R16, R17, R18, F1
**Dependencies:** U1, U3, U5, U6
**Files:** `src/pages/learn/[moduleCode]/assignment.astro`, `src/styles/globals.css` (two-column + cobalt-field + card + progress + responsive rules), possibly a small presentational wrapper component under `src/components/assignment/`
**Approach:**
- Grid `1fr 1fr`, full-height, independent scroll columns.
- **Left:** scrollable description surface — title, `prose` rubric (U4), SLT list with credential badge; sticky top reading-progress bar driven by `animation-timeline: scroll()`.
- **Right:** saturated `--accent-structure` (cobalt) field with subtle dotted-radial node texture + mask, centered floating card (`--surface`, radius, soft shadow) hosting the existing `<AssignmentInteractive client:only="react">` — all its states (CTA/loading/NOT_STARTED/IN_PROGRESS/PENDING/ACCEPTED/DENIED/CLAIMED) render inside the card.
- **Responsive:** `@media (max-width: 900px)` collapses to stacked blocks, description first.
- Do not alter island props/logic.
**Patterns to follow:** reference `.practicum__columns/__left/__right/__card/__progress` CSS and its `max-width: 900px` collapse.
**Test scenarios:**
- Covers F1/AE4. ≥900px: description and cobalt work-field side-by-side as equal columns; <900px: stacked, description first.
- Covers AE5. Unauthenticated visitor sees the connect-wallet CTA inside the right-column card; progressing enroll→submit→claim swaps card contents without changing the two-column frame.
- Left column scrolls independently; progress bar advances on scroll (and is a harmless static bar where `animation-timeline` is unsupported).
- All existing submission behavior unchanged (smoke: enroll/update/claim paths still call through).
**Verification:** Assignment page matches the reference two-column signature in both themes; every `AssignmentInteractive` state renders in the card; responsive collapse works; no behavior change.

---

## Scope Boundaries

- No business logic, data-fetching, gateway, store, route, or wallet/TX changes — visual/CSS/markup-structure only. The assignment page is re-structured but `AssignmentInteractive` and its states are reused as-is.
- No new course content; does not address the separate "mainnet build serves no modules" issue.

### Deferred to Follow-Up Work

- Chain-output-as-distinct-card styling (input vs output round-trip) — only if it falls cheaply out of U5; otherwise deferred (needs content conventions).
- Opportunistic migration of components off alias token names onto clean semantic names — not required; aliases stay.

### Outside this restyle's identity (from origin)

- Transit-spine / node-geometry progress navigation, multi-accent-by-course-phase wayfinding, gallery wayfinding plates, dual-voice (human vs protocol) typography, "lesson = light / lab = dark" auto-theming, code-beside split layouts, no-sidebar redesigns.

---

## Dependencies / Assumptions

- Add `@tailwindcss/typography` (verified absent; compatible with Tailwind v4 via `@plugin`).
- Go Mono woff2 obtainable and BSD-3 redistributable; JetBrains Mono fallback if not bundled.
- `AssignmentInteractive` can be placed inside a right-column card without prop/behavior changes (verified self-contained with its own `QueryClientProvider`).
- `animation-timeline: scroll()` acceptable as progressive enhancement (static bar fallback).

---

## Risks & Mitigation

- **Token alias regressions** — re-pointing `@theme` names could shift unrelated surfaces. Mitigate: change values only, keep names; visually sweep every page after U1.
- **Plugin prose vs `set:html`** — lessons render via `set:html`; ensure the `prose` class wraps the injected HTML and the trimmed `.prose-course` modifier still covers custom bits. Verify on a content-rich lesson.
- **Two-column height/scroll on real content** — long rubrics + tall editor states; verify independent scroll and the <900px collapse with a real assignment in each `AssignmentInteractive` state.
- **Dark-mode code contrast** — ensure `--code-bg` is distinguishable from page bg in dark; check the shared palette in both themes.

---

## Success Criteria

- App reads as warm, editorial, distinctly Go×Cardano in light (default) and dark; no generic-dark-dev-tool impression; no un-themed/jarring surface (editor included).
- Lessons + assignment prose are comfortably readable at the 66ch measure in both themes; lessons print as clean handouts.
- A forker reskins the whole app — chrome and the assignment cobalt field included — by editing only `src/config/branding.ts` + the token block in `src/styles/globals.css`.
- Every `AssignmentInteractive` state, route, wallet/TX flow, and submission path behaves exactly as before; `npm run typecheck` passes.
- Implementer needed no product re-decisions: palette, type roles, theme strategy, code-surface approach, and the assignment layout are all settled here.

---

## Outstanding Questions

### Deferred to Implementation

- [Affects U3][Needs research] Exact Go Mono woff2 source/subset and whether to ship a variable or static weight set.
- [Affects U4][Technical] Final list of `.prose-course` custom rules that must survive after adopting the plugin (language label, table overflow, any content-specific markup).
- [Affects U8][Technical] Whether the left-column progress + node-texture need a tiny presentational wrapper component or fit inline in `assignment.astro`.
- [Affects U5][Technical] Final `--code-bg` dark-theme value and the exact 5–7 color `hljs-*` palette tuned for both themes.
