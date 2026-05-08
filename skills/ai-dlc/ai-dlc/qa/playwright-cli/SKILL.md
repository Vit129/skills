---
name: playwright-cli
description: >
  This skill should be used when the user asks to "open a URL", "เปิด URL",
  "take a screenshot", "ถ่าย screenshot", "test the login flow", "ทดสอบ login flow",
  "scrape this page", "scrape หน้านี้", "interact with a web element", "กดปุ่มบนเว็บ",
  or needs browser automation via Playwright CLI terminal commands.
---

Control a browser via terminal commands for agentic web workflows.

## Setup

```bash
npm install -g @playwright/cli@latest
```

## Capabilities

- **Token Efficiency:** Interacts using YAML snapshots and `eX` references instead of raw HTML.
- **Interaction Commands:** Navigate, click, type, and extract data. (Read `references/commands.md`)
- **Complex Workflows:** Multi-step automations like logins and scraping. (Read `references/workflows.md`)
- **Visual Feedback:** Capture screenshots and open a live dashboard (`show`).
- **Session Persistence:** Supports session management for authentication states.

## When to Use

- "Open URL and take screenshot"
- "Test the login flow on [URL]"
- "Extract data from [Website]"
