# Cross-Runtime Subagent Usage

This guide shows how to invoke `memory-curator` and `fundamental-researcher` across Codex, Gemini, Claude, and Kiro.

## What Exists Today

Available agent definition files:
- Claude project-level:
  - `.claude/agents/memory-curator.md`
  - `.claude/agents/fundamental-researcher.md`
- Gemini project-level:
  - `.gemini/agents/memory-curator.md`
  - `.gemini/agents/fundamental-researcher.md`

These definitions are directly usable by Claude Code and Gemini CLI.

For Codex and Kiro, use the same role text as the prompt payload for a spawned worker/subagent.

## 1. `memory-curator`

### Claude Code

Use natural language:

```text
Use the memory-curator subagent to clean up agent-memory after this task.
Have it update only agent-memory files and summarize what changed.
```

For more explicit routing:

```text
Have @memory-curator curate the memory files for this completed task.
```

### Gemini CLI

Use explicit delegation:

```text
@memory-curator Curate the agent-memory files for this completed task.
Read only agent-memory files, make minimal updates, and summarize what changed.
```

### Codex

Use a spawned worker with the role loaded from the definition:

```text
Spawn a worker named memory-curator.
Task:
- Read agent-memory/memory.md, playbook.md, and skill-log.md.
- Consolidate hot state if needed.
- Update only agent-memory/**.
- Return a short summary of what changed and any promotion candidates.
```

### Kiro

Use `invokeSubAgent` with a narrow task block:

```text
Subagent: memory-curator
Goal: Curate agent-memory after task completion.
Read first:
- agent-memory/memory.md
- agent-memory/playbook.md
- agent-memory/skill-log.md
Constraints:
- Write only within agent-memory/**
- Keep edits minimal
- Do not modify source code
Return:
- Summary of edits
- Promotion candidates
```

## 2. `fundamental-researcher`

### Claude Code

Use natural language:

```text
Use the fundamental-researcher subagent to gather a compact fundamentals evidence block for NVDA.
Do not make the final investment call.
```

Or more explicitly:

```text
Have @fundamental-researcher research NVDA fundamentals and return source-labeled evidence only.
```

### Gemini CLI

Use explicit delegation:

```text
@fundamental-researcher Research NVDA fundamentals.
Return business summary, latest financial snapshot, valuation context, key risks, open questions, and sources used.
Do not give the final Buy/Hold/Sell decision.
```

### Codex

Use a spawned worker:

```text
Spawn a worker named fundamental-researcher.
Task:
- Research NVDA fundamentals only.
- Gather business model, latest financial snapshot, valuation context, and key risks.
- Use source and date labels on major claims.
- Mark missing items as N/A.
- Do not make the final Buy/Hold/Sell/No-Trade decision.
```

### Kiro

Use `invokeSubAgent` with a bounded finance lane:

```text
Subagent: fundamental-researcher
Goal: Gather a fundamentals evidence block for NVDA.
Deliver:
- Business summary
- Latest financial snapshot
- Valuation snapshot
- Key risks
- Open questions
- Sources used
Constraints:
- Evidence only
- No final investment decision
- Label major claims with source and date
```

## 3. `news-sentiment-researcher`

### Claude Code

```text
Use the news-sentiment-researcher subagent to gather the latest context for NVDA.
Return recent headlines, why they matter, event risk, and source-labeled notes only.
```

### Gemini CLI

```text
@news-sentiment-researcher Research the latest NVDA news and sentiment.
Return recent headlines, why they matter, net sentiment, open questions, and sources used.
```

### Codex

```text
Spawn a worker named news-sentiment-researcher.
Task:
- Research the latest NVDA news, catalysts, and event risk.
- Label major claims with source and date.
- Return only a compact evidence block.
- Do not make the final investment decision.
```

### Kiro

```text
Subagent: news-sentiment-researcher
Goal: Gather a news and sentiment evidence block for NVDA.
Deliver:
- Recent headlines
- Why they matter
- Net sentiment / event risk
- Open questions
- Sources used
Constraints:
- No final investment decision
- Source/date on major claims
```

