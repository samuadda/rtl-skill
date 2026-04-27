# RTL Anti-Patterns

Wrong-then-right pairs. Each entry shows the exact pattern agents reach for, why it breaks RTL, and the correct substitute.

Scan this file before generating in an existing codebase — most of these survive code review because nothing fails loudly.

---

## Layout

### ❌ Anti-pattern: Wrapping whole sections in `direction: ltr`
**What agents do:**
```jsx
<section style={{ direction: 'ltr' }}>
  <h2>Featured Products</h2>
  <ProductGrid items={items} />
  <Pagination />
</section>
```
**Why it's wrong:** It hides the RTL bug by forcing the whole subtree LTR. Headings, prose, and form labels read backward in Arabic. Future content added inside this section will silently inherit the LTR override.

**Correct approach:** Mark only the specific LTR island — a number, code snippet, or URL — not a layout region.
```jsx
<section>
  <h2>المنتجات المميزة</h2>
  <ProductGrid items={items} />
  <Pagination />
  <p>اتصل: <span dir="ltr" style={{display: 'inline-block'}}>+966 50 000 0000</span></p>
</section>
```

### ❌ Anti-pattern: Hardcoding `flex-direction: row` and expecting `dir="rtl"` to reverse it
**What agents do:**
```css
.toolbar {
  display: flex;
  flex-direction: row; /* assuming dir="rtl" reverses this — it does not */
}
```
**Why it's wrong:** `flex-direction` is **not** affected by `dir`. The browser does not auto-reverse rows. Buttons render in DOM order regardless of direction unless you explicitly mirror.

**Correct approach:** Reverse explicitly per direction, or default to `row-reverse` for RTL-first apps.
```css
.toolbar {
  display: flex;
  flex-direction: row;
}
[dir="rtl"] .toolbar {
  flex-direction: row-reverse;
}
```

### ❌ Anti-pattern: Using `margin-left` because "the linter doesn't complain"
**What agents do:**
```css
.avatar {
  margin-left: 12px; /* matches the rest of the file, no warnings */
}
```
**Why it's wrong:** Linters that don't enforce logical properties give zero feedback, but the avatar pushes off the wrong side in RTL — it ends up overlapping adjacent content.

**Correct approach:** Always use logical properties. Convert physical-property files as you touch them; don't extend the bug.
```css
.avatar {
  margin-inline-start: 12px;
}
```

---

## Typography

### ❌ Anti-pattern: Setting `letter-spacing` for "design polish" on Arabic text
**What agents do:**
```css
.brand-heading {
  font-family: 'Cairo', sans-serif;
  letter-spacing: 0.05em; /* "tighter, more refined" */
}
```
**Why it's wrong:** Arabic letters connect inside a word. Any positive `letter-spacing` breaks those connections — the text reads as disjointed characters, not words. This is the single most common Arabic typography bug.

**Correct approach:** Always `0` on Arabic. For visual emphasis use weight, size, or color.
```css
.brand-heading {
  font-family: 'Cairo', sans-serif;
  letter-spacing: 0;
  font-weight: 700;
  font-size: 1.5rem;
}
```

### ❌ Anti-pattern: Mixing Western and Arabic-Indic numerals in the same UI
**What agents do:**
```jsx
<div>
  <span>السعر: 1,250 ر.س</span>      {/* Western */}
  <span>الكمية: ٣ قطع</span>          {/* Arabic-Indic */}
  <span>التقييم: 4.8 من ٥</span>     {/* mixed in one string */}
</div>
```
**Why it's wrong:** Inconsistent numeral systems make scanning prices, totals, and ratings cognitively expensive. Users second-guess whether the numbers refer to the same units. The "5" and "٥" represent the same digit but visually disagree.

**Correct approach:** Decide once at the project level (`rtl.config.js`), apply everywhere via a `formatNumber()` helper.
```jsx
// rtl.config.js → numerals: 'western'
import { formatNumber } from '@/lib/format'

<div>
  <span>السعر: {formatNumber(1250)} ر.س</span>
  <span>الكمية: {formatNumber(3)} قطع</span>
  <span>التقييم: {formatNumber(4.8)} من {formatNumber(5)}</span>
</div>
```

### ❌ Anti-pattern: Manipulating Arabic strings character-by-character
**What agents do:**
```js
function getInitial(name) {
  return name.charAt(0).toUpperCase(); // "محمد" → "م" looks fine, but...
}

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}
```
**Why it's wrong:** Arabic uses combining marks (tashkeel) and ligatures. `charAt` and `slice` cut between code units, splitting graphemes — you can end a slice mid-letter or strip a tashkeel mark off its base letter. `toUpperCase` is a no-op on Arabic but signals the agent didn't think about scripts.

