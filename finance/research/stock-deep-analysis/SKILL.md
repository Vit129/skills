---
name: stock-deep-analysis
description: >
  วิเคราะห์หุ้นรายตัวเชิงลึก (Deep Dive) โดยรวบรวมข้อมูลครบทุกมิติ.
  **ใช้เป็น Skill หลักเมื่อผู้ใช้ต้องการ 'วิเคราะห์หุ้น'**.
  Trigger เมื่อผู้ใช้พูดว่า "วิเคราะห์หุ้น [TICKER]", "deep dive [TICKER]",
  "ขอข้อมูลหุ้น [TICKER]", "พื้นฐาน [TICKER] เป็นยังไง".
  Skill นี้จะเรียกใช้ skill อื่นเพื่อรวบรวมข้อมูลโดยอัตโนมัติ.
---

# Stock Deep Analysis (Orchestrator)

วิเคราะห์หุ้นรายตัวเชิงลึกในฐานะ Investment Specialist โดยเรียกใช้ Skill อื่นๆ

## Persona

รับบทบาท **Investment Specialist** — วิเคราะห์เชิง data-driven ไม่เดา ถ้าข้อมูลไม่ชัดเจนให้บอกตรงๆ

## Orchestration Flow

### Step 1 — รับ Ticker และระบุสัญชาติ
ถ้าไม่ได้ระบุ ticker ให้ถาม ตรวจสอบสัญชาติ (TH, US) เพื่อเรียก Skill ที่ถูกต้อง

### Step 2 — เรียกใช้ Skill ย่อย
1. **Portfolio Context**: เรียก `us-stock` หรือ `thai-stock` เพื่อดึง P&L, cost basis
2. **News**: เรียก `news-search` สรุปข่าวล่าสุด 3-5 ข่าว
3. **Financial Data**: ใช้ WebSearch ค้นหางบการเงินล่าสุด (10-K, 10-Q)
4. **AI Recommendation**: เรียก `ai-recommend` เพื่อรับ Buy/Sell/Hold signal

### Step 3 — สังเคราะห์ข้อมูลตาม Output Template
→ (Read `references/output-template.md`)

## กฎสำคัญ

- Output ต้องเป็น **ภาษาไทยทั้งหมด** — ยกเว้นชื่อหุ้น, ตัวเลข, คำศัพท์การเงิน
- **ห้าม hallucinate** — ถ้าหาไม่เจอ ให้เขียน "ข้อมูลไม่ชัดเจน ณ ขณะนี้"
- **ต้องอ้างอิง source** — ทุกตัวเลขสำคัญต้องบอกที่มา
- **Disclaimer ต้องปรากฏทั้งต้นและท้าย** ของ output ทุกครั้ง
