---
description: Platform-specific commands — detect the current OS and use only its shell conventions
---

# Platform

Commands and setup steps must match the OS you are **currently** running on. Detect the current OS first (it is stated in your environment context), then use **only** that OS's conventions. Never mix — no PowerShell syntax on macOS/Linux, no `mkdir -p` or brace expansion on Windows.

## Identical on every OS — run verbatim

The toolchain is cross-platform. Use these the same way everywhere, and prefer them over raw shell:

- `pnpm` and every `package.json` script (`pnpm dev`, `pnpm test`, `pnpm db:migrate`, `pnpm ui:add`, …)
- `node`, `git`, `docker compose`, `turbo`, `drizzle-kit`, `eslint`, `vitest`
- Forward slashes (`/`) in paths — Node, pnpm, and git accept them on all platforms.

## Differs — raw shell file operations

Only low-level shell/file operations differ. Translate the ones the skills use:

| Task | macOS / Linux (bash, zsh) | Windows (PowerShell) |
|------|---------------------------|----------------------|
| Make a directory tree | `mkdir -p a/b/c` | `New-Item -ItemType Directory -Force a/b/c` |
| Make several dirs at once | `mkdir -p src/{a,b,c}` | `New-Item -ItemType Directory -Force src/a, src/b, src/c` |
| Copy a file | `cp src dst` | `Copy-Item src dst` |
| Move / rename | `mv src dst` | `Move-Item src dst` |
| Remove recursively | `rm -rf dir` | `Remove-Item -Recurse -Force dir` |
| Env var for one command | `VAR=value cmd` | `$env:VAR = 'value'; cmd` |

Brace expansion (`{a,b,c}`) and `mkdir -p` are POSIX-shell only — expand paths manually on Windows.

## Rules

- Emit commands for the current OS only. If another OS must be documented, put it under an explicit **On Windows:** / **On macOS/Linux:** heading — never two syntaxes in one code block.
- Ignore-file hygiene in `.gitignore` covers every contributor's OS (`.DS_Store` for macOS, `Thumbs.db` / `Desktop.ini` for Windows); keep both covered even on a single-OS machine.
