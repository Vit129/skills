---
name: portfolio
version: 1.0.0
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

Wrap the report with the disclaimer (see Safety & Disclaimer) at start and end, and a header block (`PORTFOLIO & ETF ANALYSIS REPORT`, `Data as of: [YYYY-MM-DD]`). Sections, in order:

1. **Portfolio Snapshot** — table of Ticker/Type/Sector/Weight %/Value/Beta/Div Yield; plus Total Value, # Holdings, Weighted Avg Beta.
2. **Sector Allocation** — % by sector; benchmark context (S&P 500 weights) and deviations >5%.
3. **Concentration Risk** — top 5 holdings %, largest single holding %; checks for single stock >20%, single sector >40%, top 5 >60%, geographic concentration.
4. **Risk Profile** — portfolio beta vs S&P 500 (~1.0), reading it (>1.2 higher vol / 0.8–1.2 market-like / <0.8 defensive); estimated max drawdown; estimated annual dividend income.
5. **Correlation (Qualitative)** — high-correlation pairs (reduce diversification) and low/negative-correlation exposures (diversification benefit); overall diversification score (Good/Moderate/Poor) + why.
6. **Performance Context** — major holdings' 1Y return vs S&P 500; portfolio weighted 1Y return, S&P 500 1Y return, alpha.
7. **Rebalancing Recommendations** — current vs target sector table with Trim/Add/Hold actions; specific per-ticker actions with reasons.
8. **Portfolio Health Summary** — Yes/No checks (diversification adequate, risk matches goal, sector balance reasonable, no single stock dominates, income matches goal); overall assessment (Strong/Needs Attention/Requires Rebalancing); next review timing.

---

## Output Format — ETF Sections (9–15)

Include these when ETF tickers are present in the input. Close with the disclaimer.

9. **ETF Snapshot** — table per ETF: Full Name, Index Tracked, AUM, Expense Ratio, Dividend Yield, # Holdings, Inception Date.
10. **ETF Performance vs Benchmark** — 1Y/3Y CAGR/5Y CAGR/Max Drawdown per ETF vs benchmark; tracking error (lower = closer index tracking).
11. **ETF Top Holdings & Sector Allocation** — top 10 holdings per ETF; sector allocation table per ETF.
12. **Holdings Overlap** (if 2+ ETFs) — overlap %; >60% = limited added diversification, <30% = complementary.
13. **Cost Analysis** — annual cost per ETF for a $10,000 investment (expense ratio × amount).
14. **ETF vs Individual Stocks (Fit)** — when to prefer ETFs (immediate diversification, no single-stock research, low-cost passive, sector exposure without stock-picking) vs individual stocks (specific company thesis, focused bet, avoiding unwanted ETF positions).
15. **ETF Summary & Recommendation** — best-fit investor profile, verdict (which ETF fits which goal), 1–3 key watch-outs.

---

## Critical Rules

✅ Data-driven (live web search for prices/sector/beta/yield/expense ratios)
✅ Portfolio-level focus (use `stock-deep-analysis` for single-stock deep dive)
✅ English output (except tickers, numbers, finance terms)
✅ Disclaimer required at beginning and end
✅ No per-stock buy/sell calls; recommend allocation/weights only
✅ No guessing; use `N/A` if not found
✅ Orchestration option: for a multi-role workflow (debate + risk gate + evidence log), use `tradingagents-orchestrator`
