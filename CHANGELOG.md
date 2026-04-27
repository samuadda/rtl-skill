# Changelog

All notable changes to rtl-skill are documented here.

Format: [Semantic Versioning](https://semver.org). Types: `Added`, `Fixed`, `Changed`, `Removed`.

---

## [Unreleased]

---

## [1.2.0] — 2026-04-27

**First production-ready release.** Closes the gap between "the skill has the right rules" and "the skill is enforceable, evaluated, and battle-tested."

### Added
- `skills/rtl/anti-patterns.md` — wrong-then-right pattern catalog (12 entries across Layout, Typography, Icons, Forms, Animations). Each pair shows the exact pattern agents reach for, why it breaks RTL, and the runnable substitute.
- `## Forbidden Workarounds` section in `SKILL.md` — 7 escape hatches agents must not take under pressure (`!important`, `direction: ltr` wraps, `scaleX(-1)` on text, `charAt` on Arabic, positive `letter-spacing`, per-component `dir` attrs, mimicking existing physical-property style).
- `## Framework Detection` section in `SKILL.md` — mechanical `grep`/`ls`/`find` checks per framework, replacing the previous hand-wavy "Tailwind detected" line.
- `## Common Mistakes` section in `SKILL.md` — pointer to anti-patterns.md to scan before generating.
- `## Version Assumptions` block at the top of every `frameworks/*.md` file — minimum versions, recommended versions, and known version-specific gotchas.
- Pre-version fallback sections in `frameworks/tailwind.md` (pre-v3.3 logical-utility plugin) and `frameworks/react-native.md` (pre-0.65 `rtlValue()` everywhere).
- New component coverage in `reference.md` Section 3: **Modals/Dialogs**, **Date pickers** (locale-aware week-start), **Command palettes** (Up/Down stable, Left/Right flips), **Rich text editors** (Start/End alignment, `dir="auto"` on contenteditable).
- "Out of scope — escalate" subsection in `reference.md` Section 3 listing components the skill defers to human review (data viz, map UIs, video players, canvas, PDF viewers, animation-heavy marketing).
- Complete `/rtl-audit` report template in `workflows.md` — header, summary block, full sample issues per severity (six required fields each: file:line, severity tag, title, Current, Fix, Why), Recommended order section.
- `evals/queries.json` — 28-query trigger eval suite (15 should-trigger, 13 should-not-trigger) covering direct mentions, indirect signals (Saudi users, Hebrew support), slash commands, and false-positive edge cases (translate to Arabic, audit accessibility, right-click).
- `evals/README.md` — manual run protocol (no API key required).
- `evals/results.md` — iteration log: 89.3% baseline → 100% after one description-tuning iteration.
- `tests/real-world-audit.md` — full audit of shadcn-ui/ui @ `fd0e0c3` (56 component files, 22 issues found) with file:line examples and an honest coverage assessment.
- `tests/gaps-found.md` — five gaps surfaced by the real-world audit, two fixed in the same pass and three deferred with rationale.

### Changed
- `description` field in `SKILL.md` frontmatter — broadened from "Arabic UI" to "Arabic, Hebrew, Persian, and Urdu UI"; added concrete locale examples ("Saudi Arabia, UAE, Egypt"); added explicit "Do NOT use for plain translation tasks" exclusion. Eval pass rate went 25/28 → 28/28.
- `reference.md` Section 2 — scoped `letter-spacing: 0` to `:lang(ar)` / `[lang^="ar"]` / `[dir="rtl"]` instead of the universal `*` selector, so the rule no longer strips designer-intended `tracking-*` on Latin-only or mixed-content projects.
- `anti-patterns.md` — added "Component APIs that take `'left' | 'right'` as a prop value" entry covering shadcn `Sheet`/`Sidebar`, MUI `Drawer`, Radix `Tooltip`, with a wrapper-pattern correct substitute.
- `test/validate.mjs` — extended required-files list to include `anti-patterns.md`, `evals/queries.json`, `evals/results.md`, and `tests/real-world-audit.md`.
- `package.json` version bumped from `1.1.0` to `1.2.0`.

### Fixed
- `frameworks/tailwind.md` accuracy on Tailwind v4 — `tailwind.config.js` is no longer the primary config; documented the `@theme` directive switchover.

---

## [1.1.0] — 2026-04-13

### Added
- CSS Grid section in `reference.md` — named template areas, logical column placement, auto-mirror behaviour
- Scroll Behavior section in `reference.md` — `scrollLeft` RTL normalization, `scroll-snap`, sticky positioning
- CI test harness (`test/run-audit.mjs`) — calls Claude API, scores the skill against `BadComponent.jsx`, fails if score drops below 22/24
- `CLAUDE.md` — Claude Code project instructions for contributors working in this repo
- Self-hosting note for Arabic fonts in `workflows.md` — warns against Google Fonts in production

### Fixed
- `test/BadComponent.jsx` — removed stray closing ` ``` ` that made the file invalid JSX
- `reference.md` — corrected incorrect claim that `flex-direction: row + dir="rtl"` auto-reverses flex (it does not)
- `frameworks/css.md` — corrected same incorrect flexbox claim

---

## [1.0.0] — 2026-04-10

### Added
- Initial release
- `skills/rtl/SKILL.md` — skill entry point with golden checklist and command index
- `skills/rtl/reference.md` — full rules: layout, typography, components, icons, animations, forms, data & tables
- `skills/rtl/workflows.md` — command definitions: `/rtl-init`, `/rtl-audit`, `/rtl-convert`, `/rtl-check`
- Framework files: `tailwind.md`, `css.md`, `css-in-js.md`, `react-native.md`
- `test/BadComponent.jsx` — intentionally broken RTL component with 24 issues
- `test/ANSWER_KEY.md` — grading rubric with expected audit output and icon classification scoring
