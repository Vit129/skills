# Finance Skills (Claude) — Local Instructions

This file is the folder-level guidance for `skills/finance/` so the finance skills stay consistent.

## Scope

- Applies to everything under `skills/finance/`
- Does not override the global rules in `/Users/supavit.cho/.claude/CLAUDE.md`

## Safety (Mandatory)

- Any investment-related analysis output must include the skill-specific disclaimer at both the beginning and the end.
- No guessing: if you cannot find a number/fact, write `N/A` and state the limitation.
- Use live web search for unstable facts (prices, latest filings, recent news/events), unless the user explicitly forbids browsing.

## Which Skill To Use

- `portfolio-etf-analysis`: portfolio-level risk/allocation/rebalancing + ETF comparison (holdings/sector/cost/tracking, ETF vs stocks)
- `stock-deep-analysis`: deep single-stock fundamental template (20 sections)
- `stock-peer-comparison`: 2–5 stock peer comparison as an HTML report
- `tradingagents-orchestrator`: multi-role decision workflow (debate + risk gate + evidence log) producing Buy/Hold/Sell/No-Trade

## Recommended “Full Mode” Composition

Use this when the user wants the full picture:

1. Main report: `tradingagents-orchestrator`
2. Appendices (only if requested / data is available)
- Appendix A: `stock-deep-analysis`
- Appendix B: `portfolio-etf-analysis` (portfolio fit + ETF lens when relevant)
- Appendix C: `stock-peer-comparison`

For selective research delegation patterns, see `skills/finance/subagent-patterns.md`.
For copy-ready orchestration examples, see `skills/finance/orchestration-prompts.md`.

## Input Conventions

- Batch tickers: `NVDA MSFT AMD` or `NVDA,MSFT,AMD`
- Main + peers:
  - `MAIN: NVDA`
  - `PEERS: AMD AVGO`
- Portfolio context:
  - `HOLDINGS: NVDA 15%, MSFT 10%, VOO 40%, CASH 35%`

## Output Conventions

- Use `YYYY-MM-DD` dates (e.g., `2026-05-03`).
- For batch tickers, include a cross-ticker summary table at the top and a cross-ticker comparison section at the end (per orchestrator template).
