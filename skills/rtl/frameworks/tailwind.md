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

## Arbitrary-deep RTL variants

### The problem

Some libraries render their own internal DOM and never expose the directional element to you. react-day-picker draws its own month-navigation chevrons inside `<button class="rdp-button_next">`. react-select renders its dropdown caret. Several Radix primitives wrap content in chrome you don't write. Rich text editors generate toolbar SVGs internally.

You can't add `rtl:rotate-180` to an element you don't own. Forking the library to add one class is overkill; skipping the flip leaves the chevrons pointing the wrong way in RTL.

### The solution

Tailwind v3.3+ supports **arbitrary variants** combined with **descendant selectors** via the `**:` syntax. You add a single class to a wrapper you do control, and Tailwind generates a CSS rule that targets the deep descendant only when `dir="rtl"` is set.

The shape is:
```
rtl:**:[<descendant-selector>]:<utility>
```

Read it as: "in RTL, for every descendant matching `<descendant-selector>`, apply `<utility>`."

### Example 1 — react-day-picker chevrons

```jsx
import { Calendar } from "your-calendar-wrapper" // wraps react-day-picker

<Calendar
  className={cn(
    "rounded-md border p-3",
    // Flip the next/previous month chevrons that live inside react-day-picker's
    // own DOM. We only own the wrapper; rdp owns the buttons.
    "rtl:**:[.rdp-button_next>svg]:rotate-180",
    "rtl:**:[.rdp-button_previous>svg]:rotate-180"
  )}
/>
```

This is the exact pattern shadcn-ui's `calendar.tsx` uses — single wrapper class, no fork.

### Example 2 — every directional SVG inside a third-party menu

```jsx
import { ContextMenu } from "some-menu-library"

<ContextMenu className="rtl:**:[svg.directional]:rotate-180">
  {/* library renders its own <svg class="directional"> deep inside */}
</ContextMenu>
```

If the library marks directional SVGs with a stable class, target it directly. If it uses an attribute or element type, the same syntax works: `rtl:**:[[data-direction]]:rotate-180`, `rtl:**:[svg]:scale-x-[-1]`.

### Constraints

This pattern requires all three:

1. **Tailwind v3.3 or later.** Older versions don't compile the `**:` arbitrary-descendant syntax.
2. **A stable selector inside the library's DOM.** A class name (`.rdp-button_next`), data attribute (`[data-slot="indicator"]`), or element type (`svg`). If the library's DOM uses generated hash classes (CSS modules, atomic CSS) the selector breaks on the next library release.
3. **The library doesn't run its own `dir`-aware logic.** A few libraries (Radix `DirectionProvider`, MUI with RTL plugin) flip directional elements themselves. Stacking your `rtl:rotate-180` on top of their flip cancels both. Check first.

### When to reach for it

Use the arbitrary-deep pattern **only** when you can't add classes to the actual element. If the library exposes a `className` or `slot` prop on the directional element itself, prefer that — clearer intent, easier to debug, survives DOM-structure changes inside the library. Save the deep variant for cases where the API leaves you no other path.

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
