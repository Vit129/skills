# User Profile

<!-- Stable preferences — update only when user explicitly changes them. -->
<!-- Loaded at session start alongside memory.md. -->

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

- **Investment:** Runs a Terry/Nora/Cleo multi-agent research pipeline on US equities — paper portfolio ($5K) validates conviction before routing to Thai RMF/PVD mutual funds. See: `/Users/supavit.cho/Git/Personal/My-Investment-Port`
- **Home Assistant:** Builds HVAC automations (AC scheduling, pre-cooling, arrival triggers, power outage handling) for his home. See: `/Users/supavit.cho/Git/Personal/HomeAssistant`
- **Harness Terminal:** macOS terminal app (Swift/Metal) — personal project; active development, latest release v3.2.0. See: `/Users/supavit.cho/Git/Personal/harness-terminal`
- **Language Learning:** English grammar/fluency + Japanese reading/writing — practice sessions via claude.ai custom instructions. See: `/Users/supavit.cho/Git/Personal/Language-Learning`

## Thinking Style

- Encodes *how to think*, not just what to do — frameworks have phase sequencing, decision trees, escalation conditions, and reusability formulas
- Deep Abstraction instinct: strips domain names and matches on `Input → Process → Output` flow — catches cross-domain reuse others miss
- Designs against AI verbosity by default: silent execution phases, file-first output, no chat dumps
- QA origin gave him phase gates + anti-pattern discipline that most AI Infrastructure engineers lack
- Skills in `~/.claude/skills/thinking/analysis-skills/` are cognitive engineering artifacts — not prompts

## Work Context

- **Primary QA stack:** Azure DevOps (ADO) — uploads test scenarios from CSV, queries sprint reports, triggers pipelines via TypeScript scripts under `.kiro/scripts/azure-devops/`
- **AI infrastructure:** Builds AI-DLC and agent skill systems across `.claude/` and `.kiro/`; skills sync from `.kiro/skills/` → `.claude/skills/` via `sync-skills-to-claude.sh`
- **Postman → Playwright:** Active migration work; dedicated skill + setup script exists
- **Agent orchestration:** Claude = architect/orchestrator; Codex = implementation; Gemini = fast read/explore; Kiro Autopilot = repo-level AI coding

## QA Work Context

- **QA Email:** <!-- PLACEHOLDER — agent will ask on first use -->
- **Dev Email:** <!-- PLACEHOLDER — agent will ask on first use -->
- **Project Management Tool:** Azure DevOps / Jira (detect per project)
