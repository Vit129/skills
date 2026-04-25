# 🚪 Memory Palace Setup
> Wing: ai-dlc-skills | Created: 2025-04-09 | Updated: 2025-04-09

## Context
Memory Palace skill created in 2 tiers: user-level (ตัวกลาง) + workspace-level (Light adapter).
Inspired by [MemPalace](https://github.com/milla-jovovich/mempalace).

## Key Facts
- 2-tier architecture: `~/.claude/skills/memory-palace/` = source of truth, `.claude/skills/ai-dlc/core/memory-palace/` = workspace adapter
- User-level has: AAAK compression, Temporal Knowledge Graph, Contradiction Detection, 19-tool MCP spec
- Workspace-level (Light): markdown files only, zero deps, storage at `.claude/memory/`
- Palace hierarchy: Wing(L0) → Room(L1) → Closet(L2) → Drawer(L3), Hall+Tunnel(L4)
- Full version roadmap: ยกเลิกแล้ว — markdown-only เป็น final approach

## Temporal State
- (MemPalace-Light, architecture, single-skill) [2025-04-09 session1 — 2025-04-09 session2]
- (MemPalace-Light, architecture, 2-tier user+workspace) [2025-04-09 session2 — Present]
- (agentStop-hook, save-steps, 8-step) [2025-04-09 session1 — 2025-04-09 session2]
- (agentStop-hook, save-steps, 10-step+AAAK+temporal+contradiction) [2025-04-09 session2 — Present]
- (MemPalace, kiro-support, none) [2025-04-09 — 2026-04-09]
- (MemPalace, kiro-support, steering+hook+STEERING_INDEX) [2026-04-09 — Present]
- (MemPalace-workspace, content, full-in-ai-dlc-core) [2025-04-09 — 2026-04-09]
- (MemPalace-workspace, content, thin-wrapper-only) [2026-04-09 — Present]

## Decisions Made
- Placed workspace skill at `.claude/skills/ai-dlc/core/memory-palace/` (core category)
- User-level skill at `~/.claude/skills/memory-palace/` is the ตัวกลาง for all workspaces
- Memory storage at `.claude/memory/` (separate from skills)
- agentStop hook triggers memory save — not promptSubmit (less noisy)
- state.md ≤100 lines, rooms ≤80 lines → compress to AAAK closet

## Files
- `~/.claude/skills/memory-palace/SKILL.md` — core concepts (AAAK, Temporal KG, hierarchy)
- `~/.claude/skills/memory-palace/references/mempalace-logic.md` — technical reference
- `.claude/skills/ai-dlc/core/memory-palace/SKILL.md` — workspace adapter
- `.claude/memory/state.md` — palace map
- `.claude/.kiro/hooks/memory-palace-save.kiro.hook` — agentStop hook (10-step)
- `VitProjects/.kiro/steering/memory-palace.md` — Kiro steering (manual inclusion)
- `VitProjects/.kiro/hooks/memory-palace-save.kiro.hook` — Kiro agentStop hook (mirror)
