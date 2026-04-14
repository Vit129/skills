# News Search Guide (Standalone)

## ขั้นตอน (Claude Desktop)

### Step 1: ได้รับ Input จากผู้ใช้
- ถ้าระบุมา: ใช้ ticker/sector ที่ระบุ
- ถ้าไม่ระบุ: ถาม "ต้องการข่าวเกี่ยวกับหุ้นตัวไหน หรือข่าว macro?"
- Optional: โหลดพอร์ตจาก `src/data/raw/webull_holdings.js` เพื่ออ้างอิง

### Step 2: ค้นหาด้วย WebSearch API

**หุ้นเฉพาะตัว:**
- `"[TICKER] news today"`
- `"[TICKER] earnings analyst"`

**Sector:**
- `"[sector] sector news 2026"`

**Macro:**
- `"US stock market news today"`
- `"Fed interest rate decision"`
- `"S&P500 outlook"`

**ตลาดไทย:**
- `"SET index news"`
- `"Thai baht USD exchange rate"`

## Output Format

```
📰 Top Headlines (5-7 ข่าว)
1. [หัวข้อข่าว] — [วันที่]
   สรุป: ...
   🔗 [URL]

📊 Market Impact ต่อพอร์ต
- [TICKER]: [บวก/ลบ/กลาง] — เพราะ...

⚠️ Watch List
- [TICKER]: ข่าวสำคัญที่ต้องติดตาม...
```

## กฎสำคัญ

- แสดงวันที่ publication ทุกข่าว
- อ้างอิง URL ทุกข้อมูลที่ดึงจากเว็บ
- ตอบเป็นภาษาไทย แต่ชื่อหุ้น/ตัวเลขใช้ภาษาอังกฤษ
- เน้นข่าวภายใน 7 วันล่าสุด
