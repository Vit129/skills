# Finance Mock Orchestration Prompts

These prompts are intentionally simple and practical. They are meant to help you test selective research delegation without over-engineering the workflow.

## 1. Full-Mode Batch Stocks

Use case:
- 2–5 tickers
- Medium or long answer
- Final synthesis owned by the main orchestrator

```text
Main agent: tradingagents-orchestrator

Task:
- Evaluate NVDA, MSFT, and AMD.
- Horizon: medium
- Risk profile: balanced
- Produce a final batch summary plus per-ticker decision blocks.

Spawn only these lanes:
- fundamental-researcher for each ticker
- news-sentiment-researcher for each ticker

Optional:
- portfolio-fit-researcher only if holdings are provided
- etf-lens-researcher only if an ETF comparison becomes useful

Final output must include:
- Batch summary table
- Per-ticker analyst synthesis
- Risk gate
- Cross-ticker comparison
- Monitoring plan

Subagent rules:
- Evidence only
- Source/date on major claims
- Mark missing items as N/A
- No subagent makes the final Buy/Hold/Sell/No-Trade call
```

## 2. Single Stock + Portfolio Fit

Use case:
- One ticker
- The user already has portfolio context

```text
Main agent: tradingagents-orchestrator

Task:
- Evaluate whether NVDA still fits this portfolio:
  NVDA 15%, MSFT 10%, VOO 40%, CASH 35%
- Horizon: medium
- Risk profile: balanced

Spawn:
- fundamental-researcher for NVDA
- news-sentiment-researcher for NVDA
- portfolio-fit-researcher for the provided portfolio

Final output must include:
- Final action
- Confidence
- Concentration and overlap risks
- What would change the decision
```

## 3. Stock Thesis vs ETF Alternative

Use case:
- The user is not sure whether to own a stock directly or use ETF exposure

```text
Main agent: tradingagents-orchestrator

Task:
- Compare NVDA direct exposure with QQQ as a broader alternative.
- Horizon: medium
- Risk profile: balanced

Spawn:
- fundamental-researcher for NVDA
- news-sentiment-researcher for NVDA
- etf-lens-researcher for QQQ

Final output must include:
- Direct stock thesis vs ETF lens
- Risk asymmetry
- Diversification tradeoff
- Final recommendation format: Buy/Hold/Sell/No-Trade
```

## 4. Minimal Dry-Run Prompt

Use case:
- You want to test whether the lane split is worth it before running a heavier workflow

```text
Use the fundamental-researcher and news-sentiment-researcher lanes for NVDA only.
Return compact evidence blocks first.
Do not produce the final decision until both blocks are complete.
```
