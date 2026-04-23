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
