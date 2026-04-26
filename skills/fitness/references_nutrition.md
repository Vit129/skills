# Reference: Nutrition & Protein Tracking (Parameterized)

## Unit System Configuration

**Collect from user upfront OR detect by region:**

### Option 1: User Selects Units
* **Preferred Unit System:** Imperial (lb, oz, kcal) / Metric (kg, g, kJ)
* **Language/Region:** Thailand / USA / EU / Other
* System auto-converts all recommendations

### Option 2: Auto-Detect by Region
| Region | Default System | Weight | Protein | Energy |
|---|---|---|---|---|
| Thailand, Asia-Pacific | Metric | kg | g | kcal |
| USA, UK, Canada | Imperial | lb | g | kcal |
| EU, Australia | Metric | kg | g | kcal |

### Option 3: Flexible (User can input in any unit)
* User inputs: "180 lb" or "81 kg" → system normalizes internally
* System detects unit from input → converts automatically
* Output in user's preferred unit

**Implementation:** On first interaction, ask: "Do you prefer Imperial (lb) or Metric (kg)?"

---

## Unit Conversion Reference

### Weight Conversions
* 1 lb = 0.453592 kg
* 1 kg = 2.20462 lb
* 1 oz = 28.3495 g

### Protein Target Multipliers (Unit-Agnostic)
* **Low-protein:** 0.6g per lb BW = 1.32g per kg BW
* **Standard:** 0.8g per lb BW = 1.76g per kg BW
* **High-protein:** 1.0g per lb BW = 2.2g per kg BW

**Calculation Template:**
* **Imperial:** BW (lb) × [0.6–1.0] = daily protein (g)
* **Metric:** BW (kg) × [1.32–2.2] = daily protein (g)

---

## User-Configurable Parameters

Collect from user upfront:

### 1. Unit System & Demographics
* **Preferred Units:** Imperial / Metric
* **Current Weight:** [User Input] + unit (lb or kg)
* **Height:** [User Input] (cm or ft/in)
* **Region:** For default unit + language (English / Thai / Other)

### 2. Dietary Profile
* **Dietary Paradigm:** Low-carb / Balanced / High-carb
* **Meal Frequency:** 2 meals, 3 meals, 4+ meals
* **Dietary Restrictions:** None / Vegetarian / Vegan / Keto / Allergies

### 2. Protein Targets (User-Defined)
* **Workout Day Target:** [User Input] g/day (default: 120–130g)
* **Rest Day Target:** [User Input] g/day (default: 100–110g)
* **Basis:** BW × [0.8–1.0g per lb BW] = baseline
  * Example: 180 lb person = 144–180g protein target

### 3. Meal Distribution Strategy
* **Option A:** Equal distribution across meals (total ÷ meal count)
* **Option B:** Front-loaded (larger breakfast/lunch, smaller dinner)
* **Option C:** Custom per-meal targets [User defines per meal]
* **Option D:** Flexible (track running total, aim for daily target)

### 4. Reset Schedule
* **Daily Reset Time:** [User Input] (default: 00:01 / midnight)
* **Tracking Method:** Running total OR per-meal targets

---

## Calculation Workflow (Dynamic)

### Step 1: Determine Training Day Type
**User Input:** "Workout day" OR "Rest day" OR "Light activity day"

