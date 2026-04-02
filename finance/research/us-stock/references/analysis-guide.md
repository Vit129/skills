# US Stock Analysis Guide

## Source Files

- **Data:** `src/data/raw/webull_holdings.js`, `dime_holdings.js`
- **FX Rate:** USD/THB จาก Yahoo Finance (auto-sync ใน `src/data/services/yahoo.js`)
- **Feature files:** `src/features/holdings/`, `src/features/overview/`
- **Portfolio engine:** `src/features/holdings/usePortfolioEngine.js`

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
