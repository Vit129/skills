# L-MOB-004: Mobile Infrastructure & Session Stability

---
id: L-MOB-004
category: infrastructure
severity: High
priority: HIGH
tags: infrastructure, appium, session, teardown, keyboard, reset, ci
workflow: mobile_automation
updated: 2026-04-27
---

## Context

Appium manages a persistent session between the test runner and the device. Without proper lifecycle management, sessions leak between tests, app state bleeds across test cases, and UI elements get obscured by the soft keyboard.

## Problem

- Symptoms: 'Session Not Created' error, suite takes 10x longer due to full reinstall, button click fails because keyboard covers it
- Antipattern 1: Session Overlap (no teardown)
- Antipattern 2: Heavy Reset on Every Test (`fullReset=true` takes 30-60s per test)

## Solution: Hybrid-API-Setup

### 1. Smart Reset Strategy

```robot
# Suite Setup — full reset only once
Open Application    ${APP_URL}    fullReset=true

# Individual tests — keep existing state
Open Application    ${APP_URL}    noReset=true
```

### 2. Explicit Teardown

```robot
*** Test Cases ***
Login Test
    [Teardown]    Close Application
    Open Application    ${APP_URL}    noReset=true
    # test steps...
```

### 3. Hide Keyboard Pattern

```robot
# GOOD — hide keyboard before clicking button below input
Input Text       ${USERNAME_FIELD}    john@example.com
Hide Keyboard
Click Element    ${LOGIN_BTN}
```

### 4. Appium Health Check (CI)

```robot
# Run before suite on CI
Wait Until Keyword Succeeds    3x    5s    Get Appium Session Id
```

## AI Instruction

Ensure every generated test suite has a `[Teardown]` that calls `Close Application`. When generating `Input Text` steps, proactively add `Hide Keyboard` immediately after if the next step is a Click Element.
