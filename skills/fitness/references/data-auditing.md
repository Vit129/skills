# Reference: Data Auditing & Body Composition Analysis (Unit-Aware)

## Unit System Configuration

**Body composition tracking adapts to user preference:**

### Metric System
* Weight: kg
* Lean Mass: kg
* Daily fluctuation tolerance: ±0.5–1.5 kg
* Trend threshold: ±0.5 kg per week

### Imperial System
* Weight: lbs
* Lean Mass: lbs
* Daily fluctuation tolerance: ±1–3 lbs
* Trend threshold: ±1 lb per week

### Auto-Conversion Reference
* 1 kg = 2.2 lbs
* 0.5 kg = 1.1 lbs
* 1 lb = 0.453 kg
* 1 lb ≈ 0.45 kg

**System Behavior:**
* User selects: Metric (kg) or Imperial (lbs)
* AI displays all weight data in selected unit
* AI adjusts fluctuation thresholds by unit system
* Body fat % and visceral fat (unit-independent)

---

## BIA (Bioelectrical Impedance Analysis) Review Protocol

### Key Metrics to Track
* **Total Weight** — Primary indicator; daily fluctuations normal (metric: ±0.5–1.5 kg | imperial: ±1–3 lbs)
* **Body Fat %** — Target range: 8–15% (athlete), 15–25% (fit), 25%+ (elevated)
* **Lean Mass** — Muscle, organs, water; should remain stable or increase (metric: kg | imperial: lbs)
* **Visceral Fat** — Organ fat; minimize (risk when >50 on scale) — unit-independent
* **Water %** — 50–60% normal; <50% = dehydration, >65% = water retention — unit-independent

---

## Assessment Framework: 28-Day Trend Analysis

**Collect data:** Same time, same conditions (morning, after bathroom, before eating)

| Week | Weight | Body Fat % | Lean Mass | Trend |
|---|---|---|---|---|
| Week 1 (Baseline) | [0 kg] | [0%] | [0 kg] | Establish baseline |
| Week 2 | [+/- kg] | [+/- %] | [+/- kg] | Single week → ignore; natural variance |
| Week 3 | [+/- kg] | [+/- %] | [+/- kg] | Two-week pattern emerging |
| Week 4 | [+/- kg] | [+/- %] | [+/- kg] | Confirm 28-day trend |

---

## Interpretation Rules

### Pattern 1: Weight ↓ | Lean Mass ↓ | Body Fat % ↑
**Meaning:** Muscle loss (caloric deficit too aggressive or training insufficient)
**Action:** Increase protein target by 10g; reduce deficit; add strength training
**Status:** Below Threshold

### Pattern 2: Weight → | Lean Mass ↑ | Body Fat % ↓
**Meaning:** Body recomposition (gaining muscle, losing fat simultaneously)
**Action:** Continue current protocol; maintain consistency
**Status:** Goal Achieved

### Pattern 3: Weight ↑ | Lean Mass ↑ | Body Fat % →
**Meaning:** Muscle gain with some fat gain (surplus working, training effective)
**Action:** Acceptable for bulking phase; monitor bf% doesn't exceed target
**Status:** Goal Achieved (if within acceptable range)

### Pattern 4: Weight ↑ | Lean Mass → | Body Fat % ↑
**Meaning:** Fat gain without muscle gain (surplus too aggressive, training not optimized)
**Action:** Reduce surplus by 200 cal; prioritize strength training
**Status:** Below Threshold

---

## Data Quality: Visual Evidence Hierarchy

**Priority 1 (Most Reliable):** Progress photos (front, side, back, same lighting)
**Priority 2:** Circumference measurements (waist, chest, thigh)
**Priority 3:** BIA data (useful for trends, not absolute values)
**Priority 4:** Scale weight alone (highly variable, least reliable)

### Photo-Based Assessment
* Take monthly: same pose, same lighting, same time of day
* Compare visually: muscle definition, shape, symmetry
* Use as PRIMARY evidence; BIA confirms trend

---

## Common BIA Artifacts (Not Real Changes)

| Artifact | Cause | Duration | Fix |
|---|---|---|---|
| Weight ↑ 1–2 kg | Dehydration | 24–48 hours | Drink 2–3L water |
| Body Fat % ↑ | High sodium dinner | 24–48 hours | Resume normal sodium |
| Lean Mass ↑ | Glycogen loading | 24 hours | Normal carbs |
| Visceral Fat ↑ | Alcohol/late meal | 12–24 hours | Return to routine |

**Protocol:** If outlier detected, retest after 48 hours under identical conditions.

---

## Reporting Standards

**Status Classification (ONLY):**
* **Goal Achieved** — Trend supports stated objective over 28 days
* **Stable** — No significant change; maintenance phase acceptable
* **Below Threshold** — Trend opposes objective; intervention needed

**Example Reports:**
* ✅ "Goal Achieved: 2 kg lean mass gained, body fat % stable over 28 days—continue current protocol"
* 🔄 "Stable: Weight ±0.5 kg, bf% fluctuating 0–1%—expected maintenance pattern"
* ⚠️ "Below Threshold: Lean mass declined 0.8 kg, bf% increased 1.2%—reduce deficit, increase protein"

---

## Reassessment Schedule
* **Weekly:** Weight check (establish variance baseline)
* **Biweekly:** Body composition scan (if BIA available)
* **Monthly:** Progress photos + circumference measurements
* **Every 4 weeks:** Full 28-day trend review + intervention if needed
