# Gaps surfaced by real-world audit

Source: `tests/real-world-audit.md` against shadcn-ui/ui @ fd0e0c3.

## Gap 1 — Components whose public API takes `"left" | "right"` (CRITICAL — fixed in this phase)

**What the skill is missing.** Many libraries (shadcn `Sheet`, `Sidebar`, MUI `Drawer`, Radix `Tooltip`) expose `side="left"|"right"` as a prop. The skill's audit rules check the implementation but don't flag the API itself. An agent following the skill will convert the internals (`right-0` → `end-0`) but happily leave `side="right"` in a JSX call site, which still puts the panel on the visually wrong side in RTL.

**Fix (this phase):** Add a "Direction-as-API props" entry to `anti-patterns.md`. Tell agents to prefer `side="start" | "end"` and, when consuming a library that only offers physical names, document the mapping for the project (e.g. "in this app, `side='end'` is the trailing edge — `right` in LTR, `left` in RTL") and add a thin wrapper component.

## Gap 2 — Tailwind `rtl:**:[selector]:rotate-180` deep variant pattern (MEDIUM — defer)

**What the skill is missing.** When third-party components render their own DOM (react-day-picker, react-select), the agent cannot edit child markup directly. shadcn's `calendar.tsx:37-38` solves this with `rtl:**:[.rdp-button_next>svg]:rotate-180` — Tailwind's arbitrary deep-descendant variant. Our `frameworks/tailwind.md` does not show this pattern.

**Recommended fix (defer to a later iteration):** Add an "Advanced: deep variants for third-party DOM" section to `frameworks/tailwind.md` with one example.

## Gap 3 — Global `letter-spacing: 0` over-applies on Latin-only projects (CRITICAL — fixed in this phase)

**What the skill is missing.** `reference.md` Section 2 prescribes `* { letter-spacing: 0 }` as a global reset, then `anti-patterns.md` reinforces it. On a Latin-only or mixed-content project this strips designer-intended `tracking-*` from headings, navs, and buttons — a regression that will roll back through code review. The rule is correct *for Arabic-rendering elements*; the scoping was implicit.

**Fix (this phase):** Tighten the rule in `reference.md` to scope `letter-spacing: 0` to elements containing Arabic — `[lang="ar"]`, `html[lang^="ar"]`, or per-component. Anti-patterns entry already implies the scope ("on Arabic text") but the reference rule reads as universal.

## Gap 4 — `left-[50%]; translate-x-[-50%]` centering false-positive in audit (LOW — defer)

**What the skill is missing.** The `/rtl-audit` grep rule treats every `left-[` match as 🔴 Breaking. Symmetric centering with `translate-x-[-50%]` actually works in both directions and shouldn't be flagged at the same severity as `left-0` or `left-4`. This produces noise on real reports.

**Recommended fix (defer):** Add a "False positives" subsection to the `/rtl-audit` rules in `workflows.md` listing two safe patterns: symmetric centering (`left-[50%]; translate-x-[-50%]`) and block-axis offsets (`top-*`, `bottom-*` — block axis is unaffected by writing direction). Tell the agent to suppress these from the report.

## Gap 5 — Numeral-mixing rule generated zero signal on a real audit (LOW — defer)

**What the skill is missing.** The numeral-mixing anti-pattern fires only when the project contains Arabic content. On shadcn it's pure noise. The rule is still valuable for `/rtl-init` and `/rtl-convert`, but `/rtl-audit` should de-prioritize it when no Arabic strings are detected in the scanned files.

**Recommended fix (defer):** Add a "skip when no Arabic content present" guard to the numeral-mixing scan rule in `workflows.md`.
