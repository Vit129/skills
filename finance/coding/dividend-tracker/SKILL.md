---
name: dividend-tracker
description: >
  ติดตามปันผลที่คาดว่าจะได้รับในไตรมาสถัดไปและคำนวณยอดสุทธิเป็นบาท.
  Trigger เมื่อผู้ใช้พูดว่า "ปันผลไตรมาสหน้า", "dividend next quarter",
  "จะได้ปันผลเมื่อไหร่", "ex-dividend date", "ปันผลที่รอรับ", "dividend schedule",
  หรือต้องการดู projection ปันผลระยะสั้น.
---

# Dividend Tracker Skill

ติดตามปันผลที่คาดว่าจะได้รับและคำนวณยอดสุทธิ (หลัง withholding tax) เป็น THB

## ข้อมูลที่ใช้

- **Holdings:** `src/data/raw/webull_holdings.js`, `dime_holdings.js`
- **Dividend history:** `src/data/raw/webull_dividends.js`, `dime_dividends.js`
- **FX Rate:** USD/THB real-time จาก Yahoo Finance

## ขั้นตอน

### 1. ดึง Dividend History
อ่านประวัติปันผลของแต่ละ ticker เพื่อประมาณ dividend ต่อหุ้น

### 2. ค้นหา Ex-Dividend Dates (ถ้าต้องการ)
ใช้ WebSearch: `"[TICKER] ex-dividend date 2026 Q[X]"`

### 3. คำนวณ Projected Dividend

สำหรับแต่ละ ticker:
```
Gross Dividend (USD) = shares × dividend per share
Withholding Tax (15%) = Gross × 0.15
Net Dividend (USD) = Gross - Withholding Tax
Net Dividend (THB) = Net USD × FX Rate
```

### 4. แสดงผล

## Output Format

```
📅 Dividend Tracker — Q[X] 2026

คาดรับปันผล [เดือน] นี้:

TICKER  Shares  Div/Share  Gross $    Tax(15%)  Net $    Net ฿
------  ------  ---------  ---------  --------  -------  ------
MSFT    XX      $X.XX      $XXX.XX    $XX.XX    $XXX.XX  ฿X,XXX
AAPL    XX      $X.XX      $XXX.XX    $XX.XX    $XXX.XX  ฿X,XXX

รวม Q[X]:   $X,XXX.XX gross → $X,XXX.XX net (~฿XX,XXX)
ภาษีที่ถูกหัก: $XXX.XX (ขอคืนได้ในแบบ PND.90 ปลายปี)

💡 FX Rate ที่ใช้: 1 USD = ฿XX.XX
```
