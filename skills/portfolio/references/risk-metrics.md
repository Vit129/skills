# Portfolio Risk Metrics — Reference

Quick reference for calculations used in portfolio analysis.

## Core Metrics

| Metric | Formula / Rule | Threshold |
|--------|---------------|-----------|
| **Portfolio Beta** | Σ(weight × stock beta) | >1.2 high volatility, <0.8 defensive |
| **Weighted Avg Yield** | Σ(weight × dividend yield) | — |
| **Sharpe Ratio** | (Return − Risk-free rate) / StdDev | >1 good, >2 excellent |
| **Max Drawdown** | (Peak − Trough) / Peak | — |
| **Concentration (HHI)** | Σ(weight²) | >0.25 = concentrated |

## Concentration Red Flags

- Single stock > 20% of portfolio
- Single sector > 40% of portfolio
- Top 5 holdings > 60% of portfolio
- US-only with no international exposure

## Correlation Interpretation

| Correlation | Meaning | Action |
|-------------|---------|--------|
| > 0.8 | High — move together | Reduce one position |
| 0.4–0.8 | Moderate | Acceptable |
| < 0.4 | Low — diversified | Ideal pair |
| Negative | Counter-cyclical | Hedge benefit |

## Sector Weights — S&P 500 Reference (2025)

| Sector | S&P 500 | Overweight if |
|--------|---------|---------------|
| Technology | ~29% | > 34% |
| Healthcare | ~13% | > 18% |
| Financials | ~13% | > 18% |
| Consumer Disc. | ~10% | > 15% |
| Industrials | ~8% | > 13% |
| Energy | ~4% | > 9% |

## Rebalancing Triggers

- **Drift > 5%**: Any position drifts >5pp from target → rebalance
- **Calendar**: Quarterly review minimum
- **Event-based**: After earnings, macro shock, or new position
- **Tax-aware**: Prefer selling losers (harvest loss) before winners

## ETF Quality Checklist

- Expense ratio < 0.20% for passive index ETFs
- AUM > $1B (liquidity buffer)
- Tracking error < 0.50%
- Bid-ask spread < 0.10%
- Holdings overlap with other ETFs < 60%
