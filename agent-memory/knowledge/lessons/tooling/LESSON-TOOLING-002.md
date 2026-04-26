---
id: LESSON-TOOLING-002
domain: tooling
type: pattern
status: active
confidence: 0.85
created: 2026-04-26
updated: 2026-04-26
---

# Token Optimization Has Four Dimensions

## Summary

Token optimization work clusters into four dimensions: output compression, input filtering, smart navigation, and context management.

## Detail

Research across multiple token optimization repos showed recurring strategies:

- Output compression reduces verbose model responses.
- Input filtering removes irrelevant shell and file output.
- Smart navigation uses symbols, indexes, and search to avoid reading everything.
- Context management keeps only the relevant working set active.

## Apply Next Time

- Diagnose token waste by dimension before adding tools.
- Prefer targeted search and structured summaries before loading large files.
- Record which dimension a new optimization addresses.

## Evidence

- 2026-04-26 token optimization research session.
