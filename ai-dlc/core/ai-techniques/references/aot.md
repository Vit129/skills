# Algorithm of Thought (AoT)

จำลองกระบวนการค้นหาคำตอบแบบ algorithmic — สำรวจหลายเส้นทาง, ย้อนกลับเมื่อตัน, เลือกเส้นทางที่ดีที่สุด
คล้ายการทำ DFS/BFS บน tree of possible solutions แต่ทำในหัวแทนการรัน code จริง

## When to use
- ปัญหามีหลายทางเลือกที่แตกแขนงออกไป (branching decisions)
- ต้องการสำรวจทั้ง happy path และ dead-end ก่อนตัดสินใจ
- ปัญหาที่ greedy approach (เลือกทางแรกที่เจอ) มักให้คำตอบที่ไม่ดีพอ
- ต้องการ reasoning ที่ traceable ว่าทำไมถึงเลือก/ไม่เลือกแต่ละทาง

## How it works

### Phase 1: Define the Search Space
1. ระบุปัญหาและ goal ให้ชัด
2. ระบุ decision points ทั้งหมด — แต่ละจุดมีกี่ทางเลือก
3. กำหนด evaluation criteria สำหรับตัดสินว่าทางไหนดี/ไม่ดี

### Phase 2: Explore (DFS-style)
4. เลือกทางเลือกแรก → ขยายต่อให้ลึกที่สุด
5. ที่แต่ละ node ประเมิน:
   - ✅ Promising → ขยายต่อ
   - ⚠️ Uncertain → จดไว้ แล้วขยายต่อแบบระวัง
   - ❌ Dead-end → หยุด, บันทึกเหตุผล, **backtrack**
6. เมื่อ backtrack → กลับไป decision point ล่าสุดที่ยังมีทางเลือกเหลือ → ลองทางถัดไป

### Phase 3: Evaluate & Select
7. เปรียบเทียบทุกเส้นทางที่สำรวจแล้ว
8. ให้คะแนนตาม criteria ที่กำหนดใน Phase 1
9. เลือกเส้นทางที่ดีที่สุด — อธิบายเหตุผลว่าทำไมทางอื่นถูกตัด

## Key Principles
- **Backtracking is strength, not failure** — การย้อนกลับคือการเรียนรู้ว่าทางนั้นไม่ work
- **Record dead-ends** — จดทุก dead-end พร้อมเหตุผล เพื่อไม่กลับไปทางเดิม
- **Depth before breadth** — ลงลึกก่อน ถ้าตันค่อย backtrack ไม่ใช่สำรวจผิวเผินทุกทาง
- **Prune early** — ถ้าเห็นชัดว่าทางนี้ไม่ work ตัดทิ้งเลย ไม่ต้องสำรวจต่อ

## Tips
- ใช้ tree notation (indent) เพื่อแสดง depth ของการสำรวจ
- ถ้า decision points เยอะมาก (>5 ทาง) ให้ prune ด้วย heuristic ก่อนลงลึก
- รวมกับ CoT ได้ — ใช้ CoT ที่แต่ละ node เพื่อประเมินว่า promising หรือ dead-end
- รวมกับ LATS ได้ — ใช้ AoT สำรวจก่อน แล้วเอา top candidates ไปเข้า LATS scoring

## Example
```
Problem: เลือก database strategy สำหรับ multi-tenant booking system

Goal: รองรับ 50+ tenants, data isolation, query performance

Decision Points:
  D1: DB Architecture → [Shared DB, Schema-per-tenant, DB-per-tenant]
  D2: Caching → [Redis, In-memory, No cache]
  D3: Read/Write split → [Yes, No]

Exploration:

[D1] Shared DB
  ├─ ✅ ง่ายต่อ deployment, ต้นทุนต่ำ
  ├─ [D2] Redis cache
  │   ├─ ✅ Query performance ดี
  │   ├─ [D3] Read/Write split
  │   │   └─ ✅ รองรับ scale — VIABLE PATH (Score: 7/10)
  │   └─ [D3] No split
  │       └─ ⚠️ อาจ bottleneck ที่ write — VIABLE BUT RISKY (Score: 5/10)
  └─ [D2] No cache
      └─ ❌ 50 tenants shared table = slow queries — DEAD END

[D1] Schema-per-tenant
  ├─ ✅ Data isolation ดี
  ├─ ⚠️ Migration ต้องรัน 50 schemas
  ├─ [D2] Redis cache
  │   └─ [D3] Read/Write split
  │       └─ ✅ Isolation + Performance — VIABLE PATH (Score: 8/10)
  └─ [D2] No cache
      └─ ⚠️ Acceptable ถ้า query ไม่ complex — VIABLE (Score: 6/10)

[D1] DB-per-tenant
  ├─ ✅ Isolation สูงสุด
  ├─ ❌ 50 DB instances = operational nightmare, cost สูงมาก
  └─ DEAD END (pruned — ไม่สำรวจ D2, D3 ต่อ)

Selected: Schema-per-tenant + Redis + Read/Write split (8/10)
Reason: Balance ระหว่าง isolation กับ operational cost
         Dead-ends บอกว่า Shared DB ไม่ scale, DB-per-tenant แพงเกิน
```

## Comparison with Other Techniques

| Technique | เหมาะกับ | ต่างจาก AoT อย่างไร |
|---|---|---|
| CoT | ปัญหาเชิงเส้น ทำทีละ step | AoT สำรวจหลายเส้นทาง + backtrack |
| LATS | เปรียบเทียบ N ตัวเลือกแบบ flat | AoT สำรวจแบบ tree (ลึก + แตกแขนง) |
| Step-Back | ถอยออกมาดูภาพใหญ่ | AoT ลงลึกในรายละเอียดแต่ละทาง |
| AoT | ปัญหาที่มี branching decisions หลายชั้น | ใช้ backtracking เป็นหัวใจ |
