---
name: tax-review
description: >
  คำนวณและวิเคราะห์ภาษีเงินได้บุคคลธรรมดาไทยใน My Investment Port.
  Trigger เมื่อผู้ใช้พูดว่า "ดูภาษี", "คำนวณภาษี", "tax", "PND.90",
  "PND.91", "ภาษีเงินได้", "ลดหย่อนภาษี", "เสียภาษีเท่าไหร่",
  "effective tax rate", หรือถามเกี่ยวกับการวางแผนภาษีปี 2026.
---

# Tax Review Skill

วิเคราะห์ภาษีเงินได้บุคคลธรรมดาไทยปี 2026 (แบบ PND.90/PND.91)

## Source Files

- **Tax engine:** `src/features/tax/taxCalculations.js`, `src/lib/taxCalculations.js`
- **Tax UI:** `src/features/tax/` (TaxInputPanel, TaxMetrics, TaxVisualizer, CompanyIncomeSection)
- **Tax page:** `src/pages/TaxPage.jsx`

## Tax Brackets 2026

| รายได้สุทธิ (THB) | อัตรา |
|---|---|
| 0 – 150,000 | 0% |
| 150,001 – 300,000 | 5% |
| 300,001 – 500,000 | 10% |
| 500,001 – 750,000 | 15% |
| 750,001 – 1,000,000 | 20% |
| 1,000,001 – 2,000,000 | 25% |
| 2,000,001 – 5,000,000 | 30% |
| 5,000,001+ | 35% |

## ค่าลดหย่อนหลัก

- **ส่วนตัว:** 60,000 THB
- **คู่สมรส (ถ้ามี):** 60,000 THB
- **เงินได้จากการจ้างงาน:** 50% ของรายได้ สูงสุด 100,000 THB
- **ประกันสังคม:** ตามจริง
- **RMF/SSF/ThaiESG:** ดูรายละเอียดใน `thai-stock` skill
- **เครดิตภาษีปันผลไทย:** 3/7 ของเงินปันผลจากหุ้นไทย

## ขั้นตอนการ Review

1. อ่าน input ปัจจุบันจาก TaxInputPanel
2. ตรวจสอบ logic การคำนวณใน `taxCalculations.js`
3. แสดง effective tax rate และ marginal rate
4. หาโอกาสลดหย่อนเพิ่ม (ซื้อ RMF/SSF เพิ่มได้อีกมั้ย?)
5. คำนวณ withholding tax credit จากปันผล US stocks

## Output Format

```
🧾 Tax Summary 2026

รายได้รวม: ฿X,XXX,XXX
รายได้สุทธิหลังหักลดหย่อน: ฿X,XXX,XXX
ภาษีที่ต้องจ่าย: ฿XX,XXX
Effective Rate: X.X%
Marginal Rate: XX%

💡 Optimization
- ซื้อ RMF เพิ่มได้อีก ฿XX,XXX → ประหยัดภาษี ฿X,XXX
- เครดิตภาษีปันผล US: ฿X,XXX
```
