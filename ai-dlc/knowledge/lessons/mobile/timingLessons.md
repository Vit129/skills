# Lesson: UI Synchronization (UI Slower than Code)

**ID:** L-MOB-001
**Category:** Timing & Synchronization
**Priority:** 🚨 CRITICAL

## 🔴 Problem (Antipattern)
Mobile applications often have transitions, animations, and network latency that make the UI appear much slower than the Robot Framework code execution.
*   **Symptom:** AI/Robot clicks a button before it's fully rendered or clickable.
*   **Result:** `ElementNotInteractableException` or `StaleElementReferenceException`.
*   **Bad Practice:** Using `Sleep 5s` - this makes the entire test suite slow and doesn't guarantee success.

## 🟢 Solution (Best Practice)
Always follow the **"Wait-Action-Verify"** pattern.

### 1. Wait Until Clickable
Never use `Click Element` directly on a new screen. Always wait first.
```robot
# Good
Wait Until Page Contains Element    ${SUBMIT_BTN}    timeout=10s
Wait Until Element Is Visible       ${SUBMIT_BTN}
Click Element                       ${SUBMIT_BTN}
```

### 2. Post-Action Verification
After clicking something that changes the state, verify the result immediately.
```robot
# Good
Click Element    ${LOGIN_BTN}
Wait Until Page Does Not Contain Element    ${LOGIN_BTN}    # Ensure switch to next page
```

### 3. Handle Animations
If the app has heavy animations (e.g., sliding menus), add a micro-wait or wait for the specific animation-end marker.
```robot
# Pattern: Wait for 'settled' state
Wait Until Page Contains    Welcome, User    timeout=5s
```

## 🧠 AI Instruction
When generating Robot scripts, **NEVER** use `Sleep`. Always generate a `Wait Until...` keyword before any interaction (`Click`, `Input`, `Swipe`). If a transaction is expected to be slow, explicitly set a longer `timeout` argument (e.g., `timeout=30s`).
