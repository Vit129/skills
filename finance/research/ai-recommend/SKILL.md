---
name: ai-recommend
description: >
  แนะนำหุ้น US/TH ที่เหมาะสม โดยวิเคราะห์พอร์ตปัจจุบัน + real-time research.
  ✅ Claude Desktop compatible — load current portfolio from src/data/
  Trigger: "แนะนำหุ้น", "ซื้ออะไรดี", "พอร์ตขาดอะไร", "rebalance", "ควรเพิ่มอะไร"
---

# AI Recommend Skill (Standalone)

แนะนำหุ้นที่เหมาะสมจากการวิเคราะห์พอร์ตปัจจุบัน + web research

## 2 Modes

### Mode 1: Claude Desktop (Recommended)
โหลดพอร์ตปัจจุบันจาก `src/data/raw/` + web search for candidates

### Mode 2: User Input
ถ้าผู้ใช้ให้ข้อมูลพอร์ตมาตรง ให้วิเคราะห์จากนั้น

Analysis method, web search queries, recommendation rules → (Read `references/recommend-guide.md`)
