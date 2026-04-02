# Backup Guide

## ขั้นตอน

1. รัน `npm run backup` จาก project root
2. ตรวจสอบว่าโฟลเดอร์ `backups/YYYY-MM-DD/` ถูกสร้างขึ้นแล้ว
3. ยืนยันว่ามีไฟล์ครบ 5 ไฟล์:
   - `holdings.json`
   - `dividends.json`
   - `sectors.json`
   - `tax_inputs.json`
   - `rmf_funds.json` (ถ้ามีข้อมูล RMF/PVD)
4. แสดง file size และจำนวน records ของแต่ละไฟล์
5. แจ้งเตือนถ้าไฟล์ใดไฟล์หนึ่งว่างเปล่าหรือหายไป

## Output ที่แสดง

```
✅ Backup สำเร็จ — backups/2026-04-01/
📄 holdings.json    — X records, X KB
📄 dividends.json   — X records, X KB
📄 sectors.json     — X records, X KB
📄 tax_inputs.json  — X fields, X KB
📄 rmf_funds.json   — X fields, X KB
```

หรือถ้ามีปัญหา:
```
⚠️ Backup Warning: tax_inputs.json หายไป — ตรวจสอบ Google Sheet tab Tax_Calculate
```

## Backup Schedule

- **อัตโนมัติ:** ทุกวันเวลา 22:00 ผ่าน macOS LaunchAgent
- **Manual:** สั่งได้ตลอดเวลาด้วย `npm run backup`
- **ที่เก็บ:** `backups/YYYY-MM-DD/` (อย่า commit เข้า git)

## Data Sources (Google Sheet Tabs)

| ไฟล์ | Sheet Tab |
|------|-----------|
| holdings.json | Holdings_Webull + Holdings_Dime |
| dividends.json | Dividends_Webull + Dividends_Dime |
| sectors.json | Sectors |
| tax_inputs.json | Tax_Calculate |
| rmf_funds.json | RMF_Funds |
