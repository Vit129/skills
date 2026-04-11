---
name: analysis-concept
description: >
  Reusable analysis thinking patterns extracted from ai-dlc/core/analysis-skills.
  Each reference is a domain-agnostic concept that any skill can adapt by filling in
  its own context (wings/rooms, code/tests, business/technical, etc.).
  Use these as abstract templates — not copy-paste instructions.
---

# Analysis Concepts

Reusable thinking patterns for analysis. Each concept describes HOW to think, not WHAT to think about.

## How to Use

1. Pick the concept that matches your analysis need
2. Replace `{placeholders}` with your domain-specific content
3. Follow the thinking pattern — adapt the output format to your domain

## Concepts — Load ONE per request

| Need | Load |
|------|------|
| "zoom out", "what's the goal", "extract context before starting" | `references/context-concept.md` |
| "find existing assets", "search before creating", "anti-redundancy" | `references/discovery-domain-concept.md` |
| "what's missing", "required vs available", "prioritize gaps" | `references/gap-concept.md` |
| "scan existing system", "understand architecture", "reverse engineer" | `references/reverse-eng-concept.md` |
| "gather requirements", "write user stories", "acceptance criteria" | `references/requirements-concept.md` |

Each concept is self-contained. Load ONE at a time.
