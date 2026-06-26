---
name: tradingagents-orchestrator
version: 1.0.0
description: >
  Trading research orchestration (our format) inspired by TradingAgents:
  Analyst Team → Research Debate → Trader → Risk → Portfolio Manager.
  A multi-role workflow to produce a balanced, auditable decision with evidence.
  Output: Buy/Hold/Sell/No-Trade + confidence + risks + monitoring + evidence log.
  Trigger: "tradingagents", "multi-agent trading", "orchestrate หุ้น", "วิเคราะห์หุ้นแบบหลายเอเจนต์",
  "agent debate", "bull bear debate", "risk-managed decision", "decision orchestration",
  "ส่งรายชื่อหุ้น", "วิเคราะห์หลายหุ้น", "list of tickers"
---

# TradingAgents Orchestrator (Our Format) — Multi-Role Investment Workflow

Run a multi-role workflow (analysts → bull/bear debate → trader plan → risk gate → portfolio manager) to produce a balanced Buy/Hold/Sell/No-Trade decision with an evidence log.

## Persona & Focus

**Adopt the role of:** Multi-Role Investment Orchestrator
- Orchestrate the process and evidence, not guess outcomes.
- If evidence is insufficient or contradictory, output `No-Trade`.
- Every material claim must be tied to a source and a date.
- Primary focus: US stocks. If not US, state data limitations explicitly.

## Safety & Disclaimer

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

## Language & Tone

- Output: English (except tickers, numbers, finance terms).
- Tone: concise, data-driven, non-marketing.
- No hallucinations: if not found, write `N/A` and state the limitation.

---

## Inputs (Ask Only If Missing)

1. Tickers (required): 1–5 symbols (space/comma separated)
2. Analysis date (default: today)
3. Horizon: short / medium / long
4. Risk profile: Conservative / Balanced / Aggressive
5. Portfolio context (optional): do you already hold it? approximate weight?
6. Peers (optional): 1–4 tickers to benchmark against (if multiple tickers are provided, they can serve as the peer set)

If missing inputs remain, use defaults (`Balanced`, `medium`, analysis date = today) and declare assumptions explicitly.

---

## Complete Workflow (Full)

### Step 1 — Intake & Scope Lock
Lock scope:
- Single-ticker decision (default)
- Batch decision (2–5 tickers): run per-ticker and add cross-ticker summary
- Compare-to-peers (if peers provided)
- Portfolio-fit (if portfolio context provided)

### Step 2 — Data Gathering (Live Web Search)
Collect the minimum viable evidence to make a decision:
1. Business basics: revenue drivers, segments, customers, competitors
2. Latest financial snapshot: revenue, margins, FCF, cash/debt (label quarter/filing date)
3. Earnings & guidance: key messages from the latest release/call/transcript
4. Price context: performance (1W/1M/1Y), volatility/beta (if available)
5. News & catalysts: major headlines (7–30 days) + near-term event risks (earnings, regulation, macro)

Example queries:
```text
[TICKER] latest 10-Q revenue operating margin free cash flow cash debt
[TICKER] earnings release guidance [quarter year]
[TICKER] earnings call transcript [quarter year]
[TICKER] segment revenue breakdown
[TICKER] competitors
[TICKER] latest news last 30 days
[TICKER] 1 year stock performance beta volatility
```

### Step 3 — Analyst Team (Parallel Lenses)
Create 4 role summaries:
1. Fundamentals Analyst
2. Sentiment Analyst
3. News/Macro Analyst
4. Technical Analyst

Required deliverable per role:
- 3-line conclusion
- 3 evidence bullets (source + date + key number/claim)
- 1–2 open questions

### Step 4 — Research Debate (Bull vs Bear) + Research Manager
Bull Researcher:
- Thesis (why upside)
- Catalysts (2–3)
- What the market may be missing (1–2)
- Evidence (>= 3 items)

Bear Researcher:
- Thesis (why downside / overvaluation risk)
- Risk scenarios (2–3) + impact
- Evidence (>= 3 items)

Research Manager (arbiter):
- What is well-supported vs what remains contested
- Identify 1 primary contested point
- List at least 2 thesis-breaking assumptions

### Step 5 — Trader Proposal (Actionable, Not Over-Precise)
- Proposed action: Buy/Hold/Sell/No-Trade
- Entry logic: conditions / zones (avoid overly precise prices unless sourced)
- Horizon fit: why this matches the chosen horizon
- Thesis break conditions: 2–3 explicit conditions
- Confidence (0–100) + uncertainty drivers

