---
name: Error Recovery Strategy Pattern
description: Systematic approach to handling failures and knowing when to escalate
type: lesson
scope: global
keywords: error handling, debugging, escalation, retry logic, persistence vs giving up
---

# Error Recovery Strategy

**Pattern:** Diagnose → Adjust → Verify → Loop/Escalate (max 3 different attempts)

## The Problem

Common mistakes:
- Retrying same approach 5+ times (insanity)
- Giving up too early (before root cause found)
- Escalating vaguely ("it doesn't work")
- Not distinguishing between "symptom" and "root cause"

## The Solution: 4-Step Loop

### 1. Diagnose (not panic)

**Read the error completely:**
- Entire error message, not just first line
- Stack trace / context (where did it fail, why)
- What was the expected behavior?

**Identify root cause, not symptom:**
- Symptom: "Test failed"
- Root cause: "Array index out of bounds because loop runs 1x too many"

**Verify your assumption:**
- "I thought X, but it's actually Y"
- Document the discovery

### 2. Adjust Approach (don't retry)

**Try something different:**
- Different strategy (not same thing again)
- Different angle (maybe not a code issue, but config)
- Different tool or method

**Examples:**
- Attempt 1: `npm install` failed → Attempt 2: `npm cache clean && npm install`
- Attempt 1: TypeScript compile error → Attempt 2: Check tsconfig.json
- Attempt 1: API call timeout → Attempt 2: Increase timeout, check network

**Gather more info if needed:**
- Add logging, check logs, grep codebase
- Run diagnostic command, review output
- Ask user for more context

### 3. Verify Fix Works

**Test the fix:**
- Does it solve the original problem?
- Any new side effects?
- Did it break anything else?

**Commit to understanding:**
- Can you explain why the fix works?
- Would you do it the same way next time?

### 4. Loop or Escalate

**If fix works:**
- Continue with the task
- Document pattern (might help next time)

**If 3 different approaches fail:**
- STOP trying
- Escalate to user (see Escalation Rules)
- Report what was tried: "Attempted X, Y, Z. All hit [common blocker]"
- Ask specifically: "Need your decision on A vs B" or "What's the environment?"

---

## Key Rules

| Rule | Why |
|------|-----|
| **Max 3 different attempts** | After that, you need more info or user guidance |
| **Different ≠ retry** | Retry = same thing again; Different = new strategy |
| **Diagnose first** | Don't fix symptoms, fix root cause |
| **Verify before continuing** | One-time fix isn't enough; it must be durable |
| **Report what was tried** | Helps user understand the problem scope |

---

## Example: Good Error Recovery

**Scenario:** Tests fail with "Cannot find module './helpers'"

**Attempt 1 (Diagnose):**
- Read error: module not found at `./helpers`
- Check file exists: `ls src/helpers.ts` — file exists
- Root cause hypothesis: wrong import path?

**Attempt 2 (Adjust):**
- Check actual import: `grep -r "from.*helpers" test/`
- Found: `from '../helpers'` but file is at `./helpers`
- Fix: Update import path

**Attempt 3 (Verify):**
- Run tests again
- All pass ✅
- Document: "Import paths were relative to wrong dir"

**Result:** Escalate? NO — fixed in 3 attempts, different strategy each time.

---

## Example: When to Escalate

**Scenario:** API returns 500 error, retry fails

**Attempt 1 (Diagnose):**
- Error: server returns 500
- Check logs: no errors in API logs
- Hypothesis: API is down or overloaded

**Attempt 2 (Adjust):**
- Check API status page: all systems nominal
- Try from different machine: same 500
- Try older endpoint version: same 500

**Attempt 3 (Adjust again):**
- Check if API requires new auth token: token is fresh
- Check if request format changed: format is valid
- Check firewall/proxy: no issues evident

**Result:** ESCALATE
- What was tried: API status check, different machines, older endpoints, auth, request format, network
- What's the blocker: "API consistently returns 500, no obvious cause in logs"
- What do you need: "Access to API logs or server status?" or "Is there an API incident I'm not seeing?"

---

## Patterns to Watch

**These patterns mean escalate:**
- Same error after 3 different fixes → env issue or missing context
- Different errors each attempt → system instability or missing dependency
- Can't identify root cause → need more visibility
- User's decision required → can't guess

**These patterns mean continue:**
- Error disappeared → fixed
- New error (more specific) → progressing toward solution
- Third attempt works differently → found the real issue
