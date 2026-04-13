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

## Framework Rules

Detect the project's framework and load the relevant file:

- Tailwind CSS detected → load [frameworks/tailwind.md](frameworks/tailwind.md)
- Plain CSS / SCSS → load [frameworks/css.md](frameworks/css.md)
- styled-components / emotion / CSS-in-JS → load [frameworks/css-in-js.md](frameworks/css-in-js.md)
- React Native → load [frameworks/react-native.md](frameworks/react-native.md)

Multiple frameworks may apply. Load all that match.

---

## Full Rules Reference

For deep rules on each concern area → [reference.md](reference.md)

Covers: Layout, Typography, Components, Icons, Animations, Forms, Data & Tables.
