# GRAPH_REPORT.md — Template

Use this template when generating a project's knowledge graph.
Replace `{placeholders}` with actual project data. Remove sections that don't apply.

---

## File Header

```markdown
# {Project Name} — Knowledge Graph Report
<!-- Auto-generated: {YYYY-MM-DD} | Update when adding new features/services -->
```

---

## Section 0: Report Contract

Always include. Tells readers what this file is and is not for.

```markdown
## Report Contract

This report is a codebase knowledge graph for navigation, impact analysis,
god-node discovery, and surprising relationships.

Use this file for:
- God nodes and high-degree modules
- Dependency/data/state flows
- File index and ownership map
- Surprising connections and impact risks
- Suggested architecture/navigation questions

Do not use this file for:
- Agent behavior, safety, git, or response rules
- Runtime-specific instructions for Claude, Codex, Gemini, or Kiro
- Dev command checklists (those belong in AGENTS.md / CLAUDE.md)

Evidence tags:
- `EXTRACTED` = directly visible in source files
- `INFERRED` = reasonable relationship inferred from imports, calls, or naming
- `AMBIGUOUS` = needs human verification before relying on it
```

---

## Section 1: Corpus Check

Snapshot of what was scanned. Helps readers know how fresh the report is.

```markdown
## Corpus Check

- Source files scanned: {N}
- Focused corpus: {N} `src/` files, {N} `tests/` files
- Built from commit: `{git commit hash}`
```

For test-only projects:

```markdown
## Corpus Check

- Source files scanned: {N}
- Focused corpus: {N} spec files, {N} page objects, {N} helpers, {N} fixtures
- Built from commit: `{git commit hash}`
```

---

## Section 2: God Nodes

High-degree modules — always check these first.

Identify 3-7 nodes that are true bottlenecks. A god node has:

- 5+ direct dependents
- Touches multiple domains
- Breaking it breaks everything

**"Connected To" column = degree count (integer)** — count how many files import or depend on this node.

```markdown
## God Nodes

| Node | Type | Connected To | Role |
| --- |--- |--- |--- |
| `{path/to/file}` | {Config/Module/Service/Page Object/Hook} | {N} | {one-line role} `EXTRACTED` |
```

**Type vocabulary:** Config, Module, Service, Hook, Page Object, Fixture, Router, Context

**Optional sub-tables** when relevant:

```markdown
### Agent Runtime / Documentation Nodes

| Node | Type | Connected To | Role |
| --- |--- |--- |--- |
| `AGENTS.md` | Agent entrypoint | All agents | Agent routing and skill map `EXTRACTED` |
```

---

## Section 3: Dependency Map

Use ASCII diagrams. Adapt sub-maps to project type.

**Diagram rules:**

- Use `──►` or `-->` for data direction
- Use `├──` / `└──` for tree branches
- Use `│` for vertical connections
- Max width: 100 chars
- Label each arrow with the mechanism (reads/writes, HTTP, localStorage, etc.)

### 3a. Data Flow

Show: User → Pages → Store → External APIs

### 3b. Domain-Specific Flow (add as needed)

- Frontend/AI: AI Flow
- API project: Request Flow
- Test project: Auth Flow + Test Execution Flow
- Mobile: Navigation Flow

### 3c. State Flow (if applicable)

Show: Store shape with source and consumers for each key.

---

## Section 4: File Index

Group by architectural layer. Use tables.

```markdown
## File Index

### {Layer Name}

| File | Purpose | Key Connections |
|------|---------|----------------|
| `{path}` | {one-line purpose} `EXTRACTED` | {what it imports/exports to} |
```

**Layer order (top to bottom):**

1. Pages / Routes
2. Features / Modules
3. Services / Data layer
4. Hooks / State
5. Cloud Functions / Backend
6. Server / Dev tools
7. Config / Build

---

## Section 5: Key Entities / State

For projects with a central store or complex state:

