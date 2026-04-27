# RTL Skill — Workflows & Commands

---

## /rtl-init

**Triggers:** `/rtl-init`, "start an RTL project", "new Arabic app", "initialize RTL", "setup RTL from scratch"

**Purpose:** Scaffold a new project with RTL baked in from day one. No LTR assumptions anywhere.

### What to ask first
Before generating anything, determine:
1. **Framework** — React / Vue / Next.js / plain HTML / React Native?
2. **CSS approach** — Tailwind / plain CSS / styled-components / CSS modules?
3. **Switching** — Pure RTL only, or LTR/RTL toggle needed?
4. **Component library** — shadcn, MUI, Ant Design, or none?

### What to generate

**1. Root HTML setup**
```html
<html lang="ar" dir="rtl">
```
For switching apps:
```html
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

**2. Base CSS reset**
```css
:root {
  --font-primary: 'Cairo', 'Tajawal', sans-serif;
  --font-size-base: 1rem;
  --line-height-arabic: 1.7;
  --letter-spacing-arabic: 0;
}

* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-primary);
  line-height: var(--line-height-arabic);
  letter-spacing: var(--letter-spacing-arabic);
}

/* LTR islands — apply to numbers, code, URLs */
.ltr-island {
  direction: ltr;
  display: inline-block;
  unicode-bidi: embed;
}
```

**3. Font loading**
```html
<!-- Quick start (prototypes only — has latency + privacy tradeoffs) -->
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
```
> **Production:** self-host fonts using [fontsource](https://fontsource.org/fonts/cairo) or download and serve from your own CDN. Google Fonts adds a cross-origin request and is blocked in some regions.

Preferred Arabic fonts in order: Cairo → Tajawal → IBM Plex Arabic → Noto Kufi Arabic

**4. RTL config file**
Create `rtl.config.js` at project root:
```js
export const RTL_CONFIG = {
  defaultLocale: 'ar',
  supportedLocales: ['ar', 'en'], // extend as needed
  fonts: {
    arabic: 'Cairo, Tajawal, sans-serif',
    latin: 'Inter, system-ui, sans-serif',
  },
  numerals: 'western', // 'western' (1,2,3) or 'arabic-indic' (١,٢,٣)
}
```

**5. Base RTL-aware components**
Generate stubs for: `Button`, `Input`, `Icon`, `Card` — each with RTL handled.

**6. Numeral decision**
Flag this as a required project decision:
> "Western numerals (1, 2, 3) or Arabic-Indic (١, ٢, ٣)? This affects all number rendering. Decide now and set in rtl.config.js."

### Output checklist before finishing
```
□ dir="rtl" on root
□ lang="ar" on root  
□ Arabic font loaded and set
□ letter-spacing: 0 globally
□ line-height: 1.7 globally
□ LTR island utility class defined
□ rtl.config.js created
□ Numeral format decided and documented
```

---

## /rtl-audit

**Triggers:** `/rtl-audit`, "audit for RTL", "check RTL issues", "scan this project", "what's broken in RTL", "rtl audit `<path>`"

**Purpose:** Scan an existing codebase for RTL issues. Produce a persistent, actionable report.

### How to run it
1. Scan the specified path (or entire project if no path given)
2. Classify every issue by severity
3. Write `rtl-audit-report.md` to project root

### What to scan for

**🛑 Breaking — renders incorrectly in RTL**
- `margin-left`, `margin-right`, `padding-left`, `padding-right` (use logical instead)
- `left: X`, `right: X` in positioned elements
- `text-align: left` or `text-align: right`
- `flex-direction: row` without RTL consideration
- `float: left` / `float: right`
- Missing `dir` attribute on root or isolated LTR islands
- Directional icons (arrows, chevrons) without flip handling
- `transform: translateX()` without RTL sign reversal

**🔶 Degraded — works but looks wrong**
- `border-left`, `border-right` as design elements (not dividers)
- `box-shadow` with directional offset not mirrored
- `background-position: left` / `right`
- Animations sliding from wrong direction
- `justify-content: flex-start` where start ≠ right

**🔹 Cosmetic — minor polish issues**
- `letter-spacing` set on Arabic text (should be 0)
- `line-height` below 1.6 on Arabic text
- Generic system font instead of Arabic-optimized font
- Hardcoded LTR punctuation in Arabic content

### Report format

Write to `rtl-audit-report.md`. **When generating the report, follow this template exactly. Every issue must include all six fields (file:line, severity tag, issue title, Current, Fix, Why). Don't omit fields when the value seems obvious — consistency across reports is the point.**

````markdown
# RTL Audit Report
Generated: 2026-04-27
Path audited: apps/web/src

## Summary
- 🛑 Breaking: 3 issues
- 🔶 Degraded: 2 issues
- 🔹 Cosmetic: 2 issues
- **Total:** 7 issues across 5 files

## Issues

### 🛑 components/Sidebar.tsx:24 — Hardcoded `left` on absolute-positioned drawer
**Current:**
```tsx
<aside className="absolute left-0 top-0 h-full w-72 border-r">
```
**Fix:**
```tsx
<aside className="absolute start-0 top-0 h-full w-72 border-e">
```
**Why:** `left-0` and `border-r` pin the drawer to the physical left edge in both directions. In RTL the drawer should open from the right — use `start-0` and `border-e` so the browser mirrors automatically.

### 🛑 components/Pagination.tsx:41 — Directional chevron not flipped
**Current:**
```tsx
<button onClick={next} aria-label="next">
  <ChevronRight className="h-4 w-4" />
