# Lesson: Mobile Infrastructure & Session Stability

**ID:** L-MOB-004
**Category:** Infrastructure
**Priority:** ⭐ HIGH

## 🔴 Problem (Antipattern)
1.  **Session Overlap:** Starting a new test while the previous Appium session is still active, leading to "Session Not Created" errors.
2.  **Heavy Resets:** Performing a `Full Reset` (reinstalling the app) for every single test case makes the suite extremely slow.
3.  **Keyboard Obstruction:** Leaving the soft keyboard open after typing, which hides buttons at the bottom of the screen.

## 🟢 Solution (Best Practice)

### 1. Smart Reset Strategy
Use `noReset=true` for most tests to keep the login session and app data, significantly speeding up execution.
*   Use `fullReset=true` only for the first test of the suite or for specific "Clean Install" test cases.

### 2. Explicit Cleanup
Always use `Close Application` in a `[Teardown]` to ensure the Appium node is freed for the next test.
```robot
*** Test Cases ***
My Test
    [Teardown]    Close Application
    ...
```

### 3. Hide Keyboard Pattern
Always hide the keyboard immediately after inputting text unless the next action is another input field.
```robot
# Standard Pattern
Input Text       ${USERNAME_FIELD}    myuser
Hide Keyboard    # Prevent obstruction of the 'Next' button
```

### 4. Appium Health Check
If running on CI, ensure the Appium server is responsive before triggering the suite.

## 🧠 AI Instruction
Ensure every generated test suite has a proper teardown that closes the application. When generating `Input Text` steps, proactively add a `Hide Keyboard` step if the following action is a button click or a navigation element.
