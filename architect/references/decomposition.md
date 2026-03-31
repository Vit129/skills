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
5. **Choose multi-tenancy strategy (if applicable):**

| Strategy | Isolation | Cost | Complexity | When to use |
|----------|-----------|------|------------|-------------|
| Single-Tenant | Highest | High (1 DB per tenant) | Low per tenant, high ops | Enterprise, strict compliance |
| Shared DB + Row-Level | Low | Low | Medium (tenant_id everywhere) | SaaS, cost-sensitive |
| Schema-per-Tenant | Medium | Medium | Medium (migration per schema) | Balance isolation + cost |

If project doesn't need multi-tenancy → skip this step.
   - Multi-tenant schema per tenant — highest isolation (regulatory)
6. **Define bounded contexts** — name, responsibilities, key entities, data ownership
7. **Prioritize contexts** — implementation order:
   - Core Business (revenue-generating) → first
   - Data-Heavy (complex queries, reporting) → second
   - Integration (external APIs, third-party) → third
   - Supporting (admin, config, logging) → last
8. **Map relationships** — upstream/downstream, shared kernel, anti-corruption layer
9. **Verify coverage** — every user story must be assigned to a context, no orphans

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
