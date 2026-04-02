---
name: passive
description: >
  วิเคราะห์ passive income และ dividend ในพอร์ต My Investment Port.
  Trigger เมื่อผู้ใช้พูดว่า "ปันผล", "dividend", "passive income",
  "รายได้จากหุ้น", "yield", "withholding tax", "คืนภาษีปันผล",
  หรือต้องการดู projection รายได้ในอนาคต.
---

# Passive Income Skill

วิเคราะห์ปันผลและ passive income ของพอร์ต My Investment Port

## Source Files

- **Dividend data:** `src/data/raw/webull_dividends.js`, `dime_dividends.js`
- **Feature components:** `src/features/passiveIncome/`
  - `PassiveLog.jsx` — ประวัติปันผล
  - `PassiveForecast.jsx` — projection รายได้
  - `PassiveHeader.jsx` — summary metrics
  - `PassiveCharts.jsx` — visualization
  - `EfficiencyScoring.jsx` — yield efficiency
  - `AddDividendForm.jsx` — เพิ่มปันผล manual

## ภาษีปันผล US

US dividends มี **withholding tax 15%** หัก ณ ที่จ่าย
→ สามารถขอคืนได้ในแบบภาษีไทย (PND.90/91) ในฐานะเครดิตภาษี

## การวิเคราะห์ที่ต้องแสดง

1. **ยอดปันผลรวม** — ทั้งปี USD + เทียบเท่า THB (ใช้ FX rate ปัจจุบัน)
2. **Breakdown by ticker** — แต่ละตัวได้รับเท่าไหร่
3. **Trend รายเดือน/ไตรมาส** — กราฟ/ตาราง
4. **Annualized yield on cost** — คำนวณจาก cost basis ของแต่ละหุ้น
5. **ภาษีที่ถูกหัก** — และยอดที่ขอคืนได้
6. **Projection 12 เดือนข้างหน้า** — อิงจาก holdings ปัจจุบัน + dividend history

## Output Summary Format

```
💰 Passive Income Summary

ยอดรวมปี 2026: $X,XXX.XX USD (~฿XXX,XXX THB)
Withholding Tax: $XXX.XX (ขอคืนได้ในแบบ PND.90)

Top Dividend Payers:
1. [TICKER]: $XXX (X% yield on cost)
2. [TICKER]: $XXX (X% yield on cost)

📈 Projection 12 เดือน: ~$X,XXX USD
```
