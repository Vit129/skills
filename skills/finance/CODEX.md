# Finance Skills (Codex) — Working Notes

This file helps Codex work consistently inside `skills/finance/` (creating/updating skills, adding cross-references, and keeping outputs aligned).

## Principles

- Make surgical edits only.
- Preserve each `SKILL.md` format (frontmatter + sections).
- When adding a new skill, include triggers and a ready-to-use output template.

## Safety Defaults

- Do not output unstable facts (prices, latest filings, recent news) without a live source.
- If a value cannot be found, use `N/A` and state the limitation.
- Outputs must include the disclaimer (beginning and end) as specified by the skill.

## Skill Routing (Quick Map)

- ETF: `skills/finance/etf/SKILL.md`
- Portfolio: `skills/finance/portfolio/SKILL.md`
- Research:
  - Deep single stock: `skills/finance/research/stock-deep-analysis/SKILL.md`
  - Peer compare (HTML): `skills/finance/research/stock-peer-comparison/SKILL.md`
  - Multi-agent decision: `skills/finance/research/tradingagents-orchestrator/SKILL.md`

## “Full Mode” Composition

When the user wants the full picture:
- Main = orchestrator
- Appendices = deep / portfolio / peer / etf as appropriate
- Add backwards cross-references in related skills for discoverability when introducing new skills

For selective research delegation and subagent lane design, see `skills/finance/subagent-patterns.md`.
For copy-ready orchestration examples, see `skills/finance/mock-orchestration-prompts.md`.

## Input Patterns To Support

- Batch tickers (space/comma separated)
- `MAIN` / `PEERS`
- `HOLDINGS` weights
