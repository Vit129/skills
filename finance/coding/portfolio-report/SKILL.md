---
name: portfolio-report
description: >
  สร้างรายงานสรุปพอร์ตการลงทุนแบบ PDF หรือ DOCX.
  Trigger เมื่อผู้ใช้พูดว่า "สรุปพอร์ต", "ออกรายงาน", "portfolio report",
  "สร้าง report", "export พอร์ต", "รายงานการลงทุน", "สรุปผลการลงทุน",
  หรือต้องการไฟล์สรุปพอร์ตเพื่อนำไปใช้งานอื่น.
---

# Portfolio Report Skill

สร้างรายงานสรุปพอร์ตการลงทุน My Investment Port แบบไฟล์ PDF หรือ DOCX

## ข้อมูลที่ดึงมาใช้

- **Holdings:** `src/data/raw/webull_holdings.js`, `dime_holdings.js`
- **Dividends:** `src/data/raw/webutil_dividends.js`, `dime_dividends.js`
- **FX Rate:** USD/THB จาก Yahoo Finance (ดึง real-time)
- **Backup ล่าสุด:** `backups/YYYY-MM-DD/` (ถ้ามี)

## โครงสร้าง Report

```
1. Executive Summary
   - มูลค่าพอร์ตรวม (USD + THB)
   - Total gain/loss (USD + %)
   - วันที่ออกรายงาน + FX rate ที่ใช้

2. Holdings Breakdown
   - รายการหุ้นทุกตัว: shares, cost basis, current value, P&L
   - Sector allocation (% และมูลค่า)

3. Dividend Income YTD
   - รายได้ปันผลรวม USD + THB
   - Withholding tax ที่ถูกหัก
   - Top dividend payers

4. Thai Fund Summary
   - RMF/SSF/ThaiESG positions + วงเงินที่เหลือ

5. Tax Snapshot (ถ้ามีข้อมูล)
   - ประมาณการภาษีปีนี้ + effective rate
```

## วิธีสร้าง Report

ใช้ `docx` skill เพื่อสร้างไฟล์ Word หรือ `pdf` skill สำหรับ PDF
แล้วบันทึกไปที่ workspace folder ของผู้ใช้

## ถามผู้ใช้ก่อน (ถ้าไม่ได้ระบุ)

- ต้องการ format อะไร: PDF หรือ Word (.docx)?
- ต้องการ Demo Mode (ซ่อนตัวเลขจริง) มั้ย?
