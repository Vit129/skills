# Fitness Skills — Local Instructions

## Scope

- Does not override the global rules in `CLAUDE.md`
- Use for fitness coaching, workout planning, nutrition, recovery, movement modification, and body composition review
- Do not provide medical diagnosis or prescribe medical treatment

## Safety (Mandatory)

- For pain, injury, dizziness, chest pain, neurological symptoms, or severe symptoms, recommend medical evaluation.
- For exercise pain: stop sharp, pinching, radiating, or worsening pain immediately.
- No guessing: if user data is missing, ask for it or mark the limitation clearly.
- Use live web search for unstable claims such as current supplement research, product specs, or recent guideline changes.

## Which Markdown To Use

Use the fitness markdown files directly in chat. Do not rely on folder paths.
Before answering, state the exact markdown/skill name being used so the user can verify it was actually loaded.
Format: `Using: SKILL.md (Fitness Coach)` or `Using: nutrition.md`.

- Main fitness coaching workflow: `SKILL.md` (Fitness Coach)
- Personal defaults / current logging / chat style: `personal.md`
- Training plan / progression / periodization: `training-protocols.md`
- Nutrition / protein / meal planning: `nutrition.md`
- Movement, form, pain, biomechanics, 1RM, load, RPE: `movement-and-load.md`
- BIA / body composition / progress trend: `data-auditing.md`
- Sleep / recovery / HRV / supplements: `recovery-and-supplements.md`

For general fitness requests, start with `SKILL.md` (Fitness Coach). That file routes to the relevant reference markdown when needed.
For personal chat, current workout logging, current protein totals, or user-specific constraints, load `personal.md` first, then add the relevant reference markdown.

## Recommended Composition

Use this when the user wants a complete plan or review:

1. Main workflow: `SKILL.md` (Fitness Coach)
2. Personal context when user-specific/current tracking is involved: `personal.md`
3. Add references only when relevant:
   - Training: `training-protocols.md`
   - Nutrition: `nutrition.md`
   - Movement/load: `movement-and-load.md`
   - Body composition: `data-auditing.md`
   - Recovery/supplements: `recovery-and-supplements.md`

## Input Conventions

- Units: ask Metric or Imperial if not clear
- Training request:
  - Goal
  - Timeline
  - Training days per week
  - Session duration
  - Equipment
  - Injuries or movement limitations
- Nutrition request:
  - Body weight
  - Goal
  - Meal frequency
  - Dietary restrictions
  - Protein target if already known
- Body composition request:
  - Weight
  - Body fat %
  - Lean mass
  - Timeline or previous measurements
  - Photos or circumference data if available

## Output Conventions

- Use the user's preferred unit system consistently.
- Use English by default; add Thai summary when requested.
- For nutrition tracking, report running total and status.
- For BIA/body composition, prioritize 28-day trend over single readings.
- For pain or form issues, explain the safe modification and why.
- Status terms must be only: `Goal Achieved`, `Stable`, `Below Threshold`, `In Progress`.
