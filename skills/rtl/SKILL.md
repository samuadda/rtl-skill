---
name: rtl
description: RTL (right-to-left) layout skill for Arabic UI. Use when building, auditing, or converting interfaces that need Arabic/RTL support. Handles layout mirroring, CSS logical properties, Arabic typography, directional components, animations, and forms. Triggers on /rtl-init, /rtl-audit, /rtl-convert, /rtl-check, or any mention of Arabic UI, RTL layout, or bidirectional text.
---

# RTL Skill — Arabic UI

This skill makes you RTL-first. Not RTL-aware. RTL-first.

Before generating any component, run the **Start/End Axis Test**:
> "Does this element have a start and an end? If yes — it needs a conscious RTL decision."

## The Three Categories

Every element in every component falls into one of these:

| Category | Rule | Examples |
|----------|------|---------|
| **Always mirror** | Flip in RTL, no exceptions | Layout, flex direction, padding, margin, positioning, chevrons, arrows, progress bars, sliders, breadcrumbs |
| **Never mirror** | Stay LTR always | Numbers, currency, phone numbers, URLs, code blocks, email addresses, mathematical expressions |
| **Context-dependent** | Requires judgment | Images with people, decorative illustrations, brand logos |

When in doubt: mirror it. It's easier to un-mirror than to discover it was wrong in production.

---

## Commands

See [workflows.md](workflows.md) for full command definitions.

| Command | Trigger phrases | What it does |
|---------|----------------|--------------|
| `/rtl-init` | "start an RTL project", "new Arabic app", "setup RTL" | Scaffold a new project with RTL baked in |
| `/rtl-audit` | "audit for RTL", "check RTL issues", "scan this project" | Scan existing code and produce `rtl-audit-report.md` |
| `/rtl-convert` | "rtlize this", "convert to RTL", "make this RTL" | Convert a specific component to RTL-aware |
| `/rtl-check` | "check this component", "rtl review" | Quick golden checklist pass on a single component |

---

## The Golden Checklist

Run this on every component before considering it done:

```
□ No physical left/right properties — use logical (inline-start/end)
□ Flex/grid directions explicitly handled for RTL
□ Every icon classified: directional (flip) or neutral (don't flip)
□ Animations respect RTL axis (slide directions, progress fills)
□ Numbers, code, URLs are marked as LTR islands
□ Form inputs: text aligned correctly, labels on correct side
□ letter-spacing: 0 on all Arabic text
□ Line-height: minimum 1.6 on Arabic text
□ dir="rtl" present on root or component wrapper
□ Component mentally tested in both LTR and RTL
```

---

## Framework Detection

Run these checks from the repo root before loading any framework file. Each check is mechanical — no judgment. Multiple checks may pass; load every framework file that matches.

| Framework | Check (any one passes → match) |
|-----------|-------------------------------|
| **Tailwind** | `grep -E '"tailwindcss"\s*:' package.json` returns a line, OR `ls tailwind.config.js tailwind.config.ts tailwind.config.cjs tailwind.config.mjs 2>/dev/null` lists any file |
| **CSS-in-JS** | `grep -E '"(styled-components\|@emotion/react\|@emotion/styled)"\s*:' package.json` returns a line |
| **React Native** | `grep -E '"react-native"\s*:' package.json` returns a line. The dep `react-native-web` alone does NOT match — it's web-only. Require the bare `"react-native":` key |
| **Plain CSS / SCSS** | Fallback when none of the above match, OR repo contains `.css`/`.scss`/`.sass` files outside `node_modules` (`find . -type f \( -name '*.css' -o -name '*.scss' -o -name '*.sass' \) -not -path '*/node_modules/*' \| head -1`) used for non-framework styles |

Concrete decision flow:
1. Read `package.json` once. Cache the dependency list.
2. Run each check above against that list (and the file checks for Tailwind).
3. Build a set of matched frameworks. Load every matching file from `## Framework Rules` below.
4. If the set is empty, default to `frameworks/css.md`.

A Next.js + Tailwind + styled-components project loads **three** files: `tailwind.md`, `css-in-js.md`, and `css.md` (for any unscoped global styles).

---

## Framework Rules

Load the file(s) selected by detection above:

- Tailwind CSS → [frameworks/tailwind.md](frameworks/tailwind.md)
- Plain CSS / SCSS → [frameworks/css.md](frameworks/css.md)
- styled-components / emotion / CSS-in-JS → [frameworks/css-in-js.md](frameworks/css-in-js.md)
- React Native → [frameworks/react-native.md](frameworks/react-native.md)

---

## Full Rules Reference

For deep rules on each concern area → [reference.md](reference.md)

Covers: Layout, Typography, Components, Icons, Animations, Forms, Data & Tables.