### Step 2: Apply Protein Target (Unit-Aware)
* If workout day → use **Workout Day Target** [param in user's preferred unit]
* If rest day → use **Rest Day Target** [param in user's preferred unit]
* If custom → use **Custom Target** [param in user's preferred unit]

**Auto-Conversion Example:**
* User weight: 180 lb (Imperial)
* Calculation: 180 lb × 0.9g/lb = 162g protein
* Display: "162g per day" (if Imperial preferred) OR "162g per day" (metric — protein is always g)
* If BW needed in kg: 180 lb ÷ 2.2 = 81.8 kg

### Step 3: Calculate Per-Meal Protein (Based on Strategy)
**Option A: Equal Distribution**
```
Per-Meal Protein = Total Target ÷ Meal Count
Example: 120g target, 3 meals = 40g per meal
```

**Option B: Front-Loaded (70/20/10 split)**
```
Meal 1: 70% of total
Meal 2: 20% of total
Meal 3: 10% of total
Example: 120g target = 84g / 24g / 12g
```

**Option C: Custom Per-Meal**
```
Meal 1: [User defines] g
Meal 2: [User defines] g
Meal 3: [User defines] g
(Total must = Daily Target)
```

**Option D: Flexible Running Total**
```
Track each meal's protein
Running total = sum of all meals so far
No per-meal constraint; only daily total matters
```

### Step 4: Report & Track
* Display current meal's protein intake
* Add to running total
* Show: Current Total / Daily Target (%)
* Reset at user-defined time (default: 00:01)

---

## Sample Calculations

### Example 1: Fixed Distribution (3 meals, 120g)
* **Meal 1:** 40g protein
* **Meal 2:** 40g protein
* **Meal 3:** 40g protein
* **Daily Total:** 120g (Goal Achieved if ≥ 120g)

### Example 2: Front-Loaded (3 meals, 130g)
* **Meal 1:** 91g protein (70%)
* **Meal 2:** 26g protein (20%)
* **Meal 3:** 13g protein (10%)
* **Daily Total:** 130g

### Example 3: Custom Per-Meal (4 meals, 140g)
* **Meal 1 (Breakfast):** 35g
* **Meal 2 (Snack):** 25g
* **Meal 3 (Lunch):** 50g
* **Meal 4 (Dinner):** 30g
* **Daily Total:** 140g

### Example 4: Flexible Running Total
* Meal 1: 38g → Running Total: 38g / 120g (31%)
* Meal 2: 42g → Running Total: 80g / 120g (67%)
* Meal 3: 45g → Running Total: 125g / 120g (104% — Goal Achieved ✅)

---

## Status Reporting Rules

**Report status ONLY as:**
* ✅ **Goal Achieved** — Daily protein total ≥ Daily Target
* 🔄 **Stable** — Previous 3 days average within ±5g of target
* ⚠️ **Below Threshold** — Daily total < 90% of target
* ⏱️ **In Progress** — Mid-day; not yet reset; tracking active

**Output Format (NO TABLES):**
* Meal consumed: [meal name]
* Protein intake: [X]g
* Running total: [Y]g / [target]g ([%])
* Status: [one of above]

---

## Dietary Paradigm Adjustments

### Low-Carbohydrate
* Protein target: higher end (0.9–1.0g per lb BW)
* Carbs: <50g/day or <20% calories
* Fat: fills remaining calories
* Examples: chicken breast, eggs, fish, beef, Greek yogurt

### Balanced (Standard)
* Protein target: mid-range (0.7–0.8g per lb BW)
* Carbs: 40–50% calories
* Fat: 25–30% calories
* Examples: lean meats, brown rice, oats, vegetables, nuts

### High-Carb
* Protein target: lower end (0.6–0.7g per lb BW)
* Carbs: 50–60% calories
* Fat: 20–25% calories
* Examples: poultry, whole grains, fruits, legumes

---

## Flexible Adjustments

**If user is consistently above target (+10g):**
* Option 1: Reduce daily target by 5–10g (new baseline)
* Option 2: Reduce meal sizes proportionally
* Option 3: Keep current; document as "consistent overage"

**If user is consistently below target (-10g):**
* Option 1: Increase daily target by 5–10g (raise bar)
* Option 2: Adjust meal distribution (add to highest-protein meal)
* Option 3: Add protein supplement (protein shake, bar)

**If user changes dietary paradigm:**
* Recalculate target = BW × new multiplier
* Adjust meal distribution to match new target
* Reset baseline (first 3 days establish new pattern)
