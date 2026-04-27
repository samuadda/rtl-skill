# Real-World Audit — shadcn/ui registry components

## Target

- **Project:** [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- **Branch / commit SHA:** `fd0e0c369bada16232dc44e22298ad69a9be234c`
- **Commit date:** 2026-04-27
- **Scope:** `apps/v4/registry/new-york-v4/ui/*.tsx` — the canonical component registry. 56 component files scanned.
- **Tools used:** ripgrep + manual read of the highest-impact components (dialog, sheet, dropdown-menu, sidebar, carousel, pagination, breadcrumb, calendar). Audited following `skills/rtl/workflows.md` `/rtl-audit` exactly as the agent would.

## Summary

| Severity | Count |
|----------|-------|
| 🛑 Breaking | 11 |
| 🔶 Degraded | 6 |
| 🔹 Cosmetic | 5 |
| **Total** | **22** |

42 of 56 component files contained at least one match for the breaking-pattern grep (`ml-/mr-/pl-/pr-/left-N/right-N/border-l/border-r/rounded-l/rounded-r/text-left/text-right`). Only `calendar.tsx` shows evidence of intentional RTL handling (uses `rtl:rotate-180` on the day-picker chevrons via Tailwind arbitrary deep variants).

## Selected findings

### 🛑 dialog.tsx:73 — Close button anchored to physical right
**Current:**
```tsx
className="absolute top-4 right-4 ..."
```
**Fix:**
```tsx
className="absolute top-4 end-4 ..."
```
**Why:** In RTL the close button should sit on the inline-end corner (visually left). `right-4` keeps it on the right in both directions, breaking convention.

### 🛑 sheet.tsx:65–67 — Side="right" / "left" pin physically
**Current:**
```tsx
side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right ..."
side === "left"  && "inset-y-0 left-0  h-full w-3/4 border-r data-[state=closed]:slide-out-to-left ..."
```
**Fix:** Two-step. First, treat the `side` prop as logical: `side="end"` and `side="start"`. Then use logical classes:
```tsx
side === "end"   && "inset-y-0 end-0   h-full w-3/4 border-s data-[state=closed]:slide-out-to-right ..."
side === "start" && "inset-y-0 start-0 h-full w-3/4 border-e data-[state=closed]:slide-out-to-left  ..."
```
**Why:** The API itself encodes physical direction. In an RTL app a `<Sheet side="right">` should slide in from the visual right, but `right-0` + `slide-in-from-right` already do the wrong thing relative to user intent. Slide-direction utilities also need `rtl:`-variant overrides since Tailwind v3.4 does not auto-flip `slide-in-from-*`.

### 🛑 carousel.tsx:190,220 — Prev/Next buttons hard-positioned
**Current:**
```tsx
orientation === "horizontal"
  ? "top-1/2 -left-12 -translate-y-1/2"   // Previous
  : ...
orientation === "horizontal"
  ? "top-1/2 -right-12 -translate-y-1/2"  // Next
  : ...
```
**Fix:**
```tsx
orientation === "horizontal"
  ? "top-1/2 -start-12 -translate-y-1/2"
  : ...
orientation === "horizontal"
  ? "top-1/2 -end-12 -translate-y-1/2"
  : ...
```
**Why:** In RTL the "previous slide" button should sit on the right edge and "next" on the left. Hardcoded `-left-12` / `-right-12` reverses the navigation affordance.

### 🛑 pagination.tsx:79,97 — Directional chevrons not flipped
**Current:**
```tsx
<ChevronLeftIcon />   {/* Previous */}
<ChevronRightIcon />  {/* Next */}
```
**Fix:**
```tsx
<ChevronLeftIcon  className="rtl:rotate-180" />
<ChevronRightIcon className="rtl:rotate-180" />
```
**Why:** "Previous page" in RTL means the page to the **right** of the current one. The chevron must rotate so the meaning ("go back") survives mirroring. This is one of the highest-visibility RTL bugs — every paginated list inherits it.

### 🛑 breadcrumb.tsx:78 — Default separator chevron not flipped
**Current:**
```tsx
{children ?? <ChevronRight />}
```
**Fix:**
```tsx
{children ?? <ChevronRight className="rtl:rotate-180" />}
```
**Why:** In RTL the breadcrumb chain reads right-to-left; the separator must point toward the next crumb (visually left). Without the rotation the chevron points back toward where the user came from.

### 🔶 dropdown-menu.tsx:95,101,131,136 — Check / radio indicator on physical left
**Current:**
```tsx
"... py-1.5 pr-2 pl-8 ..."
<span className="pointer-events-none absolute left-2 ...">
```
**Fix:**
```tsx
"... py-1.5 pe-2 ps-8 ..."
<span className="pointer-events-none absolute start-2 ...">
```
**Why:** Checkbox/radio indicator sits on the leading edge of the row. In RTL the leading edge is the right side — the current code anchors it to physical left, dropping it on the trailing edge.

### 🔶 sidebar.tsx:234–239 — `side="left"|"right"` API uses physical direction
**Current:**
```tsx
side === "left"
  ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
  : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
"... group-data-[side=left]:border-r group-data-[side=right]:border-l",
```
**Fix:** Either rename the prop to `side="start" | "end"` (preferred) or layer an RTL conversion: `side === "left"` → `start-*` when the document is RTL.
**Why:** Same pattern as sheet — the public API encodes physical direction, so RTL mirroring depends on what the consumer thinks "left" means. Document the chosen convention in the project's RTL notes; do not silently mirror.

### 🔹 alert.tsx:42 / command.tsx:166 / dropdown-menu.tsx:187 / menubar.tsx:205 — `tracking-tight`, `tracking-widest`
**Current:**
```tsx
className={cn("... font-medium tracking-tight", ...)}
```
**Fix (when the element may render Arabic):**
```tsx
className={cn("... font-medium", ...)}  // remove tracking — or scope to .latin-only
```
**Why:** Tailwind's `tracking-*` maps to `letter-spacing`. Any positive letter-spacing on Arabic text breaks letterform connections. Acceptable on Latin-only text; flag for review when the component is reused in Arabic copy.

## Coverage assessment

### What the skill caught
- ✓ All instances of physical margin/padding/border/positioning utilities — the `/rtl-audit` grep rules in `workflows.md` matched cleanly across 42 files.
- ✓ Directional-icon misuse in pagination and breadcrumb — the Section 3 "Pagination" and "Breadcrumbs" rules in `reference.md` named the exact pattern.
- ✓ Letter-spacing as a cosmetic risk — caught the `tracking-*` variants because the skill explicitly cross-walks `letter-spacing` to its Tailwind utility.
- ✓ Sheet side-prop slide animations — the Section 5 "Animations" rule about hardcoded slide directions applied directly.

### What the skill missed
- ✗ **Components whose public API takes `"left" | "right"` as a prop value.** Sheet and Sidebar both expose `side="left" | "right"`. The skill's audit rules find the *implementation* leaks (internal `right-0` / `left-0`) but never instructs the agent to flag the **API itself** as an RTL trap. A consumer passing `side="right"` in an RTL app will keep getting the visually wrong side even after every internal class is converted.
- ✗ **Tailwind arbitrary-deep variants like `rtl:**:[.rdp-button_next>svg]:rotate-180`.** Calendar uses this to flip nested chevrons inside react-day-picker without forking the library's DOM. The skill's `frameworks/tailwind.md` doesn't show this pattern, so an agent generating equivalent code would either fork the library or skip the flip.
- ✗ **`left-[50%]; translate-x-[-50%]` centering.** Section 3 "Modals" mentions this works in both directions but the audit grep flags it as 🛑 because it matches `left-[`. The skill needs a rule that says "physical-property centering is a false positive — leave it" or, better, prefer logical for clarity.

### Rules that didn't apply / felt over-specified
- **Global `letter-spacing: 0` rule.** Setting `* { letter-spacing: 0 }` in `reference.md` is correct for Arabic-rendering elements but wrong as a global reset on a Latin-only project — it removes designer-intended `tracking-*` from headings. The rule should specify scope: apply on the Arabic text root (`html[lang="ar"]`, `[lang="ar"]`, or component-level) rather than universal.
- **Numeral mixing rule.** Reads as a content-team concern, not something an agent can detect or fix in code. Leave it as guidance, but de-emphasize during `/rtl-audit` — it generated noise on shadcn (no Arabic content present).

### Tooling friction
- **Tailwind class noise.** The grep rule `ml-[0-9]|mr-[0-9]` matches inside arbitrary values (`-ml-4`, `sm:ml-0`, `peer-data-[variant=inset]:ml-2`). No false positives on shadcn but on a larger codebase the report would balloon. Recommend the skill add a "responsive prefix variants" note so the agent groups related matches.

## Followups

Gaps documented in `tests/gaps-found.md`. The most critical ones (side-prop API guidance, letter-spacing scope) are fixed in this same phase before the audit is declared complete.
