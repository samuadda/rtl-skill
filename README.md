# rtl-skill 🔤

**RTL-first UI for Arabic apps — one install, every agent.**

A skill for AI coding agents that makes Arabic/RTL layout support automatic. Covers layout mirroring, CSS logical properties, Arabic typography, directional components, icons, animations, and forms.

---

## Install

```bash
# Auto-detect your agent
npx skills add [yourhandle]/rtl-skill

# Specific agents
npx skills add [yourhandle]/rtl-skill -a claude-code
npx skills add [yourhandle]/rtl-skill -a cursor
npx skills add [yourhandle]/rtl-skill -a windsurf
npx skills add [yourhandle]/rtl-skill -a cline
npx skills add [yourhandle]/rtl-skill -a copilot

# Global (all projects)
npx skills add [yourhandle]/rtl-skill -g
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

## License

MIT
