---
name: earnings-preview
description: >
  Pre-earnings analysis — build a one-page setup before a company reports.
  Covers consensus estimates, key metrics to watch (sector-specific), bull/base/bear scenarios
  with stock reaction implications, catalyst checklist, and options-implied move.
  All data from live web search.
  Trigger: "earnings preview", "pre-earnings", "earnings setup", "what to watch [TICKER]",
  "before earnings [TICKER]", "preview Q[X] [TICKER]", "ก่อน earnings", "เตรียมก่อน earnings"
---

# Earnings Preview — Pre-Earnings Setup

One-page setup before a company reports: estimates, scenarios, catalysts, trading setup.

## Persona & Focus

**Adopt the role of:** Buy-side Research Associate
- Focus on what will MOVE the stock, not general company info.
- Every scenario needs an operational driver — not just "beats/misses."
- Options-implied move tells you what the market is already pricing in.

## Safety & Disclaimer

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

---

## Workflow

### Step 1 — Gather Context (Web Search)

```text
[TICKER] earnings date Q[X] [year]
[TICKER] consensus estimates revenue EPS [quarter year]
[TICKER] prior quarter earnings call guidance
[TICKER] options implied move earnings
[TICKER] earnings reaction history
```

Collect:
- Earnings date + time (pre-market / after-hours)
- Consensus: Revenue, EPS, key segment metrics
- Prior quarter guidance (quantitative targets management gave)
- Options-implied move % (1-day expected move priced into options)
- Historical earnings reactions (last 4–6 quarters: beat → +X%, miss → -X%)

### Step 2 — Key Metrics Framework

**Financial Metrics (always include):**
- Revenue vs. consensus (total + by segment if disclosed)
- EPS vs. consensus
- Gross margin / Operating margin — expanding or contracting?
- Free cash flow
- Forward guidance vs. current consensus

**Operational Metrics (sector-specific — pick relevant ones):**

| Sector | Key Metrics |
|--------|-------------|
| Tech/SaaS | ARR, net retention (NRR), RPO, customer count, cloud rev % |
| Semiconductor | Data center rev, AI/HPC rev, inventory correction status |
| E-commerce/Retail | GMV, take rate, same-store sales, ad revenue |
| Consumer | Same-store sales, traffic, basket size, inventory levels |
| Financials | NIM, credit quality, loan growth, fee income |
| Healthcare | Scripts, patient volumes, pipeline/trial updates |
| Industrials | Backlog, book-to-bill, price vs. volume mix |

### Step 3 — Scenario Analysis

Build 3 scenarios — each needs an operational driver, not just a number.

| Scenario | Revenue | EPS | Key Driver | Stock Reaction |
|----------|---------|-----|------------|----------------|
| Bull | | | | |
| Base | | | | |
| Bear | | | | |

For each scenario, answer:
- What would need to happen operationally?
- What management commentary would signal this?
- Historical analog — did the stock react similarly before?

### Step 4 — Catalyst Checklist

Identify 3–5 things that will determine the stock's reaction (ranked by importance):

1. [Metric] vs. [consensus/whisper] — why it matters
2. [Guidance item] — what buy-side expects to hear
3. [Narrative shift] — strategic change, M&A, new product, regulation

### Step 5 — Trading Setup

- Recent stock performance (1W / 1M vs S&P 500)
- Options-implied move: ±[X]% — compare to your bull/base/bear scenarios
- Key resistance/support levels (if available from web search)
- Is the implied move wide or tight vs. historical earnings moves?

---

## Output Format

```text
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.

════════════════════════════════════════
EARNINGS PREVIEW — [TICKER] | [Company Name]
Quarter: [Q_] FY[_] | Earnings Date: [YYYY-MM-DD] [pre-market/after-hours]
Data as of: [YYYY-MM-DD]
════════════════════════════════════════

1) Consensus Estimates
| Metric | Consensus | Prior Quarter Actual | YoY Change |
|--------|-----------|----------------------|------------|
| Revenue | $[X]B | $[X]B | [X]% |
| EPS | $[X] | $[X] | [X]% |
| [Key metric] | | | |

Source: [source + date]

2) Key Metrics to Watch (ranked)
1. [Metric] — [threshold] — [why it moves the stock]
2. [Metric] — ...
3. Forward guidance — [what the market needs to hear]

3) Scenario Analysis
| Scenario | Revenue | EPS | Key Driver | Stock Reaction |
|----------|---------|-----|------------|----------------|
| Bull (30%) | | | | |
| Base (50%) | | | | |
| Bear (20%) | | | | |

Bull: [What must happen operationally]
Base: [Current trend continues]
Bear: [What breaks the thesis]

4) Catalyst Checklist
☐ [Catalyst 1] — [why it matters]
☐ [Catalyst 2]
☐ [Catalyst 3]
☐ Forward guidance [above/in-line/below] consensus

5) Trading Setup
- Stock vs S&P 500: 1W [X]% | 1M [X]%
- Options-implied move: ±[X]%
- Historical earnings moves: [data from last 4–6 quarters]
- Implied move vs. history: [wide/tight/in-line]
- Key level to watch: [price level if available]

════════════════════════════════════════
⚠️ Disclaimer: The information provided is for informational purposes only and is NOT financial advice.
════════════════════════════════════════
```

---

## Critical Rules (MANDATORY)

✅ Live web search for consensus, dates, implied move (never use training data for numbers)  
✅ Note the source + date of consensus estimates — they change daily  
✅ Scenarios need operational drivers, not just "beat/miss"  
✅ Options-implied move must be compared to your scenarios  
✅ Disclaimer at beginning and end  
✅ `N/A` if data not found — no guessing  
✅ For post-earnings follow-up: use `stock-deep-analysis` (Section 19 — Earnings Surprise History)  
✅ For full investment decision: use `tradingagents-orchestrator`