**Correct approach:** Use grapheme-aware APIs.
```js
function getInitial(name) {
  const segmenter = new Intl.Segmenter('ar', { granularity: 'grapheme' });
  return [...segmenter.segment(name)][0]?.segment ?? '';
}

function truncate(text, max) {
  const segmenter = new Intl.Segmenter('ar', { granularity: 'grapheme' });
  const graphemes = [...segmenter.segment(text)].map(s => s.segment);
  return graphemes.length > max ? graphemes.slice(0, max).join('') + '…' : text;
}
```

---

## Icons

### ❌ Anti-pattern: Applying `transform: scaleX(-1)` to a text container
**What agents do:**
```css
[dir="rtl"] .heading-with-arrow {
  transform: scaleX(-1); /* "flip the whole thing for RTL" */
}
```
**Why it's wrong:** `scaleX(-1)` mirrors *every* glyph inside the element, including the Arabic text. Letters render backward, unreadable. The technique is for **directional icons only** — never for elements containing text.

**Correct approach:** Flip only the icon. Use logical properties for layout.
```jsx
<h2 className="flex items-center gap-2">
  <span>المنتجات</span>
  <ChevronLeft className="rtl:rotate-180" />
</h2>
```

### ❌ Anti-pattern: Flipping every icon "to be safe"
**What agents do:**
```jsx
<div className="rtl:[&_svg]:-scale-x-100">
  <Heart />
  <Search />
  <Settings />
  <ChevronRight />
</div>
```
**Why it's wrong:** Neutral icons (heart, search, settings, user, home) carry no direction. Flipping them produces backward magnifying glass handles, mirrored gear teeth, and a search box where the lens sits on the wrong side. Only **directional** icons flip.

**Correct approach:** Classify each icon. Flip only directional ones.
```jsx
<Heart />                                {/* neutral — leave alone */}
<Search />                               {/* neutral — leave alone */}
<Settings />                             {/* neutral — leave alone */}
<ChevronRight className="rtl:rotate-180" /> {/* directional — flip */}
```

---

## Forms

### ❌ Anti-pattern: `text-align: left` on input fields
**What agents do:**
```css
input, textarea {
  text-align: left;
  padding-left: 12px;
}
```
**Why it's wrong:** Arabic users type from the right. Left-aligned text means the cursor starts at the wrong edge and the placeholder reads from the wrong corner — the input feels broken before they type a character.

**Correct approach:** Use `start` and logical padding.
```css
input, textarea {
  text-align: start;
  padding-inline-start: 12px;
}
```

### ❌ Anti-pattern: Number/phone inputs without an LTR island
**What agents do:**
```jsx
<label>رقم الجوال</label>
<input type="tel" placeholder="+966 50 000 0000" />
```
**Why it's wrong:** Phone numbers are LTR sequences. Inside an RTL document the `+` and country code render at the wrong end, the digits visually reorder around spaces, and copy-paste produces a mangled string. Same problem applies to IBANs, credit cards, and OTP codes.

**Correct approach:** Force the input itself LTR while keeping the label RTL.
```jsx
<label>رقم الجوال</label>
<input
  type="tel"
  dir="ltr"
  placeholder="+966 50 000 0000"
  style={{ textAlign: 'right' }} /* visually right-aligned in the RTL form */
/>
```

---

## Animations

### ❌ Anti-pattern: Hardcoded `translateX(-100%)` slide-in
**What agents do:**
```css
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}
.drawer { animation: slideIn 0.3s ease; }
```
**Why it's wrong:** In RTL the drawer should enter from the right (inline-start in RTL = right edge). The hardcoded `-100%` always slides from the left — so in Arabic the drawer appears to fly in from the wrong side, breaking the sense of "this panel lives off-screen on the start side."

**Correct approach:** Sign the offset against a direction variable.
```css
:root      { --rtl-flip: 1; }
[dir="rtl"] { --rtl-flip: -1; }

@keyframes slideIn {
  from { transform: translateX(calc(-100% * var(--rtl-flip))); }
  to   { transform: translateX(0); }
}
.drawer { animation: slideIn 0.3s ease; }
```

### ❌ Anti-pattern: Skeleton shimmer hardcoded left-to-right
**What agents do:**
```css
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
}
.skeleton { animation: shimmer 1.4s linear infinite; }
```
**Why it's wrong:** Shimmer mimics light sweeping across content. In LTR it sweeps left-to-right, matching reading direction. Hardcoded, it sweeps the same way in RTL — against reading direction — and feels jarring.

**Correct approach:** Reverse the animation in RTL.
```css
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
}
.skeleton { animation: shimmer 1.4s linear infinite; }
[dir="rtl"] .skeleton { animation-direction: reverse; }
```
