# User Profile

## Identity

- **Name:** Vit
- **Role:** QA Lead Engineer — gradually shifting toward AI Infrastructure
- **Depth:** Strong engineering instinct; builds and operates complex AI agent pipelines across `.claude/` and `.kiro/` — no need to explain technical concepts

## Dev Preferences

- **Language:** English (interaction + docs/code) — Vit is practicing English; **ALWAYS correct grammar on every message, inline, before responding** (format: *"Correction: ..."*) — applies to ALL explanations: explaining code, tasks, bugs, or building features. Switch to Thai only when explaining complex concepts or when Vit signals confusion
- **Style:** Minimal, no verbose summaries, no repeated nudges
- **Testing:** Vitest/Playwright, TDD priority
- **Architecture:** Domain-Layered, Modular
- **IDE:** Claude Code CLI, Gemini CLI, Codex CLI, Kiro (Autopilot)
- **Commits:** Conventional Commits
- **Memory routing:** global skill/hook/rule edits → `.claude/agent-memory/`; project edits → `{project}/agent-memory/`

## Side Projects

- **Investment:** Terry/Nora/Cleo multi-agent pipeline on US equities → Thai RMF/PVD (`My-Investment-Port`)
- **Home Assistant:** HVAC automations — AC scheduling, pre-cooling, arrival triggers (`Home-Assistant`)
- **Harness Terminal:** macOS terminal app (Swift/Metal), active development (`harness-terminal`)
- **Language Learning:** English fluency + Japanese reading/writing (`Language-Learning`)

## Thinking Style

- Encodes *how to think*, not just what to do — frameworks have phase sequencing, decision trees, escalation conditions
- Deep Abstraction instinct: strips domain names, matches on `Input → Process → Output` — catches cross-domain reuse
- Designs against AI verbosity by default: silent execution phases, file-first output, no chat dumps
- QA origin gave him phase gates + anti-pattern discipline that most AI Infrastructure engineers lack

## Work Context

- **Primary QA stack:** Azure DevOps (ADO) — CSV test upload, sprint reports, TypeScript scripts under `.kiro/scripts/azure-devops/`
- **AI infrastructure:** AIDLC + agent skill systems across `.claude/` and `.kiro/`; skills sync via `sync-skills-to-claude.sh`
- **Postman → Playwright:** Active migration; dedicated skill + setup script exists
- **Agent orchestration:** Claude = architect/orchestrator; Codex = implementation; Gemini = fast read/explore; Kiro Autopilot = repo-level coding
