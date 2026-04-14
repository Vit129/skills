---
name: thai-stock
description: >
  วิเคราะห์หุ้นไทย + กองทุน RMF/SSF/ThaiESG: allocation, ลดหย่อนภาษี, remaining quota.
  ✅ Claude Desktop compatible — load data directly from src/data/
  Trigger: "หุ้นไทย", "RMF", "SSF", "เหลือวงเงินเท่าไหร่", "ประหยัดภาษี"
---

# Thai Stock & Fund Skill (Standalone)

วิเคราะห์พอร์ตหุ้นไทยและกองทุนลดหย่อนภาษี โดยอ่านจาก `src/data/` โดยตรง

## 2 Modes

### Mode 1: Claude Desktop (Recommended)
อ่าน Thai holdings + tax-deductible fund config จาก `src/data/`

### Mode 2: User Input
ถ้าผู้ใช้ให้ข้อมูลมาตรง ให้ใช้ค่านั้นแทน

Data files, tax calculations, remaining limits → (Read `references/fund-details.md`)
