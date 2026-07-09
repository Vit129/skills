---
name: dev-architect
description: >
  This skill should be used when the user asks to "design the architecture",
  "define bounded contexts", "model the domain", "model domain",
  "create API contracts", "do logical design",
  "use TDD", or needs DDD Strategic & Tactical Design, Logical Design,
  or Test-Driven Development guidance.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Architect

Design systems from requirements to implementation-ready blueprints.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "bounded contexts", "strategic design", "architecture pattern" | `references/decomposition.md` |
| "microservices vs monolith", "file structure", "context routing" | `references/architecture-patterns.md` |
| "entities", "aggregates", "domain events", "tactical design" | `references/domain-design.md` |
| "API contracts", "DB schema", "frontend spec", "logical design" | `references/logical-design.md` |
| "TDD", "Red Green Refactor", "test-driven" | `references/tdd.md` |

- **DDD Strategic Design** — Bounded contexts, architecture pattern selection. (Read `references/decomposition.md`)
- **Architecture Patterns** — Microservices vs Monolith workflow and file structure. (Read `references/architecture-patterns.md`)
- **DDD Tactical Design** — Entities, aggregates, domain events in pseudocode. (Read `references/domain-design.md`)
- **Logical Design** — API contracts, DB schemas, frontend specs. (Read `references/logical-design.md`)
- **TDD** — Test-Driven Development cycle: Red → Green → Refactor. (Read `references/tdd.md`)

## Inline Process

0. **Entry (mandatory)** — `Skill(interview)` must have already run (its Step 0 scope-check or full gather). If it hasn't, stop and call it first — don't design on top of an unconfirmed scope. Then: run `mcp__graphify__query_graph` on the relevant symbol/module if `graphify-out/` exists in the project root — know the blast radius before Strategic/Tactical Design, not after.
1. **Identify the design phase** — Match to ONE phase: Strategic Design (bounded contexts), Architecture Patterns (monolith vs microservices), Tactical Design (entities/aggregates/events), Logical Design (API contracts/DB schemas), or TDD (Red→Green→Refactor). Execute phases in order — don't skip ahead.
2. **Strategic Design** — Group user stories by business function → identify domain boundaries → assess complexity → choose architecture pattern with documented tradeoffs → define bounded contexts.
3. **Architecture Pattern** — If microservices: define integration patterns per context pair, specify failure handling. If monolith: define module boundaries.
4. **Tactical Design** — Define entities, aggregate roots, value objects, and domain events per bounded context. Events require aggregate boundaries first.
5. **Logical Design** — Produce API contracts, DB schemas, and frontend specs. Only after tactical design is complete.
6. **TDD cycle** — Write a failing test (Red) → implement minimum code to pass (Green) → refactor while keeping tests green.
7. **Verify** — Bounded contexts defined, pattern chosen with tradeoffs, entities/aggregates specified, logical artifacts produced, only ONE reference loaded per step.

## Next Step

Design complete → continue with `references/task-design.md` (Dev section) to break the design into implementation tasks, then implement.

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll jump straight to logical design (API contracts, DB schema) without doing domain design first" | Tactical design (entities, aggregates) must precede logical design. Without domain boundaries defined, your API contracts will leak domain logic across service boundaries. |
| "TDD is too slow for this task — I'll write tests after implementation" | TDD's Red→Green→Refactor cycle catches design flaws BEFORE they're baked into code. Writing tests after means you're testing implementation details, not behavior. |
| "I'll pick microservices because it's more scalable" | Architecture pattern selection requires evaluating team size, deployment constraints, and domain complexity. Microservices for a 2-person team with 3 bounded contexts is over-engineering. |
| "Bounded contexts are obvious from the folder structure" | Bounded contexts are defined by business domain boundaries, not code organization. Folders reflect past decisions (possibly wrong ones), not domain truth. |
| "I don't need to read the reference file — I know DDD well enough" | Each reference contains project-specific conventions and output formats. Skipping it means your output won't match the expected structure for downstream phases. |

---

## Red Flags

- 🚩 API contracts defined without domain-design.md artifacts existing → Logical design was done before tactical design; go back and define entities/aggregates first.
- 🚩 Architecture pattern chosen without listing tradeoffs → Decision was made on instinct, not analysis; load `decomposition.md` and evaluate against actual constraints.
- 🚩 Multiple references loaded simultaneously → Each reference is a distinct design phase; load only the one matching the current step.
- 🚩 Domain events defined but no aggregate boundaries drawn → Events without aggregates means you don't know who owns what; define aggregate roots first.
- 🚩 TDD reference loaded but no failing test written before implementation code → TDD means Red FIRST; if implementation exists without a prior failing test, the cycle was skipped.

