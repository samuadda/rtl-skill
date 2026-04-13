## What does this PR do?

<!-- One sentence summary -->

## Type of change

- [ ] Bug fix — incorrect rule or example
- [ ] New rule or pattern
- [ ] New framework support
- [ ] Test / ANSWER_KEY update
- [ ] Docs / README

## Checklist

**Sync rule** — `reference.md` and `workflows.md` must stay in sync:
- [ ] If I added/changed a rule in `reference.md`, I added the corresponding scan check in `workflows.md`
- [ ] If I added/changed a `workflows.md` command, the examples in `reference.md` still match

**Examples:**
- [ ] All CSS examples use logical properties (`inline-start/end`, not `left/right`)
- [ ] Every icon example states whether it is directional or neutral
- [ ] No pseudocode in framework files — examples are copy-pasteable

**Test:**
- [ ] If I changed issue counts in `BadComponent.jsx`, I updated `ANSWER_KEY.md`
- [ ] I ran `npm test` and the score is 22+ (or explained why it changed)

## Score before / after (if relevant)

<!-- paste the scoring block from npm test -->
```
🔴 Breaking:
🟡 Degraded:
🟢 Cosmetic:
Total:
```
