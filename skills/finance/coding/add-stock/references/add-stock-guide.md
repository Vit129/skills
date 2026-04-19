# Add Stock Guide

## Required Information from User

Ask the user for all details before proceeding (if not already provided):

1. **Ticker symbol** — e.g., AAPL, MSFT, NVDA
2. **Number of shares** (shares)
3. **Cost basis per share** (USD)
4. **Purchase date**
5. **Sector** — Technology, Healthcare, Finance, Energy, Consumer, Industrial, Real Estate
6. **Exchange** — NYSE or NASDAQ

## Workflow

1. Read `src/data/raw/webull_holdings.js` or `dime_holdings.js` to check the existing data format.
2. Create a new entry following the original format and **show it to the user** before confirming.
3. Ask if they want to sync to Google Sheets via GAS (if yes, refer to the `google-sheets` skill).
4. Recommend running `npm run backup` after updating the data.

## Output shown before confirmation

```
📌 Stock information to be added:
- Ticker: [TICKER]
- Shares: [Amount]
- Cost Basis: $[Price] USD
- Purchase Date: [Date]
- Sector: [sector]
- Exchange: [exchange]

Confirm adding this information?
```

## Notes

- Do not write data to files without user confirmation.
- If the ticker already exists, notify the user and ask if they want to add to the position or update the existing position.
```
