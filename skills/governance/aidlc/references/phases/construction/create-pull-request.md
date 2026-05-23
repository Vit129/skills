# Create Pull Request

**Objective**: Generate working code based on logical design specifications
**Focus**: Domain models, API endpoints, data access, integration components

## Entry Point Requirements
**Can start this phase if:**
- [ ] `user-stories.md` exists
- [ ] `domain-decomposition.md` exists
- [ ] Domain design completed for target context
- [ ] Logical design completed for target context
- [ ] Test cases created
- [ ] Test scripts generated (optional)
- [ ] Azure DevOps sync completed (optional)
- [ ] Technical specifications and technology choices defined

**Missing Prerequisites Handling:**
- Guide user to complete missing phases first
- Validate logical design completeness before proceeding
- Ensure all technical specifications are defined

## Required Context from Previous Phases

- **From 1.1**: User stories for feature validation from `user-stories.md`
- **From 1.2**: Architecture pattern and integration requirements from `domain-decomposition.md`
- **From 2.1**: Domain model specifications from `domain_design.md`
- **From 2.2**: Technical specifications and technology choices from `logical_design.md`
- **From 2.3**: Test cases and acceptance criteria from test case design phase
- **From 2.4**: Test scripts for validation (optional)
- **From 2.5**: Azure DevOps work items (optional)

## Process

### Azure DevOps Integration Workflow
1. **Create Pull Request**
   - After coding and testing are complete, create a pull request in Azure DevOps and remember the pullRequestID
   - Ensure PR title references the work item number (e.g., "AB#123: Implement user authentication")
   - Include comprehensive PR description with:
     - Summary of changes
     - Reference to work item/ticket
     - Testing performed
     - Screenshots/demos if applicable
   - Link PR to the work item in Azure DevOps

2. **Update Ticket Status to Code Review**
   - Once PR is created, update work item status to "Code Review"
   - Notify reviewers and stakeholders
   - Address review feedback and update PR as needed