</button>
```
**Fix:**
```tsx
<button onClick={next} aria-label="next">
  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
</button>
```
**Why:** `ChevronRight` points toward the next page in LTR. In RTL the next page sits to the *left*, so the icon must rotate 180° to keep the meaning consistent.

### 🛑 styles/globals.css:88 — `text-align: left` in body copy
**Current:**
```css
.prose p { text-align: left; }
```
**Fix:**
```css
.prose p { text-align: start; }
```
**Why:** Physical alignment forces left-aligned paragraphs in RTL, producing a ragged right edge. `start` follows writing direction.

### 🔶 components/Toast.tsx:12 — Toast container anchored with physical offset
**Current:**
```tsx
<div className="fixed bottom-4 right-4 z-50">
```
**Fix:**
```tsx
<div className="fixed bottom-4 end-4 z-50">
```
**Why:** Toasts conventionally appear in the trailing-edge corner. `right-4` keeps them on the right in RTL, where the trailing edge is the left.

### 🔶 components/Card.tsx:6 — Card shadow with directional offset
**Current:**
```tsx
<div className="shadow-[4px_4px_12px_rgba(0,0,0,0.1)]">
```
**Fix:**
```tsx
<div className="shadow-[calc(4px_*_var(--rtl-flip,1))_4px_12px_rgba(0,0,0,0.1)]">
```
**Why:** A 4px horizontal shadow offset reads as light-from-the-left in LTR. In RTL the implied light source should flip; otherwise shadows look wrong against mirrored layouts.

### 🔹 styles/globals.css:14 — `letter-spacing` set on Arabic body text
**Current:**
```css
body { letter-spacing: 0.02em; font-family: 'Cairo', sans-serif; }
```
**Fix:**
```css
body { letter-spacing: 0; font-family: 'Cairo', sans-serif; }
```
**Why:** Arabic is cursive — any positive `letter-spacing` breaks the connections between letterforms.

### 🔹 components/Article.tsx:9 — Tight line-height on Arabic paragraph
**Current:**
```tsx
<p className="leading-tight">{content}</p>
```
**Fix:**
```tsx
<p className="leading-[1.8]">{content}</p>
```
**Why:** Arabic diacritics (tashkeel) clip when line-height drops below ~1.6. Body copy should use 1.7–1.8.

## Recommended order

Tackle in this order — earlier severities block later ones from being meaningful:

1. **🛑 Breaking first.** These render the UI incorrectly in RTL. Ship-blocking. Fix before any visual review.
2. **🔶 Degraded next.** Layout works but looks wrong (mismatched shadows, off-axis animations, wrong-side toasts). Fix before stakeholder demo.
3. **🔹 Cosmetic last.** Typography polish (letter-spacing, line-height, font choice). Fix before launch but safe to batch.

Re-run `/rtl-audit` after each pass to confirm zero regressions.
````

---

## /rtl-convert

**Triggers:** `/rtl-convert`, "rtlize this", "convert to RTL", "make this RTL-aware", "fix RTL in this component"

**Purpose:** Take a specific component or file and convert it fully to RTL-aware. Does the work, not just flags issues.

### Process

1. **Read the component fully** before touching anything
2. **Run the golden checklist** mentally against it
3. **Convert in this order:**
   - Physical → logical CSS properties
   - Fix flex/grid directions
   - Handle icons (flip directional, leave neutral)
   - Fix animations
   - Mark LTR islands
   - Fix form elements
4. **Add inline comments** for every RTL decision made:
   ```css
   /* RTL: margin-inline-start mirrors correctly in both directions */
   margin-inline-start: 16px;
   ```
5. **Output the full converted file** — not a diff, the whole thing

### Conversion reference

| Before | After |
|--------|-------|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `left: X` | `inset-inline-start: X` |
| `right: X` | `inset-inline-end: X` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |
| `float: right` | `float: inline-end` |

### Icon handling
```jsx
// Directional icon — must flip
<ChevronRight className="rtl:rotate-180" />
<ArrowLeft className="rtl:rotate-180" />

// Neutral icon — never flip
<Heart />  {/* no flip needed */}
<Star />   {/* no flip needed */}
```

### LTR island marking
```jsx
// Numbers, phone, email, URLs, code
<span dir="ltr" className="inline-block">+966 50 000 0000</span>
<code dir="ltr">npm install</code>
```

---

## /rtl-check

**Triggers:** `/rtl-check`, "check this component", "rtl review", "quick rtl check"

**Purpose:** Lightweight checklist pass after generating a new component. Flags only — does not rewrite. Run this after every new component before moving on.

### Process
Run each checklist item. Output pass ✓ or fail ✗ with a one-line fix suggestion.

```
✓ No physical left/right properties
✗ flex-direction: row — needs rtl:flex-row-reverse or use row-reverse as default
✓ Icons classified correctly
✓ Animations direction correct
✗ letter-spacing: 0.5px on Arabic text — set to 0
✓ Numbers wrapped in LTR island
✓ Form inputs aligned correctly
✓ dir attribute present
```

If any item fails: fix it immediately before proceeding. Do not defer RTL fixes.
