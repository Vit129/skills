# Global Agent Instructions — Gemini-First Engineering

> **Compatible with:** Claude Code · Gemini CLI · Cursor · Codex

---

## 1. Agent Selection Decision Matrix

**Before starting any task**, the AI must evaluate and suggest the appropriate agent to the user:

| Task Type | Recommended Agent | Reasoning |
|-----------|-------------------|-----------|
| **Codebase Mapping & Research** | ♊ **Gemini CLI** | 1M Context Window — ideal for reading many files |
| **Feature Implementation** | ♊ **Gemini CLI** | Autonomous execution — faster and more token-efficient |
| **Bug Fixing & Refactoring** | ♊ **Gemini CLI** | Better cross-file dependency analysis |
| **High-Level Architecture** | ❄️ **Claude Code** | Deeper reasoning and precision in design decisions |
| **Final Review & UX Polish** | ❄️ **Claude Code** | Superior sensitivity to style and user experience |

---

## 2. Gemini-First Engineering Workflow (Primary)

### Step 1 — Suggest the Agent
Notify the user immediately if the task should go through Gemini CLI:
> "♊ This task is recommended for **Gemini CLI** (model: `gemini-3-flash-preview`) for maximum efficiency and context savings — would you like me to generate the ready-to-run command?"

### Step 2 — Handover
Generate a ready-to-run command:
```bash
gemini --model gemini-3-flash-preview -p "[Prompt with detailed task context and goals]"
```

### Step 3 — Gemini Self-Review (Mandatory)
After Gemini completes the task, **always run a self-review**:
```bash
gemini --model gemini-3-flash-preview -p "Review your previous output for correctness, completeness, and edge cases. Fix any issues and provide the final verified version."
```

---

## 3. Claude-Assisted Workflow (Alternative)

Use Claude when the user prefers it or when the task requires strategic decision-making:
- Emphasize Planning before execution
- Use for Final Quality Check after Gemini completes work
- Small tasks where Context < 25,000 tokens

---

## 4. Engineering Standards & AIDLC

Regardless of which agent is used, **the same standards must be followed**:
1. **Explain Before Acting:** Briefly state intent before invoking any tool
2. **Evidence-First:** Never guess — always `grep` or `glob` for evidence first
3. **Validation is Finality:** Work is only complete when tests confirm correctness
4. **Context Efficiency:** Use tools economically (read only necessary lines, batch commands in one turn)
5. **Commit After Final Review:** After every Final Review, stage all changes and commit with a descriptive message

---

## 5. Project Context — My Investment Port v2.3.0

Main project: **Personal Investment Portfolio App** (React 18 + Vite 5)
Live: `https://vitinvestmentport.web.app`

**Tech Stack:**
- React 18 + Vite 5, Tailwind CSS 4 + Custom Design System
- Chart.js 4.4, Firebase Hosting
- Data: Google Sheets (GAS) + Yahoo Finance API
- Automation: macOS LaunchAgent (Backup 22:00)

**Security Rules:**
- Never commit `.env` or real financial data
- Never set the repository to Public
- All GAS requests must include Token Auth

**Commands:**
- `npm run dev` (Real data) / `npm run dev:test` (Mock data)
- `npm run test` (Vitest) / `npx playwright test` (E2E)
- `npm run backup` (Manual trigger)