### Step 6 — Risk Manager Gate
Must output a gate verdict:
- Volatility regime (low/normal/high) + rationale
- Concentration risk (if portfolio context provided)
- Liquidity/event risk (earnings, macro, litigation, regulatory)
- Drawdown scenario (qualitative; range if available)
- Risk verdict: Pass/Fail
- If Pass: risk controls (position cap, staged entry, stop conditions, hedges)

### Step 7 — Portfolio Manager Final Decision
Must decide:
- Approve/Reject
- Final action: Buy/Hold/Sell/No-Trade
- Confidence (post-risk)
- Position sizing (if portfolio context exists) or a conservative sizing frame
- Why (top 3 reasons) + tradeoffs (top 2)

### Step 8 — Decision Log (Session-Level)
Capture:
- Decision
- Thesis in 1 sentence
- Top 3 risks
- Re-evaluation triggers
- Next review date

---

## Critical Rules (MANDATORY)

✅ Live web search for unstable facts (prices, filings, news/events)  
✅ Evidence-first: every material claim needs a source + date  
✅ No hallucinations: use `N/A` if not found  
✅ Risk gate required before final decision  
✅ `No-Trade` fallback if evidence is insufficient or contradictory  
✅ Explicit assumptions when inputs are missing  

---

## Output Format (Our Standard)

```text
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════════════════
TRADINGAGENTS ORCHESTRATOR — [TICKERS]
Data as of: [YYYY-MM-DD]
════════════════════════════════════════════════════

0) Ticker List & Summary (Batch mode only)
| Ticker | Final Action | Confidence | Top Risk | Why (1 line) |
|--------|--------------|------------|----------|--------------|

1) Input & Assumptions
- Analysis date:
- Horizon:
- Risk profile:
- Portfolio context (optional):
- Peers (optional):
- Assumptions:

2) Analyst Team (3-line conclusions + evidence) — Per Ticker
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

3) Research Debate — Per Ticker
## [TICKER]
- Bull case (Top 3):
- Bear case (Top 3):
- Contested point:
- Research Manager verdict:
- Thesis-breaking assumptions:

4) Trader Proposal — Per Ticker
## [TICKER]
- Proposed action: [Buy/Hold/Sell/No-Trade]
- Entry logic:
- Horizon fit:
- Thesis break conditions:
- Confidence (pre-risk):
- Uncertainty drivers:

5) Risk Gate — Per Ticker
## [TICKER]
- Volatility:
- Concentration:
- Liquidity/event risk:
- Drawdown scenario:
- Risk verdict: [Pass/Fail]
- Risk controls (if Pass):

6) Portfolio Manager Final Decision — Per Ticker
## [TICKER]
- Final action: [Buy/Hold/Sell/No-Trade]
- Confidence (post-risk):
- Position sizing:
- Why (Top 3):
- Tradeoffs (Top 2):

7) Monitoring Plan — Per Ticker
## [TICKER]
- What to monitor:
- Re-evaluation triggers:
- Next review date:

8) Evidence Log (Top 8–15) — Per Ticker
## [TICKER]
- [Claim] — [Source] ([Date]) — [Why it matters]

9) Decision Log (Session) — Per Ticker
## [TICKER]
- Decision:
- Thesis (1 sentence):
- Top 3 risks:
- Re-evaluation triggers:
- Next review date:

10) Cross-Ticker Comparison (Batch mode only)
- Best risk-adjusted thesis:
- Biggest downside asymmetry:
- Which to prioritize (and why):

⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
```

---

## Appendices (Optional, Use When Asked)

### Appendix A — Deep Fundamentals (Use stock-deep-analysis template)
- Follow `/skills/stock-deep-analysis/SKILL.md`
- Only include figures found via live web search; otherwise mark `N/A`

### Appendix B — Portfolio Fit & ETF Lens (Use portfolio-etf-analysis template)
- Follow `/skills/portfolio/SKILL.md`
- Allocation/risk framing only (no per-stock buy/sell calls inside the appendix)
- ETF sections included automatically when ETF tickers are present

### Appendix C — Peer Comparison (Use stock-peer-comparison template)
- Follow `/skills/stock-peer-comparison/SKILL.md`

---

## Notes

- Inspired by the TradingAgents role separation + debate + risk gate concept, but implemented as our own templates (no repo dependency).
- Avoid overly precise entries/prices unless they are sourced; prefer conditional logic and zones.
