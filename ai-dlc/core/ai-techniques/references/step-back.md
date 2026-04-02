# Step-Back Prompting

Zoom out to see the big picture before diving into details.

## When to use
- About to start a complex task and feeling pulled toward details too early
- Requirements feel unclear or contradictory
- Need to align on goals before choosing an approach

## How it works
1. Pause — don't start solving yet
2. Ask high-level questions appropriate to the context
3. Answer them honestly — even if the answer is "I don't know yet"
4. Use the answers to frame the detailed work that follows

## Questions to ask

**Business Context:**
- What is the actual goal? What does success look like?
- Who benefits and how? What's the business value?
- What's the scope boundary? What's explicitly out?

**Technical Context:**
- What's the core pattern? (CRUD / workflow / integration / analysis)
- What architecture constraints exist? (performance, security, compliance)
- What's the riskiest technical decision?

**Domain Context:**
- What domain concepts are involved? How do they relate?
- What's reusable from other domains? What's unique?
- What business rules are hidden in the requirements?

**Asset Reuse Context:**
- What similar features exist in the codebase?
- What common patterns can be extracted? (auth, CRUD, validation)
- What's the reuse ratio? (>60% = cheap feature, <30% = rethink architecture)

## Tips
- This takes 30 seconds of thinking but saves hours of rework
- If you can't answer "what does success look like?" — you're not ready to start
- Works for any domain: coding, design, writing, planning, debugging
