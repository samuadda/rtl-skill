# Changelog

All notable changes to rtl-skill are documented here.

Format: [Semantic Versioning](https://semver.org). Types: `Added`, `Fixed`, `Changed`, `Removed`.

---

## [Unreleased]

### Added
- CI structure validator (`test/validate.mjs`) — zero-dependency, no API key required; checks required files, SKILL.md frontmatter, internal link resolution, CHANGELOG structure, and `package.json`/CHANGELOG version drift
- GitHub Actions workflow (`.github/workflows/validate.yml`) — runs the validator on every push and PR to `main`
- `npm run validate` script
- Project logo (`assets/logo.svg`) and centered README header layout
- Arabic translation (`README.ar.md`) linked from the English README

### Added (cont.)
- `examples/sample-audit.md` — real `/rtl-audit` output from a public Next.js template (shadcn-ui/next-template), kept as reference for what a clean-codebase audit looks like

### Removed
- `test/run-audit.mjs` and its `@anthropic-ai/sdk` dependency — the skill runs inside Claude Code for free, so the paid API-based regression test was removed. Behaviour testing is now a manual `/rtl-audit test/BadComponent.jsx` run graded against `test/ANSWER_KEY.md`
- `.github/ISSUE_TEMPLATE/test-score.md` — obsolete without the audit script

### Changed
- `package.json` version bumped from `1.0.0` to `1.1.0` to match the CHANGELOG
- `npm test` now runs the structure validator (was the paid audit)

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
