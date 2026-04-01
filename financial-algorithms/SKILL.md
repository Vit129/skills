# Financial Algorithm Patterns

Guide for implementing correct, production-grade financial algorithms. Use this skill when building investment apps, tax calculators, portfolio dashboards, or any finance-related software.

## When to Use

- Building tax calculation logic (progressive brackets, deductions, withholding)
- Implementing DCA (Dollar-Cost Averaging) strategies
- Computing moving averages (SMA/EMA) for trading signals
- Portfolio risk scoring and alert systems
- Dividend forecasting and income projection
- Compound interest, loan amortization, or retirement planning
- Multi-source API fetching with fallback strategies
- Data deduplication for financial records

## Pattern Categories

### 1. Progressive Tax Bracket Calculation

Iterate through tax brackets sequentially. Never calculate each bracket independently.

```javascript
// CORRECT: Sequential iteration with remaining income
function calculateTax(netIncome, brackets) {
  let tax = 0, remaining = netIncome;
  for (let i = 0; i < brackets.length; i++) {
    const prevMax = i === 0 ? 0 : brackets[i - 1].max;
    const range = brackets[i].max - prevMax;
    if (remaining > range && brackets[i].max !== Infinity) {
      tax += range * brackets[i].rate;
      remaining -= range;
    } else {
      tax += remaining * brackets[i].rate;
      break;
    }
  }
  return tax;
}
```

Key rules:
- Brackets MUST be sorted ascending by income range
- Handle Infinity for the top bracket
- Use `remaining` pattern, not independent bracket calculation
- Deductions are applied BEFORE bracket calculation, not after
- Group deductions by cap (e.g., retirement group capped at 500k combined)

### 2. Deduction Capping (Group Caps)

Financial deductions often share caps across groups. Apply individual caps first, then group caps.

```javascript
// Pattern: Individual cap → Group cap → Total
const rmf = Math.min(userRmf, maxRmf, income * 0.30);
const ssf = Math.min(userSsf, maxSsf, income * 0.30);
const pvd = Math.min(userPvd, maxPvd, income * 0.15);
const retirementTotal = Math.min(rmf + ssf + pvd, GROUP_CAP); // e.g., 500,000
```

### 3. Dynamic DCA (Dollar-Cost Averaging)

Adjust investment amount based on price relative to moving average.

```javascript
// Price below SMA → invest more (up to 2x)
// Price above SMA → invest less (down to 0.5x)
function getDcaMultiplier(currentPrice, sma, mode = 'dynamic') {
  if (mode !== 'dynamic' || !sma || sma === 0) return 1.0;
  const ratio = currentPrice / sma;
  if (ratio >= 1.15) return 0.5;   // 15%+ above SMA
  if (ratio >= 1.05) return 0.75;  // 5-15% above
  if (ratio <= 0.85) return 2.0;   // 15%+ below SMA
  if (ratio <= 0.95) return 1.5;   // 5-15% below
  return 1.0;                       // Within 5% band
}
```

Key rules:
- Always have a base amount that gets multiplied
- Use bands, not linear scaling (prevents extreme values)
- Support multiple SMA periods (20, 120, 200 day)
- Bi-weekly DCA needs an anchor date for parity calculation

### 4. Simple Moving Average (SMA)

```javascript
function calcSMA(prices, period) {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}
```

For EMA (Exponential Moving Average):
```javascript
function calcEMA(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}
```

Key rules:
- Return `null` if insufficient data (never extrapolate)
- Filter out null/undefined prices before calculation
- SMA for trend detection, EMA for faster signal response

### 5. Alert Classification (Priority-Based)

Evaluate conditions in strict priority order. First match wins.

```javascript
function classifyAlert(holding, thresholds) {
  if (holding.offHigh <= thresholds.DEEP_BUY)    return 'DEEP_BUY';
  if (holding.pl <= thresholds.LOSS_LEVEL_2)      return 'LEVEL_2';
  if (holding.offHigh <= thresholds.VALUE_ZONE)   return 'VALUE_ZONE';
  if (holding.pl <= thresholds.LOSS_LEVEL_1)      return 'LEVEL_1';
  if (holding.dca !== 'None')                     return 'DCA_ACTIVE';
  return 'MONITORING';
}
```

Key rules:
- Order matters: most severe condition first
- Use configurable thresholds, not hardcoded values
- Combine multiple signals (price, P/L, technical indicators)

### 6. Dividend Forecasting (Rolling Average)

```javascript
function forecastMonthlyDividend(dividends, monthsBack = 6) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - monthsBack);
  const recent = dividends.filter(d => new Date(d.date) >= cutoff);

  // Per-ticker average
  const tickers = [...new Set(recent.map(d => d.ticker))];
  const monthlyByTicker = {};
  for (const t of tickers) {
    const sum = recent.filter(d => d.ticker === t).reduce((s, d) => s + d.amount, 0);
    monthlyByTicker[t] = sum / monthsBack;
  }

  const totalMonthly = Object.values(monthlyByTicker).reduce((a, b) => a + b, 0);
  return { monthlyByTicker, totalMonthly, annualized: totalMonthly * 12 };
}
```

