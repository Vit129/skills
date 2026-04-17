# Project Knowledge — Setup Guide

Per-project knowledge that overrides global templates.

## Structure

```
{project}/.knowledge/
├── README.md                    ← this file
├── automation/
│   ├── api/apiIndex.json        ← project-specific API templates + scores
│   ├── webUi/webUiIndex.json    ← project-specific Web UI templates + scores
│   └── mobile/mobileIndex.json  ← project-specific Mobile templates + scores
├── business/
│   └── businessIndex.json       ← project domain knowledge
└── lessons/
    ├── api/apiLessonsIndex.json  ← lessons from this project
    ├── webUi/webUiLessonsIndex.json
    └── mobile/mobileLessonsIndex.json
```

## Resolution Order

```
1. {project}/.knowledge/   ← project-specific (checked first)
2. ~/.claude/skills/ai-dlc/knowledge/  ← global fallback
```

## When to Use

- Project has custom templates different from global standards
- Project-specific lessons (e.g., unique API patterns, business rules)
- Non-coding knowledge (finance, law, presentation, stock analysis)
- Any domain knowledge that belongs to this project only

## Setup

Create `.knowledge/` folder at project root and add index files as needed.
Only create the categories you need — missing categories fall back to global.
