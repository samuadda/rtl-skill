# Sample `/rtl-audit` Output — Real Project

This is the actual report produced when the rtl-skill is run against a real, public, English-first React template. Kept as a reference for what `/rtl-audit` looks like when pointed at a clean codebase: short, no false positives, only the issues that actually exist.

To reproduce: clone [shadcn-ui/next-template](https://github.com/shadcn-ui/next-template), open it in Claude Code with the rtl-skill loaded, and run `/rtl-audit .`.

---

Generated: 2026-04-25
Path audited: shadcn-ui/next-template (cloned, depth 1)
Files scanned: app/layout.tsx, app/page.tsx, components/site-header.tsx, components/main-nav.tsx, components/theme-toggle.tsx, components/icons.tsx, components/ui/button.tsx (319 LOC total)

## Summary
- 🛑 Breaking: 5 issues
- 🔶 Degraded: 1 issue
- 🔹 Cosmetic: 3 issues
- **Total: 9 issues**

Note: this is an English-first template. Findings are what would break if it were converted to Arabic.

---

## 🛑 Breaking

### app/layout.tsx:35 — `<html lang="en">` missing `dir`
**Current:** `<html lang="en" suppressHydrationWarning>`
**Fix (Arabic-only):** `<html lang="ar" dir="rtl" suppressHydrationWarning>`
**Fix (i18n):** `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`
Without `dir`, every flex direction, text alignment, and logical property below silently behaves as LTR.

### components/site-header.tsx:12 — `space-x-4` (physical margin-left)
**Current:** `flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0`
**Fix:** Replace `space-x-*` with `gap-*` (or add `rtl:space-x-reverse`).
Tailwind's `space-x-*` injects `margin-left` on every child but the first — physical, breaks under RTL because spacing accumulates on the wrong side.

### components/site-header.tsx:15 — `space-x-1` on inner nav
**Current:** `<nav className="flex items-center space-x-1">`
**Fix:** `gap-1` (or `space-x-1 rtl:space-x-reverse`).

### components/main-nav.tsx:16 — `space-x-2` between logo + brand
**Current:** `<Link href="/" className="flex items-center space-x-2">`
**Fix:** `gap-2`.

### app/layout.tsx — No Arabic font loaded for RTL conversion
**Current:** `fontSans` only (Inter via @/lib/fonts).
**Fix:** Add a parallel `fontArabic` (Cairo / Tajawal / IBM Plex Arabic) and apply it on the `<html lang="ar">` branch. Inter does not support Arabic glyphs and falls back to system fonts — inconsistent rendering across OSes.

---

## 🔶 Degraded

### components/site-header.tsx:14 — `justify-end` semantics under RTL
**Current:** `<div className="flex flex-1 items-center justify-end space-x-4">`
**Fix:** Designer intent: nav cluster sits at end-of-line. `justify-end` resolves to physical right under LTR and physical left under RTL when flex-direction stays `row`. If intent is "always at end of line in writing direction," that is correct. If intent is "always physical right," needs explicit handling. Document the intent.

---

## 🔹 Cosmetic

### app/page.tsx:10 — `tracking-tighter` on `<h1>`
**Current:** `text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl`
**Fix (if Arabic content):** Remove `tracking-tighter` — letter-spacing on Arabic breaks ligatures.

### app/page.tsx:10 — `leading-tight` on `<h1>`
**Current:** `leading-tight` (≈ 1.25)
**Fix (if Arabic content):** Use `leading-relaxed` or higher (≥ 1.6). Arabic descenders need vertical room.

### app/layout.tsx — No global `letter-spacing: 0` / `line-height: 1.7` for Arabic body
**Fix:** Add Arabic-aware base styles in globals.css scoped to `[lang="ar"]` or `[dir="rtl"]`.

---

## Icon classification

| Icon | File | Type | Action |
|------|------|------|--------|
| `Icons.logo` | main-nav.tsx | Brand mark | Neutral — never flip |
| `Icons.gitHub` | site-header.tsx | Brand mark | Neutral — never flip |
| `Icons.twitter` | site-header.tsx | Brand mark | Neutral — never flip |
| `Sun` | theme-toggle.tsx | Symbolic | Neutral — never flip |
| `Moon` | theme-toggle.tsx | Symbolic | Neutral — never flip |

**5 icons total, 0 directional, 5 neutral.** No flips needed. Project has no arrows / chevrons / send / next / prev icons in the audited surface.

---

## Verdict

The template is **mostly RTL-clean** — no physical `margin-*`, `padding-*`, `border-*`, `text-align`, or `float` anywhere. Cleanest issues are the four `space-x-*` instances (Tailwind antipattern that the skill correctly flags via [skills/rtl/frameworks/tailwind.md](skills/rtl/frameworks/tailwind.md)) and the missing `dir` attribute.

Real-world signal: the skill caught the *only* category of issue this codebase actually has, did not invent issues, and correctly classified all 5 brand/symbolic icons as neutral. If `space-x-*` had not been in the framework rules, this audit would have returned a near-empty report — exactly what we want from a real-project run.
