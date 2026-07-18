# PRODUCT.md / DESIGN.md Convention

Optional per-project docs, not mandatory for every repo (see Qualifying Projects). When present at project root, they are the canonical source for product scope and visual identity — read them before designing, don't re-derive from scratch or guess.

## What each file is

- **PRODUCT.md** — Product Context: vision, target users, core problems, core features, out of scope, success metrics. Answers "what are we building, for whom, why."
- **DESIGN.md** — Design Language: design direction, colors, typography, layout, components, avoid-list. Answers "what should it look/feel like."

## Qualifying projects

Worth having when a project: works with AI coding agents often, has multiple pages/features, needs consistent branding, has multiple contributors, or is developed long-term. Skip for single-purpose scripts, CLI tools, or config-only repos (e.g. backend-only, no UI) — `rules/coding.md`'s existing conventions already cover consistency there.

## How skills use these files

- `dev-architect` — Step 0 reads `PRODUCT.md` if present, checks new feature scope against it before Strategic Design.
- `ui-designer` — Phase 0 reads `DESIGN.md` if present as the existing design system (skip regenerating tokens); Context Gathering reads `PRODUCT.md` for target audience/use cases instead of asking when already documented.
- Any skill starting new-feature or UI work on a project root containing these files should read them first, the same way `graphify-out/GRAPH_SUMMARY.md` is read for code impact.

## Staying in sync

`hooks/design-doc-sync.py` is a PostToolUse (`Edit|Write`) hook: when a known design-token file (colors/theme/typography/tailwind-config/style.css/`KouenDesign.swift`/etc.) is edited in a project that has a `DESIGN.md`, it reminds the agent to update `DESIGN.md` in the same turn. It's a reminder, not a block — the agent still decides whether the edit actually changed anything DESIGN.md-relevant. Requires a `PostToolUse` entry for `python3 ~/.claude/hooks/design-doc-sync.py` (matcher `Edit|Write`) in `~/.claude/settings.json` — not auto-registered by this PR since that file is local/gitignored, add it manually once:

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    { "type": "command", "command": "python3 /Users/supavit.cho/.claude/hooks/design-doc-sync.py", "statusMessage": "checking design-doc sync" }
  ]
}
```
Append as one more entry inside the existing `hooks.PostToolUse` array.

## Authoring

Write from real repo facts (README, package.json/deps, existing color/font/component code, docs) — don't invent vision or tokens not evidenced in the repo. If a section would be pure invention, say so plainly and keep it thin rather than padding.

## Known instances

`My-Investment-Port`, `kouen-terminal`, `Accountant-Learning`, `QA-Automation-Coding-Course`, `Home-Assistant` (all under `~/Git/Personal/`) have both files as of 2026-07-18.
