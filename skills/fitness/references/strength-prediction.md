# Reference: Strength Prediction & Load Estimation (Unit-Aware)

## Unit System Configuration

**1RM calculations and load percentages work in any unit:**

### Metric System (kg)
* Use kg for all weight values
* Example: Lift 80 kg for 5 reps → calculate 1RM in kg
* Load ranges: Use 85–95% of 1RM in kg

### Imperial System (lbs)
* Use lbs for all weight values
* Example: Lift 175 lbs for 5 reps → calculate 1RM in lbs
* Load ranges: Use 85–95% of 1RM in lbs

### Conversion (If needed)
* 1 kg = 2.2 lbs
* 1 lb = 0.453 kg
* Formulas work in either unit independently

**System Behavior:**
* User inputs weight in their preferred unit
* 1RM calculated and displayed in same unit
* Load percentages apply equally (math is unit-independent)
* User can request conversion: "What's my 100 kg 1RM in lbs?"

---

## 1RM (One-Rep Max) Calculation

### Method 1: Brzycki Formula (Most Accurate)
```
1RM = Weight × (36 / (37 - Reps))
```

**Example (Metric):**
* Lifted 80 kg for 5 reps
* 1RM = 80 × (36 / (37 - 5)) = 80 × (36 / 32) = 80 × 1.125 = **90 kg**

**Example (Imperial):**
* Lifted 175 lbs for 5 reps
* 1RM = 175 × (36 / (37 - 5)) = 175 × 1.125 = **197 lbs**

### Method 2: Epley Formula (Alternative)
```
1RM = Weight × (1 + Reps / 30)
```

**Example (Metric):**
* Lifted 80 kg for 5 reps
* 1RM = 80 × (1 + 5/30) = 80 × 1.167 = **93.3 kg**

**Example (Imperial):**
* Lifted 175 lbs for 5 reps
* 1RM = 175 × (1 + 5/30) = 175 × 1.167 = **204 lbs**

### Method 3: Direct Testing (Most Reliable)
* Warm up thoroughly (10 reps × 50%, 5 reps × 70%, 3 reps × 85%)
* Attempt singles, adding 5–10 kg until form breaks
* Last successful heavy single = 1RM
* **Safety:** Have spotter; failure = form breakdown first

---

## Load Ranges by Training Goal

### Strength (3–6 reps)
* Load: 85–95% of 1RM
* Example (Metric): 1RM = 100 kg → use 85–95 kg
* Example (Imperial): 1RM = 220 lbs → use 187–209 lbs
* Rest: 2–3 min between sets
* Volume: 5–10 sets per lift

### Hypertrophy (6–12 reps)
* Load: 65–85% of 1RM
* Example (Metric): 1RM = 100 kg → use 65–85 kg
* Example (Imperial): 1RM = 220 lbs → use 143–187 lbs
* Rest: 60–90 sec between sets
* Volume: 10–20 sets per muscle group

### Endurance (12+ reps)
* Load: <65% of 1RM
* Example (Metric): 1RM = 100 kg → use <65 kg
* Example (Imperial): 1RM = 220 lbs → use <143 lbs
* Rest: 30–45 sec between sets
* Volume: 20+ sets per muscle group

---

## RPE (Rate of Perceived Exertion) Scale

Use this to autoregulate load without calculating 1RM:

| RPE | Definition | Reps in Reserve |
|---|---|---|
| 5 | Very Easy | 5+ |
| 6 | Easy | 4 |
| 7 | Moderate | 3 |
| 8 | Hard | 2 |
| 9 | Very Hard | 1 |
| 10 | Maximum (can't do another rep) | 0 |

**For Strength Work:** Stop at RPE 8–9 (leaving 1–2 reps)
**For Hypertrophy:** Stop at RPE 7–8 (leaving 2–3 reps)
**For Endurance:** Go to RPE 9–10 (if safe)

---

## Progression Recommendations by Current Load

| Current Load | Beginner | Intermediate | Advanced |
|---|---|---|---|
| **Strength Phase** | +2.5 kg/session | +5 kg/session | +2.5 kg per week |
| **Hypertrophy Phase** | +2.5–5 kg/week | +5 kg/week | +2.5 kg/week |
| **Deload Week** | Reduce 40% | Reduce 40–50% | Reduce 50% |

**Progression Criteria:** All reps completed with RPE ≤ 8

---

## Upper/Lower Body Strength Benchmarks

### Barbell Back Squat (Bodyweight Ratios)
* **Beginner:** 0.5–1.0× BW
* **Intermediate:** 1.5–2.0× BW
* **Advanced:** 2.5–3.0× BW+

### Barbell Bench Press
* **Beginner:** 0.5–0.75× BW
* **Intermediate:** 1.0–1.25× BW
* **Advanced:** 1.5–2.0× BW+

### Deadlift
* **Beginner:** 1.0–1.5× BW
* **Intermediate:** 2.0–2.5× BW
* **Advanced:** 3.0–3.5× BW+

**Note:** Individual variation is high; use benchmarks as reference only, not absolute target.

---

## Load Prescription Workflow

### Step 1: Assess Current Strength
* Perform 3–5 reps at challenging weight
* Apply Brzycki formula to estimate 1RM

### Step 2: Determine Training Goal
* Strength → 85–95% 1RM
* Hypertrophy → 70–80% 1RM
* Endurance → 50–65% 1RM

### Step 3: Calculate Working Load
* Example: 1RM = 100 kg, Goal = Hypertrophy (75%)
* Working Load = 100 × 0.75 = **75 kg**

### Step 4: Set Reps & Sets
* Strength: 3–5 reps, 5–8 sets
* Hypertrophy: 6–12 reps, 8–15 sets
* Endurance: 12+ reps, 15+ sets

### Step 5: Autoregulate by RPE
* If RPE < 6 at end of set → add weight next session
* If RPE = 8–9 (target) → maintain weight
* If RPE = 10 (all-out) → reduce weight or reps next session

---

## Failure vs. RPE Approach

| Approach | Method | When to Use |
|---|---|---|
| **Training to Failure** | Lift until can't complete rep | Isolation exercises, 12+ rep sets |
| **RPE 8–9** | Stop 1–2 reps short | Compound lifts, all phases (safer) |
| **RPE 7** | Stop 3 reps short | Hypertrophy, conservative progression |

**Recommendation:** Use RPE 8 for most training (balances intensity + safety)
