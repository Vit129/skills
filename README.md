# 🧠 Central AI Agent Workspace

The ultimate personal knowledge base and "Single Source of Truth" (SSOT) configuration hub for AI-assisted software engineering. This repository acts as the master brain that syncs rules, skills, and memory across multiple AI agents (Claude Code, Gemini CLI, Codex CLI, and Kiro IDE).

---

## 🌟 Core Philosophy
- **Single Source of Truth (SSOT):** Write a rule or a skill once, and deploy it to every AI agent instantly. No more copy-pasting prompts.
- **Context-Aware Memory:** Agents share a cross-session memory (`agent-memory/`) so they never forget past mistakes, user preferences, or successful playbooks.
- **Modular AI Skills:** Treats AI prompts like code packages. Need a tax accountant? Load the `tax-management` skill. Need Playwright E2E tests? Load the `ai-dlc/qa` skill.

## 🔑 Key Features

### 1. 🔄 Multi-Agent Sync Engine
Automated bash scripts ensure that every CLI tool reads the same rules. It translates global Markdown configurations into the specific formats required by `CLAUDE.md`, `GEMINI.md`, and `AGENTS.md`.

### 2. 📚 Universal Skill Library
A vast directory of specialized instructions tailored for various domains (Frontend, Backend, QA, Finance, Fitness, and specific projects). Skills can be loaded dynamically or mirrored to project folders via project-specific scripts.

### 3. 🧠 Cross-Domain Persistent Memory
Instead of starting from zero in every chat session, agents read and write to:
- `memory.md` (Hot state and current tasks)
- `playbook.md` (Proven bug fixes and solutions)
- `user-profile.md` (Your coding preferences)

### 4. 📐 Karpathy Principles & AIDLC
Enforces strict engineering standards based on Andrej Karpathy's principles (Think, Simplicity, Surgical, Goal-Driven) and implements a robust AI Development Life Cycle (AIDLC) to prevent AI-generated spaghetti code.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Agent CLI** | Claude Code, Google Gemini CLI, OpenAI Codex CLI, Kiro IDE |
| **Sync Engine** | Bash, Python 3, `rsync` |
| **Data Format** | Markdown (MD), JSON |
| **Memory Storage** | Flat Markdown tables & lists |

---

## 🚀 Quick Start

### 1. Managing Rules
If you update any core rule in the `rules/` directory or modify the main `CLAUDE.md` template, run the following commands to sync them to Gemini and Codex:

```bash
# Mirrors the rules/ directory to all agents
bash scripts/sync-rules.sh

# Regenerates the GEMINI.md and AGENTS.md entry points
bash scripts/sync-agent-instructions.sh
```

### 2. Managing Skills
If you add or update a skill in the `skills/` directory, sync it to all available runtimes:

```bash
bash scripts/sync-skills.sh
```

*(Tip: You can append `--dry-run` to any script to preview the changes before they are applied!)*

---
*For detailed architecture mapping, see the `GRAPH_REPORT.md`. For rule logic and sync protocols, check the `rules/` directory.*
