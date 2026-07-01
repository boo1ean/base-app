---
description: Keep AI docs in sync when rules or skills change
paths:
  - ".claude/rules/*.md"
  - ".claude/skills/**/SKILL.md"
  - "AGENTS.md"
  - "CLAUDE.md"
  - "README.md"
---

# Rule Maintenance

When you add, remove, rename, or change the scope of any rule (`.claude/rules/*.md`) or skill (`.claude/skills/**/SKILL.md`), update the documentation in the same change:

1. **Update `AGENTS.md`** — its Rules and Skills tables must match the actual files (name, trigger/paths, purpose).
2. **Update `README.md`** — its stack, layout, core approaches, and rule/skill tables must stay accurate when the toolset, structure, or rule set changes.
3. **Check cross-references** — if a rule or skill links to another (e.g. `eslint`, `testing`, `platform`), fix or remove stale links.
4. **Keep frontmatter accurate** — `description` and `paths` must reflect what the file actually covers.

A change to the rule set is not complete until `AGENTS.md` and `README.md` reflect it.
