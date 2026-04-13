# RTL — Plain CSS / SCSS

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
/* For horizontal flex containers */
.row {
  display: flex;
  flex-direction: row;
  /* dir="rtl" on parent automatically reverses visual order */
}

/* When you need explicit control */
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
