---
name: graph-report
description: >
  Generate a per-project knowledge graph report (GRAPH_REPORT.md) that maps
  god nodes, communities, dependencies, surprising connections, and file index.
  Includes query/path/explain capabilities without external tools.
  Triggers: "create graph report", "update graph report", "dependency map",
  "codebase overview", "god nodes", "surprising connections", "สร้าง graph report",
  "graph query", "graph path", "graph explain"
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Graph Report Generator

Generate or update a per-project knowledge graph — makes navigating the codebase faster than reading source directly. Provides graphify-like features (communities, queries, path analysis) using AI agent capabilities only — no external CLI needed.

## Concept

A Graph Report answers: "ไฟล์ไหนสำคัญ เชื่อมกันยังไง มีอะไรที่ไม่ obvious"

**Output:** `{project-root}/GRAPH_REPORT.md` — a human-readable map of the codebase with community structure.

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Project source code | Read access | Scan structure, imports, exports, calls |
| Git history | Shell tool | Commit hash for freshness check |
| grep_search / readCode | Tools | Parse imports and dependencies |

## Process

### Step 1: Scan & Parse

- Read project structure (folders, key files)
- **Parse imports/exports** — use `grep_search` to find `import` statements across all `.ts`/`.js`/`.tsx` files
- Count edges: how many files import each module (degree count)
- Identify entry points, configs, shared modules

### Step 2: Community Detection (NEW — graphify-like)

Group files into communities based on import relationships:

1. **Seed communities** from folder structure (each `[system]/[feature]/` = 1 community)
2. **Merge** communities that share 3+ cross-imports
3. **Calculate cohesion** = internal edges / (internal nodes × (internal nodes - 1))
4. **Name** each community by its dominant domain/feature

Output format:
```markdown
## Communities ({N} total)

### Community 1 — "{Feature Name}"
Cohesion: {0.00-1.00}
Nodes ({N}): file1.ts, file2.ts, ...
Hub: {most-connected file in this community}
```

### Step 3: Write Report Contract

State what this file is for and what it is not for.
Tag every claim with an evidence level:

- `EXTRACTED` — directly visible in source files (import statements, function calls)
- `INFERRED` — reasonable relationship inferred from naming, folder structure, or patterns
- `AMBIGUOUS` — needs human verification

### Step 4: Corpus Check + Graph Freshness

```markdown
## Corpus Check
- {N} files · ~{N} lines
- {N} nodes · {N} edges · {N} communities

## Graph Freshness
- Built from commit: `{hash}`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
```

### Step 5: Identify God Nodes

Find 5-10 files/modules that everything depends on:

- 5+ direct dependents (degree count)
- Touches multiple communities
- Breaking it breaks everything

Format:
```markdown
## God Nodes (most connected)
| # | File | Edges | Communities Touched | Evidence |
|---|------|-------|--------------------:|----------|
| 1 | helpers/authService.ts | 12 | 4 | EXTRACTED |
```

### Step 6: Map Dependencies (ASCII diagrams)

- Data flow (User → Pages → Services → APIs)
- Auth flow (if applicable)
- Test execution flow (if test project)
- Cross-layer flow (API → Web UI → Mobile via shared-fixtures)

### Step 7: Index Files

Group by architectural layer — tables with path, purpose, community, connections.

### Step 8: Find Surprising Connections

Document non-obvious links:

- Cross-community imports that shouldn't exist
- Side effects hidden in unrelated functions
- Data living in unexpected locations
- Implicit dependencies (no import, but breaks without it)

Format:
```markdown
## Surprising Connections
| # | From | To | Type | Evidence |
|---|------|-----|------|----------|
| 1 | fileA.ts | fileB.ts | calls | INFERRED |
```

### Step 9: Write Output

Generate `GRAPH_REPORT.md` at project root.

---

## Query Capabilities (graphify-like — no external tool needed)

When user asks graph questions, agent can answer using GRAPH_REPORT.md + source scanning:

### `graph query "{question}"`
- Read GRAPH_REPORT.md → find relevant community/god node
- If not enough → grep_search for specific imports/calls
- Return: scoped subgraph (files + relationships relevant to question)

### `graph path "{A}" "{B}"`
- Find shortest import chain from file A to file B
- Use GRAPH_REPORT.md communities + grep_search for imports
- Return: A → imports → X → imports → B (with evidence)

### `graph explain "{concept}"`
- Find all files related to a concept (by name, import, or community)
- Return: concept definition, where used, dependencies, test coverage

### Usage in AIDLC

| Phase | Query | Purpose |
|-------|-------|---------|
| Phase 0 | `graph query "existing patterns"` | Find reusable code before starting |
| Phase 2.1 | `graph query "test helpers"` | Find existing test infrastructure |
| Phase 2.4 | `graph path "fixture" "spec"` | Verify import chain is correct |
| Phase 3.1 | `graph explain "AuthService"` | Understand shared service before extending |

---

## When to Generate

| Trigger | Action |
|---------|--------|
| New project reaches first working feature | Create initial graph |
| PBI/feature completed (Phase 2.4 done) | Update affected sections |
| Major refactor | Full rebuild |
| User asks | Generate or update |
| AIDLC Step 10 | Auto-trigger after each phase with new files |

## Quality Criteria

- [ ] Report Contract present — states what file is/is not for
- [ ] Corpus Check present — file counts + commit hash
- [ ] Graph Freshness — commit hash for stale detection
- [ ] God Nodes identified (5-10), with edge count + communities touched
- [ ] Communities detected — grouped by feature/domain with cohesion scores
- [ ] Evidence tags used (EXTRACTED / INFERRED / AMBIGUOUS)
- [ ] Dependency diagrams present (ASCII)
- [ ] File Index covers all major directories with community assignment
- [ ] Surprising Connections has at least 3 entries with cross-community analysis
- [ ] Suggested Questions answer real "where is X?" queries
- [ ] Date in header

## Rules

- NEVER hallucinate file paths — verify every path exists via tools
- ALWAYS update the date when regenerating
- "Edges" column = degree count (integer) from actual import parsing
- Tag claims with EXTRACTED / INFERRED / AMBIGUOUS — never leave claims untagged
- Communities MUST be based on actual import relationships, not just folder structure
- Cohesion score MUST be calculated (internal edges / possible internal edges)
- Graph Freshness MUST include commit hash
- Adapt sections by project type (test project vs app vs library)

---

## Verification

Before declaring graph report complete, confirm:

- [ ] All file paths verified (exist on disk)
- [ ] Import relationships parsed (not guessed from naming)
- [ ] Communities have cohesion scores
- [ ] God nodes have actual edge counts from import parsing
- [ ] Commit hash recorded for freshness
- [ ] Surprising connections are genuinely non-obvious (cross-community)

---

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/meta/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
