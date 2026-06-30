# Output Format Template

```
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════════════════
TRADINGAGENTS ORCHESTRATOR — [TICKERS]
Data as of: [YYYY-MM-DD]
════════════════════════════════════════════════════

Inputs received: [tickers | scope | portfolio context if any]
Assumptions: [state any missing inputs or defaults applied]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1) Analyst Team (3-line conclusions + evidence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- Fundamentals:
  Evidence:
  Open questions:
- Sentiment:
  Evidence:
  Open questions:
- News/Macro:
  Evidence:
  Open questions:
- Technicals:
  Evidence:
  Open questions:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2) Research Debate — Per Ticker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- Bull case (Top 3):
- Bear case (Top 3):
- Contested point:
- Research Manager verdict:
- Thesis-breaking assumptions:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3) Trader Proposal — Per Ticker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- Proposed action: [Buy/Hold/Sell/No-Trade]
- Entry logic:
- Horizon fit:
- Thesis break conditions:
- Confidence (pre-risk):
- Uncertainty drivers:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4) Risk Gate — Per Ticker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- Volatility:
- Concentration:
- Liquidity/event risk:
- Drawdown scenario:
- Risk verdict: [Pass/Fail]
- Risk controls (if Pass):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5) Portfolio Manager Final Decision — Per Ticker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- Final action: [Buy/Hold/Sell/No-Trade]
- Confidence (post-risk):
- Position sizing:
- Why (Top 3):
- Tradeoffs (Top 2):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6) Monitoring Plan — Per Ticker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- What to monitor:
- Re-evaluation triggers:
- Next review date:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7) Evidence Log (Top 8–15) — Per Ticker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- [Claim] — [Source] ([Date]) — [Why it matters]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8) Decision Log (Session)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [TICKER]
- Decision:
- Thesis (1 sentence):
- Top 3 risks:
- Re-evaluation triggers:
- Next review date:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9) Cross-Ticker Comparison (Batch mode only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Best risk-adjusted thesis:
- Highest conviction (post-risk):
- Strongest bear case:
- Recommended action ranking:

⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
```

## Appendices (use when applicable)

### Appendix A — Deep-Dive Data Table (Batch only)
Add when the user asks for raw numbers side-by-side. Include financial figures found via live web search; otherwise mark `N/A`.

### Appendix B — Portfolio Fit and ETF Lens
Follow `/skills/portfolio/SKILL.md`. Allocation/risk framing only; no per-stock buy/sell calls inside the appendix. ETF sections included automatically if ETF tickers are present.

### Appendix C — Peer Comparison
Follow `/skills/stock-peer-comparison/SKILL.md`.
