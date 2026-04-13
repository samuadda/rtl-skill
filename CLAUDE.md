# RTL Skill — Claude Code Instructions

This project is the `rtl-skill` repository. It contains an agent skill for Arabic/RTL UI development.

## What this repo is

A Claude Code (and multi-agent) skill that makes agents RTL-first when building Arabic interfaces. The skill lives in `skills/rtl/`.

## When working in this repo

You are working on the **skill itself**, not using it. Your job is to improve the rules, examples, and test fixtures — not to build an Arabic UI.

### Key files
- `skills/rtl/SKILL.md` — skill entry point and golden checklist
- `skills/rtl/reference.md` — full rules by concern area (layout, typography, icons, animations, forms, grid, scroll, tables)
- `skills/rtl/workflows.md` — command definitions (`/rtl-init`, `/rtl-audit`, `/rtl-convert`, `/rtl-check`)
- `skills/rtl/frameworks/` — framework-specific rules (Tailwind, CSS, CSS-in-JS, React Native)
- `test/BadComponent.jsx` — intentionally broken RTL component (24 issues) for testing
- `test/ANSWER_KEY.md` — grading rubric: expected audit output + icon classification scores

### How to test the skill
1. Run `/rtl-audit test/BadComponent.jsx` — should catch 16 breaking + 5 degraded + 3 cosmetic issues
2. Run `/rtl-convert test/BadComponent.jsx` — should produce a fully fixed component
3. Grade output against `test/ANSWER_KEY.md`
4. Score of 22–24 issues caught with correct icon classification = skill working correctly

### Contribution rules
- All CSS examples must use logical properties (`inline-start/end`) not physical (`left/right`)
- Every new component pattern needs both an LTR and RTL mental model described
- Icon examples must explicitly state whether the icon is directional or neutral
- Code examples must be runnable — no pseudocode in the framework files
- If adding a new concern area to `reference.md`, also add a scan rule for it in the `/rtl-audit` section of `workflows.md`
