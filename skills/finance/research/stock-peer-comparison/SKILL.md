---
name: stock-peer-comparison
description: >
  Rigorous peer-comparison report — 2–5 US stock tickers side-by-side in polished HTML.
  Revenue/Net Income/EPS trends (5Q), valuation (P/E), dividend snapshot, guidance summary.
  All financial figures from live web search — zero training data, N/A if not found.
  Dark theme + Chart.js visualization. Thai/English mixed language.
  Trigger: "เปรียบเทียบหุ้น [TICKER1] [TICKER2]...", "peer comparison", "comparative analysis",
  "compare stocks [TICKER1] vs [TICKER2]", "stock peer comparison"
---

# Stock Peer Comparison Report — HTML Artifact

สร้างรายงานเปรียบเทียบหุ้นแบบ side-by-side ด้วย live web search + HTML visualization

## Persona & Focus

**Adopt the role of:** Senior Equity Analyst
- ข้อมูล data-driven, ตัวเลขจาก live web search เท่านั้น (ไม่ใช้ training data)
- เปรียบเทียบข้ามหุ้น ไม่ repetitive per-stock sections
- ทำความเข้าใจ pattern divergences ระหว่างหุ้น

## Safety & Disclaimer

**MUST state in HTML:**
```html
<footer>
  ข้อมูล ณ วันที่ [date] | จัดทำโดย AI Analysis | ข้อมูลอ้างอิงจาก public sources
  ⚠️ This report is for informational purposes only, not financial advice.
</footer>
```

---

## Language & Tone

- **Output:** Mixed Thai + English (technical terms: EPS, P/E, Guidance, Revenue, YoY, QoQ, MD&A)
- **Tone:** Professional, investor-friendly, no marketing speak
- **Style:** "NVDA มี EPS growth แบบ accelerating ในช่วง 3 ไตรมาสที่ผ่านมา ขณะที่ MSFT มีแนวโน้ม stable"

---

## Complete Workflow

### Step 1 — Receive Tickers
- ถ้าไม่ได้ระบุ → ถาม "ต้องการเปรียบเทียบหุ้นตัวไหนบ้าง? (2–5 tickers)"
- Validate: ต้องเป็น US tickers (NASDAQ / NYSE)

### Step 2 — Data Gathering (Per Stock, Web Search)

#### 2a. Qualitative (News, MD&A, Guidance)
**Search queries:**
```
[TICKER] latest earnings results [year]
[TICKER] management guidance outlook [year]
[TICKER] MD&A management discussion
[TICKER] recent news [month/year]
```

**Extract:**
- Key themes from latest earnings call
- Forward guidance (quantitative targets if disclosed)
- Risks / headwinds
- Strategic initiatives / M&A / product news
- Analyst sentiment

#### 2b. Revenue & Net Income (5 Quarters)
**Search:**
```
[TICKER] quarterly revenue net income [year]
[TICKER] income statement quarterly
```

**Collect per quarter:**
- Revenue (absolute value)
- Revenue YoY %
- Revenue QoQ %
- Net Income (absolute value)
- Net Income YoY %
- Net Income QoQ %
- Label fiscal quarters clearly (Q1 FY2025, etc.)

#### 2c. EPS (5 Quarters)
**Search:**
```
[TICKER] EPS earnings per share quarterly
[TICKER] diluted EPS quarterly history [year]
```

**Collect per quarter:**
- Reported EPS
- Consensus EPS (if available)
- Beat/miss label
- YoY growth %
- QoQ growth %

**Calculate (for analysis only, not shown):**
- QoQ % array → linear slope (trend direction) + std dev (volatility)
- Momentum label: accelerating / decelerating / stable
- Consistency label: steadily improving / flat / deteriorating / volatile

#### 2d. Valuation
**Search:**
```
[TICKER] P/E ratio trailing forward
[sector] median P/E [year]
```

**Collect:**
- Trailing P/E (TTM)
- Forward P/E (NTM consensus)
- Sector median (label "approx." if uncertain)
- Premium/discount vs peers and sector

#### 2e. Dividend
**Search:**
```
[TICKER] dividend history yield payout ratio
[TICKER] dividend per share DPS [year]
```

**Collect:**
- DPS (most recent)
- Current yield
- Historical yield (4–8 quarters)
- Payout ratio
- Payment consistency (cuts/increases)
- Avg yield over period
- **If none:** Note "ไม่จ่ายเงินปันผล"

### Step 3 — Build HTML Artifact

