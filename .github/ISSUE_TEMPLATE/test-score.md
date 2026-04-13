---
name: Test score regression
about: The skill's score on BadComponent.jsx dropped or a rule is no longer being caught
labels: bug, test
---

**What score did you get?**
(run `ANTHROPIC_API_KEY=sk-... npm test` and paste the scoring block)

```
🔴 Breaking:  X  (expected ~16)
🟡 Degraded:  X  (expected ~5)
🟢 Cosmetic:  X  (expected ~3)
Total:        X/24
```

**Which model were you using?**
(default is `claude-haiku-4-5` — try `AUDIT_MODEL=claude-sonnet-4-6` and report if score improves)

**Which issues were missed?**
Reference the issue numbers from `test/ANSWER_KEY.md`:

**Which rule file do you think needs strengthening?**
- [ ] `SKILL.md`
- [ ] `reference.md`
- [ ] `workflows.md`
- [ ] `frameworks/tailwind.md`
- [ ] `frameworks/css.md`
- [ ] `frameworks/css-in-js.md`
- [ ] `frameworks/react-native.md`
- [ ] Not sure
