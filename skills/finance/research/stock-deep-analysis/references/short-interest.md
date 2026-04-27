# Reference: Short Interest & Options Flow

## Short Interest Analysis

### Key Metrics
* **Short Interest %:** Shares sold short ÷ total float
  * <5% = low | 5–15% = moderate | >15% = high | >25% = extreme
* **Days to Cover (Short Ratio):** Shares short ÷ avg daily volume
  * >5 days = squeeze risk if stock rallies
* **Short Interest Change:** Week-over-week % change in short positions

### Short Squeeze Conditions
All 3 needed for squeeze potential:
1. High short interest (>15% of float)
2. Low days to cover (<5 days preferred, but high short % can override)
3. Positive catalyst (earnings beat, news, analyst upgrade)

**Classic squeeze pattern:** Short sellers forced to buy to cover → price accelerates up

### Interpretation
| Short Interest | Signal |
|---|---|
| Rising short interest + falling price | Bears in control; avoid |
| Rising short interest + rising price | Squeeze building; watch for catalyst |
| Falling short interest + rising price | Shorts covering = bullish confirmation |
| Very high short interest | Contrarian opportunity OR justified bearishness |

### Search Queries
```
[TICKER] short interest percentage float
[TICKER] days to cover short ratio
[TICKER] short squeeze potential
```

---

## Options Flow Analysis

### Put/Call Ratio (Stock-Specific)
* **>1.0:** More puts than calls = bearish sentiment
* **<0.7:** More calls than puts = bullish sentiment
* **Extreme readings:** Often contrarian signals

### Unusual Options Activity
Signs of informed trading or institutional positioning:
* Large block trades (>1,000 contracts) in single strike
* Out-of-the-money calls with high volume vs open interest
* Sweep orders (aggressive buying across multiple exchanges)

### Key Options Metrics
* **Implied Volatility (IV):** High IV = expensive options; market expects big move
* **IV Rank:** Current IV vs 52-week range; >50 = elevated
* **Gamma Exposure:** Large gamma = dealer hedging amplifies price moves

### Search Queries
```
[TICKER] unusual options activity
[TICKER] put call ratio
[TICKER] options flow today
[TICKER] implied volatility rank
```

---

## Integration with Stock Report

Add to Section 17 (Insider Trading Activity) or as standalone note:

**Short Interest:** [X]% of float | Days to Cover: [X] | Trend: [Rising/Falling]
**Squeeze Risk:** [High/Medium/Low] — [brief reason]
**Options Sentiment:** Put/Call [X] | Unusual activity: [Yes/No — describe if yes]
