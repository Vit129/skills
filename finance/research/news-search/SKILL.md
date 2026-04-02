---
name: news-search
description: >
  ค้นหาและสรุปข่าวตลาดหุ้น real-time ที่เกี่ยวข้องกับพอร์ต My Investment Port.
  Trigger เมื่อผู้ใช้พูดว่า "หาข่าว", "ข่าวหุ้น", "news", "ข่าว [TICKER]",
  "ตลาดเป็นยังไง", "มีข่าวอะไรมั้ย", "Fed", "S&P", "macro outlook",
  หรือถามเกี่ยวกับสถานการณ์ตลาดล่าสุด. ตอบเป็นภาษาไทย.
---

# News Search Skill

ค้นหาข่าวหุ้น real-time และสรุปผลกระทบต่อพอร์ต My Investment Port

## ขั้นตอน

### 1. เช็คพอร์ตปัจจุบัน
อ่าน `src/data/raw/webull_holdings.js` และ `dime_holdings.js` เพื่อรู้ว่ามี ticker อะไรบ้าง

### 2. ถามผู้ใช้ (ถ้าไม่ได้ระบุมา)
"ต้องการข่าวเกี่ยวกับหุ้นตัวไหน? หรือต้องการข่าวทั้งพอร์ต?"

### 3. ค้นหาด้วย WebSearch

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
