# Domain Design (DDD Tactical Design)

Model entities, aggregates, and domain events using pseudocode — no actual code in this phase.

## When to use

- After domain decomposition
- Need to model business domain before technical specifications

## How it works

1. **Classify each concept:**
   - Entity — has identity, changes over time (e.g., User, Order)
   - Value Object — no identity, immutable (e.g., Address, Money)
   - Aggregate Root — consistency boundary, entry point for a cluster of entities
2. **Define business rules in pseudocode:**
   ```text
   WHEN [trigger]
   IF [condition]
     THEN [action]
     AND EMIT [event]
   ELSE
     THROW [exception]
   ```
3. **Define domain events** — what business moments need to be captured?
4. **Define domain services** — logic that doesn't belong to a single entity
5. **Define repository interfaces** — findById, save, findBy{Criteria}

## Output per bounded context

```text
Entities: [list with key attributes]
Value Objects: [list]
Aggregates: [root entity + boundary]
Domain Events: [list with trigger conditions]
Domain Services: [list with responsibilities]
Repositories: [interfaces]
Business Rules: [pseudocode]
```

## Rules

- Pseudocode only — no actual code
- Microservices → one file per bounded context
- Monolith → one file with sections per context

## Concurrency Rules (MANDATORY for shared resources)

สำหรับ Aggregate ที่มี concurrent access ต้องระบุ locking strategy ก่อน implement:

### Decision: Optimistic vs Pessimistic Locking

| Strategy | เมื่อไหร่ใช้ | Trade-off |
|---------|------------|---------|
| **Optimistic Locking** (version field) | Conflict น้อย, read-heavy | ต้อง retry เมื่อ conflict |
| **Pessimistic Locking** (SELECT FOR UPDATE) | Conflict บ่อย, write-heavy | Block concurrent reads |
| **Idempotency Key** | Duplicate request prevention | ต้องเก็บ key history |

### Output เพิ่มเติม (ต่อท้าย Business Rules)

```text
Concurrency Rules:
- [AggregateName]: [optimistic | pessimistic | idempotency]
  Reason: [ทำไมเลือก strategy นี้]
  Conflict behavior: [retry N times | throw ConflictError | queue]
  DB isolation: [READ COMMITTED | REPEATABLE READ | SERIALIZABLE]
```

### ตัวอย่าง

```text
Concurrency Rules:
- Reservation (Seat lock): pessimistic (SELECT FOR UPDATE)
  Reason: seat booking conflict บ่อย, 15-min lock window
  Conflict behavior: throw ConflictError 409
  DB isolation: SERIALIZABLE
```
