# Thai Stock & Fund Details (Standalone)

## Data Loading (Claude Desktop)

**Base path:** `/Users/supavit.cho/Git/My Investment Port/`

### Step 1: Load Thai Fund Holdings

File: `src/data/raw/thaiFunds.js`
```javascript
// Read the file, parse Thai fund holdings array
// Expected structure:
[
  {
    fundName: "RMF Fund A",
    fundType: "RMF",
    currentValue: 150000,
    contribution: 150000,
    year: 2026
  },
  ...
]
```

### Step 2: Load User's Annual Income (for % calculation)

File: `src/data/config/userProfile.json` or latest from tax records
- Look for annual income to calculate 30% cap per fund type

### Step 3: Calculate Tax Benefit

Use: `src/data/logic/taxCalculation.js` patterns or calc manually:
- Tax savings = contribution amount × effective tax rate (e.g., 20% for high earner)

## วงเงินลดหย่อนภาษี (ปี 2026)

| กองทุน | วงเงินสูงสุด | เงื่อนไข |
|--------|-------------|---------|
| **RMF** | 500,000 THB | ≤30% ของรายได้ |
| **SSF** | 200,000 THB | ≤30% ของรายได้ |
| **ThaiESG** | 300,000 THB | ≤30% ของรายได้ |
| **รวม RMF+SSF+ThaiESG+PVD** | **500,000 THB** | cap รวม |

> ⚠️ วงเงินรวมสูงสุดไม่เกิน 500,000 THB แม้แต่ละกองทุนจะมีวงเงินของตัวเอง

## การวิเคราะห์ที่แสดง

1. **Position ปัจจุบัน** — มูลค่าของแต่ละกองทุนที่ถือ
2. **วงเงินที่ใช้ไปแล้ว** — แต่ละประเภทและรวม
3. **วงเงินที่เหลือ** — ซื้อเพิ่มได้อีกเท่าไหร่
4. **ผลประหยัดภาษี** — ถ้าซื้อเพิ่มจนเต็มวงเงิน ลดภาษีได้เท่าไหร่
5. **แนะนำ allocation** — ควรซื้อกองทุนไหนก่อนเพื่อ optimize ภาษี

## Output Format

```
🇹🇭 Thai Fund Summary

RMF:      ฿XXX,XXX / ฿500,000 (ใช้ XX%)  → เหลือ ฿XX,XXX
SSF:      ฿XXX,XXX / ฿200,000 (ใช้ XX%)  → เหลือ ฿XX,XXX
ThaiESG:  ฿XXX,XXX / ฿300,000 (ใช้ XX%)  → เหลือ ฿XX,XXX
รวม cap:  ฿XXX,XXX / ฿500,000

💡 ถ้าซื้อ RMF เพิ่มอีก ฿XX,XXX:
   ประหยัดภาษีได้ประมาณ ฿X,XXX (อัตรา XX%)
```
