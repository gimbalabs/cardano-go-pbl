---
date: 2026-06-06
topic: cardano-go-pbl-restyle
focus: Make the app beautiful — clean/clear, great reading experience; draw on enterprise-demo-resources + Go/Cardano/Blink Labs/Gimbalabs branding; style pass only (no business logic)
mode: repo-grounded
---

# Ideation: Restyle the Cardano Go PBL App

## Grounding Context (Codebase)

- **Stack:** Astro 6 + React 19 islands + Zustand + Tailwind v4. Theme tokens in `@theme` + `:root` of `src/styles/globals.css`; branding in `src/config/branding.ts`. Also an open-source template ("fork, edit branding.ts + globals.css, deploy").
- **Current look:** DARK-ONLY. bg `#13161d` navy, surface `#1a1e28`, card `#222732`, border `#ffffff12`. Text `#f1f1f1`/`#b0b8c4`. Accent Go cyan `#00ADD8` used everywhere. Radius `2px` on everything (intentionally flat). Base 17px.
- **Fonts:** Outfit (headings), Urbanist (body), Lora (prose serif), Geist Mono (referenced but NOT loaded) — four families.
- **Prose:** `.prose-course` hand-rolled (~250 lines), Lora serif 0.875rem; code blocks `#1e1e1e` with cyan left-border; all syntax tokens map to cyan (monochrome).
- **Editor:** TipTap evidence editor hardcoded LIGHT (`#1a1a1a` on white) inside the dark app — jarring.
- **Pain:** ~20 scattered hex literals violate the "semantic tokens" contract; @theme/:root duplicated; small serif prose; flat-2px + 3-tier navy surfaces read as generic dark dev-tool theme.

## Reference Target (enterprise-demo-resources)
Warm LIGHT: bg `#F5F3EE`, surface `#FFFFFF`, ink `#14171A`, muted `#74766E`, borders `#E5E2D9`. Muted oklch blue accent `oklch(0.45 0.10 230)`. Geist Sans + Geist Mono. Radius 10/6px. Article prose 720px, 15.5px/1.7, `text-wrap: pretty`, `@tailwindcss/typography`. 1px borders not shadows. Functional mono for IDs/badges. Clean, warm, minimal, info-dense, readability-first.

## Brand Raw Material
- **Go:** cyan `#00ADD8`, light blue `#5DC9E2`, fuchsia `#CE3262`; Work Sans / Roboto / Go Mono; white-heavy minimal.
- **Cardano:** cobalt `#0033AD`, paper `#F8F8F5`; Chivo; geometric network/node motif.
- **Gimbalabs:** parchment `#F4F3ED`, black `#232828`, warm orange `#FB9C73`, lemon `#FEF23C`, deep navy `#1A3B65`; Cera rounded sans; community/friendly.
- **Blink Labs:** technical-minimal, Nextra defaults, blue accent.
- **Tension:** Go cyan and Cardano cobalt are both strong blues — don't blend; assign each a job (cobalt = structure, cyan = code/interactive). `#00ADD8` fails AA on white.

## Topic Axes
1. Color system & palette
2. Typography & type system
3. Reading experience (prose / lessons / code)
4. Layout & composition
5. Brand identity & chrome

## Ranked Ideas

### 1. Warm-paper base, dark code islands
**Description:** Flip dark-only → warm light (bg `#F4F3ED`/`#F8F8F5`, ink `#14171A`, hairline `#E5E2D9`). Code blocks become the only dark regions — deep-navy slabs on paper, the canonical dev-docs look ("machine speaking" vs "human speaking"). Demote Go cyan to interactive/brand only; links use a cobalt-leaning oklch blue for AA.
**Axis:** Color system & palette
**Basis:** external — enterprise reference + Cardano paper #F8F8F5 + Gimbalabs parchment #F4F3ED; #00ADD8 on white ~2.3:1 < AA.
**Rationale:** Every brand in the family is light/warm; the dark-only app is the outlier. Light reads better for long-form code tutorials and kills the "generic dark cyber theme" impression.
**Downsides:** Biggest, most contentious change; some devs prefer dark. Mitigated by #2 making both polarities available.
**Confidence:** 80% · **Complexity:** Medium · **Status:** Explored

