# User Flow Generator — Mermaid from Requirements

## Command
`gen user flow {name}` + paste requirement text → direct analysis

## Process
1. Analyze the requirement → build a Mermaid flowchart
2. Output: Mermaid code with export guidance

## Output Format

### Mermaid Nodes
- `([start])` Start/End | `[action]` Process | `{decision?}` Decision | `[/input/]` Input
- Emoji: ✅ Success | ❌ Error | ⚠️ Warning | 🔄 Retry

## Rules
✅ **Happy path first** — error branches split off separately
✅ **Decisions phrased as questions** e.g. `{has access?}`
✅ **Short labels** — no `<br/>` (FigJam doesn't render it)
✅ **5-20 nodes** — use a subgraph if it goes over 20
❌ **No dead ends** — every path must reach End

## Output Template
```
📊 User Flow: {Feature} {Title}

‎```mermaid
flowchart LR
    Start([Start]) --> [Main step]
    [Main step] --> {Condition?}
    {Condition?} -->|Yes| [Success]
    {Condition?} -->|No| [❌ Error]
    [Success] --> End([End])
    [❌ Error] --> End
‎```

💡 Export: FigJam Plugin "Mermaid to FigJam"
```

## Flow Types (create only when needed)
1. **Main Flow** (always) — happy path + error handling
2. **Decision Flow** (optional) — when business logic is complex
3. **State Flow** (optional) — when there's a state transition (Draft→Confirm→Revise)
