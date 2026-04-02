---
name: fx-alert
description: >
  เช็ค USD/THB exchange rate ปัจจุบันและผลกระทบต่อมูลค่าพอร์ตเป็นสกุลเงินบาท.
  Trigger เมื่อผู้ใช้พูดว่า "FX", "ค่าเงิน", "USD/THB", "อัตราแลกเปลี่ยน",
  "บาทแข็ง", "บาทอ่อน", "dollar", "ดอลล่าร์", "พอร์ตเป็นบาทเท่าไหร่",
  หรือถามว่า FX กระทบพอร์ตยังไง.
---

# FX Alert Skill

เช็ค USD/THB real-time และคำนวณผลกระทบต่อพอร์ต My Investment Port

## ขั้นตอน

### 1. ดึง FX Rate ปัจจุบัน
ดึงจาก Yahoo Finance API ผ่าน `src/data/services/yahoo.js`
หรือใช้ WebSearch ค้นหา "USD THB exchange rate today"

### 2. เปรียบเทียบกับ FX Rate ก่อนหน้า
ดึง FX rate ที่บันทึกใน backup ล่าสุด `backups/YYYY-MM-DD/` เพื่อเปรียบเทียบ

### 3. คำนวณผลกระทบต่อพอร์ต
- อ่าน holdings จาก `src/data/raw/webull_holdings.js`, `dime_holdings.js`
- คำนวณมูลค่ารวม (USD) × FX rate ปัจจุบัน = มูลค่า THB
- เปรียบเทียบกับมูลค่า THB ณ FX rate เดิม = กำไร/ขาดทุน FX

## Output Format

```
💱 FX Alert — [วันที่เวลา]

USD/THB ปัจจุบัน: ฿XX.XX
เปลี่ยนแปลง: [+/-X.XX จากเมื่อวาน / สัปดาห์ที่แล้ว]

📊 ผลกระทบต่อพอร์ต:
มูลค่าพอร์ต (USD): $X,XXX,XXX
มูลค่าพอร์ต (THB ปัจจุบัน): ฿XX,XXX,XXX
มูลค่าพอร์ต (THB เดิม): ฿XX,XXX,XXX

FX Gain/Loss: [+/-]฿XX,XXX ([+/-]X.X%)

💡 ถ้าค่าบาทแข็งขึ้น 1 บาท → พอร์ตลดลงประมาณ ฿X,XXX
   ถ้าค่าบาทอ่อนลง 1 บาท → พอร์ตเพิ่มขึ้นประมาณ ฿X,XXX
```