```markdown
## Key Entities / State

| Entity | Source | Read By |
|--------|--------|---------|
| `{state_key}` | {where it comes from} `EXTRACTED` | {who consumes it} |
```

---

## Section 6: Surprising Connections

**The most valuable section.** Document non-obvious links that would trip up a developer.

Criteria for inclusion:

- Side effects hidden in unrelated functions
- Data living in unexpected locations
- Dual/redundant paths that must stay in sync
- Implicit dependencies (no import, but breaks without it)

```markdown
## Surprising Connections

### {N}. {Short title} `EXTRACTED`
{2-3 sentence explanation of what's surprising and why it matters}
```

Aim for 5-10 entries.

---

## Section 7: Feature Summary

```markdown
## Feature Summary

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| {name} | {✅ Production / ⚠️ Partial / 🚧 WIP / ❌ Broken} | {main files} | {one-line context} |
```

---

## Section 8: Suggested Questions

Write 3-5 questions a developer would actually ask, with answers referencing specific files.

```markdown
## Suggested Questions

### "{Natural question}?"
{Answer referencing specific code paths, files, and functions}
```

---

## Adaptation by Project Type

| Project Type | Emphasize | De-emphasize |
|-------------|-----------|--------------|
| Frontend (React/Vue) | State Flow, Component tree, Route map | Backend/infra |
| API/Backend | Request flow, DB schema, Auth chain | UI components |
| Mobile | Navigation flow, Platform differences, Offline | Server |
| Full-stack | All sections, keep each concise | None |
| Test project | Auth flow, Test execution flow, Fixture map | Production features |
| Monorepo | Package dependency graph, Shared libs | Individual package internals |

---

## For Test Projects (like cpi-LINUX-AGENT-POOL)

Adapt each section as follows:

### God Nodes — test infrastructure

```markdown
## God Nodes

| Node | Type | Connected To | Role |
| --- |--- |--- |--- |
| `tests/web-testing/playwright.config.ts` | Config | {N} | Test runner config, baseURL, storageState path `EXTRACTED` |
| `helpers/.../globalSetup.ts` | Module | {N} | Multi-role Azure AD login → storageState `EXTRACTED` |
| `helpers/.../loginHelper.ts` | Module | {N} | ensureLoggedIn() session guard + re-auth `EXTRACTED` |
| `helpers/.../authService.ts` | Service | {N} | OAuth token acquisition `EXTRACTED` |
| `pages/.../orderingPage.ts` | Page Object | {N} | Core UI interaction layer `EXTRACTED` |
```

### Dependency Map — test-specific sub-maps

```markdown
### Data Flow
{Test files → Page Objects / Service Helpers → Target App / API}

### Auth Flow
{.env → globalSetup → storageState files (web) | authService → Bearer token (API)}

### Test Execution Flow
{npm script → ENV → playwright.config → globalSetup → spec files → page objects}
```

### File Index — group by test layer

Config / Web Tests / Web Page Objects / Web Helpers / API Tests / API Helpers / Fixtures & Schemas / Shared & CI/CD

### Feature Summary → replace with Test Coverage Summary

```markdown
## Test Coverage Summary

| Scenario | Layer | Status | Key Files | PBI / Notes |
|----------|-------|--------|-----------|-------------|
| {SC01: description} | Web + API | {✅ Covered / ⚠️ Partial / 🚧 WIP / ❌ Missing} | {spec file} | {PBI-xxx} |
```

Status vocabulary:

- `✅ Covered` — spec exists and passes in CI
- `⚠️ Partial` — spec exists but missing edge cases
- `🚧 WIP` — spec in progress
- `❌ Missing` — no test exists yet

---

## Maintenance Rules

1. **Update trigger:** After completing a PBI or major feature
2. **Partial update:** Only touch sections affected by the change
3. **Date:** Always update the header date
4. **Prune:** Remove entries for deleted files/features
5. **Verify:** Spot-check 2-3 file paths still exist before committing
6. **Evidence tags:** Re-tag any new claims — never leave untagged