### 2. Single-source semantic token layer (oklch + color-mix), editor folded in
**Description:** Collapse `@theme` + `:root` + ~20 scattered hex literals into one role-named token set (`--bg/--surface/--ink/--line/--accent` + soft variants via `color-mix`); derive light & dark from one source via `[data-theme]`. Fold the hardcoded-light TipTap editor into the same tokens. Fork = swap ~4 base hues.
**Axis:** Color system & palette (structural)
**Basis:** direct — globals.css hand-syncs @theme/:root duplicates and hardcodes `#2a2a2a`/`#1e1e1e`/`#1a1a1a` in prose & editor; CLAUDE.md flags the editor as jarring.
**Rationale:** This is the backbone — makes the fork-friendly contract real, fixes the editor jar for free, and makes every other color change a one-edit operation.
**Downsides:** Refactor touches the whole stylesheet; needs care to avoid visual regressions.
**Confidence:** 92% · **Complexity:** Medium · **Status:** Explored

### 3. Two-typeface system + modular scale
**Description:** Retire the four-font zoo. Route (a) pure Geist Sans + Mono (match reference); route (b) brand-expressive — Work Sans (Go) or Chivo (Cardano) headings + Go Mono code. Replace 8 magic font-sizes with a named ratio scale (base 17px, ~1.2), tight heading tracking -0.018em. Actually load the mono.
**Axis:** Typography & type system
**Basis:** direct (17px base contradicted by 0.875rem prose; mono referenced but unloaded) + external (reference = 2 families).
**Rationale:** Four typefaces is the loudest "designed by committee" tell; two families read as engineered and load faster. Open question: pure-Geist vs brand-expressive pairing.
**Downsides:** Lora has fans (editorial feel); all-sans may feel less "course-like."
**Confidence:** 85% · **Complexity:** Low-Medium · **Status:** Unexplored

### 4. Reading experience: typography plugin, 66ch measure, text-wrap pretty
**Description:** Replace ~250 lines of hand-rolled `.prose-course` with `@tailwindcss/typography` driven by the semantic tokens; lock measure to 66ch/720px, body 16px/1.7, `text-wrap: pretty` on p / `balance` on headings. Add `@media print` so lessons print as typeset handouts. Editor reuses the same prose tokens → true WYSIWYG.
**Axis:** Reading experience
**Basis:** external (reference uses plugin + 720px + text-wrap) + direct (prose is small hand-maintained serif, duplicated for the editor).
**Rationale:** This is the core "beautiful text / great reading" deliverable and removes a large maintenance surface.
**Downsides:** Trades against horizontal density; plugin override needs token wiring.
**Confidence:** 88% · **Complexity:** Medium · **Status:** Unexplored

### 5. Code blocks that teach the round-trip
**Description:** Build one restrained syntax theme (keywords cobalt, strings terracotta, comments muted) replacing the all-cyan set. Then distinguish source vs command (`$`) vs chain output (thin cobalt left-border + node glyph = "the ledger answering you") — the build-TX→submit→observe round-trip is the course's subject.
**Axis:** Reading experience / code
**Basis:** direct (all-cyan highlight set, low differentiation) + reasoned (input/output is the pedagogical heart of Cardano tx work).
**Rationale:** Code is the substance of a Go course; differentiated highlighting + an output convention is distinctive and on-topic.
**Downsides:** Output-card is a stretch (may need content conventions); syntax theme is the safe core.
**Confidence:** 70% · **Complexity:** Medium · **Status:** Unexplored

