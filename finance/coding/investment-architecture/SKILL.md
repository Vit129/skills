---
name: investment-architecture
description: >
  Architecture และ coding guidance สำหรับ My Investment Port (React + Tailwind CSS).
  Trigger เมื่อผู้ใช้พูดว่า "แก้โค้ด", "สร้าง component", "เพิ่มฟีเจอร์", "build",
  "สร้างหน้า", "แก้ bug", "refactor", "เพิ่ม chart", หรือถามเกี่ยวกับ structure/architecture
  ของโปรเจค. รวมถึง "เปิด dev", "รัน dev", "start server", "npm run dev", "localhost".
---

# Architecture & Coding Skill

Coding guide สำหรับ My Investment Port — ใช้ Sovereign Design System + React 18 + Tailwind CSS 4

## Design System (Sovereign Design System)

UI เป็น **dark mode only** + Glassmorphism effects

### Component Library (`src/components/`)

- `ui/` — Button, Input, Badge, Select, Icons, Pagination, ProgressBar, TickerBadge
- `layout/` — SovereignCard, MetricCard, CardHeader, PageHeader
- `charts/` — ChartCanvas (Chart.js wrapper)
- `forms/` — CrudForm, ActionButtons
- `modals/` — ConfirmDialog

### Feature Structure

```
src/features/<feature-name>/
├── components/     # UI ของ feature นี้
├── hooks/          # Logic/state
└── index.js        # Public API
```

Pages ใน `src/pages/` เป็นแค่ thin wrapper — logic จริงอยู่ใน features

## Coding Principles

1. **Reuse first** — ห้ามสร้าง UI primitive ใหม่ถ้ามีใน `src/components/` แล้ว
2. **Feature-first** — ฟีเจอร์ใหม่ทุกอย่างไปอยู่ใน `src/features/<name>/`
3. **Data layer separation** — component ห้าม fetch data เอง ข้อมูลทั้งหมดผ่าน `src/data/`
4. **Global state** — ใช้ `usePortfolioStore` hook เท่านั้น
5. **Charts** — ใช้ `ChartCanvas` wrapper เสมอ ห้าม import Chart.js โดยตรง
6. **Styling** — Tailwind utility classes + design tokens จาก `src/data/config/colors.js`

## ขั้นตอนก่อนเขียน Code

1. ระบุว่า component ไหนใน `src/components/` ใช้ได้บ้าง
2. ระบุว่า feature นี้ควรอยู่ใน folder ไหน
3. แสดง file structure ก่อนเขียน code
4. ตาม naming convention ของโปรเจค (PascalCase component, camelCase hooks)

## Pages ที่มีอยู่

- Overview, Holdings, Passive Income, Tax, Planning, RMF

## Colors / Design Tokens

อ้างอิงจาก `src/data/config/colors.js` เสมอ — ห้าม hardcode สี

## Dev Server

เริ่ม Vite development server สำหรับ My Investment Port

### ขั้นตอน

1. ตรวจสอบว่า dev server กำลังรันอยู่บน port 5173 มั้ย
2. ถ้ายังไม่รัน — เริ่มด้วย `npm run dev` จาก project root
3. ยืนยันว่าเข้าถึงได้ที่ `http://localhost:5173`

### Network Access (iPad/iPhone)

```bash
npm run dev -- --host
```

แล้วเข้าด้วย IP ของเครื่อง เช่น `http://192.168.1.x:5173`
