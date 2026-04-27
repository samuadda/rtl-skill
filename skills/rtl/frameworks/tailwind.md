# RTL — Tailwind CSS

---

## Version Assumptions

- **Minimum: Tailwind v3.3.** First version with native `ms`/`me`/`ps`/`pe`/`start`/`end` logical utilities. Below v3.3 these classes don't exist — you'll see "Unknown class" errors at build.
- **Recommended: Tailwind v3.4+.** Stable RTL tooling, all logical utility variants available (`rounded-s`, `border-s`, etc.).
- **Tailwind v4 (different config model):**
  - `tailwind.config.js` is no longer the primary config. Configuration moves into CSS via the `@theme` directive: `@theme { --font-arabic: 'Cairo', sans-serif; }`.
  - Plugin-style config still works but is opt-in.
  - The `rtl:` variant and all `s`/`e` utilities behave the same as v3.4.
  - Detection: presence of `@import "tailwindcss";` (v4) vs `@tailwind base; @tailwind components; @tailwind utilities;` (v3) in the entry CSS.
- **Known gotchas:**
  - `space-x-*` reverses awkwardly under `dir="rtl"` even in v3.4 — prefer `gap-*` with `flex`.
  - `divide-x-*` borders render on the visual right in both directions; use `divide-x-reverse` in RTL.
- **Older than v3.3?** See the "Legacy: pre-v3.3 fallback" section at the bottom.

If you can't determine the project's Tailwind version (no lockfile, monorepo without local `package.json`), default to the most recent stable (v3.4) and flag the assumption to the user before generating.

---

## Core approach

Tailwind has built-in RTL support via the `rtl:` variant. Use it alongside logical property utilities.

**Setup — enable RTL variant in config:**
```js
// tailwind.config.js
module.exports = {
  // No special config needed in Tailwind v3+
  // rtl: variant works out of the box with dir="rtl" on parent
}
```

---

## Utility mapping

| Avoid | Use instead |
|-------|-------------|
| `ml-4` | `ms-4` (margin-inline-start) |
| `mr-4` | `me-4` (margin-inline-end) |
| `pl-4` | `ps-4` (padding-inline-start) |
| `pr-4` | `pe-4` (padding-inline-end) |
| `left-0` | `start-0` (inset-inline-start) |
| `right-0` | `end-0` (inset-inline-end) |
| `border-l` | `border-s` |
| `border-r` | `border-e` |
| `rounded-l` | `rounded-s` |
| `rounded-r` | `rounded-e` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `float-left` | `float-start` |
| `float-right` | `float-end` |

Tailwind v3.3+ supports all `s`/`e` logical utilities natively.

---

## Directional icons

```jsx
// Flip directional icons with rtl: variant
<ChevronRight className="rtl:rotate-180 transition-transform duration-200" />
<ArrowLeft className="rtl:rotate-180" />
<Send className="rtl:-scale-x-100" />
```

---

## Flex direction

```jsx
// Explicit RTL handling
<div className="flex flex-row rtl:flex-row-reverse">
  ...
</div>

// Or: use row-reverse as default (content reads correctly in RTL, mirrors in LTR)
<div className="flex flex-row-reverse rtl:flex-row">
  ...
</div>
```

---

## Conditional classes

When you need a class only in RTL or only in LTR:
```jsx
<div className="rtl:text-end ltr:text-start">
  ...
</div>
```

---

## Space utilities

```jsx
// space-x reverses in RTL — prefer gap + flex
// AVOID: space-x-4 (may behave unexpectedly)
// USE: gap-4 with flex

<div className="flex gap-4">...</div>
```

---

## Animations

```jsx
// Use arbitrary values for RTL-aware slide
<div className="animate-[slideIn_0.3s_ease]">

// Define in CSS or tailwind config:
// slideIn: from translateX(calc(-100% * var(--rtl-flip)))
```

---

## Font setup

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        latin: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

```jsx
<html dir="rtl" className="font-arabic">
```

---

## Legacy: pre-v3.3 fallback

If the project pins Tailwind below v3.3, the `s`/`e` utilities are missing. Two options:

**Option A — upgrade.** Tailwind v3.3 → v3.4 is a non-breaking minor bump for almost all projects.

**Option B — extend the config with logical utilities manually:**
```js
// tailwind.config.js (v3.0–v3.2)
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const spacing = theme('spacing')
      const utils = {}
      Object.entries(spacing).forEach(([k, v]) => {
        utils[`.ms-${k}`] = { 'margin-inline-start': v }
        utils[`.me-${k}`] = { 'margin-inline-end': v }
        utils[`.ps-${k}`] = { 'padding-inline-start': v }
        utils[`.pe-${k}`] = { 'padding-inline-end': v }
      })
      addUtilities(utils)
    }),
  ],
}
```

The `rtl:` variant itself ships from v3.0+ — only the logical utility classes need backfilling.

---

## Full RTL-ready component example

```jsx
// Navbar — RTL-aware with Tailwind
export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      {/* Logo — always on inline-end in RTL (right side visually) */}
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-semibold text-lg">اسم التطبيق</span>
      </div>

      {/* Nav links */}
      <ul className="flex items-center gap-6">
        <li><a href="/" className="hover:text-primary">الرئيسية</a></li>
        <li><a href="/about" className="hover:text-primary">من نحن</a></li>
      </ul>

      {/* CTA — with directional icon */}
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white">
        ابدأ الآن
        <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
      </button>
    </nav>
  )
}
```
