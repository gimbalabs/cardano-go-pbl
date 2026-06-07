---
date: 2026-06-06
topic: typography-spacing-refinement
focus: Thinner font weights + clearer/generous spacing to make the app feel cleaner and more professional; deep pass across the whole project. Style only.
mode: repo-grounded
---

# Ideation: Typography & Spacing Refinement

## Grounding (key facts)
- Fonts: Work Sans (headings) / Geist (body+prose) / Go Mono (code). Google Fonts loads wght 400;500;600;700 for BOTH sans families.
- **Heaviness is in the markup, not the stylesheet.** globals h1–h6 set family+tracking but NO weight; markup applies `font-bold` (homepage hero, lesson h1) + `font-semibold` (nav brand, module titles) and `.assignment-title { font-weight:700 }`. ~55 ad-hoc weight utilities, ~138 ad-hoc size utilities counted.
- Base 17px; `--text-xs..3xl` tokens exist (ratio ~1.2) but markup often uses ad-hoc `text-2xl/3xl/4xl` (text-4xl has NO token). `--tracking-heading: -0.018em` applied flatly to all sizes.
- Body ink `#14171a` (near-black) on warm paper `#f4f3ed`; muted `#5f6670`. Line-heights scattered (plugin default, editor 1.65, title 1.2, lede 1.6, sidebar 1.45) — no tokens. Measure 68ch hardcoded in one place. NO spacing scale token — arbitrary rems (2.75/1.75/0.625/0.85) + scattered Tailwind py/mb.
- Homepage "Three ways to learn" is built from **inline style attributes** (hardcoded px/rem/weight/leading) — token fixes will skip it unless migrated.

