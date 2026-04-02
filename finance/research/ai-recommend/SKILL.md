---
name: ai-recommend
description: >
  วิเคราะห์พอร์ตและแนะนำหุ้นที่น่าซื้อโดยอิงข้อมูลจริงจากเว็บ.
  Trigger เมื่อผู้ใช้พูดว่า "แนะนำหุ้น", "ซื้ออะไรดี", "ai recommend",
  "ควรเพิ่มหุ้นอะไร", "พอร์ตขาดอะไร", "rebalance", หรือถามว่าควรลงทุนอะไรต่อ.
  ใช้ skill นี้ทุกครั้งที่ผู้ใช้ต้องการคำแนะนำการลงทุนแม้จะไม่ได้พูดคำว่า "แนะนำ" ตรงๆ.
---

# AI Recommend Skill

แนะนำหุ้น US ที่เหมาะสมกับพอร์ตปัจจุบัน โดยอิงจากข้อมูลจริงและ real-time research

## ขั้นตอนการทำงาน

### 1. วิเคราะห์พอร์ตปัจจุบัน
- อ่านข้อมูลจาก `src/data/raw/webull_holdings.js` และ `dime_holdings.js`
- สรุป: sectors ที่มี, % concentration ของแต่ละ sector, มูลค่ารวม

### 2. หา gaps ในพอร์ต
- Sector ไหน underweight หรือยังไม่มีเลย
- ขาด asset class อะไร (เช่น REITs, Bonds ETF, Dividend stocks)
- Concentration risk — หุ้นตัวไหนหนักเกินไปมั้ย

### 3. ค้นหาข้อมูล real-time
ใช้ WebSearch ด้วย query เหล่านี้:
- `"[TICKER] stock analyst recommendation 2026"`
- `"best [sector] stocks to buy 2026"`
- `"portfolio diversification US stocks [current sectors]"`
- `"S&P500 sector outlook 2026"`

### 4. Output

แสดงผลตามโครงสร้างนี้:

```
📊 Portfolio Summary
- มูลค่ารวม: $X,XXX
- Sectors: [รายการ + % weight]

🔍 Gaps Identified
- [sector/asset ที่ขาด + เหตุผล]

💡 Recommendations (3-5 ตัว)
1. [TICKER] — [ชื่อบริษัท]
   - เหตุผล: ...
   - Sector: ...
   - Source: [URL + วันที่]

⚠️ Disclaimer
ข้อมูลนี้เป็นเพียงการศึกษา ไม่ใช่คำแนะนำทางการเงิน
กรุณาศึกษาข้อมูลเพิ่มเติมก่อนตัดสินใจลงทุน
```

## กฎสำคัญ

- ต้องอ้างอิง source ทุกข้อมูลที่ดึงมาจากเว็บ (URL + วันที่)
- ห้ามแนะนำโดยไม่มี real-time data ประกอบ
- ต้องใส่ disclaimer ทุกครั้ง
