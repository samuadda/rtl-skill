<div align="center">

<img src="assets/logo.svg" alt="rtl-skill logo" width="420"/>

# rtl-skill

![Stars](https://img.shields.io/github/stars/samuadda/rtl-skill?style=flat&color=orange)
![Last Commit](https://img.shields.io/github/last-commit/samuadda/rtl-skill?style=flat&color=green)
![License](https://img.shields.io/github/license/samuadda/rtl-skill?style=flat&color=yellow)
![npm](https://img.shields.io/badge/install-npx%20skills%20add-blue?style=flat)

**RTL-first UI for Arabic apps — one install, every agent.**

[اقرأ بالعربية](README.ar.md)

A skill for AI coding agents that makes Arabic/RTL layout support automatic. Covers layout mirroring, CSS logical properties, Arabic typography, directional components, icons, animations, and forms.

</div>

---

## Scope

This skill targets **Arabic-language UI specifically**. Other RTL scripts are RTL but have different typography rules — different cursive systems, different diacritic positioning, different font stacks — and are not supported. Use this skill for Arabic; pick a script-specific resource for any other RTL language.

---

## Install

### Recommended (via the `skills` CLI)

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

### Manual install (fallback)

If the `skills` CLI isn't available or doesn't resolve, copy the skill directory directly:

```bash
# Claude Code — project-scoped
git clone --depth 1 https://github.com/samuadda/rtl-skill.git /tmp/rtl-skill
mkdir -p .claude/skills
cp -R /tmp/rtl-skill/skills/rtl .claude/skills/

# Claude Code — global
mkdir -p ~/.claude/skills
cp -R /tmp/rtl-skill/skills/rtl ~/.claude/skills/

# Cursor / Windsurf / Cline — point your agent's skill loader at
# the cloned skills/rtl/ directory; consult your agent's docs for the
# exact path (typically .cursor/skills/, .windsurf/skills/, etc).
```

After install, verify with: `ls .claude/skills/rtl/SKILL.md` (or the equivalent path for your agent). The agent picks up the skill on next conversation.

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

Run `/rtl-audit test/BadComponent.jsx` inside Claude Code and grade the output against [`test/ANSWER_KEY.md`](test/ANSWER_KEY.md). The component contains 24 deliberate RTL bugs (16 breaking + 5 degraded + 3 cosmetic) and expects 5 directional icons flipped, 5 neutral icons untouched. A score of 22+ with correct icon classification = skill working.

Structure sanity check (no API, no dependencies):

```bash
npm run validate
```

---

## Evals

The skill ships with a 30-query trigger eval suite that measures whether the agent correctly invokes the skill from a given user prompt. Mix of direct mentions ("make this RTL"), indirect signals ("Saudi users"), slash commands, false-positive edge cases ("translate to Arabic", "right-click context menu"), and non-Arabic RTL scripts the skill explicitly rejects.

- **Latest pass rate: 30 / 30 (100%)** after Arabic-only scope lockdown.
- See [`evals/results.md`](evals/results.md) for the full table and iteration log.
- See [`evals/README.md`](evals/README.md) for how to re-run manually (no API key required).

---

## Tested on

The skill was stress-tested against a real public component library:

- **Target:** [shadcn-ui/ui](https://github.com/shadcn-ui/ui) @ `fd0e0c3` — `apps/v4/registry/new-york-v4/ui/*.tsx` (56 component files).
- **Findings:** 22 RTL issues — 11 breaking, 6 degraded, 5 cosmetic. 42 of 56 files contained at least one physical-property utility.
- **Coverage:** the skill caught all physical margin/padding/positioning leaks, directional-icon misuse in pagination/breadcrumb, sheet slide-direction bugs, and `tracking-*` on text. It missed component APIs that take `"left" | "right"` as prop values (Sheet, Sidebar, MUI Drawer) — fixed in the same pass.

Full report: [`tests/real-world-audit.md`](tests/real-world-audit.md). Gaps surfaced and how they were addressed: [`tests/gaps-found.md`](tests/gaps-found.md).

---

## What's NOT covered

This skill stays focused on layout, typography, components, and animations for RTL UI. It does **not** cover:

- **Complex data visualizations** — D3 charts, force-directed graphs, custom SVG dashboards. Axis direction, tooltip placement, and legend ordering are domain decisions.
- **Map UIs** — Mapbox, Google Maps, Leaflet. Map tiles aren't mirrored (geography is geography); only the chrome around them is RTL.
- **Video / audio players with directional controls** — scrub bars and chapter markers mix temporal direction (always LTR) with spatial UI direction.
- **Game UIs / canvas-rendered scenes** — anything drawn imperatively to `<canvas>` or WebGL. CSS direction does not reach into canvas.
- **PDF viewers and document renderers** — page layout is fixed by the source document; the viewer chrome is RTL but the content is not.
- **Animation-heavy marketing pages** — bespoke parallax, scroll-linked timelines, custom Lottie files. Each animation needs a designer call, not a generic flip.
- **Content translation** — this skill is for layout work. Translating English copy to Arabic is a different task — agents should not invoke `rtl-skill` for it.
- **Other RTL scripts** — non-Arabic RTL languages use different cursive systems, different diacritic conventions, and different font stacks. The Arabic-specific guidance in this skill (Cairo/Tajawal fonts, tashkeel-aware line-height, cursive-letterform letter-spacing rules) does not transfer cleanly. The skill rejects requests for non-Arabic RTL UI rather than half-supporting them.

When you hit one of these, the agent will flag it for human review with the specific RTL decisions that need a call. See [`skills/rtl/reference.md`](skills/rtl/reference.md) → "Out of scope — escalate" for the full list.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to fix rules, add frameworks, and submit PRs.

The key rule: **`reference.md` and `workflows.md` must stay in sync** — if you add a rule to one, update the other.

---

## License

MIT
