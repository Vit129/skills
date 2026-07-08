# Domain Decomposition

**Objective**: Group requirements into logical boundaries using DDD Strategic Design and choose architecture pattern
**Focus**: Business capabilities, domain boundaries, architectural organization, and architecture decision

## Required Context from Previous Phases

- **From 1.1**: User stories, business rules, and success criteria from `user-stories.md`
- **From 1.1**: Non-functional requirements (performance, security, scalability needs)

## Common DDD Process

**Sequential Steps to Avoid Circular Dependency:**

1. **Identify Business Capabilities** (architecture-agnostic) → Group user stories by business function
2. **Define Bounded Contexts** (pure domain boundaries) → Identify natural domain boundaries
3. **Analyze Complexity Factors** → Team size, scalability needs, integration complexity
4. **Choose Architecture Pattern** → Microservices or Monolith based on complexity analysis
5. **Organize Contexts** → Structure bounded contexts according to chosen architecture

## Architecture Decision Criteria

### Choose Monolith When:
- Single domain or closely related domains
- Small team (1-5 developers)
- Simple to moderate complexity
- Rapid prototyping or MVP
- Limited operational expertise

### Choose Microservices When:
- Multiple distinct domains with clear boundaries
- Large team (6+ developers) or multiple teams
- High scalability requirements (1000+ concurrent users)
- Complex integration needs
- Strong operational capabilities

## Multi-Tenancy Strategy Decision

**Critical Strategic Decision**: Multi-tenancy must be decided in this phase as it fundamentally impacts data ownership, bounded context responsibilities, and security boundaries.

### Choose Single-Tenant Multi-User When:
- Each user has isolated personal data (no organizations/teams)
- Simple user-level authorization sufficient
- Personal productivity apps (todo lists, notes, etc.)
- POC/MVP with no collaboration requirements
- File-based or simple storage solutions

### Choose Multi-Tenant (Shared Database) When:
- Organizations/teams contain multiple users
- Collaboration and data sharing within tenant required
- SaaS model with cost-effective resource sharing
- Tenant-level isolation needed but not regulatory-driven
- Standard B2B application pattern

### Choose Multi-Tenant (Schema/Database per Tenant) When:
- Regulatory compliance requires physical data separation
- Tenant-specific customizations needed
- Highest level of data isolation required
- Premium/enterprise tier customers
- Willing to accept higher operational complexity

**Impact on Bounded Contexts**:
- **Single-Tenant**: User is top-level entity; contexts filter by userId
- **Multi-Tenant**: Tenant is top-level entity; all contexts must be tenant-aware; requires tenant management bounded context

**Security Implications**:
- **Single-Tenant**: User authentication + user-level authorization
- **Multi-Tenant**: User authentication + tenant context + dual-level authorization (tenant + user)

**Data Model Impact**:
- **Single-Tenant**: User → Entity (e.g., User → Todos)
- **Multi-Tenant**: Tenant → Users → Entity (e.g., Tenant → Users → Todos)

## Architecture-Specific Focus

### Microservices
- Context mapping, data ownership, service boundaries, integration patterns

### Monolith
- Module boundaries, shared data models, internal APIs, dependency management

## Key Deliverables

- **Architecture Decision**: Microservices or Monolith with rationale
- **Multi-Tenancy Strategy**: Single-tenant vs Multi-tenant with data isolation approach
- **Microservices**: Context map, data ownership matrix, service integration patterns, API contracts
- **Monolith**: Module dependency diagram, shared data specs, internal API definitions, layering rules
- **MANDATORY**: Use `references/templates/outputs/domain-decomposition-template.md` for consistent structure

## Phase Transition Validation

Before proceeding to Domain Design (2.1), validate:

- [ ] Architecture decision made with clear rationale
- [ ] Multi-tenancy strategy decided (impacts all subsequent phases)
- [ ] All bounded contexts have clear responsibilities
- [ ] Data ownership matrix is complete and unambiguous
- [ ] Tenant/user hierarchy clearly defined (if multi-tenant)
- [ ] Integration patterns are defined
- [ ] Context relationships are mapped
- [ ] All user stories are assigned to contexts
- [ ] Business rules are identified and assigned
- [ ] User approval obtained on architecture and boundaries

**Validation Questions**:
1. Does each bounded context have a single, clear responsibility?
2. Are data ownership boundaries clear and non-overlapping?
3. Can we implement each context independently?
4. Are integration points well-defined and manageable?

## Phase Restrictions

**Forbidden**: Technology stack, databases, frameworks, implementation details
