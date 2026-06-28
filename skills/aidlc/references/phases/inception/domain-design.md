# Domain Design

**Objective**: Apply DDD Tactical Design to create domain models using pseudocode
**Focus**: Entities, value objects, aggregates, domain events, business rules
**Important**: Use pseudocode for business concepts - avoid technical implementation

## Entry Point Requirements
**Can start this phase if:**
- [ ] `user-stories.md` exists
- [ ] `domain-decomposition.md` exists
- [ ] Architecture decision is documented
- [ ] Bounded contexts are clearly defined
- [ ] User stories are mapped to contexts

**Missing Prerequisites Handling:**
- Guide user to create missing artifacts using templates
- Offer to generate minimal versions from existing information
- Validate completeness before proceeding with domain design

## Required Context from Previous Phases

- **From 1.1**: User stories and business rules from `user-stories.md`
- **From 1.2**: Bounded context definitions and architecture decision from `domain-decomposition.md`
- **From 1.2**: Context boundaries and data ownership decisions

## Process

- **MANDATORY**: Use the domain design template at `references/templates/outputs/domain-design-template.md` for consistent modeling
- Apply DDD tactical patterns within each bounded context
- Define entities, value objects, and aggregates with clear business purpose
- Specify business rules in pseudocode format
- Identify domain events for inter-context communication
- Create repository interfaces for data access patterns

## Architecture-Specific Approach

### Microservices Architecture - Context Selection and Design

**Step 1: Context Selection (No Decision File)**
- Review bounded contexts from domain decomposition
- **Ask user directly**: "Which bounded context would you like to start with?"
- **Present options** with recommended priority:
  1. **{Context 1}** - {Brief description} (Recommended: Core business context)
  2. **{Context 2}** - {Brief description}
  3. **{Context 3}** - {Brief description}
- **Wait for user selection** - User responds with context name or number
- **No formal decision file needed** - This is a simple workflow choice

**Step 2: Domain Design for Selected Context**
- **Create domain design decision file** for the selected context only
- **Create domain design plan file** for the selected context
- **Execute domain design** for the selected context
- **File naming**: `domain-design-{context-name}.md`
- **Location**: `agent-memory/plans/[feature]/outputs/construction/{context-name}/domain-design.md`

**Step 3: Context Completion**
After completing one context, Continue with next bounded context (repeat from Step 1)

### Monolith Architecture
- **Create single domain design file** covering all bounded contexts
- **File naming**: `domain-design.md`
- **Location**: `agent-memory/plans/[feature]/outputs/construction/domain-design.md`
- **Structure**: Organize by bounded context sections within the single file

## Context Selection Guidance

### Recommended Starting Priority:
1. **Core Business Context** - Primary value-generating domain
2. **Data-Heavy Contexts** - Complex entity relationships
3. **Integration Contexts** - External system connections
4. **Supporting Contexts** - Utility or administrative domains

### Context Selection Questions:
- Which context represents the core business value?
- Which context has the most complex business rules?
- Which context do other contexts depend on?
- Which context would provide the most learning for the team?

## CONTEXT.md Generation (Side-Effect)

After domain design is complete, generate or update `{project-root}/CONTEXT.md`:

1. Extract all domain terms (entities, value objects, aggregates, events) from the domain design
2. Write precise definitions using business language (no implementation details)
3. Record relationships between terms
4. If CONTEXT.md already exists — merge new terms, don't overwrite existing definitions
5. Use format from `references/CONTEXT-FORMAT.md`

**Create lazily** — only when domain terms are resolved. Don't create an empty file.
**Update inline** — if a term is sharpened later (brainstorming, interview), update immediately.

## Phase Transition Validation

### For Microservices (Per Context):
- [ ] Selected context domain design is complete
- [ ] All entities have clear business identity and purpose
- [ ] Value objects are properly defined with immutability
- [ ] Aggregates maintain proper consistency boundaries
- [ ] Business rules are expressed in pseudocode
- [ ] Domain events capture important business moments
- [ ] Repository interfaces defined for each aggregate
- [ ] **User decision obtained**: Next context OR proceed to logical design

### For Monolith:
- [ ] All bounded contexts covered in single file
- [ ] All entities have clear business identity and purpose
- [ ] Value objects are properly defined with immutability
- [ ] Aggregates maintain proper consistency boundaries
- [ ] Business rules are expressed in pseudocode
- [ ] Domain events capture important business moments
- [ ] Repository interfaces defined for each aggregate
