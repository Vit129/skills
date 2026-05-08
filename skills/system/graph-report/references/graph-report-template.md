# GRAPH_REPORT.md — Template

Use this template when generating a project's knowledge graph. Replace `{placeholders}` with actual project data. Remove sections that don't apply (e.g., no Cloud Functions = skip that table).

---

## File Header

```markdown
# {Project Name} — Knowledge Graph Report
<!-- Auto-generated: {YYYY-MM-DD} | Update when adding new features/services -->
```

---

## Section 1: God Nodes

*Entities/modules everything flows through — always check these first*

Identify 3-7 nodes that are true bottlenecks. A god node has:
- 5+ direct dependents
- Touches multiple domains (UI + data + API)
- Breaking it breaks everything

```markdown
## God Nodes

| Node | Type | Connected To | Role |
|------|------|-------------|------|
| `{identifier}` | {Store/Page/Service/Module} | {list of dependents} | {one-line role description} |
```

**Type vocabulary:** Store, Page, Service, Module, Cloud Function, Hook, Context, Router

---

## Section 2: Dependency Map

Use ASCII diagrams. Three sub-maps:

### 2a. Data Flow
Show: User → Pages → Store → External APIs

### 2b. Domain-Specific Flow (optional)
For AI-heavy projects: AI Flow
For API projects: Request Flow
For mobile: Navigation Flow

### 2c. State Flow
Show: Store shape with source and consumers for each key

**Diagram rules:**
- Use `──►` for data direction
- Use `├──` / `└──` for tree branches
- Use `│` for vertical connections
- Max width: 100 chars
- Label each arrow with the mechanism (reads/writes, HTTP, localStorage, etc.)

---

## Section 3: File Index

Group by architectural layer. Use tables.

```markdown
## File Index

### {Layer Name} (e.g., Pages, Features, Services, Hooks, Cloud Functions)
| File | Purpose | Key Connections |
|------|---------|----------------|
| `{path}` | {one-line purpose} | {what it imports/exports to} |
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

## Section 4: Key Entities / State

For projects with a central store or complex state:

```markdown
## Key Entities / State

| Entity | Source | Read By |
|--------|--------|---------|
| `{state_key}` | {where it comes from} | {who consumes it} |
```

---

## Section 5: Surprising Connections

**The most valuable section.** Document non-obvious links that would trip up a developer who only reads the obvious code paths.

Criteria for inclusion:
- Side effects hidden in unrelated functions
- Data living in unexpected locations
- Dual/redundant paths that must stay in sync
- Migration artifacts that look like bugs
- Implicit dependencies (no import, but breaks without it)

```markdown
## Surprising Connections

### {N}. {Short title}
{2-3 sentence explanation of what's surprising and why it matters}
```

Aim for 5-10 entries. Fewer is fine for small projects.

---

## Section 6: Feature Summary

```markdown
## Feature Summary

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| {name} | {✅ Production / ⚠️ Partial / 🚧 WIP / ❌ Broken} | {main files} | {one-line context} |
```

---

## Section 7: Suggested Questions

Write 3-5 questions a developer would actually ask, with answers that reference specific files/functions.

```markdown
## Suggested Questions

### "{Natural question}?"
{Answer referencing specific code paths, files, and functions}
```

Good questions:
- "Why does X behave unexpectedly?"
- "Where does Y data come from?"
- "How do I add a new Z?"
- "What's the difference between A and B?"

---

## Adaptation by Project Type

| Project Type | Emphasize | De-emphasize |
|-------------|-----------|--------------|
| Frontend (React/Vue) | State Flow, Component tree, Route map | Backend/infra |
| API/Backend | Request flow, DB schema, Auth chain | UI components |
| Mobile | Navigation flow, Platform differences, Offline | Server |
| Full-stack | All sections, but keep each concise | None |
| Test project | Test structure, Mock strategy, Fixture map | Production features |
| Monorepo | Package dependency graph, Shared libs | Individual package internals |

---

## For Test Projects (like ai-dlc-skill-testing)

When the project is primarily a test workspace:

```markdown
## God Nodes
→ Focus on: test config, shared fixtures, mock handlers

## Dependency Map
→ Show: Test files → Fixtures → Mock handlers → Target APIs

## File Index
→ Group by: test-scenario/, api-testing/, web-testing/, mobile-testing/

## Key Entities
→ Show: Mock data shapes, environment configs, shared utilities

## Surprising Connections
→ Focus on: shared fixtures across test types, mock handler coverage gaps

## Feature Summary
→ Replace with: Test Coverage Summary (which PBIs have tests, which don't)
```

---

## Maintenance Rules

1. **Update trigger:** After completing a PBI or major feature
2. **Partial update:** Only touch sections affected by the change
3. **Date:** Always update the header date
4. **Prune:** Remove entries for deleted files/features
5. **Verify:** Spot-check 2-3 file paths still exist before committing
