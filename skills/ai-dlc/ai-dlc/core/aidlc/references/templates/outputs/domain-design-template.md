# Domain Design: {Project Name} - {Bounded Context}

## 1. Domain Overview

**Bounded Context**: {Context name and scope}
**Core Domain Focus**: {Primary business capability this context addresses}
**Context Boundaries**: {What's included and excluded from this context}

## 2. Domain Entities

### {Entity Name 1}
**Type**: Entity | Value Object | Aggregate Root
**Purpose**: {What this represents in the business domain}
**Identity**: {How this entity is uniquely identified}

**Attributes**:
- `{attribute1}`: {type} - {business meaning}
- `{attribute2}`: {type} - {business meaning}
- `{attribute3}`: {type} - {business meaning}

**Business Rules**:
- {Rule 1}: {Description of business constraint}
- {Rule 2}: {Description of business constraint}

**Invariants**:
- {Invariant 1}: {What must always be true}
- {Invariant 2}: {What must always be true}

---

### {Entity Name 2}
**Type**: Entity | Value Object | Aggregate Root
**Purpose**: {What this represents in the business domain}
**Identity**: {How this entity is uniquely identified}

**Attributes**:
- `{attribute1}`: {type} - {business meaning}
- `{attribute2}`: {type} - {business meaning}

**Business Rules**:
- {Rule 1}: {Description of business constraint}

**Invariants**:
- {Invariant 1}: {What must always be true}

---

{Repeat for each entity}

## 3. Value Objects

### {Value Object Name 1}
**Purpose**: {What this represents}
**Immutability**: {Why this should be immutable}

**Properties**:
- `{property1}`: {type} - {meaning}
- `{property2}`: {type} - {meaning}

**Validation Rules**:
- {Rule 1}: {Validation constraint}
- {Rule 2}: {Validation constraint}

---

### {Value Object Name 2}
**Purpose**: {What this represents}
**Immutability**: {Why this should be immutable}

**Properties**:
- `{property1}`: {type} - {meaning}

**Validation Rules**:
- {Rule 1}: {Validation constraint}

---

## 4. Aggregates

### {Aggregate Name 1}
**Aggregate Root**: {Root entity name}
**Boundary**: {What entities/value objects are included}
**Purpose**: {Business transaction boundary this represents}

**Consistency Rules**:
- {Rule 1}: {What must be consistent within this aggregate}
- {Rule 2}: {What must be consistent within this aggregate}

**Business Operations**:
- `{operation1}()`: {What this operation does}
- `{operation2}()`: {What this operation does}
- `{operation3}()`: {What this operation does}

---

### {Aggregate Name 2}
**Aggregate Root**: {Root entity name}
**Boundary**: {What entities/value objects are included}
**Purpose**: {Business transaction boundary this represents}

**Consistency Rules**:
- {Rule 1}: {What must be consistent within this aggregate}

**Business Operations**:
- `{operation1}()`: {What this operation does}
- `{operation2}()`: {What this operation does}

---

## 5. Domain Events

### {Event Name 1}
**Trigger**: {What causes this event}
**Purpose**: {Why other contexts need to know about this}
**Data**: {What information is included in the event}

**Event Structure**:
```
{EventName1} {
  eventId: UUID
  aggregateId: UUID
  timestamp: DateTime
  {data1}: {type}
  {data2}: {type}
}
```

---

### {Event Name 2}
**Trigger**: {What causes this event}
**Purpose**: {Why other contexts need to know about this}
**Data**: {What information is included in the event}

**Event Structure**:
```
{EventName2} {
  eventId: UUID
  aggregateId: UUID
  timestamp: DateTime
  {data1}: {type}
}
```

---

## 6. Domain Services

### {Service Name 1}
**Purpose**: {Business logic that doesn't belong to a single entity}
**Operations**:
- `{operation1}()`: {What this does}
- `{operation2}()`: {What this does}

**Dependencies**: {What this service needs}

---

### {Service Name 2}
**Purpose**: {Business logic that doesn't belong to a single entity}
**Operations**:
- `{operation1}()`: {What this does}

**Dependencies**: {What this service needs}

---

## 7. Business Rules (Pseudocode)

### {Business Process 1}
```
WHEN {trigger condition}
IF {business condition 1}
  THEN {business action 1}
ELSE IF {business condition 2}
  THEN {business action 2}
  AND EMIT {domain event}
ELSE
  THROW {business exception}
END
```

### {Business Process 2}
```
WHEN {trigger condition}
VALIDATE {business constraint}
IF valid
  THEN {business action}
  AND UPDATE {aggregate state}
  AND EMIT {domain event}
ELSE
  THROW {validation exception}
END
```

## 8. Repository Interfaces

### {Repository Name 1}
**Purpose**: {Data access for which aggregate}
**Operations**:
- `findById(id)`: {Find aggregate by identifier}
- `save(aggregate)`: {Persist aggregate changes}
- `findBy{Criteria}()`: {Find by business criteria}
- `delete(id)`: {Remove aggregate}

---

### {Repository Name 2}
**Purpose**: {Data access for which aggregate}
**Operations**:
- `findById(id)`: {Find aggregate by identifier}
- `save(aggregate)`: {Persist aggregate changes}

---

## 9. Integration Points

### Inbound Dependencies
- **{External Context 1}**: {What we receive and how}
- **{External Context 2}**: {What we receive and how}

### Outbound Dependencies
- **{External Context 1}**: {What we send and when}
- **{External Context 2}**: {What we send and when}

## 10. Success Criteria

- [ ] All entities have clear business purpose and identity
- [ ] Value objects are properly immutable with validation
- [ ] Aggregates maintain consistency boundaries
- [ ] Domain events capture important business moments
- [ ] Business rules are expressed in pseudocode
- [ ] Repository interfaces defined for data access
- [ ] Integration points with other contexts specified
