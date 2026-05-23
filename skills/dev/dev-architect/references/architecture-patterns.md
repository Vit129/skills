# Architecture Patterns

Microservices vs Monolith — how each pattern affects file structure, workflow, and output organization.

## When to use

- After domain decomposition (bounded contexts defined)
- Need to decide how to organize code, files, and deliverables per pattern

## Monolith

Single codebase, shared database, one deployment unit.

**When to choose:**
- Small team (1-5 devs)
- Simple domain with few bounded contexts
- Rapid prototyping / MVP
- Low scalability requirements

**File structure:**
```text
outputs/construction/
├── domain-design.md          (all contexts in one file, separated by sections)
├── logical-design.md         (all endpoints in one file)
└── implementation-plan.md
```

**Workflow:**
- Single domain-design file with sections per context
- Single logical-design file with all endpoints
- One implementation plan covering everything
- Shared database schema

## Microservices

Multiple services, database per service, independent deployment.

**When to choose:**
- Large team (5+ devs, multiple squads)
- Complex domain with clear bounded context boundaries
- High scalability / independent deployment needed
- Different tech stacks per service acceptable

**File structure:**
```text
outputs/construction/
├── catalog/
│   ├── domain-design.md
│   ├── logical-design.md
│   └── implementation-plan.md
├── order/
│   ├── domain-design.md
│   ├── logical-design.md
│   └── implementation-plan.md
└── user/
    ├── domain-design.md
    ├── logical-design.md
    └── implementation-plan.md
```

**Workflow:**
- Separate files per bounded context (`domain-design-{context}.md`)
- Context selection: ask user which context to work on
- Priority order: Core Business → Data-Heavy → Integration → Supporting
- Each context gets its own decision/plan files (`03-domain-design-catalog.md`)
- Database per service — no shared tables across contexts

## Context Selection (Microservices)

When entering a phase that operates per context:

1. List all bounded contexts from domain decomposition
2. Ask user: "Which context to work on?" (or suggest priority order)
3. Create context-specific files: `{phase}-{context}.md`
4. Repeat phase for each context until all are done

## Decision Guide

| Factor | Monolith | Microservices |
| --- | --- | --- |
| Team size | 1-5 | 5+ |
| Deployment | Single unit | Independent per service |
| Database | Shared | Per service |
| Complexity | Low-medium | High |
| Scalability | Vertical | Horizontal per service |
| Dev speed (early) | Faster | Slower (infra overhead) |
| Dev speed (late) | Slower (coupling) | Faster (independence) |
