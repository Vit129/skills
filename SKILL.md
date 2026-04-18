# Claude Code Skills — Overview

Single source of truth for all AI-assisted development, QA, and Finance analysis.

## 1. AI-DLC Category (`ai-dlc/`)

### Core (Governance) — `ai-dlc/core/`

| Folder | Purpose |
|--------|---------|
| `aidlc/` | Full AI-DLC lifecycle: governance, phases, templates, guides, task design |
| `analysis-skills/` | Context, Gap, Requirements, Domain Discovery, Reverse Eng — used across all phases |
| `unified-memory/` | Unified Memory workspace adapter (Memory Palace + Knowledge Evolution) |
| `monitoring/` | Logging, error tracking, performance metrics, tracing, alerts |
| `storage/` | Knowledge save, buffer update, Data Backup & Integrity standards |

### PO (Product Owner) — `ai-dlc/po/`

| Folder | Purpose |
|--------|---------|
| `architect/` | DDD Strategic & Tactical, Architecture Patterns, Logical Design, TDD |

### UX-UI (Design) — `ai-dlc/ux-ui/`

| Folder | Purpose |
|--------|---------|
| `ui-designer/` | Design system + aesthetic direction, Figma analysis, Sovereign Design System rules |

### Dev (Implementation) — `ai-dlc/dev/`

| Folder | Purpose |
|--------|---------|
| `frontend-dev/` | React, Flutter, Android Kotlin, iOS Swift, Tailwind, Vite implementation |
| `backend-dev/` | API design, DB, Auth, Node.js, Python, Docker |
| `devops-pipeline/` | CI/CD pipeline, PRs (Azure DevOps, GitHub Actions, GitLab CI) |

### QA (Testing & Automation) — `ai-dlc/qa/`

| Folder | Purpose |
|--------|---------|
| `playwright-rules/` | Playwright coding standards (API + Web UI) |
| `playwright-testing/` | Write/review/run/heal Playwright tests |
| `playwright-cli/` | Browser automation via CLI |
| `qa-architect/` | API/Web/Mobile test automation arch, Test DB Strategy |
| `robotframework-rules/` | RF coding standards (Android + iOS) |
| `robotframework-testing/` | Write/review/run/heal RF mobile tests |
| `test-scenario/` | Scenario design, data gen, reuse, quick-scenario |
| `test-scenario-rules/` | Test scenario design guidelines + CSV export |
| `postman/` | Postman → Playwright migration: collection/env analysis, code generation (spec+helper+service+schema), run + auto-heal fix loop |
| `performance-testing/` | Performance test strategy, scripts, and analysis |

### Knowledge (Domain Data) — `ai-dlc/knowledge/`

| Folder | Purpose |
|--------|---------|
| `automation/` | Automation knowledge base: API, Web UI, Mobile — indexed via automationIndex.json |
| `business/` | Business domain knowledge: auth, common, document, finance — indexed via businessIndex.json |
| `lessons/` | Lessons learned from past projects: API, Mobile, Web UI |

## 2. System Skills (`system/`)

Cross-project tools that work with any domain — not tied to ai-dlc.

| Folder | Purpose | Trigger phrases |
|--------|---------|----------------|
| `unified-memory/` | Persistent memory + self-learning knowledge for any domain (Memory Palace + Knowledge Evolution) | "save memory", "load context", "session start/end", "remember this", "track which templates work", "score lessons", "auto-capture failures", "feedback loop" |
| `hook-creator/` | Create Kiro + Claude Code hooks from templates, event-driven automation | "create hook", "automate on save", "สร้าง hook" |
| `ai-techniques/` | CoT, LATS, AoT — domain-agnostic reasoning techniques | "use CoT", "step-back", "LATS", "reasoning technique" |
| `analysis-concept/` | Reusable analysis concepts: context, discovery, gap, reverse-eng, requirements | "analyze context", "gap analysis", "domain discovery" |
| `skill-creator/` | Create, improve, validate Claude Code skills (meta skill — use when building new skills) | "create skill", "improve skill", "skillify" |

### unified-memory — Special Note

Meta-skill ที่รวม Memory Palace + Knowledge Evolution — always activate เมื่อต้องการ session memory หรือ knowledge tracking ในทุก domain

References: `system/unified-memory/references/` (session, storage, intelligence, maintenance, adaptation)

## 3. Built-in Skills (Claude Code)

Skills ที่มาพร้อม Claude Code — ไม่ต้องสร้างเอง:

| Skill | ใช้เมื่อ | เทียบกับ custom skill |
|-------|---------|---------------------|
| `/simplify` | refactor code ให้ clean | — |
| `/verify` | ตรวจ correctness | เสริม qa-architect |
| `/stuck` | ติดปัญหา ไม่รู้จะทำยังไง | — |
| `/remember` | persist ข้อมูลลง memory | เสริม memory-palace |
| `/skillify` | สร้าง skill ใหม่จาก workflow | เสริม skill-creator |
| `/debug` | debugging workflow | — |
| `/batch` | batch operations across files | — |

## 4. Internal (`_internal/`)

Folders that store system data, logs, or backups to keep the root directory clean.

- `backups/`, `cache/`, `debug/`, `downloads/`, `file-history/`

## 5. Finance Category (`finance/`)

### Coding (Claude Code) — `finance/coding/`

| Folder | Purpose |
|--------|---------|
| `investment-architecture/` | React + Tailwind architecture guide for My Investment Port |
| `financial-algorithms/` | Tax calc, DCA, SMA/EMA, Sharpe Ratio, dividend forecasting |
| `google-sheets/` | Google Apps Script (GAS) integration for portfolio sync |
| `tax-optimizer/` | Tax planning logic and optimization code |
| `tax-review/` | Tax engine review and validation |
| `dividend-tracker/` | Dividend tracking and forecasting logic |
| `portfolio-report/` | Portfolio performance report generation |
| `rebalance-check/` | Portfolio rebalancing logic |
| `fx-alert/` | FX impact calculation and alerts |
| `passive/` | Passive income analysis logic |
| `add-stock/` | Logic for adding new stocks to portfolio |
| `backup/` | Portfolio data backup and integrity verification |

### Research (Claude Chat/Cowork) — `finance/research/`

| Folder | Purpose |
|--------|---------|
| `stock-deep-analysis/` | Fundamental and deep-dive stock analysis |
| `thai-stock/` | Thai market specific analysis (RMF/SSF/ThaiESG) |
| `us-stock/` | US holdings and market analysis |
| `news-search/` | Market news search and sentiment analysis |
| `ai-recommend/` | AI-driven stock recommendations and insights |

---

## Maintenance

- Edit skills in their respective subdirectories — this is the single source of truth.