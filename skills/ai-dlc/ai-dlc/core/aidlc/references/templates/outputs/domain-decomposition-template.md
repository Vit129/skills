# Domain Decomposition: {Project Name}

## 1. Architecture Decision

**Chosen Architecture**: {Microservices | Monolith} - {specific approach}
**Communication Pattern**: {For Microservices: Event-driven, REST APIs, etc. | For Monolith: Internal APIs, modules}
**Data Strategy**: {For Microservices: Database per service | For Monolith: Shared database with module boundaries}

### Decision Analysis
**Complexity Factors Analyzed**:
- **Domain Complexity**: {Number of distinct business domains identified}
- **Team Size**: {Current team size and growth plans}
- **Scalability Requirements**: {Performance and user load requirements}
- **Integration Needs**: {External systems and complexity}
- **Operational Capability**: {Team's operational maturity}

**Decision Criteria Applied**:
- [ ] {Criterion 1 - e.g., Multiple distinct domains with clear boundaries}
- [ ] {Criterion 2 - e.g., Team size supports independent development}
- [ ] {Criterion 3 - e.g., High scalability requirements identified}
- [ ] {Criterion 4 - e.g., Strong operational capabilities available}

**Rationale**: {Architecture choice} because {primary reasons based on criteria}

## 2. Bounded Context Boundaries

### {Bounded Context Name 1}
**Domain Area**: {Domain area this context handles}
**Responsibilities**:
- {Primary responsibility 1}
- {Primary responsibility 2}
- {Primary responsibility 3}

**User Stories Covered**: {List of user story IDs and names}

**Key Entities**:
- {Entity 1}
- {Entity 2}
- {Entity 3}

**{Microservices: Implementation Services | Monolith: Module Name}**: {How this context is implemented}

---

### {Bounded Context Name 2}
**Domain Area**: {Domain area this context handles}
**Responsibilities**:
- {Primary responsibility 1}
- {Primary responsibility 2}
- {Primary responsibility 3}

**User Stories Covered**: {List of user story IDs and names}

**Key Entities**:
- {Entity 1}
- {Entity 2}
- {Entity 3}

**{Microservices: Implementation Services | Monolith: Module Name}**: {How this context is implemented}

---

{Repeat for each bounded context}

## 3. Data Ownership

| Bounded Context | Owned Data | Read Access | Write Access |
|-----------------|------------|-------------|--------------|
| **{Context 1}** | {Data entities owned} | {Who can read} | {Who can write} |
| **{Context 2}** | {Data entities owned} | {Who can read} | {Who can write} |
| **{Context 3}** | {Data entities owned} | {Who can read} | {Who can write} |

## 4. Business Rules

- **{Business Rule 1}**: {Rule description and which bounded context enforces it}
- **{Business Rule 2}**: {Rule description and which bounded context enforces it}
- **{Business Rule 3}**: {Rule description and which bounded context enforces it}

## 5. Integration Patterns

### Key Process Flows

#### {Primary Business Process}
```
1. {Bounded Context} → {Action} → {Bounded Context}
2. {Bounded Context} → {Action} → {Bounded Context}
3. {Bounded Context} → {Action} → {Bounded Context}
```

#### {Secondary Business Process}
```
1. {Bounded Context} → {Action} → {Bounded Context}
2. {Bounded Context} → {Action} → {Bounded Context}
```

## 6. Context Map

### Dependencies Diagram

```mermaid
graph TD
    A[{Bounded Context 1}] --> B[{Bounded Context 2}]
    A --> C[{Bounded Context 3}]
    B --> D[{Bounded Context 4}]
    C --> D
    
    %% Add relationship labels
    A -.->|{relationship type}| B
    A -.->|{relationship type}| C
    B -.->|{relationship type}| D
    C -.->|{relationship type}| D
```

### Relationship Types
- **{Bounded Context 1} → {Bounded Context 2}**: {Relationship description}
- **{Bounded Context 1} → {Bounded Context 3}**: {Relationship description}
- **{Bounded Context 2} → {Bounded Context 4}**: {Relationship description}
- **{Bounded Context 3} → {Bounded Context 4}**: {Relationship description}

## 7. Implementation Strategy

### Phase 1: Core Bounded Contexts
1. {Bounded Context 1} - {Key functionality}
2. {Bounded Context 2} - {Key functionality}

### Phase 2: Supporting Bounded Contexts
3. {Bounded Context 3} - {Key functionality}
4. {Bounded Context 4} - {Key functionality}

### Phase 3: Integration & Testing
- Context integration patterns
- Cross-context business processes
- End-to-end testing

## 8. Success Criteria

- [ ] Architecture decision analysis completed with clear criteria
- [ ] Bounded context boundaries clearly defined
- [ ] Data ownership matrix completed
- [ ] Key business rules identified and assigned to contexts
- [ ] Integration patterns designed between contexts
- [ ] Context map showing relationships
- [ ] Implementation strategy defined per bounded context

## 9. Future Considerations

### Post-MVP Enhancements
- **{Future Bounded Context 1}**: {Purpose}
- **{Future Bounded Context 2}**: {Purpose}

### Evolution Path
- How bounded contexts might evolve or split
- Potential context boundary adjustments
