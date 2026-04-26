# Token Optimization Tips (Claude Code)

## 1. Extended Thinking Token Management

Extended Thinking consumes **all thinking tokens as output tokens** — expensive for simple tasks.

**Usage:**

- **Toggle on/off:** Press `Tab` in Claude Code CLI
- **Global limit:** Set in `~/.zshrc`:

  ```bash
  export MAX_THINKING_TOKENS=8000
  ```

  Then reload: `source ~/.zshrc`

**When to use:**

- Use for complex architectural decisions and debugging multi-file dependencies
- Skip for simple commands, quick fixes, and file reads

---

## 2. Prompt Cache Protection

- Do NOT edit CLAUDE.md, `.claude/rules/`, or MCP config mid-session — cache breaks permanently for that session
- Configure everything before starting a session — changes mid-session = cache lost, no recovery
- If you must change: run `/clear` and start a new session
- CLAUDE.md structure: stable content (standards, rules) at top; dynamic content (test mapping) at bottom

---

## 3. Autocompact Circuit Breaker

If compaction fails 3+ times in a row → switch model to 1M context (`/model`) then run `/compact`

---

## 4. Context Efficiency with .claudeignore

Exclude unnecessary files from context scanning via `.claudeignore`.

Already configured:

- Build artifacts: `dist/`, `assets/`
- Dependencies: `node_modules/`
- Test noise: `playwright-report/`, `test-results/`
- Secrets: `.env`, `.firebase/`
- OS/Logs: `*.log`, `.DS_Store`

---

## 5. Output Compression — Caveman Style

Reduce output tokens ~65-75% without losing technical accuracy.

