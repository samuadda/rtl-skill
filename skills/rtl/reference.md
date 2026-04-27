# RTL Reference — Full Rules

---

## 1. Layout & Flow

**The core rule:** Replace all physical properties with logical properties.

```css
/* NEVER use these */
margin-left, margin-right
padding-left, padding-right  
left, right (in positioned elements)
border-left, border-right
float: left / right

/* ALWAYS use these */
margin-inline-start, margin-inline-end
padding-inline-start, padding-inline-end
inset-inline-start, inset-inline-end
border-inline-start, border-inline-end
float: inline-start / inline-end
```

**Flexbox:** `flex-direction` is NOT affected by `dir="rtl"` — the browser does not auto-reverse it. You must handle it explicitly.
```css
/* Option A — default to row-reverse (correct for RTL-first apps) */
.container { flex-direction: row-reverse; }

/* Option B — explicit per-direction (for LTR/RTL switching apps) */
.container { flex-direction: row; }
[dir="rtl"] .container { flex-direction: row-reverse; }
```

**Absolute positioning:**
```css
/* NEVER */
.tooltip { left: 100%; }

/* ALWAYS */
.tooltip { inset-inline-start: 100%; }
```

**Scroll direction:** In RTL, `scrollLeft = 0` is the right edge. Account for this in any JS scroll logic.

---

## 2. Arabic Typography

These are non-negotiable for Arabic text.

### Font stack (in preference order)
```css
font-family: 'Cairo', 'Tajawal', 'IBM Plex Arabic', 'Noto Kufi Arabic', sans-serif;
```

Never use: Arial, Helvetica, system-ui alone — they render Arabic poorly.

### Letter spacing — ALWAYS zero on Arabic
```css
/* Arabic is cursive. Letter spacing breaks connected letterforms.
   Scope the reset to Arabic-rendering elements — applying it globally
   on a Latin or mixed-content project strips designer-intended
   tracking from headings and labels. */
:lang(ar), [lang^="ar"], [dir="rtl"] {
  letter-spacing: 0;
}

/* For pure-Arabic apps you can promote this to the root: */
html[lang^="ar"] * { letter-spacing: 0; }
```
This is the single most common Arabic typography mistake in agent-generated code. Set the scope based on whether the project is Arabic-only, mixed-content, or LTR-first with Arabic translations.

### Line height — generous
```css
/* Arabic diacritics (tashkeel) need vertical space to not clip */
body { line-height: 1.7; }
p    { line-height: 1.8; } /* body copy */
h1, h2, h3 { line-height: 1.4; } /* headings need less */
```

### Font weight
Arabic fonts tend to look heavier. Prefer `400` and `500`. Use `700` sparingly.

### Numerals decision
Must be made at project level — do not mix within the same UI:
- **Western** `1 2 3` — default, recommended for mixed content
- **Arabic-Indic** `١ ٢ ٣` — use only for fully Arabic-language UIs

### Punctuation
Arabic uses different punctuation — flag for content team, not a code concern:
- Comma: `،` not `,`
- Question mark: `؟` not `?`

### Bidi text (mixed Arabic + LTR content)
```jsx
{/* Wrap LTR islands explicitly */}
<p dir="rtl">
  اتصل بنا على{' '}
  <span dir="ltr" style={{display: 'inline-block'}}>+966 50 000 0000</span>
</p>
```

Never manipulate Arabic strings character by character — breaks text shaping.

---

## 3. Components with Strong Directionality

Each of these needs explicit RTL handling:

### Modals / Dialogs
Close button sits on the **inline-end** corner — top-left in RTL, top-right in LTR. Focus traps must follow DOM order, which already respects writing direction; do not hard-code Tab to "move right."

Action-button order is a **decision point**: many design systems (Material, iOS HIG) put the primary action on the right in LTR. Mirroring that puts the primary on the left in RTL — which feels backward to users coming from native Arabic apps that often place the primary on the right (closer to the thumb on RTL-laid phones). Pick one rule per project and document it in `rtl.config.js`.

```jsx
<dialog dir="rtl" className="...">
  <button className="absolute top-3 end-3" aria-label="إغلاق">
    <X />
  </button>
  <h2>تأكيد الحذف</h2>
  <p>هل أنت متأكد؟</p>
  <footer className="flex gap-2 justify-end">
    {/* Order in DOM = visual order in RTL.
        Primary first in DOM → renders on inline-start (left in RTL). */}
    <button className="btn-primary">حذف</button>
    <button className="btn-secondary">إلغاء</button>
  </footer>
</dialog>
```

