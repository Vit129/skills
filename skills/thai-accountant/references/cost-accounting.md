# Reference: Cost Accounting (บัญชีต้นทุน)

## 1. Job Order Costing

**ใช้กับ:** การผลิตตามคำสั่ง, งานก่อสร้าง, บริการเฉพาะราย

### การบันทึกต้นทุน
- Direct Materials: Dr. WIP / Cr. Raw Materials
- Direct Labor: Dr. WIP / Cr. Wages Payable
- Manufacturing Overhead: Dr. WIP / Cr. MOH Applied

### Overhead Application Rate
```
Predetermined OH Rate = Budgeted OH / Budgeted Activity Base
```
- Activity Base: Direct Labor Hours, Machine Hours, Direct Labor Cost

### Over/Under Applied Overhead
- Over-applied: OH Applied > Actual OH → ปรับลด COGS
- Under-applied: OH Applied < Actual OH → ปรับเพิ่ม COGS

---

## 2. Process Costing

**ใช้กับ:** การผลิตต่อเนื่อง, อุตสาหกรรมเคมี, อาหาร

### Equivalent Units
```
EU = Units Completed + (Units in Ending WIP × % Complete)
```

### วิธี Weighted Average
```
Cost per EU = (Beginning WIP Cost + Current Period Cost) / Total EU
```

### วิธี FIFO
```
Cost per EU = Current Period Cost / EU (ไม่รวม Beginning WIP)
```

### Joint Products & By-Products
- Joint Products: แยกต้นทุนตาม Sales Value หรือ Physical Measure
- By-Products: บันทึกเป็น Other Income หรือลด Joint Cost

---

## 3. Activity-Based Costing (ABC)

### ขั้นตอน
1. ระบุกิจกรรม (Activities)
2. กำหนด Cost Driver สำหรับแต่ละกิจกรรม
3. คำนวณ Cost per Activity
4. จัดสรรต้นทุนให้ผลิตภัณฑ์ตาม Cost Driver

### ตัวอย่าง Activities
| Activity | Cost Driver |
|---|---|
| Machine Setup | จำนวนครั้ง Setup |
| Quality Inspection | จำนวนชั่วโมงตรวจสอบ |
| Material Handling | จำนวนครั้งเคลื่อนย้าย |
| Customer Service | จำนวนคำสั่งซื้อ |

**ข้อดี:** ต้นทุนแม่นยำกว่า Traditional Costing
**ข้อเสีย:** ซับซ้อน ใช้เวลามาก

---

## 4. Standard Costing & Variance Analysis

### Standard Cost Card
- Standard Material Cost = Standard Qty × Standard Price
- Standard Labor Cost = Standard Hours × Standard Rate
- Standard OH = Standard Hours × OH Rate

### Variance Analysis

**Material Variances:**
```
Price Variance = (Actual Price - Standard Price) × Actual Qty
Usage Variance = (Actual Qty - Standard Qty) × Standard Price
```

**Labor Variances:**
```
Rate Variance = (Actual Rate - Standard Rate) × Actual Hours
Efficiency Variance = (Actual Hours - Standard Hours) × Standard Rate
```

**Overhead Variances:**
```
Spending Variance = Actual OH - Budgeted OH
Volume Variance = Budgeted OH - Applied OH
Efficiency Variance = (Actual Hours - Standard Hours) × OH Rate
```

---

## 5. Target Costing

**Target Cost = Target Selling Price - Target Profit**

- กำหนดราคาขายจากตลาด
- กำหนดกำไรที่ต้องการ
- ต้นทุนที่เหลือคือ Target Cost
- ออกแบบผลิตภัณฑ์ให้ต้นทุนไม่เกิน Target

---

## 6. Throughput Accounting (Theory of Constraints)

**Throughput = Sales Revenue - Direct Materials**

- ระบุ Bottleneck (คอขวด)
- เพิ่ม Throughput ที่ Bottleneck
- ลด Operating Expenses และ Inventory

**Throughput Accounting Ratio = Throughput per Bottleneck Hour / Operating Cost per Hour**
- TAR > 1: ทำกำไร
- TAR < 1: ขาดทุน
