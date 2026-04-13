# rtl-skill 🔤
![Stars](https://img.shields.io/github/stars/samuadda/rtl-skill?style=flat&color=orange)
![Last Commit](https://img.shields.io/github/last-commit/samuadda/rtl-skill?style=flat&color=green)
![License](https://img.shields.io/github/license/samuadda/rtl-skill?style=flat&color=yellow)
![npm](https://img.shields.io/badge/install-npx%20skills%20add-blue?style=flat)

**RTL-first UI for Arabic apps — one install, every agent.**

A skill for AI coding agents that makes Arabic/RTL layout support automatic. Covers layout mirroring, CSS logical properties, Arabic typography, directional components, icons, animations, and forms.

---

## Install

```bash
# Auto-detect your agent
npx skills add samuadda/rtl-skill

# Specific agents
npx skills add samuadda/rtl-skill -a claude-code
npx skills add samuadda/rtl-skill -a cursor
npx skills add samuadda/rtl-skill -a windsurf
npx skills add samuadda/rtl-skill -a cline
npx skills add samuadda/rtl-skill -a copilot

# Global (all projects)
npx skills add samuadda/rtl-skill -g
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `/rtl-init` | Scaffold a new project with RTL baked in — fonts, reset, config, base components |
| `/rtl-audit` | Scan existing codebase for RTL issues → produces `rtl-audit-report.md` |
| `/rtl-convert <file>` | Convert a specific component to RTL-aware |
| `/rtl-check` | Quick golden checklist pass on the current component |

All commands also work as natural language: "audit this project for RTL issues", "rtlize this component", etc.

---

## What it covers

- ✅ CSS logical properties (`inline-start/end` over `left/right`)
- ✅ Arabic typography (Cairo/Tajawal fonts, `letter-spacing: 0`, generous `line-height`)
- ✅ Icon classification (directional vs neutral — knows what to flip)
- ✅ Component patterns (breadcrumbs, pagination, drawers, toasts, carousels)
- ✅ Animations (slide directions, progress fills, skeleton loaders)
- ✅ Forms (input alignment, labels, validation, number inputs)
- ✅ Data & tables (column order, sort indicators)
- ✅ LTR islands (numbers, URLs, code inside Arabic text)
- ✅ Dynamic LTR/RTL switching scaffold

## Framework support

- Tailwind CSS (`rtl:` variants, `s`/`e` logical utilities)
- Plain CSS / SCSS (logical properties, SCSS mixins)
- CSS-in-JS (styled-components, emotion)
- React Native (`I18nManager`, Animated API)

---

## The core mental model

Before generating any component, the agent runs the **Start/End Axis Test**:

> "Does this element have a start and an end? If yes — it needs a conscious RTL decision."

Every element falls into one of three categories:
- **Always mirror** — layout, flex, directional icons, animations
- **Never mirror** — numbers, code, URLs, neutral icons  
- **Context-dependent** — images, illustrations

---

## Testing the skill

A test harness verifies the skill catches issues correctly. It runs `/rtl-audit` on an intentionally broken component and fails if fewer than 22/24 issues are caught.

```bash
npm install
ANTHROPIC_API_KEY=sk-... npm test
```

The component (`test/BadComponent.jsx`) contains 24 deliberate RTL bugs. Expected output: 16 breaking + 5 degraded + 3 cosmetic issues, with correct icon classification (5 directional flipped, 5 neutral untouched). Full scoring rubric: [`test/ANSWER_KEY.md`](test/ANSWER_KEY.md).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to fix rules, add frameworks, and submit PRs.

The key rule: **`reference.md` and `workflows.md` must stay in sync** — if you add a rule to one, update the other.

---

## License

MIT