**Gotcha:** Centering a modal with `left: 50%; transform: translateX(-50%)` works in both directions because the offset is symmetric — but `inset-inline-start: 50%; transform: translateX(-50%)` mirrors correctly *and* signals intent.

### Date pickers
Calendar grids must set `dir="rtl"` on the grid container so column 1 (Saturday) renders on the right. Month-navigation chevrons are directional — flip them. Day-of-week headers must match the visual column order.

In most Arabic countries the week starts on **Saturday**. Don't hard-code `weekStartsOn: 1` (Monday, common in EU libraries) — read it from locale data and verify against the project's target market. Saudi Arabia officially shifted to a Sunday-start workweek in 2023; if you target KSA specifically, confirm with the product team.

```jsx
<div dir="rtl" className="grid grid-cols-7 gap-1">
  <header className="contents text-sm text-muted">
    {/* DOM order = visual order in RTL: Sat is column 1, rendered rightmost */}
    <span>السبت</span><span>الأحد</span><span>الاثنين</span>
    <span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span>
  </header>
  {/* day cells */}
</div>

<nav className="flex items-center justify-between">
  <button aria-label="الشهر السابق">
    <ChevronLeft className="rtl:rotate-180" />
  </button>
  <span>أبريل ٢٠٢٦</span>
  <button aria-label="الشهر التالي">
    <ChevronRight className="rtl:rotate-180" />
  </button>
</nav>
```

**Gotcha:** Numerals inside date cells can be Arabic-Indic (`١٥`) or Western (`15`). Match the project-level decision in `rtl.config.js`. Mixing is the bug.

### Command palettes / Search dropdowns
Result highlight bands and selection indicators follow text direction — no extra work if you used logical properties. Keyboard arrows behave as follows:

- **Up / Down:** unaffected by direction. Up always = previous result, Down = next.
- **Left / Right:** semantics flip. In RTL, Left = "next character/word" inside the input; Right = "previous." If your palette uses arrows for tab-like navigation between sections, swap them with `dir`.
- **Home / End:** map to start/end of line — already direction-aware in browsers.

```jsx
<div role="combobox" dir="rtl">
  <input className="ps-9 pe-3" placeholder="ابحث..." />
  <Search className="absolute start-3 top-1/2 -translate-y-1/2" />
  <ul role="listbox">
    {results.map(r => (
      <li role="option" className="ps-3 pe-3 text-start">
        <span className="font-medium">{r.title}</span>
        <kbd dir="ltr" className="ms-auto">⌘K</kbd> {/* shortcut stays LTR */}
      </li>
    ))}
  </ul>
</div>
```

**Gotcha:** Keyboard shortcut hints (`⌘K`, `Ctrl+P`) are LTR islands. Wrap them in `dir="ltr"` even inside an RTL list.

### Rich text editors
Toolbar buttons appear in the same DOM order in both directions, which means visual order flips automatically — Bold sits on the right in RTL. That's correct. Don't override.

Indent/outdent are **logical**: indent always pushes toward inline-end. In RTL the indent grows leftward visually. Use `margin-inline-start` on indented blocks; do not use `margin-left`.

Alignment buttons must say **Start / End**, not Left / Right. The underlying CSS is `text-align: start | center | end | justify`. Show the icons mirrored in RTL.

List markers (`•`, `1.`) sit on the inline-start side automatically when the editor sets `dir="rtl"` on the list — no manual work.

```jsx
<div role="toolbar" className="flex gap-1" dir="rtl">
  <button title="غامق"><Bold /></button>
  <button title="مائل"><Italic /></button>
  <span className="w-px bg-border mx-1" />
  <button title="محاذاة للبداية" data-align="start">
    <AlignStart className="rtl:rotate-180" />
  </button>
  <button title="توسيط" data-align="center"><AlignCenter /></button>
  <button title="محاذاة للنهاية" data-align="end">
    <AlignEnd className="rtl:rotate-180" />
  </button>
  <span className="w-px bg-border mx-1" />
  <button title="إنقاص المسافة"><Outdent className="rtl:rotate-180" /></button>
  <button title="زيادة المسافة"><Indent className="rtl:rotate-180" /></button>
</div>

{/* Indented blockquote */}
<blockquote style={{ marginInlineStart: '1.5rem' }}>...</blockquote>
```

**Gotcha:** `contenteditable` regions inherit `dir` from the nearest ancestor. If your editor lets users mix Arabic and English paragraphs, set `dir="auto"` on each `<p>` so each paragraph picks its own direction from its first strong character.

### Breadcrumbs
```jsx
// Separator arrow must flip
Home › Products › Item  →  العناصر › المنتجات › الرئيسية
// Use: chevron-right in LTR, chevron-left in RTL (or rotate-180)
```

