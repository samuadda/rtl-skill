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

**Flexbox:** `flex-direction: row` reads left-to-right — wrong for RTL.
```css
/* Option A — explicit RTL default */
.container { flex-direction: row-reverse; }

/* Option B — use logical values (preferred when supported) */
.container { flex-direction: row; } /* + dir="rtl" on parent handles it */
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

### Letter spacing — ALWAYS zero
```css
/* Arabic is cursive. Letter spacing breaks connected letterforms. */
* { letter-spacing: 0; }
```
This is the single most common Arabic typography mistake in agent-generated code.

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

## 7. Data & Tables

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
