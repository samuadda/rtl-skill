# rtl-skill evals

Manual eval harness for the rtl-skill trigger logic. No API key, no subagent access required — you grade the model's reasoning yourself.

## What's here

- `queries.json` — 28 hand-built queries, 15 should-trigger and 13 should-not-trigger. Each entry has `query`, `should_trigger`, and `reason`.
- `results.md` — last run's pass rate, failures, and any description tweaks made between iterations.

## How to run

The eval measures one thing: **given the `description` field in `skills/rtl/SKILL.md`, would the agent invoke the skill on each query?**

For each entry in `queries.json`, paste this prompt into a fresh Claude conversation (web, Claude Code, or any harness that loads skills via frontmatter):

```
Here is the description field from a skill called "rtl":

> RTL (right-to-left) layout skill for Arabic UI. Use when building, auditing, or converting interfaces that need Arabic/RTL support. Handles layout mirroring, CSS logical properties, Arabic typography, directional components, animations, and forms. Triggers on /rtl-init, /rtl-audit, /rtl-convert, /rtl-check, or any mention of Arabic UI, RTL layout, or bidirectional text.

User query: "<paste query here>"

Would you invoke the rtl skill for this query? Answer with exactly "YES" or "NO" followed by one sentence of reasoning.
```

Record the answer next to the entry's `should_trigger`:
- `should_trigger: true` + model says YES → **pass**
- `should_trigger: false` + model says NO → **pass**
- Mismatch → **fail** (record the model's reasoning so the description can be tuned)

## Pass-rate target

90%+ across all 28 queries. Below that, edit the `description` in `skills/rtl/SKILL.md` frontmatter and re-run. Common levers:

- **False negatives on indirect mentions** (e.g. "Saudi users") → add the implied-locale mapping to the description.
- **False positives on translation requests** ("translate to Arabic") → tighten the description to specify *UI* work, not content translation.
- **False negatives on Hebrew/Persian/Urdu** → broaden from "Arabic UI" to "Arabic, Hebrew, Persian, or other RTL UI."

## Logging iterations

Append every iteration to `results.md` with: date, description before/after, pass rate before/after, queries that flipped. Keeps the tuning history audit-able.
