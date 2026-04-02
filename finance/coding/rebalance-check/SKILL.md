---
name: rebalance-check
description: >
  เช็ค sector weight ปัจจุบันเทียบกับ target allocation แล้วแนะนำว่าควรปรับพอร์ตยังไง.
  Trigger เมื่อผู้ใช้พูดว่า "rebalance", "ปรับพอร์ต", "sector weight", "overweight",
  "underweight", "พอร์ตเอียงมั้ย", "ควรขายอะไร", "ควรซื้อเพิ่มอะไร",
  หรือต้องการตรวจสอบความสมดุลของพอร์ต.
---

# Rebalance Check Skill

ตรวจสอบ sector allocation ปัจจุบันและแนะนำการปรับพอร์ต

## ข้อมูลที่ใช้

- **Holdings:** `src/data/raw/webull_holdings.js`, `dime_holdings.js`
- **Sector config:** ตาม sectors ที่มีใน portfolio engine

## Sectors ที่ track

Technology, Healthcare, Finance, Energy, Consumer, Industrial, Real Estate

## ขั้นตอน

### 1. คำนวณ Current Allocation
- มูลค่าแต่ละ sector (USD)
- % weight ของแต่ละ sector

### 2. เปรียบเทียบกับ Target
ถามผู้ใช้ว่ามี target allocation มั้ย ถ้าไม่มีให้ใช้ benchmark นี้:
- Technology: ~30%
- Healthcare: ~15%
- Finance: ~15%
- Consumer: ~15%
- Energy: ~10%
- Industrial: ~10%
- Real Estate: ~5%

### 3. หา Imbalances
- Overweight (>5% เกิน target) → พิจารณาขาย/ไม่ซื้อเพิ่ม
- Underweight (>5% ต่ำกว่า target) → พิจารณาซื้อเพิ่ม

### 4. แนะนำ Action

## Output Format

```
📊 Rebalance Check — [วันที่]

Current vs Target:
Technology:  38% vs 30% 🔴 Overweight  +8%
Healthcare:  12% vs 15% 🟡 Underweight -3%
Finance:     16% vs 15% 🟢 On Target
...

💡 แนะนำ:
- ลด Technology: พิจารณาขาย [TICKER] บางส่วน
- เพิ่ม Healthcare: ดู [TICKER] หรือ [TICKER]

⚠️ ก่อนปรับพอร์ตควรพิจารณา capital gains tax ด้วย
```