**Structure:**

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Peer Comparison Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    [design system styles — see below]
  </style>
</head>
<body>
  <!-- Header -->
  <!-- Section 1: Snapshot Table -->
  <!-- Section 2: Revenue & Net Income Charts -->
  <!-- Section 3: EPS Deep Dive -->
  <!-- Section 4: Valuation Comparison -->
  <!-- Section 5: Dividend Snapshot -->
  <!-- Section 6: News, MD&A & Guidance Summary -->
  <!-- Section 7: Peer Comparison Summary (Thai prose) -->
  <!-- Footer -->
  <script>
    [Chart.js initialization]
  </script>
</body>
</html>
```

---

## HTML Section Details

### Header
```html
<header>
  <h1>📊 Stock Peer Comparison Report</h1>
  <p>เปรียบเทียบหุ้น: [TICKER1], [TICKER2], ... | ณ วันที่ [date]</p>
</header>
```

### Section 1: Snapshot Table
```
Columns: Name | Sector | Market Cap | Latest Rev (YoY%) | 
         Latest Net Income (YoY%) | Latest EPS (YoY%) | 
         Trailing P/E | Forward P/E | Div Yield
```

- Values formatted with comma separators, B/M suffix
- Percentages: one decimal, ▲/▼ prefix, green/red colored
- If N/A: show "N/A" with muted gray (#999) + footnote "ไม่พบข้อมูล / Not available from public sources"

### Section 2: Revenue & Net Income Comparison
- **Chart 1:** Multi-line chart, Revenue 5Q (all stocks, one chart)
- **Chart 2:** Multi-line chart, Net Income 5Q (all stocks, one chart)
- Each stock: consistent color across all charts (see color palette below)
- **Thai bullets:** 2–3 per chart explaining divergences

Example: "NVDA revenue accelerating ขณะ MSFT flat; net income margin MSFT ดีกว่า"

### Section 3: EPS Deep Dive
- **Bar chart per stock:** 5Q bars, colored by QoQ direction (green up / red down)
- **Summary table:** QoQ slope | QoQ stddev | Momentum | Consistency
- **Thai paragraph:** Compare EPS momentum across all stocks

### Section 4: Valuation Comparison
- **Grouped bar chart:** Trailing P/E vs Forward P/E (all stocks, one chart)
- Sector median line overlay (if found)
- **Table:** Stock | Trailing P/E | Forward P/E | vs Sector Median | Verdict
  - Verdict: "ถูกกว่า sector" / "แพงกว่า sector" / "ใกล้เคียง"

### Section 5: Dividend Snapshot
- **Card per stock** (or rows if only 2–3 stocks):
  - Stock name | Yield | Payout Ratio | Consistency | Avg Yield
  - If none: "ไม่จ่ายเงินปันผล"

### Section 6: News, MD&A & Guidance Summary
- **Card per stock** with 3–5 Thai bullets
- Each bullet: key theme + color highlight (green for upgrades, red for downgrades)

Example:
```
🎯 NVDA
  • AI momentum แข็งแรง ✅ guidance raised
  • DataCenter segment ทำ 75% revenue
  • Supply constraints easing
  • ⚠️ China regulations risk
