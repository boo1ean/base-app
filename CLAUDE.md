@AGENTS.md

## Claude Code setup

- **Rules** — coding standards live in `.claude/rules/*.md`, auto-injected by the `paths` in each file's frontmatter (no `paths` = always loaded).
- **Skills** — on-demand workflows live in `.claude/skills/*/SKILL.md`. They load when a task matches: `scaffold-app`, `add-feature`, `add-ui-component`.
- **Platform** — the always-on `platform` rule applies: detect the current OS and use only its shell conventions (no Windows syntax on macOS/Linux, and vice-versa).
- **Keep docs in sync** — changing a rule or skill means updating `AGENTS.md` and `README.md` in the same change. See the `rule-maintenance` rule.
