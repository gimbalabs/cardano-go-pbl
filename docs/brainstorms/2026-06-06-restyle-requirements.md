---
date: 2026-06-06
topic: cardano-go-pbl-restyle
---

# Cardano Go PBL — Visual Restyle

## Summary

A full visual restyle of the app: a warm-paper light look (with dark code islands) as the new default plus a dark-mode toggle, both driven by one semantic token layer that also absorbs the currently-hardcoded TipTap editor. New type system (Work Sans / Geist Sans / Go Mono), typography-plugin prose at a 66ch measure, refined code highlighting, a hairline + radius refresh, and Go×Cardano dual-accent chrome. The assignment page is rebuilt as a two-column layout (description left, work surface right) adopting the reference's cobalt-field-with-floating-card signature. Style pass only — no business logic changes.

---

## Problem Frame

The deployed app currently reads as a generic dark dev-tool theme: dark-only navy (`#13161d`), Go cyan used indiscriminately as accent + link + code + icon, a flat 2px radius on everything, four loaded typefaces (one mono referenced but never loaded), and ~250 lines of hand-rolled `.prose-course` CSS at a small serif size. The TipTap evidence editor is hardcoded light and sits as a white flashbang inside the dark app. Color values are duplicated across the `@theme` and `:root` blocks and scattered as ~20 one-off hex literals, which quietly breaks the project's central promise — that a fork can be reskinned by editing `src/config/branding.ts` + `src/styles/globals.css`.

The app is also the public face of a Go-on-Cardano course and an open-source template, yet it expresses neither the Go nor the Cardano brand distinctly and doesn't match the warm, readable, enterprise-grade aesthetic of `enterprise-demo-resources` or the broader Andamio/Cardano family. For a product whose substance is long-form technical reading, the reading experience is the product — and it is currently the weakest surface.

---

## Actors

- A1. Learner: reads lessons and completes assignments (the primary reader; long-form reading + evidence authoring are their core interactions).
- A2. Forker / template adopter: clones the repo and reskins it by editing `src/config/branding.ts` + `src/styles/globals.css` tokens to deploy their own course.

---

## Key Flows

- F1. Complete an assignment (two-column)
  - **Trigger:** Learner opens `/learn/:moduleCode/assignment`.
  - **Actors:** A1
  - **Steps:** (1) Page renders two equal columns. (2) Left column: assignment title, prompt/rubric prose, SLT list with credential badge, sticky reading-progress bar; scrolls independently. (3) Right column: a saturated Cardano-cobalt field with subtle node-dot texture holding a floating card. (4) The card hosts the full `AssignmentInteractive` flow — connect-wallet CTA → evidence editor → commitment status → claim/denied states — in whatever state the learner is in. (5) Below 900px the columns stack: description first, then the work surface.
  - **Outcome:** Learner reads the task and authors/sees evidence without losing either from view; all existing submission behavior is preserved.
  - **Covered by:** R14, R15, R16, R17, R18

- F2. Switch theme
  - **Trigger:** Learner clicks the theme toggle in the nav (or first visit with no stored preference).
  - **Actors:** A1
  - **Steps:** (1) First visit: theme follows OS `prefers-color-scheme`, defaulting to light. (2) Toggle flips `[data-theme]` on the document root. (3) Choice persists across visits and overrides OS preference. (4) Every surface — chrome, prose, code, editor, assignment columns — re-skins from the same token set.
  - **Outcome:** A coherent light or dark presentation with no un-themed islands.
  - **Covered by:** R2, R3, R4, R19

---

## Requirements

**Token architecture**
- R1. Consolidate the duplicated `@theme` + `:root` color stores and the ~20 scattered hex literals into one canonical set of role-named semantic tokens (e.g. background, surface, card, ink, muted ink, line, accent, accent-ink) defined once; `@theme` references them. No raw hex below the token layer in component or prose CSS.
- R2. Derive both light and dark themes from that single token set via a `[data-theme]` switch on the document root; remove the hardcoded `color-scheme: dark`.
- R3. Express accent state variants (hover, soft-fill, active tint, borders) via `color-mix`/oklch derivation from a small number of base hues, not hand-tuned hex, so a fork changes ~4 base hues and the rest re-derives.
- R4. Fold the TipTap evidence editor styling into the same semantic tokens so it inherits the active theme instead of being a hardcoded-light island.