### 6. Hairline + radius refresh: borders not boxes
**Description:** Escape flat-2px-everywhere and the 3-tier navy surface stack + sidebar shadow. Radius scale 10px cards / 6px inputs+code / 4px chips; structure via 1px hairlines + whitespace, not fills/shadows/glow — letterpress/Swiss-technical.
**Axis:** Layout & composition
**Basis:** direct (--radius-* all 2px; 3 surface tints; sidebar box-shadow) + external (reference = 1px borders not shadows; Blink Labs minimal).
**Rationale:** Uniform 2px + stacked surfaces is a primary "generic/weak" signal; hairlines read as editorial and engineered.
**Downsides:** Flatness is stated as intentional in a file comment — deliberate philosophy reversal.
**Confidence:** 78% · **Complexity:** Low · **Status:** Unexplored

### 7. Go×Cardano brand chrome: dual-accent zoning + mono module IDs
**Description:** Give each brand color a job: Cardano cobalt `#0033AD` = structure/wayfinding/nav-active/module numbers; Go cyan `#00ADD8` = code/interactive only (resolves the clash by zone, not blend). Module numbers (099–302) as mono ID tags, mono eyebrows ("MODULE 201 · INDEXING"), README/spec-sheet-honest identity. Type-as-brand (no fake logo asset; hero currently fakes a wordmark with favicon.svg).
**Axis:** Brand identity & chrome
**Basis:** direct (branding.ts reuses favicon.svg as both symbol & wordmark) + external (Cardano cobalt + Go cyan; reference uses functional mono for IDs).
**Rationale:** Two strong brands to draw on, currently expressing neither distinctly. Zoning tells the Cardano-platform / Go-language story in the color system itself.
**Downsides:** Introduces a second brand color + a real mark — biggest brand-direction commitment.
**Confidence:** 80% · **Complexity:** Medium · **Status:** Unexplored

### 8. Assignment page: two-column (description left, evidence editor right)
**Description:** Restructure the assignment page to the enterprise-demo-resources two-pane presentation — assignment description / rubric in a left column, the TipTap evidence editor in a right column (side-by-side on desktop, stacked on mobile). The learner reads the task and writes evidence without losing either from view. Both columns inherit the new semantic tokens (#2) so the editor stops being a light island.
**Axis:** Layout & composition
**Basis:** direct — user-specified requirement (2026-06-06); enterprise-demo-resources uses a left-nav/description + right-content two-column reading frame. Current assignment page stacks editor + submission UI vertically.
**Rationale:** Side-by-side task/evidence is the natural ergonomics for "read the rubric, produce the artifact" — the highest-stakes interaction in the app. Pairs with #2 (tokenized editor) and #4 (shared prose tokens).
**Downsides:** Needs a responsive breakpoint strategy; narrow editor column on smaller laptops; must preserve all existing submission/business logic.
**Confidence:** 90% (user-required) · **Complexity:** Medium · **Status:** Explored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Multi-accent by course phase (cyan/cobalt/orange = altitude) | Clever wayfinding but gimmick risk; brainstorm variant of #7 |
| 2 | Transit-map / node-geometry progress spine | Distinctive but more interaction than style |
| 3 | Gallery wayfinding plates | Strong personality, brainstorm-worthy, gimmick risk |
| 4 | Dual-voice "human vs protocol" type | Ambitious; brainstorm variant |
| 5 | Annotated-source-file prose styling | Gimmick risk if overdone; brainstorm variant |
| 6 | "Lesson = light / lab = dark" theme assignment | Elegant; depends on #2 landing first — revisit after |
| 7 | No-sidebar progress spine | Layout/interaction beyond pure style pass |
| 8 | Stripe code-beside reading rhythm | Per-section layout, beyond style pass |
| 9 | Zero-JS lessons | Engineering discipline, not styling |
| 10 | Single-ink (zero semantic colors) | Too austere for a course app |
| 11 | 2x editorial type | Below value; trades too much density |
| 12 | "Make it like Stripe docs" / generic cleaner | Too obvious/vague |
