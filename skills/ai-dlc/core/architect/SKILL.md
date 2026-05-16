---
name: architect
description: >
  This skill should be used when the user asks to "design the architecture", "ออกแบบ architecture",
  "define bounded contexts", "กำหนด bounded contexts", "model the domain", "model domain",
  "create API contracts", "สร้าง API contracts", "do logical design", "ทำ logical design",
  "use TDD", "ทำ TDD", or needs DDD Strategic & Tactical Design, Logical Design,
  or Test-Driven Development guidance.
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
