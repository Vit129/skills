# Reference: Financial Planning & Capital Budgeting

## 1. งบประมาณประจำปี (Annual Budget)

### ลำดับการจัดทำงบประมาณ
1. Sales Budget → Production Budget → Material/Labor/Overhead Budget
2. Operating Expense Budget → Capital Expenditure Budget
3. Budgeted Income Statement → Budgeted Balance Sheet → Cash Budget

### Variance Analysis (Budget vs Actual)
| ประเภท | สูตร | ความหมาย |
|---|---|---|
| Material Price Variance | (Actual Price - Standard Price) × Actual Qty | ราคาวัตถุดิบ |
| Material Usage Variance | (Actual Qty - Standard Qty) × Standard Price | ปริมาณวัตถุดิบ |
| Labor Rate Variance | (Actual Rate - Standard Rate) × Actual Hours | อัตราค่าแรง |
| Labor Efficiency Variance | (Actual Hours - Standard Hours) × Standard Rate | ประสิทธิภาพแรงงาน |
| Sales Price Variance | (Actual Price - Budget Price) × Actual Volume | ราคาขาย |
| Sales Volume Variance | (Actual Volume - Budget Volume) × Standard Margin | ปริมาณขาย |

---

## 2. Capital Budgeting

### วิธีการประเมิน

**Payback Period**
- จำนวนปีที่ใช้คืนทุน
- ง่าย แต่ไม่คำนึงถึง Time Value of Money
- Decision: เลือก Project ที่ Payback สั้นกว่า

**Net Present Value (NPV)**
```
NPV = Σ [CF_t / (1+r)^t] - Initial Investment
```
- r = Discount Rate (WACC)
- Decision: NPV > 0 → Accept

**Internal Rate of Return (IRR)**
- อัตราผลตอบแทนที่ทำให้ NPV = 0
- Decision: IRR > Cost of Capital → Accept
- ข้อจำกัด: Multiple IRR ถ้า Cash Flow เปลี่ยนทิศทางหลายครั้ง

**Profitability Index (PI)**
```
PI = PV of Future Cash Flows / Initial Investment
```
- Decision: PI > 1 → Accept
- ใช้เปรียบเทียบ Projects ที่มีขนาดต่างกัน

---

## 3. Cost-Volume-Profit Analysis

**Break-Even Point (Units)**
```
BEP = Fixed Costs / Contribution Margin per Unit
```

**Break-Even Point (Sales)**
```
BEP = Fixed Costs / Contribution Margin Ratio
```

**Contribution Margin**
```
CM = Sales - Variable Costs
CM Ratio = CM / Sales
```

**Margin of Safety**
```
MOS = Actual Sales - Break-Even Sales
MOS % = MOS / Actual Sales
```

**Operating Leverage**
```
DOL = Contribution Margin / Operating Income
```
- DOL สูง = กำไรผันผวนมากเมื่อยอดขายเปลี่ยน

---

## 4. Relevant Costing for Decisions

### Make or Buy
- เปรียบเทียบ: ต้นทุนผลิตเอง vs ราคาซื้อ
- คำนึงถึง: Opportunity Cost, Qualitative Factors

### Special Pricing
- รับ Order พิเศษถ้า: ราคา > Variable Cost (ถ้ามี Idle Capacity)
- ไม่นับ Fixed Cost ที่เกิดขึ้นอยู่แล้ว

### Discontinuance Decision
- หยุดผลิตถ้า: Contribution Margin < 0
- หรือถ้า CM < Avoidable Fixed Costs

### Sell or Process Further
- Process Further ถ้า: Incremental Revenue > Incremental Cost

---

## 5. Risk Management

### ประเภทความเสี่ยง
- **Operational Risk:** กระบวนการ, ระบบ, คน
- **Financial Risk:** เครดิต, สภาพคล่อง, ตลาด, อัตราแลกเปลี่ยน
- **Compliance Risk:** กฎหมาย, ภาษี, สัญญา
- **Strategic Risk:** ตลาด, คู่แข่ง, เทคโนโลยี

### Risk Matrix
- ประเมิน: ความน่าจะเป็น × ผลกระทบ
- จัดลำดับ: High/Medium/Low
- กำหนดมาตรการ: Avoid/Reduce/Transfer/Accept

### Hedging
- **Currency Hedge:** Forward Contract, Options
- **Interest Rate Hedge:** Interest Rate Swap
- **Commodity Hedge:** Futures Contract