Principles (from [Caveman](https://github.com/JuliusBrussee/caveman) + [claude-token-efficient](https://github.com/drona23/claude-token-efficient)):

- Cut filler words: "Sure!", "Great question!", "I'd be happy to help", "Let me know if..."
- Drop unnecessary articles (a/an/the), hedging, and pleasantries
- Fragments are fine — full sentences not required
- Pattern: `[thing] [action] [reason]. [next step].`
- Code unchanged — compress prose only
- Expand only for: security warnings, irreversible actions, user confusion

**Trade-off:** The rules file itself consumes input tokens every message — only net-positive when output volume is high enough to offset the persistent input cost.

**Install (Claude Code):**

```bash
claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman
```

---

## 6. CLI Output Filtering — RTK

Reduce shell output tokens 60-90% before they enter context.

Principles (from [RTK](https://github.com/rtk-ai/rtk)):

- Smart Filtering — removes noise (comments, whitespace, boilerplate)
- Grouping — aggregates similar items (files by directory, errors by type)
- Truncation — keeps relevant context, cuts redundancy
- Deduplication — collapses repeated log lines with counts

**Install:**

```bash
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
rtk init -g   # for Claude Code
```

Example savings: `git status` -80%, `npm test` -90%, `git diff` -75%

---

## 7. Documentation Layering — Load Only What's Needed

Reduce startup tokens ~90% (11K → 800 tokens).

Principles (from [claude-token-optimizer](https://github.com/nadimtuhin/claude-token-optimizer)):

- Keep only 4 core files that load at startup:
  - `CLAUDE.md` — entry point (~450 tokens)
  - `COMMON_MISTAKES.md` — top 5 critical bugs (~350 tokens)
  - `QUICK_START.md` — common commands (~100 tokens)
  - `ARCHITECTURE_MAP.md` — where things are (~150 tokens)
- Move old sessions, completions, archive → `.claudeignore` (0 tokens until explicitly requested)
- Topic-based learnings load on-demand (~500 tokens each)

---

## 8. Structural Code Navigation — Symbol-Based

Reduce code reading tokens ~97% by reading only relevant symbols.

Principles (from [Token Savior](https://github.com/mibayy/token-savior) + [code-review-graph](https://github.com/tirth8205/code-review-graph)):

- Parse codebase into AST → graph of symbols (functions, classes, imports, call graph)
- Navigate by pointer, not by `cat` — `find_symbol()` = 67 chars vs full file read = 41M chars
- Blast-radius analysis: trace callers + dependents + tests of changed file → read only affected files
- Progressive disclosure: index (~15 tokens) → search (~60 tokens) → get (~200 tokens)
- Incremental updates < 2 sec on file save

**Install:**

```bash
pip install code-review-graph
code-review-graph install --platform claude-code
code-review-graph build
```

---

## 9. MCP Tool Context Sandboxing

Reduce MCP tool output in context ~98%.

Principles (from [Context Mode](https://github.com/mksglu/context-mode)):

- Sandbox tool output — raw data never enters context window directly (315KB → 5.4KB)
- "Think in Code" paradigm: instead of reading 50 files into context, write a script that `console.log()`s only the result

  ```js
  // Before: 47 × Read() = 700 KB
  // After: 1 × ctx_execute() = 3.6 KB
  ctx_execute("javascript", `
    const files = fs.readdirSync('src').filter(f => f.endsWith('.ts'));
    files.forEach(f => console.log(f + ': ' + fs.readFileSync('src/'+f,'utf8').split('\\n').length + ' lines'));
  `);
  ```

- Session continuity via SQLite FTS5 — context survives compaction

**Install (Claude Code):**

```bash
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
```

---

## 10. MCP Tool Caching — token-optimizer-mcp

Reduce MCP tool token cost 95%+ via caching and compression.

Principles (from [token-optimizer-mcp](https://github.com/ooples/token-optimizer-mcp)):

- Intelligent caching of repeated MCP tool calls — same query = cached result, 0 tokens
- Compress MCP tool manifests — large tool lists shrunk before entering context
- Reduces per-turn MCP manifest overhead significantly in tool-heavy sessions

---

## 11. Ghost Token Detection & Full Visibility

Find hidden token usage you can't see.

Principles (from [Token Optimizer](https://github.com/alexgreensh/token-optimizer)):

- Dashboard shows every token, every dollar, every turn — auto-updates after each session
- Detects bloated configs, unused skills, duplicate system prompts, stale memory
- Compaction survival: keeps work alive across compactions (normally lose 60-70% context on compact)
- Quality bar measurement: verifies whether optimizations actually helped

**Install (Claude Code):**

```bash
/plugin marketplace add alexgreensh/token-optimizer
/plugin install token-optimizer@alexgreensh-token-optimizer
```

---

## 12. Vector Search for Smart Context

Reduce context cost by fetching only semantically relevant code.

Principles (from [Claude Context](https://github.com/zilliztech/claude-context)):

- Semantic code search via vector DB (Milvus/Zilliz) — no need to load entire directories
- Embedding model (OpenAI) indexes codebase → queries return only related code
- Best for large codebases where loading everything is prohibitively expensive

**Install:**

```bash
claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-key \
  -e MILVUS_ADDRESS=your-endpoint \
  -e MILVUS_TOKEN=your-token \
  -- npx @zilliz/claude-context-mcp@latest
```

---

## Quick Reference

| Problem | Solution | Savings |
| --- | --- | --- |
| Output too verbose | Caveman-style compression (#5) | ~65-75% output |
| Shell output flooding context | RTK CLI filtering (#6) | ~60-90% |
| Heavy startup load | Doc layering + .claudeignore (#7) | ~90% startup |
| Reading entire code files | Symbol-based navigation (#8) | ~97% |
| MCP tool dumping raw data | Sandbox + Think-in-Code (#9) | ~98% |
| Repeated MCP tool calls | MCP caching (#10) | ~95%+ |
| Unknown token drain | Ghost token detection (#11) | varies |
| Large codebase context | Vector search (#12) | significant |
| Thinking tokens too expensive | Toggle Extended Thinking (#1) | 100% when off |
| Cache lost mid-session | Don't edit rules mid-session (#2) | preserves cache |