## Reference target (enterprise-demo) + best practice
- Weights cap at 600 (h1/h2 600, body 400, labels/buttons 500, NO 700 in body). h1 600@30px tracking -0.025em; body 15.5px/1.7; muted body ink (#3D3F44, never pure black). Spacing in multiples of ~7 (14/22); 720px measure; hairlines; tight-intra / generous-inter spacing contrast.
- Large-goes-lighter (Apple titles Regular, Stripe display 300, Geist treats 400 as "the new semibold"); negative tracking at scale; leading 1.6–1.7 prose / 1.1–1.2 headings; 65ch measure; non-uniform spacing = premium; `font-optical-sizing: auto`; Geist 400 can render thin → 450 in dense UI.

## Topic Axes
1. Weight & color
2. Scale & tracking
3. Rhythm & leading
4. Whitespace & density
5. Measure & alignment

## Ranked Ideas

### 1. Large-goes-lighter weight system (centralized in tokens)
**Description:** Cap heading weight at 500–600 (display/hero 400–500, h1 600, h2/h3 500), body 400, labels 500, reserve 600 for inline emphasis only. Centralize via `--weight-display/-heading/-body/-label/-emphasis` tokens, set `font-weight: var(--weight-heading)` on the base `h1–h6` rule, and **delete the `font-bold`/`font-semibold` from markup** (hero, lesson h1, nav, `.assignment-title` 700). Drop the now-unused 700 from the Google Fonts load; add `font-optical-sizing: auto`. Consider Geist 450 in dense UI.
**Axis:** Weight & color
**Basis:** direct (font-bold/semibold + assignment-title 700 in markup; 4 weights loaded) + external (Apple/Stripe/Geist large-goes-lighter; reference caps 600).
**Confidence:** 95% · **Complexity:** Medium · **Status:** Explored
**Note:** The single biggest "looks generic/heavy" lever. Headline of the whole pass.

### 2. Muted body ink (reserve near-black for emphasis)
**Description:** Move long-form body text off near-black `#14171a` to a softened ink (~`#2a2e33` light / matching muted in dark), point `--tw-prose-body` at it; keep full-ink `--ink` for headings/UI/emphasis. Near-black paragraphs "vibrate" on the warm parchment.
**Axis:** Weight & color
**Basis:** direct (`--ink #14171a` drives both body and headings) + external (reference body ink #3D3F44, "never pure black").
**Confidence:** 85% · **Complexity:** Low · **Status:** Unexplored

### 3. Tracking-by-size ramp
**Description:** Replace the single flat `--tracking-heading: -0.018em` with graduated tokens — `--tracking-display: -0.03em`, `--tracking-h2/h3: -0.02em`, `--tracking-body: 0`, `--tracking-label: +0.08em` — applied by role. Bigger = tighter; small uppercase mono labels/eyebrows get POSITIVE tracking (they currently sit ~0.04–0.08em, under-spec). Code stays tracking 0.
**Axis:** Scale & tracking
**Basis:** direct (one flat tracking token; label 0.04em hardcoded) + external (negative tracking at scale, positive on small caps).
**Confidence:** 88% · **Complexity:** Low · **Status:** Unexplored

### 4. Cap & tighten the display scale; make the scale load-bearing
**Description:** Cap h1/hero at ~30–34px (kill `md:text-6xl`); pull hero + lesson h1 into the token scale (add `--text-4xl` or cap), tighten the ratio toward ~1.15–1.2, and replace ad-hoc `text-2xl/3xl/4xl` in markup with scale tokens so no on-screen size is off-scale. Hierarchy then comes from size+space+tracking, not oversized bold.
**Axis:** Scale & tracking
**Basis:** direct (hero uses raw text-6xl outside the scale; text-4xl has no token; ~138 ad-hoc size utils) + external (reference h1 30px; oversized hero = "AI landing page" tell).
**Confidence:** 80% · **Complexity:** Medium · **Status:** Unexplored

### 5. Leading tokens by role
**Description:** Add `--leading-display: 1.1`, `--leading-heading: 1.2`, `--leading-body: 1.7`, `--leading-ui: 1.35`, `--leading-code: 1.55`; bind them in base `h1–h6`, `body`, `pre`, and dense components. Replaces the scattered/plugin-default/inline line-heights with one policy: airy prose, tight UI/display, breathing code. (Leading should track measure — wide prose looser, narrow UI tighter.)
**Axis:** Rhythm & leading
**Basis:** direct (line-heights scattered, none tokenized) + external (reading 1.6–1.7, dense UI 1.3–1.4, Bringhurst measure↔leading coupling).
**Confidence:** 85% · **Complexity:** Low-Med · **Status:** Unexplored

### 6. Spacing scale + non-uniform rhythm
**Description:** Introduce one `--space-*` ramp (4px or 7px grain, e.g. 4/8/12/16/24/32/48/64/96) and replace every arbitrary rem padding (assignment 2.75/1.75/0.625, card 1.75, etc.) and ad-hoc Tailwind py/mb. Apply as **tight-intra / generous-inter** — small gaps within a block (heading→its paragraph), large gaps between sections (48–96px). Non-uniform spacing is the actual "premium" signal; uniform reads flat.
**Axis:** Whitespace & density
**Basis:** direct (no spacing token; ~20 distinct arbitrary values) + external (4px grid; non-uniform = premium; reference multiples of 7).
**Confidence:** 88% · **Complexity:** Medium · **Status:** Unexplored

### 7. Unify the measure + fix heading alignment
**Description:** Promote measure to one `--measure` token (~65–66ch) applied to every prose/text-block context (lessons, assignment description, dashboard copy), not just `.prose-course`. Fix the real alignment break: the lesson h1 sits in the wide `max-w-5xl` wrapper while body is capped at 68ch, so the heading overhangs its own text — align the header to the prose column. Allow code/tables to exceed the prose measure.
**Axis:** Measure & alignment
**Basis:** direct (`max-width: 68ch` in one place; lesson h1 wider than body; assignment uses separate 720px) + external (65ch optimal; one measure = one typeset document).
**Confidence:** 82% · **Complexity:** Low-Med · **Status:** Unexplored

## Open decision (surface, don't auto-resolve)
- **One family vs two.** Several frames argue Work Sans + Geist is a near-invisible sans-vs-sans contrast and that collapsing to **Geist-only** (with Go Mono as the sole second voice) is cleaner, more editorial, lighter to load, and matches the reference. This conflicts with the brand-expressive Work Sans choice made in the prior restyle. Worth a deliberate call in brainstorm — keep Work Sans for Go identity, or go Geist-only for refinement.

## Through-line
Ideas 1+3+4+5+6+7 complete the token system: weight, tracking, scale, leading, spacing, and measure all become `:root` tokens beside the existing color + radius — so the whole app re-derives from one place and forks reskin type/space in seconds. Idea 2 is the cheapest single readability win.

## Rejection Summary
| # | Idea | Reason |
|---|------|--------|
| 1 | Density-as-attribute toggle (`data-density`) | Clever but a brainstorm variant; beyond a pure refinement pass |
| 2 | Financial-terminal dashboard density + tabular figures | Strong, but dashboard-specific follow-up, not core type/space |
| 3 | Canon/golden-ratio page placement | Ambitious, gimmick risk |
| 4 | Newspaper-deck + museum wall-label hierarchy | Nice editorial concepts → brainstorm variants of the weight/hierarchy work |
| 5 | Two distinct measures for prose vs code | Folded into #7 (allow code to exceed prose measure) |
| 6 | Generic "add more whitespace" | Too vague; #6 makes it systematic |
