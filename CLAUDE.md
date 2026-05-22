# Claude Agent Workspace

`CLAUDE.md` is the entry point and index.

Source of truth:
- `rules/` for behavior, routing, response format, and skill map
- `output-styles/communication-style.md` for tone
- `agent-memory/` for cross-session memory
- `GRAPH_REPORT.md` for structural navigation when present

Cross-session memory (loaded every session):
- @agent-memory/memory.md

## Rules — Auto (every session)

- `rules/project-rules.md` — AIDLC enforcement, phase gates, language rules
- `rules/response-format.md` — Done/Next/Why/Options structure
- `rules/workflow.md` — working style, do/don't list

## Rules — On-demand (read when triggered)

- `rules/agent-core.md` — Read when: complex multi-file implementation, security review, architecture decision, or planning phase
- `rules/skill-map.md` — Read when: routing to a skill, user invokes `/skill-name`, or skill selection is unclear
- `rules/frontend.md` — Read when: React, TypeScript, Tailwind, or UI component work
- `rules/skills-sync-protocol.md` — Read when: creating, updating, or syncing skills across agents
- `rules/token_efficient.md` — Read when: user asks about context, token optimization, or `/compact`
- `output-styles/communication-style.md` — Read when: adjusting tone or formatting style

## Skills — On-demand (load via Skill tool when triggered)

Skills are invoked via the `Skill` tool — not auto-loaded. Trigger by keyword or `/skill-name`:
- `finance/` — investment research, portfolio analysis, stock screening
- `thai-accountant/` — Thai tax, TFRS, accounting (invoke explicitly)
- `fitness/` — workout, nutrition, body composition (invoke explicitly)

Generated agent configs:
- `scripts/sync-agent-instructions.sh` writes `~/.codex/AGENTS.md`
- `scripts/sync-agent-instructions.sh` writes `~/.gemini/GEMINI.md`

Project-specific notes:
- Update `rules/` first, then resync generated configs.
- Use `rules/skill-map.md` (on-demand) when deciding which skill to load.
- Use `agent-memory/` for session state, playbook, and knowledge promotion.

## Agent Routing (Plugin-based)

| Task | Agent | Trigger |
|------|-------|---------|
| **Read / explore project structure** | Google Gemini 3 Flash (`/gemini:rescue`) | อ่านโค้ด, หาไฟล์, ดู structure, grep, explore codebase |
| **Planning / architecture** | Claude (main) | วางแผน, ออกแบบ, เลือก approach, spec |
| **Coding / implementation** | Codex (`/codex:rescue`) | เขียนโค้ด, แก้ bug, refactor, implement feature |

**Rules:**
- ถ้าต้องการอ่าน project structure → spawn Gemini 3 Flash ก่อน แล้วนำผลลัพธ์มาวางแผน
- วางแผนใน Claude แล้ว delegate implementation ให้ Codex
- Claude เป็น orchestrator — ไม่เขียนโค้ดเองถ้า Codex ทำได้

## Auto Memory + Dream Protocol

Claude Code maintains two complementary memory layers — use both:

| Layer | Location | Purpose | Who writes |
|-------|----------|---------|------------|
| **Auto Memory** | `~/.claude/projects/.../memory/` | Session knowledge: build commands, debugging patterns, YAML tricks | Claude (automatic) |
| **agent-memory/** | `~/.claude/agent-memory/` | Structured state: Task_Ledger, Decisions, Playbook, cross-agent | Claude via hooks |

### Promote Rule
When Auto Memory contains a pattern that has recurred 2+ times or prevented a mistake → promote it:
- Reusable fix/pattern → `agent-memory/playbook.md` (new CASE-xxx row)
- Domain knowledge → `agent-memory/knowledge/{domain}.md`
- Skill improvement → `agent-memory/skill-log.md`

### Dream
Run `/dream` when Auto Memory feels cluttered or after 5+ sessions. It deduplicates entries, removes stale notes, and resolves relative dates. Auto Dream runs automatically every 24h after 5+ sessions — no manual trigger needed unless memory is degraded.
