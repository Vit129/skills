# Web UI Lessons Index

Updated: 2026-04-27
Version: 7.0.0 (migrated from JSON)
Total: 11 lessons

## Popular Patterns

timeout, hidden, disabled, overlay, multiple elements, filter-hasText, getByRole

## Lessons

| ID | Category | Title | File | Confidence | Applied |
|----|----------|-------|------|------------|---------|
| LESSON-FILE-001 | file | File Upload Failed — Incorrect File Path | webUiLesFile.md | 1.0 | 0 |
| LESSON-LOC-001 | locator | Multiple Elements Match — Locator Not Specific Enough | webUiLesLocator.md | 1.0 | 0 |
| LESSON-UI-001 | locators | Replace CSS ID Selectors with getByRole for Button Locators | webUiLesLocators.md | 1.0 | 0 |
| LESSON-UI-002 | locators | Use filter({ hasText }) Instead of nth()/first() for List Item Selection | webUiLesLocators.md | 1.0 | 0 |
| LESSON-UI-003 | locators | Inline HTML Mock via page.setContent() Enables Fast Isolated UI Tests | webUiLesLocators.md | 1.0 | 0 |
| LESSON-TIME-001 | timing | Timeout Waiting for Selector — Element Not Yet Appeared or Covered | webUiLesTiming.md | 1.0 | 0 |
| LESSON-TIME-002 | timing | Element Covered by Loading Overlay — Wait for Spinner to Disappear | webUiLesTiming.md | 1.0 | 0 |
| LESSON-TIME-003 | timing | Data Not Loaded — Wait for API Response Before Asserting | webUiLesTiming.md | 1.0 | 0 |
| LESSON-TIME-004 | timing | Navigation Timeout — Page Loads Slowly or Wrong URL | webUiLesTiming.md | 1.0 | 0 |
| LESSON-VIS-001 | visibility | Element Not Visible — Hidden by CSS or Not Yet Loaded | webUiLesVisibility.md | 1.0 | 0 |
| LESSON-VIS-002 | visibility | Element Is Disabled — Fill Required Fields Before Clicking | webUiLesVisibility.md | 1.0 | 0 |

## Edges

| From | Related To |
|------|-----------|
| LESSON-FILE-001 | LESSON-LOC-001 |
| LESSON-LOC-001 | LESSON-UI-001 |
| LESSON-UI-001 | LESSON-UI-002, LESSON-LOC-001 |
| LESSON-UI-003 | LESSON-UI-001, LESSON-UI-002 |
| LESSON-TIME-001 | LESSON-TIME-002, LESSON-TIME-003 |
| LESSON-TIME-003 | LESSON-TIME-001, LESSON-TIME-004 |
| LESSON-VIS-001 | LESSON-VIS-002, LESSON-TIME-002 |
| LESSON-VIS-002 | LESSON-VIS-001 |
