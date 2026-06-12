---
name: terminal-cheatsheet
description: >
  Quick-reference cheat sheets for Linux power-user commands and Vi/Vim
  commands, plus an fzf-searchable script. Trigger: "cheat sheet",
  "linux commands", "vi commands", "vim cheat", "terminal shortcuts"
version: 1.0.0
last_improved: 2026-06-12
improvement_count: 0
---

# Terminal Cheat Sheet

Reference material for Linux shell power-user commands and Vi/Vim
commands/motions, covering navigation, search, text processing, tmux,
git basics, and vi modes/motions/macros.

## Files

- `references/linux.txt` — Linux/shell commands, tab-separated `command<TAB>description`, grouped by section (`# Section` comment headers)
- `references/vi.txt` — Vi/Vim commands and motions, same format
- `scripts/cheat.sh` — searchable viewer for both files

## Usage

```bash
# Interactive fuzzy search (requires fzf) across both cheat sheets
scripts/cheat.sh

# Restrict to one topic
scripts/cheat.sh linux
scripts/cheat.sh vi

# Print the full cheat sheet without fzf
scripts/cheat.sh --dump
scripts/cheat.sh vi --dump
```

If `fzf` is not installed, `cheat.sh` falls back to printing the full
table.

## When to use this skill

When the user asks for a Linux command reference, a Vi/Vim command
reference, or "what's the shortcut for X" — answer directly from
`references/linux.txt` / `references/vi.txt` rather than guessing, and
mention `scripts/cheat.sh` as a standalone tool they can run themselves.
