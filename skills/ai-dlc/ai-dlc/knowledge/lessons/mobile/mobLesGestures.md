# L-MOB-003: Reliable Mobile Gestures (Scrolling & Swiping)

---
id: L-MOB-003
category: gestures
severity: High
priority: HIGH
tags: gestures, scroll, swipe, coordinates, cross-device, infinite-loop
workflow: mobile_automation
updated: 2026-04-27
---

## Context

Mobile gestures depend on screen coordinates. Hardcoded pixel values work only on the exact device they were recorded on.

## Problem

- Symptoms: Swipe lands on wrong element, test hangs indefinitely scrolling, unintended 'fling' animation
- Antipattern 1: Coordinate Hardcoding

```robot
# BAD — pixel coordinates are device-specific
Swipe    100    500    100    200
```

- Antipattern 2: Infinite Scroll Loop

```robot
# BAD — no exit condition
WHILE    True
    Swipe By Percent    50    80    50    20
END
```

## Solution: Percentage-Based Gestures

### 1. Use Percentage-Based Swiping

```robot
# GOOD — scroll down: start at 80% height, end at 20% height
Swipe By Percent    50    80    50    20

# Scroll up: start at 20% height, end at 80% height
Swipe By Percent    50    20    50    80
```

### 2. Implement a Scroll-Limit

```robot
# GOOD — scroll with safety limit
FOR    ${i}    IN RANGE    0    5
    ${found}    Run Keyword And Return Status    Element Should Be Visible    ${TARGET}
    IF    ${found}    BREAK
    Swipe By Percent    50    80    50    20
END
Element Should Be Visible    ${TARGET}    # Final assertion — fails clearly if not found
```

### 3. Handle Overlay & Sticky Headers

```robot
# Check interactability after scroll
Wait Until Element Is Visible       ${TARGET}
Wait Until Element Is Enabled       ${TARGET}
Click Element                       ${TARGET}
```

## AI Instruction

Always prefer percentage-based methods. For 'scroll until found', wrap in a FOR loop with max 5-10 retries and add a final assertion after the loop.
