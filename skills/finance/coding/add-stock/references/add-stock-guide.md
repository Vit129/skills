# Add Stock Guide

## ข้อมูลที่ต้องการจากผู้ใช้

ถามผู้ใช้ให้ครบก่อนดำเนินการ (ถ้ายังไม่ได้รับ):

1. **Ticker symbol** — เช่น AAPL, MSFT, NVDA
2. **จำนวนหุ้น** (shares)
3. **ราคาต้นทุน/หุ้น** (cost basis per share, USD)
4. **วันที่ซื้อ** (purchase date)
5. **Sector** — Technology, Healthcare, Finance, Energy, Consumer, Industrial, Real Estate
6. **Exchange** — NYSE หรือ NASDAQ

## ขั้นตอนการทำงาน

1. อ่าน `src/data/raw/webull_holdings.js` หรือ `dime_holdings.js` เพื่อดู format ของข้อมูลที่มีอยู่
2. สร้าง entry ใหม่ตาม format เดิม แล้ว **แสดงให้ผู้ใช้เห็นก่อน** confirm
3. ถามว่าต้องการ sync ไปยัง Google Sheets ผ่าน GAS ด้วยมั้ย (ถ้าต้องการ ให้อ้างอิง `google-sheets` skill)
4. แนะนำให้รัน `npm run backup` หลังจากอัปเดตข้อมูลแล้ว

## Output ที่แสดงก่อน confirm

```
📌 ข้อมูลหุ้นที่จะเพิ่ม:
- Ticker: [TICKER]
- Shares: [จำนวน]
- Cost Basis: $[ราคา] USD
- Purchase Date: [วันที่]
- Sector: [sector]
- Exchange: [exchange]

ยืนยันเพิ่มข้อมูลนี้มั้ย?
```

## หมายเหตุ

- ห้ามเขียนข้อมูลลงไฟล์โดยไม่ได้รับการ confirm จากผู้ใช้ก่อน
- ถ้า ticker ซ้ำกับที่มีอยู่แล้ว ให้แจ้งผู้ใช้และถามว่าต้องการเพิ่ม position หรืออัปเดต position เดิม
