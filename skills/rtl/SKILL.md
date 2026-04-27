---
name: rtl
description: RTL skill for Arabic UI. Use when building, auditing, or converting Arabic interfaces — including apps for Saudi Arabia, UAE, or Egypt. Covers layout mirroring, logical properties, Arabic typography, directional icons, animations, forms, and bidirectional text. Triggers on /rtl-init, /rtl-audit, /rtl-convert, /rtl-check, or any mention of Arabic UI or RTL layout. Don't use for translation or non-Arabic RTL scripts.
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

## Forbidden Workarounds

**Violating the letter of these rules is violating the spirit. If you're rationalizing an exception, you're wrong.**

Under pressure, agents reach for shortcuts that ship the change without solving the RTL problem. Don't. For each forbidden pattern below, the correct substitute is named — use it.

### 1. Don't match existing physical-property style "for consistency"
**Forbidden:**
```css
.card { margin-left: 16px; } /* matches the rest of the file */
```
**Do instead:** Convert as you go. The codebase migrates one file at a time.
```css
.card { margin-inline-start: 16px; }
```

### 2. Don't add `!important` to override RTL bugs
**Forbidden:**
```css
.sidebar { left: 0 !important; } /* force-pin to "fix" RTL */
```
**Do instead:** Fix the underlying property.
```css
.sidebar { inset-inline-start: 0; }
```

### 3. Don't wrap sections in `direction: ltr` to dodge mirroring decisions
**Forbidden:**
```jsx
<section style={{ direction: 'ltr' }}>{/* whole feature */}</section>
```
**Do instead:** Mark only the specific LTR island — a number, code snippet, or URL.
```jsx
<p>الرصيد: <span dir="ltr" style={{display: 'inline-block'}}>$1,250.00</span></p>
```

### 4. Don't use `transform: scaleX(-1)` on text
**Forbidden:**
```css
[dir="rtl"] .heading { transform: scaleX(-1); } /* mirrors the glyphs */
```
**Do instead:** `scaleX(-1)` is for **directional icons only**. For layout, use logical properties; for text alignment, use `text-align: start`/`end`.

### 5. Don't manipulate Arabic strings by character index
**Forbidden:**
```js
const initial = name.charAt(0); // breaks combined letterforms and tashkeel
```
**Do instead:** Use grapheme-aware APIs.
```js
const initial = [...new Intl.Segmenter('ar', { granularity: 'grapheme' }).segment(name)][0]?.segment;
```

### 6. Don't set positive `letter-spacing` on Arabic — ever
**Forbidden:**
```css
.brand { letter-spacing: 0.05em; } /* "for design reasons" */
```
**Do instead:** Always `0` on Arabic text. If the design needs visual emphasis, use weight, size, or color — not spacing. Arabic is cursive; spacing breaks letter connections.
```css
.brand { letter-spacing: 0; font-weight: 700; }
```

### 7. Don't skip root `dir="rtl"` and set direction per-component
**Forbidden:**
```jsx
<html><body>
  <Header dir="rtl" /><Main dir="rtl" /><Footer dir="rtl" />
</body></html>
```
**Do instead:** Set direction once on the root. Per-component `dir` is reserved for LTR islands inside an RTL document.
```jsx
<html lang="ar" dir="rtl"><body>
  <Header /><Main /><Footer />
</body></html>
```

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

## Common Mistakes

Before generating, scan [anti-patterns.md](anti-patterns.md) for patterns to avoid. Especially relevant when working on existing code — most anti-patterns survive code review because nothing fails loudly.

---

## Full Rules Reference

For deep rules on each concern area → [reference.md](reference.md)

Covers: Layout, Typography, Components, Icons, Animations, Forms, Data & Tables.
