---
name: investment-architecture
description: >
  Architecture และ coding guidance สำหรับ My Investment Port (React + Tailwind CSS).
  Trigger เมื่อผู้ใช้พูดว่า "แก้โค้ด", "สร้าง component", "เพิ่มฟีเจอร์", "build",
  "สร้างหน้า", "แก้ bug", "refactor", "เพิ่ม chart", หรือถามเกี่ยวกับ structure/architecture
  ของโปรเจค. รวมถึง "เปิด dev", "รัน dev", "start server", "npm run dev", "localhost".
---

# Architecture & Coding Skill

Coding guide สำหรับ My Investment Port — Sovereign Design System + React 18 + Tailwind CSS 4

## Key Principles

1. **Reuse first** — ห้ามสร้าง UI primitive ใหม่ถ้ามีใน `src/components/` แล้ว
2. **Feature-first** — ฟีเจอร์ใหม่ไปอยู่ใน `src/features/<name>/`
3. **Data layer separation** — component ห้าม fetch data เอง ผ่าน `src/data/`
4. **Colors** — อ้างอิง `src/data/config/colors.js` เสมอ ห้าม hardcode สี

## Full Architecture Details

Component library, feature structure, coding principles, dev server setup
→ (Read `references/architecture.md`)
