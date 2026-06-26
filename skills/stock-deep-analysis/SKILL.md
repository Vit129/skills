---
name: stock-deep-analysis
version: 1.0.0
description: >
  Deep dive US stock in 20 dimensions: Business, Financials, Competitive Advantage, Risks, Management, Valuation,
  Performance, Insider Trading, Comparable Companies, Earnings, and an Action Plan.
  Data-driven, 20-section output.
  Trigger: "วิเคราะห์หุ้น [TICKER]", "deep dive [TICKER]", "ข้อมูลหุ้น", "พื้นฐาน",
  "analyze stock [TICKER]", "stock analysis", "fundamental analysis", "deep dive stock",
  "investment analysis", "stock deep dive", "research stock"
---

# Stock Deep Analysis — Investment Specialist (20 Sections)

A comprehensive, evidence-based deep dive for a single US stock (fundamentals first).

## Persona & Focus

**Adopt the role of:** Investment Specialist (US Equities)
- Data-driven, analytical, based on the latest available facts.
- Primary sources preferred: 10-K/10-Q, earnings releases, transcripts, investor presentations.
- No hallucinations: if unclear or not found, say so and use `N/A`.

## Safety & Disclaimer

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

## Language & Tone

- Output: English (except tickers, numbers, finance terms).
- Tone: clear, investor-friendly, no marketing speak.
- Briefly define complex terms in parentheses where helpful.

---

## Complete Workflow

### Step 1 — Receive Ticker
If missing, ask which ticker to analyze.

### Step 2 — Gather Data (Web Search)

Financial & valuation:
1. Latest 10-K / 10-Q (or equivalent filings)
2. Earnings releases + transcripts (last 3–5 quarters)
3. Guidance and KPIs (if disclosed)
4. Valuation multiples (P/E, PEG, P/S, EV/EBITDA)
5. Fair value references (DCF models / third-party estimates, if available)

Business & competition:
6. Revenue breakdown and segment drivers
7. Customer base and concentration risk
8. Competitive landscape and moats
9. Industry trends + macro overlay (use `macro-context.md` when needed)

Performance & sentiment:
10. Historical returns vs S&P 500 (1Y/3Y/5Y)
11. Volatility / beta (if available)
12. Latest news (5–7 headlines) + sentiment
13. Insider transactions and ownership
14. Short interest / options flow (optional; use `short-interest.md`)

Earnings quality:
15. Earnings surprise history (last ~8 quarters, if available)
16. Revenue surprises and guidance accuracy
17. Dividends (if any) and payout sustainability

### Step 3 — Generate Report (20 Sections)
Use the output template below and do not skip sections. If a data point cannot be found, mark it `N/A`.

---

## Critical Rules (MANDATORY)

✅ Evidence-based — every key figure must cite source + date (e.g., "Q3 2024 10-Q filed Nov 8, 2024")  
✅ Beat/miss quantified — "beat by $120M or 3%" not just "beat"  
✅ Variance table in Section 19 — actual vs consensus vs prior estimate  
✅ No hallucinations (`N/A` if not found)  
✅ Disclaimer required at beginning and end  
✅ English output (except tickers/numbers/finance terms)  
✅ Keep all 20 sections present  

**Citation Enforcement Checklist (run before delivering):**
- [ ] Section 4 figures cite filing name + date
- [ ] Section 13 headlines cite source + date
- [ ] Section 19 beat/miss data cites consensus source + date
- [ ] Section 17 insider data cites SEC filing or source + date
- [ ] No training-data numbers used for unstable facts (prices, recent filings)  

---

## Output Format — 20 Sections (Template)

