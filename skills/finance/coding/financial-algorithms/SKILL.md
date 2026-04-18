# Financial Algorithm Patterns

Guide for implementing correct, production-grade financial algorithms.

## When to Use

- Tax calculation (progressive brackets, deductions, withholding)
- DCA strategies, moving averages (SMA/EMA)
- Portfolio risk scoring, alert systems, dividend forecasting
- Compound interest, loan amortization, retirement planning
- Multi-source API fetching, data deduplication

## All Patterns (13 total)

Tax brackets, deduction capping, dynamic DCA, SMA/EMA, alert classification,
dividend forecasting, weighted salary, sentiment scoring, compound interest,
loan amortization, Sharpe ratio, multi-fallback API, record deduplication
→ (Read `references/patterns.md`)

## General Rules

1. Never use floating point for currency — use `toFixed(2)` at display only
2. Always clamp percentages — `Math.max(0, Math.min(100, value))`
3. Handle division by zero
4. Sort before processing — tax brackets, salary adjustments, date ranges
5. Use configurable thresholds — never hardcode financial constants
6. Round at the end — accumulate precise values, round only for display