### Pagination
```jsx
// Prev/Next labels AND arrow icons swap
// LTR: ← Previous  |  Next →
// RTL: → السابق  |  التالي ←
```

### Progress / Stepper
```css
/* Fill from right in RTL */
.progress-fill {
  /* LTR: left to right */
  /* RTL: right to left — handled by dir="rtl" + inline-start */
}
```

### Carousel / Slider
- Initial active slide: index 0 is rightmost in RTL
- Swipe direction reverses
- Dot indicators order reverses

### Sidebar / Drawer
```css
/* Default open position flips */
/* LTR: opens from left */
/* RTL: opens from right */
.drawer { inset-inline-start: 0; }
```

### Toast / Notifications
```css
/* LTR: bottom-right or top-right */
/* RTL: bottom-left or top-left (i.e. inset-inline-start) */
.toast-container {
  inset-inline-end: 1rem;
  bottom: 1rem;
}
```

### Tabs
Tab reading order reverses in RTL — first tab is rightmost.

### Tooltips
```css
/* Anchor to the correct side */
.tooltip { inset-inline-start: 100%; } /* appears to the left in RTL */
```

### Back button
```jsx
<button>
  <ChevronLeft className="rtl:rotate-180" />
  رجوع
</button>
```

### Out of scope — escalate

This skill does **not** cover the components below. Don't guess — flag them for human review and explain what RTL decisions are pending.

- **Complex data visualizations** — D3 charts, force-directed graphs, custom SVG dashboards. Axis direction, tooltip placement, and legend ordering are domain decisions.
- **Map UIs** — Mapbox, Google Maps, Leaflet. Map tiles are not mirrored (geography is geography); only the chrome (controls, panels, route lists) is RTL. Boundary rules are project-specific.
- **Video / audio players with directional controls** — scrub bars, chapter markers, and playback rate menus mix temporal direction (always LTR — time flows forward) with spatial UI direction.
- **Game UIs / canvas-rendered scenes** — anything drawn imperatively to `<canvas>` or WebGL. CSS direction does not reach into the canvas.
- **PDF viewers and document renderers** — page layout is fixed by the source document; the viewer chrome is RTL but the content is not.
- **Animation-heavy marketing pages** — bespoke parallax, scroll-linked timelines, custom Lottie files. Each animation needs a designer call, not a generic flip.

When you hit one of these, write a one-paragraph note to the user listing the specific RTL decisions that need a human:

> "This component falls outside the rtl-skill scope. Pending decisions: (1) does the chart x-axis flip, (2) does the legend order reverse, (3) does the tooltip pointer mirror? Please confirm before I proceed."

---

## 4. Icons

### The classification rule
Ask: "Does this icon point or indicate direction?"

**Directional — MUST flip in RTL:**
- Arrows (→ ← ↑ ↓ when used for navigation)
- Chevrons (›, ‹)
- Send / submit arrows
- Back / forward buttons
- Play button (points right — flip in RTL)
- Quote marks used decoratively

**Neutral — NEVER flip:**
- Heart, star, bookmark
- Phone, email, camera
- Search (magnifying glass)
- Settings, menu (hamburger)
- User/avatar
- Check, close (✓ ✕)
- Warning, info, error circles
- Home

**How to flip:**
```jsx
// Tailwind
<ArrowRight className="rtl:rotate-180 transition-transform" />

// Plain CSS
[dir="rtl"] .icon-directional { transform: scaleX(-1); }

// CSS logical (preferred)
.icon-directional { transform: scaleX(var(--rtl-flip, 1)); }
[dir="rtl"] { --rtl-flip: -1; }
```

For icons rendered inside third-party libraries you can't modify (react-day-picker chevrons, react-select carets, library-owned menu chrome), see the arbitrary-deep variant pattern in [`frameworks/tailwind.md`](frameworks/tailwind.md#arbitrary-deep-rtl-variants) → `rtl:**:[<selector>]:rotate-180` flips a descendant from a wrapper you own without forking the library.

---

## 5. Animations & Transitions

Any animation with a horizontal axis must be mirrored in RTL.

### Slide animations
```css
/* WRONG — hardcoded direction */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}

/* RIGHT — RTL-aware */
@keyframes slideIn {
  from { transform: translateX(calc(-100% * var(--rtl-flip, 1))); }
  to   { transform: translateX(0); }
}

[dir="rtl"] { --rtl-flip: -1; }
[dir="ltr"] { --rtl-flip: 1; }
```

