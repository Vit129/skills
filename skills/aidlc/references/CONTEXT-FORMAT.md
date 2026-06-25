# CONTEXT.md Format

Per-project domain glossary — a shared language between human and AI.

## Location

```
{project-root}/CONTEXT.md
```

If a project has multiple bounded contexts, use `CONTEXT-MAP.md` at root pointing to per-context files:

```
{project-root}/CONTEXT-MAP.md
{project-root}/src/ordering/CONTEXT.md
{project-root}/src/billing/CONTEXT.md
```

## Structure

```markdown
# {Project Name}

{One-sentence project description}

## Language

**{Term}**: {Precise definition — what it IS, not how it's implemented}

**{Term}**: {Definition}. _Avoid_: {ambiguous alternatives that should not be used}

## Relationships

- A **{Term A}** contains many **{Term B}**s
- A **{Term B}** belongs to exactly one **{Term A}**

## Flagged Ambiguities

- "{old term}" was previously used to mean X — resolved: now called **{canonical term}**
```

## Rules

- **No implementation details.** CONTEXT.md is a glossary, not a spec.
- **Bold the term** on first use in its definition.
- **Use _Avoid_** to kill ambiguous synonyms (e.g., _Avoid_: ticket, task, item)
- **Relationships section** only for non-obvious connections.
- **Flagged Ambiguities** records resolved naming conflicts — prevents regression.
- **Create lazily** — only when the first term is resolved. Don't create an empty file.
- **Update inline** — when a term is resolved during interview (me/doc/amigos mode)/inception, update immediately. Don't batch.

## Example

```markdown
# Course Video Manager

Manages the lifecycle of video courses from authoring through delivery.

## Language

**Course**: A published collection of **Section**s sold as a single product. _Avoid_: class, program

**Section**: An ordered group of **Lesson**s within a **Course**. _Avoid_: module, chapter

**Lesson**: A single teachable unit — may be a video, exercise, or article. _Avoid_: lecture, unit

**Materialization**: The act of creating filesystem structure for a **Lesson** that previously existed only as a plan. _Avoid_: "making it real", instantiation

**Materialization Cascade**: When materializing a **Lesson** triggers materialization of its parent **Section** and sibling **Lesson**s.

## Relationships

- A **Course** contains 1+ **Section**s (ordered)
- A **Section** contains 1+ **Lesson**s (ordered)
- A **Lesson** belongs to exactly one **Section**

## Flagged Ambiguities

- "module" was used interchangeably for Section and npm package — resolved: Section for course structure, "package" for npm.
```

## When to Create/Update

| Trigger | Action |
|---------|--------|
| AIDLC Phase 1 (domain-design step) | Generate initial CONTEXT.md from domain model |
| During `interview` (me mode) | Update inline when term is resolved (pre-inception, no code) |
| During `interview` (doc mode) | Update inline when term is resolved (has codebase, cross-ref code) |
| During `interview` (amigos mode) | Update inline when term is sharpened |
| Term conflict discovered in code review | Add to Flagged Ambiguities |
| New bounded context added | Create per-context CONTEXT.md |
