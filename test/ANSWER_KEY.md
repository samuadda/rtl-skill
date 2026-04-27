# RTL Skill Test — Answer Key

Use this to grade the agent's output after running `/rtl-audit` and `/rtl-convert` on `BadComponent.jsx`.

---

## Expected /rtl-audit output

### Summary
- 🛑 Breaking: 16 issues
- 🔶 Degraded: 5 issues
- 🔹 Cosmetic: 3 issues

---

### 🛑 Breaking issues (agent must catch ALL of these)

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| 1 | Root `<div>` | No `dir="rtl"` on root | Add `dir="rtl"` |
| 2 | Root `<div>` | `fontFamily: Arial` — poor Arabic rendering | Use Cairo or Tajawal |
| 3 | `<nav>` | `flexDirection: row` no RTL handling | Add `flexDirection: 'row-reverse'` or use logical |
| 4 | Breadcrumbs | `marginLeft: 0` | `marginInlineStart: 0` |
| 5 | `<ChevronRight>` x3 | Directional icon — not flipped | Add `className="rtl:rotate-180"` or `scaleX(-1)` |
| 6 | `<aside>` | `borderRight` | `borderInlineEnd` |
| 7 | `<aside>` | `left: 0` | `insetInlineStart: 0` |
| 8 | `<main>` | `marginLeft: 260` | `marginInlineStart: 260` |
| 9 | Stat cards | `textAlign: 'left'` | `textAlign: 'start'` |
| 10 | Product card | `flexDirection: row` no RTL | Handle RTL direction |
| 11 | Product image | `float: 'left'` | `float: 'inline-start'` |
| 12 | Product title | `textAlign: 'right'` | `textAlign: 'end'` |
| 13 | Product description | `textAlign: 'right'` | `textAlign: 'end'` |
| 14 | CTA button | `paddingLeft: 12` | `paddingInlineStart: 12` |
| 15 | `<Send>` icon | Directional icon — not flipped | Flip with `scaleX(-1)` in RTL |
| 16 | Phone, email, URL | Not wrapped in LTR island | Wrap with `<span dir="ltr">` |

---

### 🔶 Degraded issues

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| 17 | Nav | No RTL consideration for flex row | Handle row direction |
| 18 | Pagination `ArrowLeft` "previous" | Wrong direction in RTL | In RTL, "previous" should point RIGHT — needs `scaleX(-1)` |
| 19 | Pagination `ArrowLeft` "next" | Hardcoded `rotate(180deg)` — breaks in RTL | Use RTL-aware flip instead |
| 20 | Progress bar | Fills from left always | Ensure `insetInlineStart` based fill |
| 21 | Sidebar flex | `flexDirection: row` in main container | Needs RTL mirror |

---

### 🔹 Cosmetic issues

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| 22 | Sidebar items | `letterSpacing: '0.5px'` on Arabic | Set to `0` |
| 23 | Sidebar items | `lineHeight: 1.2` on Arabic | Minimum `1.6`, prefer `1.7` |
| 24 | Stat card numbers | Number values not explicitly wrapped as LTR | Wrap `24,500` etc. in `<span dir="ltr">` |

---

## Icons — grading the classification

The agent must correctly classify every icon:

| Icon | Type | Should flip? | Correct answer |
|------|------|-------------|----------------|
| `<ChevronRight>` in breadcrumbs | Directional | ✓ Yes | Rotate 180 in RTL |
| `<ChevronRight>` in sidebar | Directional | ✓ Yes | Rotate 180 in RTL |
| `<Send>` | Directional | ✓ Yes | `scaleX(-1)` in RTL |
| `<ArrowLeft>` "السابق" | Directional | ✓ Yes | In RTL should point right (scaleX(-1)) |
| `<ArrowLeft>` "التالي" | Directional | ✓ Yes | Remove hardcoded rotation, use RTL-aware |
| `<Heart>` | Neutral | ✗ No | Leave unchanged |
| `<Star>` | Neutral | ✗ No | Leave unchanged |
| `<Search>` | Neutral | ✗ No | Leave unchanged |
| `<Bell>` | Neutral | ✗ No | Leave unchanged |
| `<Settings>` | Neutral | ✗ No | Leave unchanged |

**Perfect score: 5 directional flipped, 5 neutral untouched.**

---

## Scoring

| Score | Verdict |
|-------|---------|
| 22–24 issues caught + icons correct | ✓ Skill working great |
| 16–21 issues caught | 🔶 Good — review which rules are vague |
| < 16 issues caught | 🛑 Skill needs refinement |
| Any neutral icon flipped | 🛑 Icon classification rule needs work |
| Phone/email/URL NOT wrapped | 🛑 LTR island rule needs reinforcing |
