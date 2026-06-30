# Workflow: 8-Step Orchestration

## Step 1 — Intake and Scope Lock

Lock scope before analysis:
- Single-ticker decision (default)
- Batch decision (2–5 tickers): run per-ticker then add cross-ticker summary
- Compare-to-peers (if peers provided)
- Portfolio-fit (if portfolio context provided)

## Step 2 — Data Gathering (Live Web Search)

Minimum viable evidence:
1. Business basics: revenue drivers, segments, customers, competitors
2. Latest financial snapshot: revenue, margins, FCF, cash/debt (label quarter/filing date)
3. Earnings and guidance: key messages from latest release/call/transcript
4. Price context: performance (1W/1M/1Y), volatility/beta (if available)
5. News and catalysts: major headlines (7–30 days) + near-term event risks

Example queries:
```
[TICKER] latest 10-Q revenue operating margin free cash flow cash debt
[TICKER] earnings release guidance [quarter year]
[TICKER] earnings call transcript [quarter year]
[TICKER] segment revenue breakdown
[TICKER] competitors
[TICKER] latest news last 30 days
[TICKER] 1 year stock performance beta volatility
```

## Step 3 — Analyst Team (Parallel Lenses)

Create 4 role summaries:
1. Fundamentals Analyst
2. Sentiment Analyst
3. News/Macro Analyst
4. Technical Analyst

Required per role: 3-line conclusion + 3 evidence bullets (source + date + key number/claim) + 1–2 open questions

## Step 4 — Research Debate (Bull vs Bear) + Research Manager

Bull Researcher: thesis (why upside) + catalysts (2–3) + what market may be missing + evidence (≥3 items)
Bear Researcher: thesis (why downside) + thesis-breaking conditions + evidence (≥3 items) + asymmetric risk
Research Manager: verdict — which side is stronger and why, with contested assumptions

## Step 5 — Trader Proposal

- Proposed action: Buy/Hold/Sell/No-Trade
- Entry logic: conditions / zones (avoid overly precise prices unless sourced)
- Horizon fit: why this horizon matches
- Thesis break conditions (2–3 explicit conditions)
- Confidence (0–100) + uncertainty drivers

## Step 6 — Risk Manager Gate

Must output gate verdict:
- Volatility regime (low/normal/high) + rationale
- Concentration risk (if portfolio context provided)
- Liquidity/event risk (earnings, macro, litigation, regulatory)
- Drawdown scenario (qualitative; range if available)
- Risk verdict: Pass/Fail
- If Pass: risk controls (position cap, staged entry, stop conditions, hedges)

## Step 7 — Portfolio Manager Final Decision

Must decide:
- Approve/Reject
- Final action: Buy/Hold/Sell/No-Trade
- Confidence (post-risk)
- Position sizing (if portfolio context exists) — conservative sizing frame
- Why (top 3 reasons) + tradeoffs (top 2)

## Step 8 — Decision Log (Session-Level)

Capture: decision, thesis in 1 sentence, top 3 risks, re-evaluation triggers, next review date
