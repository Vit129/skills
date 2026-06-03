# User Profile

<!-- Stable preferences — update only when user explicitly changes them. -->
<!-- Loaded at session start alongside memory.md. -->

## Identity

- **Name:** Vit
- **Role:** QA Lead Engineer — gradually shifting toward AI Infrastructure
- **Depth:** Strong engineering instinct; builds and operates complex AI agent pipelines across `.claude/` and `.kiro/` — no need to explain technical concepts

## Dev Preferences

- **Language:** English (interaction + docs/code) — Vit is practicing English; correct grammar inline when needed; switch to Thai only when explaining complex concepts or when Vit signals confusion
- **Style:** Minimal, no verbose summaries, no repeated nudges
- **Testing:** Vitest/Playwright, TDD priority
- **Architecture:** Domain-Layered, Modular
- **IDE:** Claude Code CLI, Gemini CLI, Codex CLI, Kiro (Autopilot)
- **Commits:** Conventional Commits
- **Memory routing:** global skill/hook/rule edits → `.claude/agent-memory/`; project edits → `{project}/agent-memory/`

## Work Context

- **Primary QA stack:** Azure DevOps (ADO) — uploads test scenarios from CSV, queries sprint reports, triggers pipelines via TypeScript scripts under `.kiro/scripts/azure-devops/`
- **AI infrastructure:** Builds AI-DLC and agent skill systems across `.claude/` and `.kiro/`; skills sync from `.kiro/skills/` → `.claude/skills/` via `sync-skills-to-claude.sh`
- **Postman → Playwright:** Active migration work; dedicated skill + setup script exists
- **Agent orchestration:** Claude = architect/orchestrator; Codex = implementation; Gemini = fast read/explore; Kiro Autopilot = repo-level AI coding
