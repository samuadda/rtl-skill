# Changelog

All notable changes to rtl-skill are documented here.

Format: [Semantic Versioning](https://semver.org). Types: `Added`, `Fixed`, `Changed`, `Removed`.

---

## [Unreleased]

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
