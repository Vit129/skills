# LESSON-FILE-001: File Upload Failed — Incorrect File Path

---
id: LESSON-FILE-001
category: file
severity: Medium
tags: file, upload, path, setInputFiles, absolute-path
workflow: webui_automation
updated: 2026-04-27
---

## Context

Playwright's `setInputFiles()` requires a valid file path. Relative paths work only when the test runner's CWD matches the expected base directory.

## Problem

- Error: `file not found / ENOENT`
- Cause: Relative path resolves differently depending on where the test runner is invoked

```typescript
// BAD — relative path, breaks in CI
await page.setInputFiles('input[type="file"]', './fixtures/document.pdf');
```

## Solution

```typescript
// GOOD — absolute path, works everywhere
import path from 'path';

const filePath = path.resolve(__dirname, 'fixtures/document.pdf');
await page.setInputFiles('input[type="file"]', filePath);
await expect(page.getByText('document.pdf')).toBeVisible();
```

## AI Instruction

When generating file upload steps, always use `path.resolve(__dirname, 'fixtures/filename')` for file paths. Never use relative paths.
