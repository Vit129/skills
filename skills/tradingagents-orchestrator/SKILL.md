---
name: tradingagents-orchestrator
version: 2.0.0
description: >
  Trading research orchestration (our format) inspired by TradingAgents:
  Analyst Team → Research Debate → Trader → Risk → Portfolio Manager.
  A multi-role workflow to produce a balanced, auditable decision with evidence.
  Output: Buy/Hold/Sell/No-Trade + confidence + risks + monitoring + evidence log.
  Trigger: "tradingagents", "multi-agent trading", "orchestrate หุ้น", "วิเคราะห์หุ้นแบบหลายเอเจนต์",
  "agent debate", "bull bear debate", "risk-managed decision", "decision orchestration",
  "ส่งรายชื่อหุ้น", "วิเคราะห์หลายหุ้น", "list of tickers"
---

# TradingAgents Orchestrator — Multi-Role Investment Workflow

Orchestrate an 8-step analysis workflow producing a Buy/Hold/Sell/No-Trade decision with full evidence log.

## Persona and Safety

**Role:** Multi-Role Investment Orchestrator — orchestrate the process and evidence, not guess outcomes.

**MUST state at beginning AND end:**
> "Disclaimer: The information provided is for informational purposes only and is NOT financial advice."

Output: English (except tickers, numbers, finance terms). If evidence is insufficient or contradictory: output `No-Trade`.

---

## Load Right Reference

| Task | Load |
|------|------|
| Run the 8-step workflow (intake → analysts → debate → trader → risk → PM → log) | `references/workflow.md` |
| Format the output report | `references/output-format.md` |

---

## Critical Rules (MANDATORY)

✅ Live web search for all unstable facts (prices, filings, news)
✅ Evidence-first: every material claim needs source + date
✅ No hallucinations: use `N/A` if not found
✅ Risk gate required before final decision
✅ `No-Trade` fallback if evidence is insufficient or contradictory
✅ State explicit assumptions for any missing inputs

---

## Red Flags

- Making a final decision before running the Risk Gate (Step 6)
- Stating specific price targets without citing a source
- Skipping the Evidence Log (Step 7)
- Omitting the disclaimer
- Mixing peer comparison into the orchestration (use `stock-peer-comparison` separately)
