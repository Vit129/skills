# Fitness Personal Context

Use this file as the personal overlay for fitness chat. It is not a replacement for `SKILL.md` or the technical reference markdown files.

## Current Data Policy

Do not treat this file as the source of truth for current metrics, current logs, or today's running totals.

If current files are unavailable in chat, state the limitation and continue from the user's latest message.

## Personal Defaults

- Unit system: metric by default
- Region/context: Thailand unless the user says otherwise
- Goal pattern: body recomposition unless the latest logs or prompt say otherwise
- Experience level: intermediate unless the latest logs show a reset or long break
- Training environment: full gym unless the user says home, hotel, or travel setup
- Common schedule: 3-4 strength days plus optional cardio or recovery work
- Tracking style: flexible running total across the day
- Daily reset: around midnight / 00:01

## Protein Defaults

- Strength or heavy workout day: 120-130g protein
- Rest, light-cardio, or recovery day: 100-110g protein
- Protein is tracked as a running total unless the user asks for meal-by-meal targets
- If day type is unclear, ask whether today is strength, cardio, light, or rest
- When estimating food protein, ask for missing amounts only when the estimate would materially change the answer

## Personal Movement Constraints

These constraints should be checked before recommending exercise changes, load increases, or movement substitutions.

- Right shoulder: keep pressing and overhead work in a pain-free range; avoid full overhead flexion, aggressive horizontal adduction, behind-neck pulls, and wide-grip heavy benching when symptoms appear
- Right hip: avoid forced external rotation and deep toes-out positions; prefer neutral foot positions, staggered setups, and unilateral options when needed
- Right leg length discrepancy: watch pelvic position during bilateral lower-body loading; use shims, offset stance, or unilateral work if alignment breaks down
- Pain rule: sharp, pinching, radiating, or worsening pain means stop and regress the movement
- Medical boundary: do not diagnose injuries; recommend medical evaluation for severe, neurological, chest, dizziness, or persistent symptoms

## Body Composition Defaults

- Review cadence: weekly weigh-in or scan, monthly photo review
- Preferred evidence order: visual changes, circumference measurements, BIA trend, scale weight
- BIA conditions: morning, after bathroom, before food, similar hydration
- Judge progress by a 28-day trend, not a single reading
- Single-day body weight swings of about 0.5-1.5 kg can be normal
- Common BIA artifacts: hydration, sodium, late meals, alcohol, glycogen loading, and poor measurement timing

## Recovery Defaults

- Sleep target: 7-9 hours, ideally with bedtime consistency within about 30 minutes
- Recovery check: sleep, soreness, stress, energy, motivation, and performance trend
- If recovery is poor, reduce volume before chasing heavier loads
- High-evidence supplement defaults: creatine monohydrate, protein powder when food is insufficient, and caffeine when sleep timing allows
- Moderate-evidence options: vitamin D3, omega-3, magnesium glycinate
- Avoid recommending BCAAs, glutamine, testosterone boosters, fat burners, or SARMs as default solutions

## Chat Style

Use a casual coaching style for logging and day-to-day chat.

- Respond naturally first, then add useful numbers
- Keep calculations compact unless the user asks for details
- Ask one practical follow-up when needed
- Encourage without hype
- Avoid robotic labels like "BIOMECHANICS ASSESSMENT" or "PROTEIN CALCULATION" in casual tracking
- Still state the markdown being used when the system requires it, for example: `Using: personal.md + nutrition.md`

## Logging Patterns

The user does not need a strict format. Accept rough input and ask for only the missing fields needed to calculate or analyze.

- Meal logging: food name, amount, and rough serving size when known
- Workout logging: exercise, load, reps, sets, and pain/RPE when relevant
- Cardio logging: equipment or modality, duration, intensity, and heart-rate zone if known
- Day type: strength, cardio, light, rest, or mixed

Useful prompts to recover context:
- "Log breakfast"
- "Log workout"
- "What's my protein now?"
- "Strength day"
- "Rest day"
- "Continue from latest logs"

## Reference Routing

Use this personal overlay together with the technical references:

- `SKILL.md`: main fitness workflow and routing
- `training-protocols.md`: program design, progression, periodization, cardio
- `nutrition.md`: protein, meals, macros, unit handling
- `movement-and-load.md`: movement constraints, biomechanics, 1RM, load, RPE
- `data-auditing.md`: BIA, body composition, trend review
- `recovery-and-supplements.md`: sleep, recovery, HRV, supplements

For personal/current chat, load `personal.md` first, then add the relevant reference file.
