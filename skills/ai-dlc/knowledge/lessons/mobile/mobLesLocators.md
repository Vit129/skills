# L-MOB-002: Cross-Platform Locator Strategy

---
id: L-MOB-002
category: locators
severity: High
priority: HIGH
tags: locators, cross-platform, android, ios, accessibility, xpath, page-object
workflow: mobile_automation
updated: 2026-04-27
---

## Context

Android and iOS use different attribute names for the same UI concept (e.g., Android uses `@text` while iOS uses `@label` or `@name`). Scripts that hardcode platform-specific locators break when switching platforms.

## Problem

- Symptoms: Tests pass on Android but fail on iOS with 'Element not found', duplicate test files per platform
- Antipattern: Hardcoding Android-only `@text` attribute

```robot
# BAD — Android only
${BTN}    xpath=//*[@text='Submit']
```

## Solution: AccessibilityId-First

### 1. Unified Locator Priority

1. Accessibility ID — works natively on both platforms
2. ID — usually stable but may be platform-prefixed
3. Smart XPath — use only as fallback

```robot
# BEST — works on both platforms
Click Element    accessibility_id=submit_button
```

### 2. Smart XPath Pattern

```robot
# Handles Android (@text) and iOS (@label, @name) in one expression
${DYNAMIC_BTN}    xpath=//*[contains(@text, '${label}')] or //*[@label='${label}'] or //*[@name='${label}']
```

### 3. Page Object Encapsulation

```robot
# resources/LoginPage.robot
${USERNAME_FIELD}    accessibility_id=username_field

# keywords/LoginKeywords.robot
Enter Username
    [Arguments]    ${value}
    Input Text    ${USERNAME_FIELD}    ${value}

# tests/LoginTest.robot — test layer never sees locators
Enter Username    john@example.com
```

## AI Instruction

Prioritize Accessibility ID for locators. If different locators exist for the same feature on different platforms, create a Unified Mapping Table before writing Keywords.
