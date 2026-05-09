---
name: portfolio-etf-analysis
description: >
  Portfolio review, ETF analysis, and optimization — analyze holdings allocation,
  concentration risk, sector exposure, correlation, rebalancing recommendations,
  ETF comparison (holdings/cost/tracking/overlap), and ETF vs stock fit.
  All data from live web search.
  Trigger: "วิเคราะห์ portfolio", "ดู port ของฉัน", "portfolio review", "rebalance portfolio",
  "portfolio allocation", "concentration risk", "sector exposure", "portfolio analysis",
  "ตรวจ port", "จัดสรรพอร์ต", "วิเคราะห์ ETF", "เปรียบเทียบ ETF", "ETF analysis",
  "ETF comparison", "expense ratio", "holdings overlap", "sector ETF", "index fund",
  "กองทุน ETF", "ดู ETF", "ETF vs stock", "passive investing", "VOO", "QQQ", "SPY", "VTI"
---

# Portfolio & ETF Analysis — Investment Review

Holistic portfolio review + ETF analysis in one skill.
Use for portfolio-level work (allocation, risk, rebalancing) and/or ETF comparison (holdings, cost, tracking, overlap).

## Persona & Focus

**Adopt the role of:** Portfolio Manager / ETF Specialist
- Portfolio-level analysis (not deep single-stock research).
- Focus on diversification, concentration risk, sector balance, and cost efficiency.
- Compare ETF vs ETF and ETF vs individual stocks when relevant.
- No guessing: ask for missing inputs or use `N/A`.

## Safety & Disclaimer

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

---

## Mode Detection

Detect which mode to use based on input:

| Input | Mode | Sections |
|-------|------|----------|
| Holdings list (stocks + weights) | **Portfolio mode** | Sections 1–8 |
| ETF tickers only (no portfolio context) | **ETF mode** | Sections 9–15 |
| Holdings list that includes ETFs | **Combined mode** | Sections 1–15 |

When in doubt, ask: "Do you want a portfolio review, an ETF comparison, or both?"

---

## Workflow

### Step 1 — Collect Input

**For Portfolio mode / Combined mode**, ask if not provided:
1. Holdings list (ticker + shares or % weight)
2. Total portfolio value (approx)
3. Investment goal: Growth / Income / Balanced / Capital Preservation
4. Time horizon: <1 yr / 1–3 yr / 3–5 yr / 5+ yr
5. Risk tolerance: Conservative / Moderate / Aggressive

**For ETF mode**, ask if not provided:
- ETF tickers to analyze (e.g., VOO, QQQ, SPY)

### Step 2 — Gather Market Data (Web Search)

For stocks:
```text
[TICKER] current price market cap sector
[TICKER] beta volatility
[TICKER] dividend yield
```

For ETFs:
```text
[TICKER] ETF expense ratio holdings AUM
[TICKER] ETF top holdings sector allocation
[TICKER] ETF performance 1Y 3Y 5Y vs benchmark
[TICKER] ETF tracking error dividend yield
[TICKER] ETF vs [TICKER2] comparison
```

### Step 3 — Generate Report

Use the sections relevant to the detected mode.

---

## Output Format — Portfolio Sections (1–8)

```text
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════
PORTFOLIO & ETF ANALYSIS REPORT
Data as of: [YYYY-MM-DD]
════════════════════════════════════════

1) Portfolio Snapshot

| Ticker | Type | Sector | Weight % | Value | Beta | Div Yield |
|--------|------|--------|----------|-------|------|-----------|
| ...    | Stock/ETF |   |          |       |      |           |

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
```

---

## Output Format — ETF Sections (9–15)

Include these when ETF tickers are present in the input.

```text
9) ETF Snapshot

| Metric | [ETF A] | [ETF B] |
|--------|---------|---------|
| Full Name | | |
| Index Tracked | | |
| AUM | $[X]B | $[X]B |
| Expense Ratio | [X]% | [X]% |
| Dividend Yield | [X]% | [X]% |
| # Holdings | [X] | [X] |
| Inception Date | | |

10) ETF Performance vs Benchmark

| Period | [ETF A] | [ETF B] | Benchmark |
|--------|---------|---------|-----------|
| 1Y | [X]% | [X]% | [X]% |
| 3Y CAGR | [X]% | [X]% | [X]% |
| 5Y CAGR | [X]% | [X]% | [X]% |
| Max Drawdown | [-X]% | [-X]% | |

Tracking Error: [X]% (lower is better; closer index tracking)

11) ETF Top Holdings & Sector Allocation

[ETF A] — Top 10 Holdings
1. [Stock]: [X]%
2. ...

Sector Allocation
| Sector | [ETF A] | [ETF B] |
|--------|---------|---------|
| Technology | [X]% | [X]% |
| ... | | |

12) Holdings Overlap (if 2+ ETFs)

Overlap: [X]% of holdings overlap
- High overlap (>60%): limited diversification benefit by holding both
- Low overlap (<30%): potentially complementary exposures

13) Cost Analysis

Annual cost for $10,000 invested:
- [ETF A]: $[X]/year ([X]% × $10,000)
- [ETF B]: $[X]/year

14) ETF vs Individual Stocks (Fit)

Use ETFs when:
- You want diversification immediately
- You do not want to research single stocks deeply
- You prefer low-cost passive exposure
- You want sector exposure without stock-picking risk

Use individual stocks when:
- You have a specific company thesis and accept concentration risk
- You want a focused bet (not diluted exposure)
- The ETF holds positions you do not want

15) ETF Summary & Recommendation

Best for: [investor profile / goal]
Verdict: [ETF A vs ETF B — which fits which goal]
Key watch-outs: [1–3 risks/caveats]

════════════════════════════════════════
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
════════════════════════════════════════
```

---

## Critical Rules

✅ Data-driven (live web search for prices/sector/beta/yield/expense ratios)
✅ Portfolio-level focus (use `stock-deep-analysis` for single-stock deep dive)
✅ English output (except tickers, numbers, finance terms)
✅ Disclaimer required at beginning and end
✅ No per-stock buy/sell calls; recommend allocation/weights only
✅ No guessing; use `N/A` if not found
✅ Orchestration option: for a multi-role workflow (debate + risk gate + evidence log), use `tradingagents-orchestrator`
