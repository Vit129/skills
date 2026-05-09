# Finance Skills — Local Instructions

## Scope

- Does not override the global rules in `CLAUDE.md`

## Safety (Mandatory)

- Any investment-related analysis output must include the skill-specific disclaimer at both the beginning and the end.
- No guessing: if you cannot find a number/fact, write `N/A` and state the limitation.
- Use live web search for unstable facts (prices, latest filings, recent news/events), unless the user explicitly forbids browsing.

## Which Markdown To Use

Use the finance markdown files directly in chat. Do not rely on folder paths.
If multiple files are named `SKILL.md`, choose by the title shown in parentheses.
Before answering, state the exact markdown/skill name being used so the user can verify it was actually loaded.
Format: `Using: SKILL.md (Stock Deep Analysis)` or `Using: macro-context.md`.

- Portfolio / ETF: `SKILL.md` (Portfolio & ETF Analysis)
- Deep single-stock research: `SKILL.md` (Stock Deep Analysis)
- Macro overlay: `macro-context.md`
- Short interest / options: `short-interest.md`
- Peer comparison: `SKILL.md` (Stock Peer Comparison)
- Multi-agent decision workflow: `SKILL.md` (TradingAgents Orchestrator)

For deep single-stock research, start with `SKILL.md` (Stock Deep Analysis). That file already routes to `macro-context.md` and `short-interest.md` when those references are relevant.

If separate agent markdown files are also provided, use them only as optional evidence lanes when a report benefits from parallel evidence gathering.

## Recommended “Full Mode” Composition

Use this when the user wants the full picture:

1. Main report: `SKILL.md` (TradingAgents Orchestrator)
2. Appendices (only if requested / data is available)
- Appendix A: `SKILL.md` (Stock Deep Analysis)
- Appendix B: `SKILL.md` (Portfolio & ETF Analysis)
- Appendix C: `SKILL.md` (Stock Peer Comparison)

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
