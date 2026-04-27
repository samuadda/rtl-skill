<div align="center">

<img src="assets/logo.svg" alt="rtl-skill" width="480"/>

<br/>

[![Stars](https://img.shields.io/github/stars/samuadda/rtl-skill?style=for-the-badge&color=252525&labelColor=151515)](https://github.com/samuadda/rtl-skill/stargazers)
[![License](https://img.shields.io/github/license/samuadda/rtl-skill?style=for-the-badge&color=252525&labelColor=151515)](https://github.com/samuadda/rtl-skill/blob/main/LICENSE)
[![NPM Install](https://img.shields.io/badge/install-npx%20skills%20add-3b82f6?style=for-the-badge&labelColor=151515)](https://npmjs.com/package/rtl-skill)

**The Elite Standard for RTL UI Architecture in AI Coding Agents**

[اقرأ بالعربية](README.ar.md)

</div>

<br/>

`rtl-skill` equips AI coding agents with deep, native understanding of Arabic and Right-to-Left (RTL) layout paradigms. It ensures flawless, automated execution of logical properties, typography, directional icons, and mirrored animations.

---

## Installation

### The Recommended Path

```bash
# Auto-detect and install for your active agent
npx skills add samuadda/rtl-skill

# Specific agent targeting
npx skills add samuadda/rtl-skill -a claude-code

# Global installation
npx skills add samuadda/rtl-skill -g
```

### Manual Integration

For bespoke environments or unlisted agents, clone directly to your agent's skill directory:

```bash
git clone --depth 1 https://github.com/samuadda/rtl-skill.git /tmp/rtl-skill

# Claude Code
cp -R /tmp/rtl-skill/skills/rtl ~/.claude/skills/

# Antigravity
cp -R /tmp/rtl-skill/skills/rtl ~/.gemini/antigravity/skills/
```

---

## Capabilities

The skill establishes a strict Start/End Axis mental model. It handles:

- **Logical CSS**: Enforcement of `inline-start/end` over legacy `left/right`.
- **Arabic Typography**: Optimized `line-height` and zero `letter-spacing` tailored for fonts like Cairo and Tajawal.
- **Directional Context**: Intelligent flipping of directional icons while preserving neutral ones.
- **Micro-interactions**: Mirrored slide directions, progress fills, and skeleton loaders.
- **RTL Forms & Tables**: Precise input alignment, form validation flows, and column ordering.
- **LTR Islands**: Flawless handling of numbers, URLs, and code blocks within Arabic text.

## Commands

| Command | Action |
|---------|--------|
| `/rtl-init` | Scaffolds a production-ready RTL foundation (fonts, resets, base config). |
| `/rtl-audit` | Analyzes the current codebase and generates `rtl-audit-report.md`. |
| `/rtl-convert <file>` | Refactors a specific component to adhere to RTL standards. |
| `/rtl-check` | Performs a rapid golden-path validation on the active component. |

*These commands also map seamlessly to natural language prompts (e.g., "Audit this project for RTL issues").*

---

## Enterprise-Grade Validation

`rtl-skill` is battle-tested against leading UI component libraries.

In our stress test against the `shadcn-ui` registry, the skill automatically identified and resolved **22 distinct RTL layout regressions** across 56 components, achieving a 100% pass rate on our 30-query trigger evaluation suite.

For detailed benchmarks, review the [Real-world Audit](tests/real-world-audit.md) and [Evaluation Results](evals/results.md).

---

## Exclusions

This architecture focuses exclusively on **Arabic UI and Layout**. It intentionally excludes:
- Non-Arabic RTL scripts (which require distinct typographical handling).
- Imperative Canvas/WebGL rendering.
- Complex Data Visualizations (D3, maps).
- Content Translation (this is a layout tool, not a localization API).

When encountering these domains, the agent is trained to escalate for human architectural decisions.

---

<div align="center">
  Released under the <a href="LICENSE">MIT License</a>.
</div>
