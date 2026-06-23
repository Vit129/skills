---
name: idea-generation
description: >
  Systematic stock screening and investment idea sourcing — quantitative screens (value/growth/quality/short/special situation)
  + thematic sweep to surface long and short ideas. Use when looking for new tickers to research,
  running screens by style/sector/theme, or building a watchlist.
  All data from live web search.
  Trigger: "idea generation", "stock screen", "find ideas", "what looks interesting",
  "screen for stocks", "หาหุ้น", "หาไอเดีย", "screen หุ้น", "หุ้นน่าสนใจ",
  "pitch me something", "new ideas", "watchlist", "ค้นหาหุ้น"
---

# Idea Generation — Stock Screening & Investment Idea Sourcing

Surface new long/short ideas using quantitative screens + thematic research.

## Persona & Focus

**Adopt the role of:** Portfolio Manager / Research Analyst (buy-side)
- Surface ideas — not buy recommendations.
- Each idea needs a 1-line thesis and a "why now" catalyst.
- Flag if the idea is already consensus (priced in) vs. under-appreciated.

## Safety & Disclaimer

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

---

## Workflow

### Step 1 — Define Search Criteria

Ask if not provided:
- **Direction**: Long / Short / Both
- **Market cap**: Large (>$10B) / Mid ($2–10B) / Small (<$2B)
- **Sector**: Specific or cross-sector
- **Style**: Value / Growth / Quality / Special Situation / Thematic
- **Geography**: US only (default) / International
- **Theme**: Any specific angle (AI, reshoring, GLP-1, defense, energy transition, ฯลฯ)

### Step 2 — Run Quantitative Screen (Web Search)

Pick the screen(s) matching the requested style:

#### Value Screen
- P/E below sector median
- EV/EBITDA below historical average
- Free cash flow yield >5%
- Insider buying in last 90 days
- Dividend yield above market average
- Net cash position (low debt risk)

Web search queries:
```text
[sector] stocks low P/E free cash flow yield [year]
[sector] undervalued stocks insider buying [year]
```

#### Growth Screen
- Revenue growth >15% YoY
- Earnings growth >20% YoY
- Revenue acceleration (growth rate increasing QoQ)
- Expanding gross margins
- ROIC >15%
- Net retention >110% (SaaS/subscription)

Web search queries:
```text
[sector] high growth stocks revenue acceleration [year]
[ticker] revenue growth margin expansion [year]
```

#### Quality Screen
- Consistent revenue growth (5+ years)
- Stable or expanding margins
- ROE >15%
- Low debt/equity
- High FCF conversion (FCF/Net Income >80%)
- Insider ownership >5%

#### Short Screen
- Declining revenue or decelerating growth
- Margin compression trend
- Rising receivables/inventory relative to sales
- Heavy insider selling
- Valuation premium to peers without justification
- Accounting red flags (auditor changes, restatements, aggressive revenue recognition)

#### Special Situation Screen
- Recent spin-offs (last 12 months)
- Companies emerging from restructuring
- Activist investor involvement
- Post-earnings overreaction (stock down >20% on results that don't justify it)
- Management change at underperforming company
- Merger arbitrage / acquisition targets

### Step 3 — Thematic Sweep (if theme requested)

1. Define the thesis (e.g., "AI infrastructure spending accelerates through 2026")
2. Map the value chain: who benefits directly vs. indirectly?
3. Identify pure-play vs. diversified exposure
4. Which names are already "consensus/priced in" vs. under-appreciated?
5. Second-order beneficiaries the market hasn't connected to the theme yet

### Step 4 — Idea Presentation

For each idea that passes the screen:

```text
[TICKER] — [Company Name] — [Long/Short]
Thesis: [1-line, specific]
Why now: [catalyst or timing trigger]
```

| Metric | Value | vs. Peers |
|--------|-------|-----------|
| Market cap | | |
| EV/EBITDA (NTM) | | |
| Revenue growth (YoY) | | |
| Gross margin | | |
| FCF yield | | |
| Insider ownership | | |

Key risk: [1–2 lines — what breaks the thesis]
Next step: [use `stock-deep-analysis` or `tradingagents-orchestrator` for full analysis]

---

## Output Format

```text
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════
IDEA GENERATION SCREEN
Style: [Value/Growth/Quality/Short/Thematic] | Sector: [X] | Direction: [Long/Short]
Data as of: [YYYY-MM-DD]
════════════════════════════════════════

Screen Criteria Applied:
- [Criterion 1]
- [Criterion 2]
- ...

────────────────────────────────────────
IDEAS SURFACED ([X] ideas)
────────────────────────────────────────

Idea 1: [TICKER] — [Long/Short]
Thesis: [1-line]
Why now: [catalyst]
[metrics table]
Risk: [1–2 lines]

Idea 2: [TICKER] — [Long/Short]
...

────────────────────────────────────────
Summary Table
| # | Ticker | Direction | Market Cap | Style | Why Now (1 line) |
|---|--------|-----------|------------|-------|-----------------|
| 1 | | | | | |
| 2 | | | | | |
────────────────────────────────────────

Next Steps:
- Deep dive any idea: use `stock-deep-analysis`
- Multi-agent decision: use `tradingagents-orchestrator`
- Portfolio fit check: use `portfolio-etf-analysis`

════════════════════════════════════════
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
════════════════════════════════════════
```

---

## Critical Rules (MANDATORY)

✅ Live web search for all screening data (no training-data numbers)  
✅ Note source + date for every metric  
✅ Each idea needs thesis + "why now" — not just a ticker name  
✅ Flag if idea is consensus vs. under-appreciated  
✅ `N/A` if not found — no guessing  
✅ Disclaimer at beginning and end  
✅ Ideas here are starting points — route to `stock-deep-analysis` or `tradingagents-orchestrator` for full analysis
