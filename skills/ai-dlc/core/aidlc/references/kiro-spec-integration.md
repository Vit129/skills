# AIDLC Dialog & Artifact Integration

How AIDLC interacts with users and stores artifacts — applies to ALL AI agents and ALL modes.

## Core Rules

1. **ALL artifacts → `.aidlc/`** — both Vibe and Spec modes write everything to `.aidlc/[system]/[feature]/`
2. **Dialog message format** — ALL AIDLC interactions use structured dialog, not plain chat
3. **Agent-agnostic** — these rules apply to Kiro, Claude Code, Gemini, and any other AI agent

## Artifact Path (Single Target)

```text
ALL modes → .aidlc/[system]/[feature]/
             ├── planning/decisions/
             ├── planning/plans/
             ├── outputs/inception/
             ├── outputs/construction/
             ├── dev-task-progress.md
             ├── qa-task-progress.md
             └── audit.md
```

There is no secondary target. AIDLC does NOT write to `.kiro/specs/` or any other location.

## Dialog Message Format

Every AIDLC phase interaction MUST use structured dialog format:

### Phase Announcement

```text
📋 Phase {N}: {Phase Name}
Mode: {Vibe/Spec/Full/QA Only/Dev Only}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Phase description — what will happen}

📎 Prerequisites: {list or "✅ all met"}
📂 Output: {expected file path}
```

### Decision Dialog

```text
🔷 Decision Required — {topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Context}

Options:
1. {Option A} — {rationale}
2. {Option B} — {rationale}
3. {Option C} — {rationale}

💡 Recommendation: {N} — {why}
```

### Progress Update

```text
✅ {Task/Phase} Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Output: {file path}
📊 Progress: {N}/{Total} tasks done
⏭️ Next: {next phase or task}
```

### Escalation Dialog

```text
⚠️ Escalation: Vibe → Spec
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

เหตุผล: {trigger}

ต้องการ:
1. Escalate → Spec (สร้าง full design artifacts)
2. ทำต่อใน Vibe (รับ risk)
```

## Why Dialog Format

- **Readable** — structured blocks are easier to scan than wall-of-text chat
- **Trackable** — each phase/decision/progress has a clear visual marker
- **Consistent** — same format regardless of AI agent or IDE
- **Searchable** — emoji markers (📋, 🔷, ✅, ⚠️) make it easy to find specific interactions

## Kiro-Specific Notes

When running in Kiro IDE:
- Kiro has built-in Vibe mode and Spec mode — agent reads mode from IDE context
- User selects mode in Kiro UI, never types it in chat
- Kiro Spec dialog system is separate from AIDLC — AIDLC uses its own `.aidlc/` artifacts
- If user wants to use Kiro's native Spec feature alongside AIDLC, they can — but AIDLC does not write to `.kiro/specs/`
