---
name: portfolio-analysis
description: >
  Portfolio review and optimization — analyze holdings allocation, concentration risk,
  sector exposure, correlation, and rebalancing recommendations.
  All data from live web search. Thai language output.
  Trigger: "วิเคราะห์ portfolio", "ดู port ของฉัน", "portfolio review", "rebalance portfolio",
  "portfolio allocation", "concentration risk", "sector exposure", "portfolio analysis",
  "ตรวจ port", "จัดสรรพอร์ต"
---

# Portfolio Analysis — Investment Review

Holistic portfolio review: allocation, concentration, correlation, and rebalancing.

## Persona & Focus

**Adopt the role of:** Portfolio Manager / Risk Analyst
- Portfolio-level analysis (not deep single-stock research).
- Focus on diversification, concentration risk, and sector balance.
- No guessing: ask for missing inputs or use `N/A`.

## Safety & Disclaimer

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

---

## Workflow

### Step 1 — Collect Portfolio Data
If not provided, ask for:
1. Holdings list (ticker + shares or % weight)
2. Total portfolio value (approx)
3. Investment goal: Growth / Income / Balanced / Capital Preservation
4. Time horizon: <1 yr / 1–3 yr / 3–5 yr / 5+ yr
5. Risk tolerance: Conservative / Moderate / Aggressive

### Step 2 — Gather Market Data (Web Search)
For each holding:
```text
[TICKER] current price market cap sector
[TICKER] beta volatility
[TICKER] dividend yield
```

### Step 3 — Generate Portfolio Report (8 Sections)

---

## Output Format — 8 Sections

```text
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════
PORTFOLIO ANALYSIS REPORT
Data as of: [YYYY-MM-DD]
════════════════════════════════════════

1) Portfolio Snapshot

| Ticker | Sector | Weight % | Value | Beta | Div Yield |
|--------|--------|----------|-------|------|-----------|
| ...    |        |          |       |      |           |

Total Value: $[X]
Number of Holdings: [X]
Weighted Avg Beta: [X]

2) Sector Allocation

- Technology: [X]%
- Healthcare: [X]%
- ...

Benchmark context (if using S&P 500 as reference):
- Technology: ~29% | Healthcare: ~13% | Financials: ~13% | ...

Over/Under vs benchmark (deviations >5%):
- ...

3) Concentration Risk

Top 5 holdings = [X]% of portfolio
Largest single holding = [X]% ([TICKER])

Checks:
- Single stock >20%: [Yes/No]
- Single sector >40%: [Yes/No]
- Top 5 >60%: [Yes/No]
- Geographic concentration: [US-only / mixed / global]

4) Risk Profile

Portfolio Beta: [X] (S&P 500 ~ 1.0)
- >1.2: higher volatility than market
- 0.8–1.2: market-like volatility
- <0.8: more defensive

Estimated max drawdown (historical / proxy): [-X]%
Estimated dividend income (annual): $[X] ([X]% yield)

5) Correlation (Qualitative)

High-correlation pairs (reduce diversification):
- [A] + [B]: ~[X]% correlated — [reason]

Low/negative correlation exposures (diversification benefit):
- [C] + [D]: ~[X]% correlated — [reason]

Overall diversification score: [Good / Moderate / Poor]
Why: [brief]

6) Performance Context

Major holdings context (from web search):
- [TICKER]: [1Y return]% | vs S&P 500: [+/-X]%

Portfolio estimated 1Y return (weighted): [X]%
S&P 500 1Y return: [X]%
Alpha (outperformance): [+/-X]%

7) Rebalancing Recommendations

Current vs Target (example):
| Sector | Current | Target | Action |
|--------|---------|--------|--------|
| Tech   | [X]%    | [X]%   | Trim/Add/Hold |
| ...    |         |        |              |

Specific actions:
1. [Trim/Add TICKER — reason + suggested new weight]
2. ...

8) Portfolio Health Summary

- Diversification adequate: [Yes/No]
- Risk matches stated goal: [Yes/No]
- Sector balance reasonable: [Yes/No]
- No single stock dominates: [Yes/No]
- Income generation matches goal (if relevant): [Yes/No]

Overall assessment: [Strong / Needs Attention / Requires Rebalancing]
Next review: [quarterly / after earnings season / after major market move]

════════════════════════════════════════
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
════════════════════════════════════════
```

---

## Critical Rules

✅ Data-driven (live web search for prices/sector/beta/yield)  
✅ Portfolio-level focus (use `stock-deep-analysis` for single-stock deep dive)  
✅ English output (except tickers, numbers, finance terms)  
✅ Disclaimer required at beginning and end  
✅ No per-stock buy/sell calls; recommend allocation/weights only  
✅ Orchestration option: for a multi-role workflow (debate + risk gate + evidence log), use `tradingagents-orchestrator`  
