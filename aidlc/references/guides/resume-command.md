# Resume AI-DLC Command

When user says "resume AI-DLC" or requests specific phase entry:

## 1. Auto-Detection
- Scan `.aidlc/iterations/` for existing iterations
- Find latest `iteration-{N}-{feature}/` folder
- Read audit.md — extract current state from "Current State" section

## 2. Context Restoration
- Current Phase: where user left off
- Current Step: specific step within phase
- Last Activity: when work was last done
- Progress Summary: what's been completed
- Available Contexts: bounded contexts and completion status

## 3. State Analysis
- Check plan files for status indicators
- Check decision files for resolved/outstanding decisions
- Review deliverables in outputs/
- Identify blockers and outstanding questions
- Validate prerequisites for entry point requests

## 4. Resume Response Format

```text
## AI-DLC Resume Summary

**Iteration**: {iteration-name}
**Current Phase**: {phase} - {status}
**Last Activity**: {timestamp}
**Progress**: {completed}/{total} phases completed

### Completed ✅
- {list of completed phases}

### Current Status 🔄
- Phase: {current-phase}
- Step: {current-step}
- Next Action: {what to do next}

### Available Contexts (Microservices)
- {Context 1}: {completion-status}
- {Context 2}: {completion-status}

### Outstanding Items ⚠️
- {pending items}

### Resume Options
A) Continue from where you left off
B) Review and update current phase plan
C) Skip to different phase
D) Start new iteration
E) Work on different context (if microservices)

**Recommendation**: {recommended option} because {reasoning}
```

## Error Handling
- No iterations found → guide user to start new project
- Corrupted state → ask user to clarify
- Multiple active iterations → ask user to choose
- Missing audit.md → reconstruct from plan files