## 4. `portfolio-fit-researcher`

### Claude Code

```text
Use the portfolio-fit-researcher subagent to evaluate whether NVDA fits this portfolio:
NVDA 15%, MSFT 10%, VOO 40%, CASH 35%.
Return concentration, overlap, diversification impact, and sizing cautions only.
```

### Gemini CLI

```text
@portfolio-fit-researcher Evaluate whether NVDA fits this portfolio:
NVDA 15%, MSFT 10%, VOO 40%, CASH 35%.
Return concentration risk, overlap, diversification impact, and sizing cautions.
```

### Codex

```text
Spawn a worker named portfolio-fit-researcher.
Task:
- Evaluate how NVDA fits this portfolio: NVDA 15%, MSFT 10%, VOO 40%, CASH 35%.
- Focus on concentration, sector overlap, diversification impact, and sizing cautions.
- Use N/A where inputs are insufficient.
- Do not make the final investment decision.
```

### Kiro

```text
Subagent: portfolio-fit-researcher
Goal: Evaluate how NVDA fits the given portfolio.
Deliver:
- Portfolio context summary
- Concentration / overlap note
- Diversification impact
- Sizing cautions
- Limitations
Constraints:
- No final investment decision
- Use provided holdings first
```

## 5. `etf-lens-researcher`

### Claude Code

```text
Use the etf-lens-researcher subagent to compare QQQ as an alternative lens for this NVDA-heavy thesis.
Return holdings, sector exposure, overlap, cost context, and diversification tradeoffs only.
```

### Gemini CLI

```text
@etf-lens-researcher Evaluate QQQ as an ETF lens for this NVDA-focused idea.
Return ETF objective, holdings, sector exposure, overlap, diversification tradeoffs, and sources used.
```

### Codex

```text
Spawn a worker named etf-lens-researcher.
Task:
- Evaluate QQQ as an ETF alternative or complement to an NVDA-heavy thesis.
- Focus on holdings, sector exposure, expense ratio, overlap, and diversification tradeoffs.
- Label major claims with source and date.
- Do not make the final investment decision.
```

### Kiro

```text
Subagent: etf-lens-researcher
Goal: Gather an ETF lens evidence block for QQQ relative to an NVDA-heavy thesis.
Deliver:
- ETF summary
- Holdings / sector exposure note
- Cost / overlap note
- Diversification tradeoff
- Fit-to-goal note
- Sources used
Constraints:
- No final investment decision
- Source/date on major claims
```

## Mock Orchestration Prompt

Use this when you want a realistic full-mode flow without over-engineering:

```text
Main agent: tradingagents-orchestrator

Task:
- Evaluate NVDA, MSFT, and AMD in medium-term horizon, balanced risk profile.
- Produce a final ranked summary and a per-ticker decision.

Spawn these lanes only:
- fundamental-researcher for NVDA, MSFT, AMD
- news-sentiment-researcher for NVDA, MSFT, AMD
- portfolio-fit-researcher if holdings are provided
- etf-lens-researcher only if an ETF comparison is relevant

Required final output:
- Batch summary table
- Per-ticker decision blocks
- Cross-ticker comparison
- Risk gate
- Monitoring plan

Subagent rules:
- Evidence only
- Source/date on major claims
- Mark unknown items as N/A
- No subagent makes the final Buy/Hold/Sell/No-Trade call
```

## Prompt Pattern That Transfers Well Everywhere

Use this structure regardless of runtime:

```text
Subagent: [agent-name]
Goal: [single bounded goal]
Read first:
- [file or source set]
Deliver:
- [expected output fields]
Constraints:
- [write scope]
- [what the subagent must not decide]
- [source/date or N/A rules]
```

## Runtime Notes

- Claude Code and Gemini CLI can load file-based subagent definitions directly.
- Codex can follow the same role by spawning a worker with the same prompt and scope.
- Kiro can follow the same role through `invokeSubAgent` using the same prompt skeleton.
- The most important portability layer is not the exact command syntax, but:
  - stable role name
  - bounded goal
  - explicit read/write scope
  - explicit output schema
