# Reference: Working Capital & Internal Controls

## 1. การจัดการเงินสด (Cash Management)

### Cash Budget
- ประมาณการรับเงิน: จากยอดขาย, ลูกหนี้เก่า
- ประมาณการจ่ายเงิน: ซื้อสินค้า, เงินเดือน, ค่าใช้จ่าย
- ระบุช่วงที่เงินสดขาด → วางแผนกู้ยืม
- ระบุช่วงที่เงินสดเกิน → วางแผนลงทุน

### Cash Control
- Bank Reconciliation ทุกเดือน
- Dual Approval สำหรับการจ่ายเงินจำนวนมาก
- Petty Cash: กำหนดวงเงิน, เบิกจ่ายมีเอกสาร, เติมเงินเมื่อใช้ไป 70-80%

---

## 2. บัญชีลูกหนี้ (Accounts Receivable)

### Aging Analysis
| อายุ | การดำเนินการ |
|---|---|
| Current (ยังไม่ครบกำหนด) | ติดตามปกติ |
| 1-30 วัน | แจ้งเตือนครั้งแรก |
| 31-60 วัน | โทรติดตาม |
| 61-90 วัน | ส่งหนังสือทวงถาม |
| >90 วัน | พิจารณาตัดหนี้สูญ |

### Allowance for Doubtful Debts
- วิธี % of Sales: ตั้งสำรองตาม % ของยอดขาย
- วิธี Aging: ตั้งสำรองตามอายุลูกหนี้ (เก่ากว่า = % สูงกว่า)
- TFRS 9 ECL: คำนวณ Expected Credit Loss

### ECL Calculation (TFRS 9)
- Stage 1: 12-month ECL (ความเสี่ยงต่ำ)
- Stage 2: Lifetime ECL (ความเสี่ยงเพิ่มขึ้นมาก)
- Stage 3: Lifetime ECL (เกิดการผิดนัดแล้ว)

**ECL = PD × LGD × EAD**
- PD = Probability of Default
- LGD = Loss Given Default
- EAD = Exposure at Default

---

## 3. บัญชีสินค้าคงคลัง (Inventory)

### วิธีการประเมินมูลค่า
- **FIFO:** สินค้าที่ซื้อก่อนขายก่อน (ใช้ได้ใน TFRS)
- **Weighted Average:** ต้นทุนเฉลี่ยถ่วงน้ำหนัก (ใช้ได้ใน TFRS)
- **LIFO:** ไม่อนุญาตใน TFRS (แต่ยังใช้ได้ในไทยสำหรับภาษี)

### Lower of Cost or NRV
- ถ้า NRV < Cost → ตั้งสำรองการด้อยค่า
- NRV = ราคาขายโดยประมาณ - ค่าใช้จ่ายในการขาย

### Inventory Control
- ABC Analysis: A (มูลค่าสูง 20% ของรายการ = 80% ของมูลค่า)
- Safety Stock: สต็อกสำรองป้องกันขาดแคลน
- Reorder Point: จุดสั่งซื้อใหม่
- JIT: Just-in-Time (ลดสต็อก)

---

## 4. บัญชีเจ้าหนี้ (Accounts Payable)

### Three-Way Match
1. Purchase Order (PO)
2. Goods Receipt / Delivery Note
3. Supplier Invoice
→ ทั้ง 3 ต้องตรงกันก่อนอนุมัติจ่าย

### Payment Terms
- Net 30/60/90: จ่ายภายใน 30/60/90 วัน
- 2/10 Net 30: ลด 2% ถ้าจ่ายภายใน 10 วัน
- วิเคราะห์ว่าควรใช้ discount หรือไม่ (เปรียบกับ cost of capital)

---

## 5. Internal Controls (COSO Framework)

### 5 องค์ประกอบ
1. **Control Environment:** วัฒนธรรมองค์กร, จรรยาบรรณ
2. **Risk Assessment:** ระบุและประเมินความเสี่ยง
3. **Control Activities:** มาตรการควบคุม
4. **Information & Communication:** ระบบข้อมูลและการสื่อสาร
5. **Monitoring:** ติดตามและประเมินผล

### Segregation of Duties
แยกหน้าที่ 4 ประการ:
- **Authorization:** อนุมัติรายการ
- **Recording:** บันทึกรายการ
- **Custody:** ดูแลสินทรัพย์
- **Verification:** ตรวจสอบ

**ห้ามให้คนเดียวทำมากกว่า 2 หน้าที่**

### Control Activities ที่สำคัญ
- Dual Approval สำหรับรายการใหญ่
- Surprise Cash Counts
- Regular Reconciliations
- Access Controls ในระบบ IT
- Physical Security

---

## 6. Fraud Prevention

### Red Flags
- ยอดเงินสดไม่ตรงกับบัญชี
- ลูกหนี้เพิ่มขึ้นผิดปกติ
- ค่าใช้จ่ายเพิ่มขึ้นโดยไม่มีเหตุผล
- พนักงานไม่ยอมลาพักร้อน
- ใช้ชีวิตเกินฐานะ

### มาตรการป้องกัน
- Whistleblower Program
- Surprise Audits
- Background Checks
- Rotation of Duties
- Strong IT Controls