```

### Section 7: Peer Comparison Summary (Thai Prose)

**Subsections:**

**7a. Strongest Earnings Momentum**
- Which stock? Why? (momentum trend + drivers)

**7b. Valuation Verdict**
- Cheap vs expensive relative to growth
- Which stock best value? Which overvalued?

**7c. Management & Strategic Positioning**
- Quality of guidance / execution track record
- Key initiatives / tailwinds / headwinds

**7d. Income Quality**
- Best dividend profile (if applicable)
- Sustainability assessment

**7e. Balanced Conclusion**
- Trade-offs clearly noted
- **DO NOT** give buy/sell recommendation
- Example: "NVDA accelerating momentum แต่ valuation แพง vs MSFT ที่ stable แต่ cheaper"

---

## Design System (Use Exactly These)

### Typography
```css
font-family: 'Inter', 'Noto Sans Thai', system-ui, sans-serif;
h1, h2, h3: SemiBold / Bold
body: Regular, 16px
```

### Theme: Dark
```css
--bg-page:     #1E0F43  (Midnight)
--bg-card:     #23222E  or rgba(255,255,255,0.05)
--text-body:   #FFFFFF
--text-alt:    #F4F4F4
--text-muted:  #999999
```

### Primary Palette
| Color | Hex | Use |
|-------|-----|-----|
| Deep Purple | #4B2885 | Section headers |
| Vivid Indigo | #5656F1 | Chart 1, interactive |
| Midnight | #1E0F43 | Page background |
| White | #FFFFFF | Text on dark |
| Off-white | #F4F4F4 | Alt rows |
| Dark Charcoal | #23222E | Card bg |

### Secondary Palette
| Color | Hex | Use |
|-------|-----|-----|
| Soft Violet | #855AFF | Chart 3, badges |
| Periwinkle | #7B7BFF | Hover, tertiary |
| Bright Blue | #0080FF | Links, chart 5 |
| Mint | #46FEDC | Positive, chart 2 |
| Yellow | #EBE717 | Caution, chart 4 |
| Green | #04A780 | Profit / up ▲ |
| Red | #E54652 | Loss / down ▼ |

### Multi-Stock Chart Color Sequence
**Use exactly this order (consistent across ALL charts):**
1. #5656F1 (Vivid Indigo)
2. #46FEDC (Mint)
3. #855AFF (Soft Violet)
4. #EBE717 (Yellow)
5. #0080FF (Bright Blue)

### Layout
```css
card border-radius:    12px
badge radius:          8px
section padding:       24px
inner padding:         16px
zebra rows:            rgba(255,255,255,0.03)
```

---

## Critical Rules (MANDATORY)

✅ **Live web search only** — ทุกตัวเลขต้องจาก live search (ห้าม training data)
✅ **All figures verified** — ไม่เดา ไม่ interpolate
✅ **N/A protocol** — ถ้าไม่เจอหลังพยายาม 2–3 search → show "N/A" + muted color + footnote
✅ **Side-by-side only** — เปรียบเทียบทั้งหมดในแต่ละ section (ไม่ repeat per-stock)
✅ **Chart.js via CDN** — ใช้ https://cdn.jsdelivr.net/npm/chart.js
✅ **Self-contained HTML** — artifact เดียว ไม่ต้อง external files
✅ **Thai + English mixed** — Natural switching เมื่อจำเป็น
✅ **No buy/sell recommendation** — Comparison เท่านั้น
✅ **Disclaimer required** — Footer + opening statement
✅ **Responsive** — Mobile-friendly viewport

---

## Formatting Rules

### Numbers
- Comma separators: `1,234.56`
- Large values: `$142.4B` or `$1.2M`
- Percentages: one decimal, e.g. `▲12.3%` (green) or `▼5.1%` (red)

### Data Not Found
```html
<span class="na" style="color: #999; opacity: 0.6;">N/A</span>
<footnote>ไม่พบข้อมูล / Not available from public sources</footnote>
```

### Section Headers
```html
<h2 style="color: #4B2885; font-weight: bold;">
  📊 Section Title
</h2>
```

### Cards
```html
<div style="
  background: #23222E;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.1);
">
  [content]
</div>
```

---

## Checklist Before Rendering

- ✅ All 7 sections present (Snapshot, Revenue/NI, EPS, Valuation, Dividend, News, Summary)
- ✅ 5 quarters of financial data collected (or N/A noted)
- ✅ No buy/sell recommendation in prose
- ✅ All charts use color palette exactly
- ✅ Disclaimer at top and footer
- ✅ Thai + English mixed naturally
- ✅ Responsive (tested at mobile + desktop viewport)
- ✅ Self-contained (no external assets except Chart.js CDN)
- ✅ All figures cite source or marked N/A

---

## Example Search Queries (Copy-Paste Ready)

```
NVDA quarterly revenue earnings Q3 2024
NVDA P/E ratio trailing forward 2024
NVDA dividend history yield 2024
NVDA latest earnings call transcript
NVDA vs AMD valuation comparison

MSFT quarterly revenue earnings Q3 2024
MSFT guidance outlook 2024 2025
MSFT margin trend analysis
MSFT latest news analyst sentiment
```

---

## Notes

- **Report date:** Use current date (from system clock)
- **5Q window:** Last 5 quarters available (may be current + prior 4 quarters)
- **Fiscal vs Calendar:** Respect company's fiscal year (e.g., MSFT uses June-end fiscal year)
- **Analyst consensus:** If Forward P/E not official, mark "estimated from consensus"
- **Chart interactivity:** Enable hover tooltips showing exact values

---

## Output Confirmation

Once artifact is complete, state:
```
✅ Report complete — [TICKER1], [TICKER2], ... peer comparison
   - [X] quarters of data
   - Snapshot table: ✅ / N/A count
   - Charts: [X] rendered
```