**Color & palette**
- R5. Light theme is warm paper: page ≈ `#F4F3ED`/`#F8F8F5`, surface white, ink ≈ `#14171A`, muted ink ≈ `#74766E`, hairlines ≈ `#E5E2D9`.
- R6. Dark theme is a refined navy (the existing family, with raised card contrast and visible borders), reached only via toggle.
- R7. In light theme, code blocks are the only dark regions (deep-navy islands on paper). In dark theme, code blocks use a distinct code surface differentiated from the page background (no dark-on-dark).
- R8. Demote Go cyan from a do-everything accent to a scoped role; body links use an AA-passing blue (Go cyan `#00ADD8` fails AA on white, so it is not used as link text on light surfaces).

**Typography**
- R9. Reduce to a three-role type system: Work Sans for headings (Go's brand face), Geist Sans for body/UI, Go Mono for code and functional IDs/badges. Retire Outfit, Urbanist, and Lora; actually load the mono. Each role is a named token slot with a fallback stack so forks can swap families.
- R10. Replace the scattered ad-hoc font sizes with a named modular type scale (single base + ratio); headings get tight tracking (≈ -0.018em).

**Reading experience (prose & code)**
- R11. Replace the hand-rolled `.prose-course` rules with `@tailwindcss/typography`, configured to draw colors/spacing from the semantic tokens; the editor reuses the same prose tokens for true WYSIWYG.
- R12. Lesson and assignment prose are constrained to a ~66ch / ~720px measure, body ≈ 16px / 1.7 line-height, `text-wrap: pretty` on paragraphs and `balance` on headings.
- R13. Replace the all-cyan syntax highlighting with a restrained multi-color theme (differentiated keyword / string / comment colors) that works in both themes.

**Assignment two-column layout**
- R14. Rebuild the assignment page as two equal columns: assignment description/rubric on the left, the work surface on the right (modeled on the reference `practicum` layout).
- R15. The left column is a scrollable description surface (title, prompt prose, SLT list with credential badge) with a sticky reading-progress affordance at the top, independent scroll.
- R16. The right column is a saturated Cardano-cobalt field with a subtle dotted node-texture, containing a floating card (white in light theme, themed in dark).
- R17. The card hosts the entire existing `AssignmentInteractive` flow and all its states (unauthenticated CTA, loading, NOT_STARTED, IN_PROGRESS, PENDING_APPROVAL, ACCEPTED, DENIED, CREDENTIAL_CLAIMED) — re-laid-out, behavior unchanged.
- R18. Below a ~900px breakpoint the layout collapses to stacked blocks: description first, then the work surface.

**Chrome & layout**
- R19. Apply a dual-accent zoning system: Cardano cobalt `#0033AD` for structure/wayfinding (nav active, module numbers, the assignment work field); Go cyan reserved for code/interactive accents.
- R20. Replace the flat 2px-everywhere radius with a small radius scale (≈ 10px cards / 6px inputs+code / 4px chips) and carry structure with 1px hairlines + whitespace instead of stacked surface tints, glows, or shadows.
- R21. Give the brand chrome real identity: module numbers (099–302) as Go Mono ID tags, mono section eyebrows, a typographic wordmark (no reliance on the favicon-as-wordmark stub), and a footer that reads as a spec block.
- R22. Add an `@media print` stylesheet so a lesson prints/PDFs as a clean typeset handout (single column on white, chrome hidden).
- R23. Preserve the fork-friendly contract: all of the above is reskinnable by editing `src/config/branding.ts` + the token block in `src/styles/globals.css` without touching components.

---

## Acceptance Examples

- AE1. **Covers R2, R3.** Given the single token layer, when a forker changes the ~4 base accent/background hues, then nav, buttons, badges, links, code-block edges, blockquote rules, and the assignment field all re-skin coherently with no leftover original-brand color and no component edits.
- AE2. **Covers R4, R11.** Given the dark theme is active, when the learner opens the evidence editor, then text rendered in the editor is visually identical to the same markdown rendered in a published lesson, and neither appears as a light island.
- AE3. **Covers R2, R7, R19.** Given a fresh visitor with OS set to light, when the assignment page loads, then it renders in warm-paper light with code blocks as dark islands and the right column as a cobalt field; when they toggle to dark, every surface follows and code blocks shift to the differentiated dark code surface (not the page background).
- AE4. **Covers R14, R18.** Given a viewport wider than 900px, when the assignment page renders, then description and work surface appear side-by-side as equal columns; given a viewport narrower than 900px, then they stack with the description first.
- AE5. **Covers R17.** Given a learner who has not connected a wallet, when they open the assignment page, then the connect-wallet CTA appears inside the right-column card (not stacked below the page), and progressing through enroll → submit → claim swaps card contents without changing the two-column frame.

---

## Success Criteria

- The app reads as warm, clean, editorial, and distinctly Go×Cardano — it visually belongs to the same family as `enterprise-demo-resources` and the Cardano/Gimbalabs brands, and no longer reads as a generic dark dev-tool theme.
- Long-form lessons are comfortably readable (measure, size, contrast) in both themes; no un-themed or jarring surface remains (the editor in particular).
- A forker can reskin the whole app — including chrome and the assignment field — by editing only `src/config/branding.ts` + the token block in `src/styles/globals.css`.
- All existing behavior is intact: every `AssignmentInteractive` state, route, wallet/TX flow, and submission path works exactly as before; `npm run typecheck` passes.
- A downstream planner can sequence the work without re-deciding palette, type roles, theme strategy, or the assignment layout — those are settled here.

---

## Scope Boundaries

- No changes to business logic, data fetching, gateway calls, state stores, routes, or component behavior — visual/CSS/markup-structure only (the assignment page may be re-structured into two columns, but its interactive component and states are reused as-is).
- No new course content; no fix for the separate "mainnet build serves no modules" issue.
- Deferred expressive concepts from ideation: transit-spine / node-geometry progress navigation, multi-accent-by-course-phase wayfinding, gallery wayfinding plates, dual-voice (human vs protocol) typography, "lesson = light / lab = dark" automatic theming, code-beside split layouts, and no-sidebar redesigns.
- The "chain output as a distinct card" idea (input vs output round-trip styling) is deferred unless it falls out cheaply from R13 — it may need content conventions to be useful.

---

## Key Decisions

- Light + dark, not light-only: both ship off the single token layer; light is the signature default. Rationale — devs value dark mode and the token layer makes the second skin low marginal cost; the toggle keeps the warm-paper look as the front-door impression.
- Brand-expressive type over pure-Geist neutrality: Work Sans (Go) headings + Go Mono code put the Go identity in the type while Geist Sans keeps body/UI clean and reference-aligned.
- Dual-accent by zone, not blend: Go cyan and Cardano cobalt are both strong blues; assigning each a job (cobalt = structure, cyan = code/interactive) resolves the clash without muddy gradients.
- Assignment work surface adopts the reference's saturated cobalt field + floating card: it is the one deliberate exception to the otherwise-calm hairline system, leaning into the Cardano network-node motif.
- Default theme follows OS preference (defaulting to light) with a persisted explicit override.

---

## Dependencies / Assumptions

- Add `@tailwindcss/typography` (Tailwind v4 plugin) — assumed not currently a dependency; verify during planning.
- Web fonts Work Sans, Geist Sans, Go Mono must be loadable (Google Fonts / self-host); Go Mono availability/licensing to confirm during planning (fallback: JetBrains Mono).
- The reference layout model is `enterprise-demo-resources` `/practicum/[course_id]/[credential_hash]` and its `.practicum*` CSS — used as the visual model only; nothing is imported, since the stacks differ (Astro/Tailwind v4 vs Next.js).
- Assumes the existing `AssignmentInteractive` island can be placed inside a right-column card without prop/behavior changes (it is self-contained with its own QueryClientProvider).

---

## Outstanding Questions

### Deferred to Planning

- [Affects R9][Needs research] Self-host vs Google Fonts for Work Sans / Go Mono, and confirm Go Mono licensing/availability (fallback JetBrains Mono).
- [Affects R11][Technical] Exact `@tailwindcss/typography` token-override wiring in Tailwind v4 `@theme`, and how much custom prose CSS must remain (code-block language label, etc.).
- [Affects R7][Technical] The precise dark-theme code surface value (raised from page bg) and the two-theme syntax palette.
- [Affects R15][Technical] How the sticky reading-progress affordance is driven for the left column (scroll-linked CSS vs small island) while honoring the no-business-logic constraint.
- [Affects R3][Technical] oklch + `color-mix` browser-support floor acceptable for the target audience.