Key rules:
- Use per-ticker averaging (not total pool) for accuracy
- Apply withholding tax rate (e.g., 15% US, 10% Thai) for net projection
- Track YoY growth: `(currentYear - prevYear) / prevYear * 100`
- Handle missing months gracefully (some stocks pay quarterly)

### 7. Weighted Salary Calculation (Mid-Year Adjustments)

When salary changes mid-year, calculate weighted annual total.

```javascript
function getAnnualSalary(baseSalary, adjustments = []) {
  if (!adjustments.length) return baseSalary * 12;
  const sorted = [...adjustments].sort((a, b) => a.month - b.month);
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    let salary = sorted[0].salary;
    for (const adj of sorted) {
      if (adj.month <= m) salary = adj.salary;
    }
    total += salary;
  }
  return total;
}
```

### 8. Sentiment / Risk Scoring (Weighted Multi-Factor)

```javascript
function calculateSentiment(holdings, vix = 18) {
  // Market factor (external)
  const marketScore = Math.max(0, Math.min(100, 100 - (vix - 10) * 3));

  // Portfolio factor (internal)
  const opportunities = holdings.filter(h =>
    h.alert === 'DEEP_BUY' || h.alert === 'VALUE_ZONE'
  ).length;
  const portfolioScore = Math.min((opportunities / holdings.length) * 100 + 20, 90);

  // Weighted combination
  const bullish = Math.round(marketScore * 0.4 + portfolioScore * 0.6);
  const neutral = Math.max(10, Math.round((100 - bullish) * 0.3));
  const bearish = 100 - bullish - neutral;

  return { bullish, neutral, bearish };
}
```

Key rules:
- Always clamp values to valid ranges (0-100)
- Ensure percentages sum to exactly 100
- Use `Math.max/Math.min` for bounds, not conditionals
- Weight external factors (market) separately from internal (portfolio)

### 9. Compound Interest & Future Value

```javascript
function futureValue(principal, monthlyContribution, annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
  return fvPrincipal + fvContributions;
}

function compoundInterest(principal, annualRate, timesPerYear, years) {
  return principal * Math.pow(1 + annualRate / timesPerYear, timesPerYear * years);
}
```

### 10. Loan Amortization Schedule

```javascript
function amortizationSchedule(principal, annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const schedule = [];
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = payment - interest;
    balance -= principalPaid;
    schedule.push({ month: i, payment, interest, principalPaid, balance: Math.max(0, balance) });
  }
  return { monthlyPayment: payment, schedule, totalInterest: payment * n - principal };
}
```

### 11. Sharpe Ratio & Portfolio Optimization

```javascript
function sharpeRatio(returns, riskFreeRate = 0.02) {
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1)
  );
  if (stdDev === 0) return 0;
  return (avgReturn - riskFreeRate / 252) / stdDev; // Daily Sharpe
}

// Annualized: multiply daily Sharpe by sqrt(252)
function annualizedSharpe(dailyReturns, riskFreeRate = 0.02) {
  return sharpeRatio(dailyReturns, riskFreeRate) * Math.sqrt(252);
}
```

Key rules:
- Use N-1 for sample standard deviation
- Annualize by multiplying by sqrt(trading days)
- Risk-free rate should match the return period (daily/monthly/annual)

### 12. Multi-Fallback API Strategy

```javascript
async function fetchWithFallbacks(url, endpoints, timeoutMs = 6000) {
  for (const endpoint of endpoints) {
    try {
      const res = await Promise.race([
        fetch(endpoint.url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))
      ]);
      if (!res.ok) continue;
      return endpoint.transform ? endpoint.transform(await res.json()) : await res.json();
    } catch { continue; }
  }
  return null;
}
```

Key rules:
- Always set a timeout (6s recommended for financial APIs)
- Try direct first, then proxies
- Return `null` on total failure (let caller handle gracefully)
- Cache successful responses to reduce API calls

### 13. Financial Record Deduplication

```javascript
function deduplicateRecords(records, keyFn) {
  const seen = new Map();
  return records.filter(r => {
    const key = keyFn(r);
    if (seen.has(key)) return false;
    seen.set(key, true);
    return true;
  });
}

// Usage: composite key
const uniqueDividends = deduplicateRecords(dividends,
  d => `${d.date}|${d.ticker}|${d.amount}|${d.broker}`
);
```

Key rules:
- Use composite keys for financial records (single field is never unique enough)
- Normalize dates before comparison (handle timezone differences)
- Use `Map` for O(1) lookup, not `Array.includes` for O(n)

## General Financial Algorithm Rules

1. **Never use floating point for currency** — use integers (cents/satang) or `toFixed(2)` at display only
2. **Always clamp percentages** — `Math.max(0, Math.min(100, value))`
3. **Handle division by zero** — check denominator before dividing
4. **Sort before processing** — tax brackets, salary adjustments, date ranges
5. **Use configurable thresholds** — never hardcode financial constants inline
6. **Cache expensive calculations** — memoize tax results, SMA values
7. **Validate inputs** — negative salary, future dates, impossible rates
8. **Round at the end** — accumulate precise values, round only for display
