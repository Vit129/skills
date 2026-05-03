# Finance Research Subagent Patterns

Use finance subagents selectively. These are research lanes, not default workers for every finance query.

## Why Finance Can Benefit

- Research naturally splits into multiple evidence lanes.
- Different lanes can collect facts in parallel.
- The main agent can stay focused on synthesis and final judgment.
- This fits especially well with `tradingagents-orchestrator`.

## When To Use Subagents

Use subagents when:
- The user provides 2–5 tickers
- The user wants the “full mode” report
- The task needs multiple evidence lanes at once
- There is substantial live web research to gather

Avoid subagents when:
- The user asks a quick single-ticker question
- The answer is mostly educational, not research-heavy
- Portfolio context is missing and the task does not need comparison

## Recommended Research Subagents

### 1. `fundamental-researcher`

Use when:
- A stock needs a fundamentals-first read
- The final answer must include business quality and valuation

Responsibilities:
- Business model and segments
- Latest financial snapshot
- Margins, FCF, cash/debt
- Valuation multiples and peer framing
- Key business risks

Expected output:
- Structured evidence block
- Source + date on each major claim
- Clear unknowns marked as `N/A`

### 2. `news-sentiment-researcher`

Use when:
- The ticker is event-driven
- The user wants the latest context
- The final answer must reflect recent news and catalysts

Responsibilities:
- Recent headlines
- Market-moving events
- Management guidance changes
- Sentiment summary
- Near-term catalyst / event risk

Expected output:
- Headline list
- Why each item matters
- Net sentiment / uncertainty note

### 3. `peer-comparison-researcher`

Use when:
- The user provides multiple tickers
- The final answer needs a “which is better and why” comparison

Responsibilities:
- Relative growth comparison
- Relative profitability comparison
- Valuation comparison
- Guidance / positioning comparison

Expected output:
- Cross-ticker comparison block
- Relative winners / laggards
- Caveats where comparisons are imperfect

### 4. `portfolio-fit-researcher`

Use when:
- The user provides holdings or weights
- The question is partly about fit within an existing portfolio

Responsibilities:
- Concentration impact
- Sector overlap
- Diversification effect
- Rebalancing implications

Expected output:
- Portfolio-fit note
- Risk implications
- Sizing or allocation cautions

### 5. `etf-lens-researcher`

Use when:
- The asset is an ETF
- The user wants to compare ETF exposure against stock-picking
- A passive alternative should be evaluated

Responsibilities:
- Holdings
- Sector exposure
- Expense ratio / cost
- Tracking / overlap
- Goal fit

Expected output:
- ETF lens summary
- Cost/diversification tradeoff
- Complement vs redundancy note

## Recommended Orchestration

For full-mode finance analysis:

1. Main agent = `tradingagents-orchestrator`
2. Spawn only the research lanes needed
3. Collect evidence blocks
4. Main agent performs:
- Bull/bear synthesis
- Risk gate
- Final Buy/Hold/Sell/No-Trade decision
- Monitoring plan

## Scope Rules

- Subagents gather evidence; they do not own the final investment call
- The main agent remains responsible for synthesis and consistency
- Every evidence block should be source- and date-labeled
- If a lane is not needed, do not spawn it

## Cost Guidance

Good value:
- Batch tickers
- Full-mode reports
- Deep evidence gathering across multiple lanes

Poor value:
- Quick single-ticker answers
- Generic educational questions
- Cases where one lane already dominates the answer

## Suggested Prompt Skeleton

```text
You are a finance research subagent working on one bounded evidence lane.

Lane:
- [fundamentals / news-sentiment / peer-comparison / portfolio-fit / ETF lens]

Task:
- Gather only the evidence needed for this lane.

Constraints:
- Use live web research for unstable facts.
- Label each major claim with source and date.
- Mark missing data as N/A.
- Do not produce the final Buy/Hold/Sell/No-Trade decision.

Return:
- A compact structured evidence block
- Key risks or uncertainties
- What the main agent should pay attention to during synthesis
```

## Ready-To-Use Definitions

Cross-runtime examples and invocation patterns:
- Claude/Codex project docs: `.claude/agents/USAGE.md`
- Claude definition: `.claude/agents/fundamental-researcher.md`
- Gemini definition: `.gemini/agents/fundamental-researcher.md`
- Additional finance lanes:
  - `.claude/agents/news-sentiment-researcher.md`
  - `.claude/agents/portfolio-fit-researcher.md`
  - `.claude/agents/etf-lens-researcher.md`
  - `.gemini/agents/news-sentiment-researcher.md`
  - `.gemini/agents/portfolio-fit-researcher.md`
  - `.gemini/agents/etf-lens-researcher.md`