```text
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════════════════
STOCK DEEP ANALYSIS — [TICKER] | [Company Name]
Data as of: [YYYY-MM-DD]
════════════════════════════════════════════════════

1) Business Overview
- What does the company sell? How does it make money?
- Core products/services:
- Segment revenue breakdown (if available):
- Primary growth driver:

2) Customer Base
- Customer types (B2B/B2C/Gov):
- Customer concentration risk:
- Switching costs:
- Why customers stay vs competitors:

3) Revenue Model & Revenue Quality
- Recurring vs one-off:
- Predictability:
- Growth drivers (volume vs price vs mix):
- Any red flags (one-time boosts, channel stuffing, etc.):

4) Latest Financial Snapshot
Revenue:              $[X]B | [X]% YoY
Net Income:           $[X]B | [X]% YoY
Gross Margin:         [X]%
Operating Margin:     [X]%
Free Cash Flow (FCF): $[X]B | FCF Margin: [X]%
Cash:                 $[X]B
Debt:                 $[X]B
Net Cash/(Debt):      $[X]B

Source: [filing / quarter] ([date])
Interpretation: [2–4 sentences]

5) Basic Health Check
- Revenue growth quality: [Good/Caution/Poor] — why
- Profitability trend: [Good/Caution/Poor] — why
- FCF conversion: [Good/Caution/Poor] — why
- Balance sheet risk: [Low/Medium/High] — why
- Capital intensity: [Low/Medium/High] — why

6) Competitive Advantage (Moat)

Moat Rating Table:
| Moat Type | Rating | Evidence |
|-----------|--------|---------|
| Network effects | Strong / Moderate / Weak / None | [what drives it] |
| Switching costs | Strong / Moderate / Weak / None | [integration depth, contracts] |
| Scale economies | Strong / Moderate / Weak / None | [unit cost advantage] |
| Intangible assets | Strong / Moderate / Weak / None | [brand, data, patents, licenses] |

- Overall moat verdict: Wide / Narrow / None
- Durable advantages (hard to replicate): [list with evidence]
- Structural vulnerabilities (hard to fix): [list]
- Key competitors: [names + brief positioning]
- Competitive position summary: [2–3 lines]

7) Optionality & Future Growth
- Growth opportunities (near/mid/long):
- Upside not priced in (if any):
- Reality check (what must go right):

8) Key Risks
- Major risk #1 (impact + probability):
- Major risk #2:
- Risk often missed by beginners:

9) Management & Narrative
- CEO/CFO background:
- Execution track record:
- Earnings call themes (recent):
- Narrative vs numbers: aligned? why/why not
- Capital allocation: buybacks/dividends/R&D/M&A — assessment

10) Summary for Beginners
- 1-sentence elevator pitch:
- Top 3 strengths:
- Top 3 risks:
- Who this is (not) for:

11) Simple Scoring (1–10)
- Business quality:
- Financial quality:
- Moat strength:
- Management:
- Valuation:
- Overall:

12) Final Verdict (Pre-Risk)
- Provisional stance: Buy / Hold / Avoid (or No-Trade)
- Core thesis:
- What would change the thesis:

13) Latest News & Potential Impact (last ~7–30 days)
- Top headlines (5–7):
- Sentiment summary:
- Impact on thesis:

14) Investment Signal & Action Plan
- If Buy: entry logic + time horizon
- If Hold: what to watch
- If Avoid: conditions to revisit

15) Valuation Analysis
- Trailing P/E / Forward P/E / P/S / EV/EBITDA (as available)
- Peer/sector comparison:
- Growth vs multiple (sanity check):
- If available: DCF / fair value references (cite)

16) Historical Performance vs Market
- 1Y / 3Y / 5Y returns vs S&P 500:
- Volatility/beta:
- Drawdown behavior:

17) Insider Trading / Ownership / Short Interest (if available)
- Insider buys/sells (3–6 months):
- Insider ownership (if available):
- Short interest % / days to cover (if available):
- Options sentiment (optional):

18) Comparable Companies
- 3–6 closest peers:
- How [TICKER] compares on growth/margins/valuation:

19) Earnings Surprise History (if available)
- Last ~8 quarters: beat/miss pattern
- Guidance accuracy:
- Any seasonality / one-offs:

20) Final Checklist & Next Steps
- Checklist (facts verified?):
- Key documents to read next:
- Next review date:
- Orchestration option: for multi-role debate + risk gate, use `SKILL.md` (TradingAgents Orchestrator)

════════════════════════════════════════════════════
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
════════════════════════════════════════════════════
```

---

## Reference Loading Guide

- Macro overlay: `macro-context.md` (use in Risks and Valuation)
- Short interest / options: `short-interest.md` (use in Section 17 when relevant)
