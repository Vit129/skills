# Interview Me

One-question-at-a-time until ~95% confidence — before any spec or code.

## Process

**Step 1 — Assess confidence internally:**
```
Current confidence: [X]%
What I know: [list] | What I don't know: [list]
```
Target: 95% before proceeding.

**Step 2 — Ask ONE question at a time:**
- Most important unknown first
- Always give recommended answer (from codebase/context if available)
- If answer is in codebase → explore first, don't ask
- Accept "ยังไม่แน่ใจ" — note it, move on
- Max 10 questions. More = scope too big → suggest splitting

**Format:**
```
Q: [คำถาม]
💡 Recommended: [คำตอบที่แนะนำ]
→ confirm, แก้ หรือ ปฏิเสธ
```

**Step 3 — Track progress after each answer:**
```
Confidence: [old]% → [new]% | Resolved: [...] | Remaining: [...]
```

**Step 4 — Update CONTEXT.md inline** when domain term is resolved.

**Step 5 — Summarize at 95%:**
```markdown
## Interview Summary
**What we're building:** [1-2 sentences]
**Key decisions:** [list]
**Scope:** In: [...] | Out: [...]
**Unconfirmed assumptions:** [flagged]
**Confidence: 95%+** → Ready for /spec or AIDLC Phase 0
```

## Question Order
1. WHAT — goal, end result, who uses it
2. WHY — motivation, what happens if not built
3. SCOPE — must-have vs nice-to-have, constraints
4. HOW — existing systems, tech stack preference
5. EDGE CASES — special scenarios, boundary conditions
