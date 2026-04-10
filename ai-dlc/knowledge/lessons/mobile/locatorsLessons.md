# Lesson: Cross-Platform Locator Strategy

**ID:** L-MOB-002
**Category:** Locators
**Priority:** ⭐ HIGH

## 🔴 Problem (Antipattern)
Using platform-specific attributes in high-level Keywords (e.g., hardcoding `@text` for Android) makes scripts non-portable and prone to failure when running on iOS.

## 🟢 Solution (Best Practice)

### 1. Unified Locator Choice
Follow this priority list for locators:
1.  **Accessibility ID:** (Works natively on both platforms).
2.  **ID:** (Usually stable but platform-prefixed on Android).
3.  **Smart XPath:** Using both common attributes.

### 2. Smart XPath Pattern
When you MUST find by text, use a combined XPath to handle both Android's `text` and iOS's `label`/`name`.
```robot
# Recommended Pattern
${DYNAMIC_TEXT_XPATH}    xpath=//*[contains(@text, "${text}")] or //*[@label="${text}"] or //*[@name="${text}"]
```

### 3. Page Object Encapsulation
Keep locators inside Page Object files. The Test Layer should only see semantic Keywords.
*   **Android PO:** `Input Text  id=com.app:id/username  ${val}`
*   **iOS PO:** `Input Text  accessibility_id=username_field  ${val}`
*   **Result:** Test script just calls `Enter Username  ${val}`

## 🧠 AI Instruction
If a locator is not provided, prioritize searching for `Accessibility ID`. If `grep` shows different locators for the same feature on different platforms, create a **Unified Mapping Table** in the implementation plan to track them.
