# Domain Decomposition (DDD Strategic Design)

Define bounded contexts and choose the right architecture pattern before any technical design.

## When to use

- After requirements gathering
- Need to define system boundaries before technical design

## How it works

1. **Group user stories by business function** — architecture-agnostic, focus on what the business does
2. **Identify natural domain boundaries** — where does one concern end and another begin?
3. **Assess complexity** — team size, scalability needs, integration complexity
4. **Choose architecture pattern:**
   - Monolith — single codebase, shared DB (small teams, simple systems)
   - Microservices — multiple services, DB per service (large teams, high scale)
5. **Choose multi-tenancy strategy:**
   - Single-tenant — user-level isolation
   - Multi-tenant shared DB — org-level isolation (typical SaaS)
   - Multi-tenant schema per tenant — highest isolation (regulatory)
6. **Define bounded contexts** — name, responsibilities, key entities, data ownership
7. **Map relationships** — upstream/downstream, shared kernel, anti-corruption layer
8. **Verify coverage** — every user story must be assigned to a context, no orphans

## Output

```text
Architecture: [Monolith / Microservices]
Multi-tenancy: [Single / Shared DB / Schema per Tenant]

Context 1: [Name]
- Responsibilities: [what it owns]
- Entities: [key entities]
- Stories: [US-001, US-002]

Context 2: [Name]
- ...

Relationships:
- Context 1 → Context 2: [upstream/downstream]
```

## Rules

- Business capabilities first, technology choices later
- No tech details in this phase — no databases, no frameworks
- Every user story must belong to exactly one context
