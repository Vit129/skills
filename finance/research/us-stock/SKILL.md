---
name: us-stock
description: >
  วิเคราะห์สถานะพอร์ตหุ้น US: P&L, FX impact, sector allocation.
  ✅ Claude Desktop compatible — load data directly from src/data/
  Trigger: "ดูพอร์ต US", "สรุปหุ้นอเมริกา", "กำไรขาดทุน US", "allocation US"
  ใช้สำหรับภาพรวม ไม่ใช่การวิเคราะห์หุ้นรายตัวเชิงลึก.
---

# US Stock Analysis Skill (Standalone)

วิเคราะห์ US stock portfolio โดยอ่านข้อมูลจาก `src/data/` โดยตรง

## 2 Modes

### Mode 1: Claude Desktop (Recommended)
ใช้เมื่อ Claude Desktop เท่านั้น — read `src/data/raw/webull_holdings.js` โดยตรง

### Mode 2: User Input
ถ้าผู้ใช้ให้ข้อมูลมาตรง ให้ใช้ค่านั้นแทน

Data structure, loading code, analysis method → (Read `references/analysis-guide.md`)
