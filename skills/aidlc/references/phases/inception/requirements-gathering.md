# Requirements Gathering

**Objective**: Transform high-level requirements into detailed business requirements
**Focus**: User stories, business rules, functional requirements, success criteria

## Requirements Source Priority

1. **First**: Check `/docs/requirements.md` for initial high-level requirements
2. **Second**: Check project root `requirements.md`
3. **Third**: If no file found, prompt user for requirements input

## Process

- If high-level requirements.md exists: Read, analyze, and transform into detailed business requirements with user stories, business rules, and success criteria
- **MANDATORY**: Use the user stories template at `references/templates/outputs/user-stories-template.md` to ensure consistent story format
- Generate detailed requirements document in iteration's outputs folder (`agent-memory/plans/[feature]/outputs/inception/user-stories.md`)
- Get user approval on detailed requirements before proceeding to domain decomposition
- If requirements.md missing: Request user to provide requirements or create the file first

## Phase Transition Validation

Before proceeding to Domain Decomposition (1.2), validate:

- [ ] All user stories follow template format consistently
- [ ] Business rules are clearly defined and complete
- [ ] Non-functional requirements captured (performance, security, scalability)
- [ ] Success criteria defined for each user story
- [ ] Acceptance criteria are testable and measurable
- [ ] User approval obtained on complete requirements
- [ ] No ambiguous or unclear requirements remain

**Validation Questions**:
1. Can we identify distinct business capabilities from the user stories?
2. Are there clear patterns of related functionality?
3. Do we understand the complexity and scale requirements?
4. Are integration needs with external systems clear?
