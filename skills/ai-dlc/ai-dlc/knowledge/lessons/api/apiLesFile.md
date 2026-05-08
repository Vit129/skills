# LESSON-FILE-001: Multipart Upload Error — Wrong MIME Type or File Path

---
id: LESSON-FILE-001
category: file
severity: Medium
tags: file, upload, multipart, form-data, mime-type
workflow: api_automation
updated: 2026-04-27
---

## Context

Multipart file uploads require the correct MIME type to match the actual file format. File paths must also be absolute — relative paths fail depending on where the test runner is invoked.

## Problem

- Error: `Multipart Upload Error / 400 Bad Request`
- Pattern: `multipart|form-data|file upload|unsupported media type`
- Cause: Incorrect MIME type for the file format, or relative file path that resolves incorrectly

```typescript
// BAD — wrong MIME type + relative path
await request.post('/upload', {
  multipart: {
    file: { name: 'data.xlsx', mimeType: 'application/octet-stream', buffer: fs.readFileSync('./data.xlsx') }
  }
});
```

## Solution

Use the correct MIME type and always use absolute paths via `path.resolve()`.

```typescript
// GOOD — correct MIME type + absolute path
import path from 'path';

const filePath = path.resolve(__dirname, 'fixtures/data.xlsx');
const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

await request.post('/upload', {
  multipart: {
    file: { name: 'data.xlsx', mimeType, buffer: fs.readFileSync(filePath) }
  }
});
```

## AI Instruction

When generating file upload tests, always use `path.resolve(__dirname, ...)` for file paths and look up the correct MIME type. Common types: `.pdf` → `application/pdf`, `.xlsx` → `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `.csv` → `text/csv`.
