# RTL — Plain CSS / SCSS

---

## Version Assumptions

Logical-property baseline support (caniuse, accurate as of 2026):

- **`margin-inline-start`/`-end`, `padding-inline-*`, `inset-inline-*`, `border-inline-*`:** Safari 14.1+, Chrome 87+, Firefox 66+, Edge 87+. Safe to use unprefixed.
- **`text-align: start | end`:** universal — Safari 12+, Chrome 1+, Firefox 1+.
- **`float: inline-start | inline-end`:** Safari 15+, Chrome 118+, Firefox 66+. Newer than the others — fall back to `[dir="rtl"] .x { float: right; }` if you must support Chrome <118.
- **`border-start-start-radius` / `border-start-end-radius` / `border-end-start-radius` / `border-end-end-radius`:** Safari 15+, Chrome 89+, Firefox 66+. The corner-radius logical properties lag a release behind the inline ones — assume Safari 15 as your floor.
- **`scroll-padding-inline-*` / `scroll-margin-inline-*`:** Safari 14.1+, Chrome 87+, Firefox 68+.

If your support matrix includes browsers older than the floors above, fall back to `[dir="rtl"]` selectors with physical properties — but document the version target in the project README so future contributors don't strip the fallbacks.

If you can't determine the support matrix, default to the most recent stable browser baseline and flag the assumption to the user.

---

## Core strategy: logical properties + dir attribute

Set `dir="rtl"` on the root, then use CSS logical properties everywhere. The browser does the mirroring automatically.

```css
/* Global logical properties setup */
:root {
  --rtl-flip: 1; /* 1 for LTR, -1 for RTL — for manual transforms */
}

[dir="rtl"] {
  --rtl-flip: -1;
}
```

---

## Property reference

```css
/* Margin */
margin-inline-start: 16px;  /* left in LTR, right in RTL */
margin-inline-end: 16px;    /* right in LTR, left in RTL */
margin-block-start: 16px;   /* top (same in both) */
margin-block-end: 16px;     /* bottom (same in both) */

/* Padding */
padding-inline-start: 16px;
padding-inline-end: 16px;

/* Positioning */
inset-inline-start: 0;      /* left in LTR, right in RTL */
inset-inline-end: 0;

/* Border */
border-inline-start: 1px solid;
border-inline-end: 1px solid;

/* Border radius */
border-start-start-radius: 8px;  /* top-left in LTR */
border-start-end-radius: 8px;    /* top-right in LTR */
border-end-start-radius: 8px;    /* bottom-left in LTR */
border-end-end-radius: 8px;      /* bottom-right in LTR */

/* Text */
text-align: start;  /* left in LTR, right in RTL */
text-align: end;    /* right in LTR, left in RTL */

/* Float */
float: inline-start;
float: inline-end;
```

---

## Flexbox

```css
/* flex-direction is NOT affected by dir="rtl" — must be handled explicitly */

/* Option A — default to row-reverse (RTL-first apps) */
.row {
  display: flex;
  flex-direction: row-reverse;
}

/* Option B — explicit per-direction (LTR/RTL switching apps) */
.row {
  display: flex;
  flex-direction: row;
}
[dir="rtl"] .row {
  flex-direction: row-reverse;
}
```

---

## Icon flipping

```css
/* Directional icons — flip in RTL */
.icon-directional {
  transform: scaleX(var(--rtl-flip));
  transition: transform 0.2s;
}

/* Alternative — target with dir selector */
[dir="rtl"] .icon-arrow,
[dir="rtl"] .icon-chevron,
[dir="rtl"] .icon-send {
  transform: scaleX(-1);
}
```

---

## Animations

```css
/* RTL-aware slide-in */
@keyframes slideInStart {
  from {
    transform: translateX(calc(-1rem * var(--rtl-flip)));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideInStart 0.3s ease forwards;
}
```

---

## SCSS helpers

```scss
// Mixin for RTL-aware property
@mixin rtl-prop($property, $ltr-value, $rtl-value) {
  #{$property}: $ltr-value;
  [dir="rtl"] & {
    #{$property}: $rtl-value;
  }
}

// Usage
.sidebar {
  @include rtl-prop(left, 0, auto);
  @include rtl-prop(right, auto, 0);
}

// Mixin for logical shorthand
@mixin inline-spacing($start, $end: $start) {
  padding-inline-start: $start;
  padding-inline-end: $end;
}
```

---

## LTR island utility

```css
.ltr {
  direction: ltr;
  display: inline-block;
  unicode-bidi: embed;
}

/* Usage in HTML */
/* <span class="ltr">+966 50 000 0000</span> */
```

---

## Complete component example

```css
/* Breadcrumbs — RTL-aware */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumbs__separator {
  color: var(--color-muted);
  /* Separator arrow flips automatically with scaleX */
  display: inline-flex;
  transform: scaleX(var(--rtl-flip));
}

.breadcrumbs__item a {
  color: var(--color-muted);
  text-decoration: none;
  padding-inline: 0.25rem;
}

.breadcrumbs__item:last-child a {
  color: var(--color-foreground);
  font-weight: 500;
}
```
