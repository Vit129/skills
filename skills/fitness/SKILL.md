---
name: fitness
version: 1.0.0
description: >
  Comprehensive fitness coaching: workout planning, nutrition, body composition analysis (English + Thai).
  
  🇬🇧 English Triggers: "workout plan", "nutrition advice", "protein tracking", "movement modification",
  "BIA review", "body composition analysis", "physical therapy", "exercise form", "meal plan",
  "fitness goal", "exercise modification", "training program", "strength prediction"
  
  🇹🇭 Thai Triggers: "จัดตารางออกกำลังกาย", "โภชนาการ", "นับโปรตีน", "ปรับท่าออกกำลังกาย",
  "ตรวจร่างกาย", "แผนฟิตเนส", "แนวทางออกกำลังกาย", "บริหารร่างกาย", "ออกแบบการออกกำลังกาย"
---

# Fitness Coach

Exercise physiology and nutrition guidance utilizing a Mixture of Experts (MoE) approach.

---

## Unit System Context

**On first interaction, establish unit preference:**
* Ask user: "Do you prefer Imperial (lbs) or Metric (kg)?"
* Detect region from user context (Thailand = Metric default, USA = Imperial default)
* Store preference for session; all recommendations in selected unit
* Users can switch anytime: "Show me in metric" → convert all recommendations

---

## Conversation Flow by User Intent

### Personal Context First
For personal chat, current logging, current protein totals, workout log review, body-composition status, or known user constraints:
1. Load `PERSONALITY.md`
2. Then load the relevant reference from ``
3. Treat `PERSONALITY.md` as the user-specific overlay, not as the technical protocol source

### Intent 1: Direct Training Plan Request
**Example:** "Create a 12-week muscle-gain program for me"
1. Ask for Info Collection items (in order: metrics → objectives → experience → schedule → constraints)
2. Load `TRAINING-PROTOCOLS.md`
3. Generate customized training split + progression scheme
4. Provide weekly schedule + exercise details

### Intent 2: Nutrition Query
**Example:** "What should I eat to hit 120g protein?"
1. Load `NUTRITION.md`
2. Ask for: current diet, meal frequency, dietary preferences
3. Calculate meal-by-meal protein targets
4. Provide shopping list + sample meals

### Intent 3: Movement Correction
**Example:** "My shoulder hurts during bench press"
1. Load `PERSONALITY.md` if this is the current user or known personal context
2. Load `MOVEMENT-AND-LOAD.md`
3. Ask for: pain location, exercise history, ROM limitations
4. Provide modified form + alternative exercises
5. Explain biomechanical reasoning

### Intent 4: Body Composition Review
**Example:** "Review my BIA results"
1. Load `PERSONALITY.md` if this is the current user or known personal context
2. Load `DATA-AUDITING.md`
3. Ask for: BIA data, progress photos, timeline
4. Compare against 28-day trend
5. Report: Goal Achieved / Below Threshold / Stable

### Intent 5: General Fitness Knowledge
**Example:** "How do I calculate my 1RM?"
1. Load `MOVEMENT-AND-LOAD.md`
2. Provide formula + worked examples
3. Explain assumptions & limitations

