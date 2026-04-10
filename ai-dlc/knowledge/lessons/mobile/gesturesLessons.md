# Lesson: Reliable Mobile Gestures (Scrolling & Swiping)

**ID:** L-MOB-003
**Category:** Gestures
**Priority:** ⭐ HIGH

## 🔴 Problem (Antipattern)
1.  **Coordinate Hardcoding:** Using fixed pixels (e.g., `Swipe 100 500 100 200`) fails when the test runs on a device with a different screen resolution.
2.  **Infinite Loops:** Scrolling to find an element that doesn't exist, causing the test to hang forever.
3.  **Fast Swiping:** Swiping too quickly can cause the app to skip elements or trigger unintended "fling" animations.

## 🟢 Solution (Best Practice)

### 1. Use Percentage-Based Swiping
Always calculate coordinates based on screen percentage to ensure cross-device compatibility.
*   **Standard Scroll Down:** `Swipe By Percent  50  80  50  20` (From 80% height to 20% height).

### 2. Implement a Scroll-Limit
Always use a `FOR` loop with a maximum retry count when searching via scroll.
```robot
# Good Practice: Scroll with limit
FOR    ${i}    IN RANGE    0    5
    ${found}    Run Keyword And Return Status    Element Should Be Visible    ${TARGET}
    IF    ${found}    BREAK
    Swipe By Percent    50    80    50    20
END
```

### 3. Handle Overlay & Sticky Headers
Be aware that sticky headers or footers might overlap your target element after a scroll.
*   **Lesson:** After scrolling, check if the element is actually "interactable" or obscured by a footer.

## 🧠 AI Instruction
When generating gesture code, always prefer percentage-based methods. If the requirement is "scroll until found", always wrap the logic in a `FOR` loop with a maximum of 5-10 retries to prevent test hangs.
