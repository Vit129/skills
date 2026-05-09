# Phase Entry Points

AI-DLC supports starting from any phase, enabling concurrent team work and flexible project entry.

## Entry Point Commands

- `"start AI-DLC from domain design"` — Phase 1.4
- `"start AI-DLC from logical design"` — Phase 1.5
- `"start AI-DLC from test case design"` — Phase 1.7
- `"start AI-DLC from implementation"` — Phase 2.1
- `"start AI-DLC from automated testing"` — Phase 2.2
- `"start domain design for {context-name}"` — Context-specific (Microservices)

## Prerequisite Validation

### Domain Design Entry (1.4)
- [ ] user-stories.md exists
- [ ] domain-decomposition.md exists
- [ ] Architecture decision documented
- [ ] Bounded contexts defined

### Logical Design Entry (1.5)
- [ ] All Domain Design prerequisites
- [ ] Domain design completed for target context
- [ ] Domain entities and business rules defined

### Implementation Entry (2.1)
- [ ] All Logical Design prerequisites
- [ ] Logical design completed for target context
- [ ] Technical specifications defined

### Automated Testing Entry (2.2)
- [ ] All Implementation prerequisites
- [ ] Implementation completed
- [ ] Application runs locally without errors

## Missing Prerequisites Handling

1. List missing artifacts clearly
2. Offer options:
   - A) Complete missing prerequisites first
   - B) Create minimal versions to proceed
   - C) Use existing artifacts from similar projects
3. Guide creation using templates
4. Validate completeness before proceeding

## Context Selection (Microservices)

Priority:
1. Core Business Context — primary value-generating domain
2. Data-Heavy Contexts — complex entity relationships
3. Integration Contexts — external system connections
4. Supporting Contexts — utility or administrative domains
