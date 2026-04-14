# US Stock Analysis Guide (Standalone)

## Data Loading (Claude Desktop)

**Base path:** `/Users/supavit.cho/Git/My Investment Port/`

### Step 1: Load Holdings Data

File: `src/data/raw/webull_holdings.js`
```javascript
// Read the file, parse holdings array
// Expected structure:
[
  {
    ticker: "AAPL",
    shares: 100,
    costBasis: 150.25,
    currentPrice: 180.50,
    sector: "Technology",
    holdingValue: 18050.00
  },
  ...
]
```

### Step 2: Get FX Rate

File: `src/data/services/yahoo.js` or latest from `src/data/config/fxRate.json`
- Look for current USD/THB rate
- Default fallback: 33.50 THB/USD

### Step 3: Calculate Portfolio Stats

- **Total Value:** Sum of all `holdingValue`
- **Total Value THB:** totalValueUSD × FX rate
- **Sector Allocation:** Group by sector, calc % of total

## Sectors ที่ track

Technology, Healthcare, Finance, Energy, Consumer, Industrial, Real Estate

## การวิเคราะห์หุ้นเฉพาะตัว

เมื่อผู้ใช้ถามถึง ticker ใดตัวหนึ่ง:

1. เช็คว่ามีใน portfolio มั้ย
2. แสดง position details:
   - จำนวนหุ้น (shares)
   - Cost basis (USD)
   - ราคาปัจจุบัน (ถ้าทราบ)
   - Unrealized P&L (USD + %)
   - มูลค่าเทียบเท่า THB (ใช้ FX rate ปัจจุบัน)
3. บอก sector และ weight ในพอร์ต

## การวิเคราะห์ภาพรวมพอร์ต

1. มูลค่ารวม USD และ THB
2. Sector allocation (% ของแต่ละ sector)
3. Top gainers / Top losers
4. FX impact — USD/THB เปลี่ยนแปลงกระทบมูลค่า THB เท่าไหร่

## Output Format (หุ้นเฉพาะตัว)

```
📈 [TICKER] — [ชื่อบริษัท]
Sector: [sector]
Weight: X.X% ของพอร์ต

Position:
- Shares: X,XXX
- Cost Basis: $XXX.XX
- Current Price: $XXX.XX
- P&L: +$X,XXX (+XX%) 🟢
- มูลค่า THB: ฿X,XXX,XXX
```

## การเพิ่ม/แก้ Position

ถ้าผู้ใช้ต้องการเพิ่มหรือแก้ไขข้อมูล ให้อ้างอิง `add-stock` skill