### Progress bar fills
```css
/* Fill from inline-start, not left */
.progress-fill {
  width: calc(var(--progress) * 1%);
  /* Positioned from inline-start — dir="rtl" handles visual direction */
}
```

### Skeleton loaders
```css
/* Shimmer direction must flip */
@keyframes shimmer {
  from { background-position: 200% center; }
  to   { background-position: -200% center; }
}
[dir="rtl"] .skeleton {
  /* Reverse animation direction */
  animation-direction: reverse;
}
```

### Page transitions
```css
/* Entering page slides from inline-start */
/* Leaving page exits to inline-end */
```

---

## 6. Forms

### Input text alignment
```css
input, textarea {
  text-align: start; /* not left */
}
```

### Numbers in inputs (phone, price, quantity)
```jsx
<input 
  type="tel"
  dir="ltr"        /* numbers stay LTR */
  style={{ textAlign: 'right' }} /* but visually right-aligned */
/>
```

### Label placement
```css
/* Labels sit on the inline-end side of checkboxes/radios in RTL */
.checkbox-label { margin-inline-start: 0.5rem; }
```

### Placeholder
```jsx
<input placeholder="ابحث هنا..." dir="rtl" />
```

### Validation messages
```css
.error-message {
  text-align: start;
  /* Icon on inline-start side of message */
  padding-inline-start: 1.5rem;
}
```

### Select / Dropdown
```css
/* Arrow icon position flips */
select {
  padding-inline-end: 2rem; /* space for arrow */
  padding-inline-start: 0.75rem;
  background-position: left 0.75rem center; /* physical — needs override */
}
[dir="rtl"] select {
  background-position: right 0.75rem center;
}
```

---

## 7. CSS Grid

CSS Grid column order is affected by `dir="rtl"` — column 1 becomes the rightmost column automatically when `dir="rtl"` is set on the container. Use this, don't fight it.

### Column order
```css
/* dir="rtl" on the grid container reverses column flow automatically */
/* No extra rules needed for simple grids */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

### Named template areas
Named areas do NOT auto-mirror — redefine them explicitly:
```css
.layout {
  display: grid;
  grid-template-areas:
    "sidebar main"
    "sidebar footer";
}

[dir="rtl"] .layout {
  grid-template-areas:
    "main sidebar"
    "footer sidebar";
}
```

### Logical column placement
```css
/* NEVER */
.item { grid-column: 1 / 3; } /* hardcoded column numbers break in RTL */

/* PREFER — named areas or auto-placement */
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
```

### Grid gap and alignment
```css
/* gap is direction-agnostic — safe to use as-is */
.grid { gap: 1rem; }

/* justify-items and justify-self respect writing direction */
.item { justify-self: start; } /* not left */
```

---

## 8. Scroll Behavior

### scrollLeft in RTL
`scrollLeft` behavior differs by browser in RTL contexts:
- Chrome/Edge: `scrollLeft` is negative (0 at right edge, negative toward left)
- Firefox: `scrollLeft` is positive (0 at right edge)
- Always use `scrollIntoView` or `scrollTo` with `behavior: 'smooth'` instead of manipulating `scrollLeft` directly

```js
// SAFE — works in both directions
element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

// RISKY — scrollLeft sign differs by browser in RTL
container.scrollLeft = 0;

// If you must use scrollLeft, normalize it:
function getScrollLeft(el) {
  const dir = getComputedStyle(el).direction;
  return dir === 'rtl' ? -el.scrollLeft : el.scrollLeft;
}
```

### scroll-snap in RTL
```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* dir="rtl" on container reverses snap point order automatically */
}

.slide {
  scroll-snap-align: start; /* "start" is RTL-aware — use it, not "left" */
  flex-shrink: 0;
  width: 100%;
}
```

### Sticky positioning
```css
/* Use logical properties — sticky respects writing direction */
.sticky-header {
  position: sticky;
  inset-block-start: 0; /* top */
  /* NOT: top: 0 — this actually works fine, block axis is unaffected by RTL */
}

.sticky-sidebar {
  position: sticky;
  inset-block-start: 1rem;
  /* inset-inline-start is safe here too */
}
```

---

## 9. Data & Tables

### Column order
In RTL, tables read right-to-left. First column is rightmost.
```jsx
// Set dir="rtl" on the table — browser handles column order
<table dir="rtl">
```

### Sort indicators
```css
/* Sort arrow on inline-end of column header text */
th .sort-icon { margin-inline-start: 0.25rem; }
```

### Text alignment in cells
```css
td, th { text-align: start; } /* not left */
td.numeric { 
  text-align: start; /* numeric data stays LTR visually */
  direction: ltr;
}
```
