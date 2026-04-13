# Contributing to rtl-skill

## What this project is

A skill for AI coding agents that makes Arabic/RTL layout support automatic. The skill lives in `skills/rtl/` — it's markdown files that instruct agents, not code.

## Structure

```
skills/rtl/
  SKILL.md          — entry point, golden checklist, command index
  reference.md      — full rules by concern area (layout, typography, icons, etc.)
  workflows.md      — command definitions (/rtl-init, /rtl-audit, /rtl-convert, /rtl-check)
  frameworks/
    tailwind.md     — Tailwind CSS rules and examples
    css.md          — Plain CSS / SCSS rules and examples
    css-in-js.md    — styled-components / emotion rules and examples
    react-native.md — React Native rules and examples

test/
  BadComponent.jsx  — intentionally broken RTL component (24 issues)
  ANSWER_KEY.md     — expected audit output and scoring rubric
```

## The sync rule

**`reference.md` and `workflows.md` must stay in sync.**

- If you add a new rule to `reference.md`, add the corresponding scan check to the `/rtl-audit` section of `workflows.md`.
- If you add a new component pattern to `reference.md`, verify `/rtl-convert` would handle it correctly.

Breaking this sync is the most common mistake — the agent knows a rule exists but doesn't scan for it.

## How to contribute

### Fix an incorrect rule

1. Find the rule in `reference.md` or the relevant `frameworks/*.md` file
2. Correct it with a code example showing the right behaviour
3. If the fix changes what the audit should catch, update `test/ANSWER_KEY.md`
4. Run the audit test to verify: `ANTHROPIC_API_KEY=sk-... npm test`

### Add a missing rule

1. Add the rule to `reference.md` under the relevant section
2. Add the scan pattern to the `/rtl-audit` section in `workflows.md`
3. If it's framework-specific, add examples to the relevant `frameworks/*.md` file
4. If it's common enough to warrant a test case, add it to `test/BadComponent.jsx` and update `test/ANSWER_KEY.md`

### Add a new framework

1. Create `skills/rtl/frameworks/<framework>.md`
2. Add a detection rule in `SKILL.md` under "Framework Rules"
3. Cover at minimum: logical properties, flex direction, icon flipping, LTR islands

### Fix a bug in the test component

`test/BadComponent.jsx` must remain valid JSX — run it through a linter before submitting. The issue count (24) and `ANSWER_KEY.md` scoring must stay consistent.

## Code examples

All CSS examples must use **logical properties** (`inline-start/end`, not `left/right`). Every icon example must explicitly state whether the icon is directional or neutral. No pseudocode in framework files — examples must be copy-pasteable.

## Testing

```bash
npm install
ANTHROPIC_API_KEY=sk-... npm test
```

The test calls the Claude API (costs ~$0.01 per run with Haiku). A score of 22+ issues caught with correct icon classification = passing.

To use a more capable model:
```bash
AUDIT_MODEL=claude-sonnet-4-6 ANTHROPIC_API_KEY=sk-... npm test
```

**Never commit your `ANTHROPIC_API_KEY`** — pass it via environment variable only, never hardcode it in any file.

## Submitting a PR

- Keep PRs focused — one concern per PR
- Reference the issue if one exists
- If you changed issue counts in `BadComponent.jsx`, update `ANSWER_KEY.md`
- If you changed rules, confirm `reference.md` and `workflows.md` are still in sync
