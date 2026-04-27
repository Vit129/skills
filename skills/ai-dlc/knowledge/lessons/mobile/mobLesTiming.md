# L-MOB-001: UI Synchronization (UI Slower than Code)

---
id: L-MOB-001
category: timing
severity: High
priority: CRITICAL
tags: timing, synchronization, wait, animation, flaky
workflow: mobile_automation
updated: 2026-04-27
---

## Context

Mobile apps have transitions, animations, and network calls that make the UI render slower than Robot Framework executes. Without explicit waits, the script tries to interact with elements that are not yet ready.

## Problem

- Symptoms: ElementNotInteractableException, StaleElementReferenceException, passes locally but fails on CI
- Antipattern: Using `Sleep 5s` as a fixed delay — makes suite slow and still doesn't guarantee success

```robot
# BAD — never do this
Sleep    5s
Click Element    ${SUBMIT_BTN}
```

## Solution: Wait-Action-Verify

### 1. Wait Until Clickable

```robot
# GOOD
Wait Until Page Contains Element    ${SUBMIT_BTN}    timeout=10s
Wait Until Element Is Visible       ${SUBMIT_BTN}
Click Element                       ${SUBMIT_BTN}
```

### 2. Post-Action Verification

```robot
# GOOD
Click Element    ${LOGIN_BTN}
Wait Until Page Does Not Contain Element    ${LOGIN_BTN}    # Confirm page switched
```

### 3. Handle Animations

```robot
# Wait for a known element that only appears after animation completes
Wait Until Page Contains    Welcome, User    timeout=5s
```

## AI Instruction

When generating Robot scripts, NEVER use Sleep. Always generate a `Wait Until...` keyword before any interaction. If a transaction is expected to be slow, explicitly set a longer timeout (e.g., `timeout=30s`).
