---
name: google-sheets
description: >
  ทำงานกับ Google Sheets และ Google Apps Script (GAS) ใน My Investment Port.
  Trigger เมื่อผู้ใช้พูดว่า "Google Sheets", "GAS", "sync ข้อมูล",
  "อัปเดต Sheets", "เชื่อม Sheets", "ข้อมูลไม่ sync", "GAS endpoint",
  หรือต้องการเพิ่ม/แก้ไข API ระหว่าง app กับ Google Sheets.
---

# Google Sheets & GAS Skill

จัดการ Google Sheets integration ใน My Investment Port

## Config ที่เกี่ยวข้อง

- **GAS URL:** `src/data/config/config.js` (ตัวแปร `GAS_URL`)
- **API Service:** `src/data/services/api.js`
- **Backup Script:** `scripts/backup.js`
- **Data ที่ sync:** holdings, dividends, sectors

## GAS Endpoints (GET/POST ไปที่ GAS_URL)

- `?action=getHoldings` → คืน holdings array
- `?action=getDividends` → คืน dividends array
- `?action=getSectors` → คืน sector allocation
- `?action=updateHolding` (POST) → อัปเดต position

## ขั้นตอนทำงาน

1. อ่าน `src/data/services/api.js` เพื่อดู integration ปัจจุบันก่อน
2. ตรวจสอบ `src/data/config/config.js` สำหรับ endpoint config
3. ถ้าเพิ่ม GAS function ใหม่ — แสดงทั้ง GAS code และ frontend fetch code
4. Handle CORS เสมอ (GAS ต้องใช้ `doGet`/`doPost` กับ ContentService)
5. แนะนำรัน `npm run backup` หลังเปลี่ยนแปลงข้อมูล

## GAS Template สำหรับ Endpoint ใหม่

```javascript
function doGet(e) {
  const action = e.parameter.action;
  let result = {};

  if (action === 'getHoldings') {
    // ดึงข้อมูลจาก Sheet
    result = getHoldingsData();
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## ทดสอบ Connection

```javascript
// รันใน browser console
fetch(GAS_URL).then(r => r.json()).then(d => console.log(d))
```

ถ้าเจอ CORS error ให้ตรวจสอบว่า GAS deployment ตั้ง access เป็น "Anyone"
