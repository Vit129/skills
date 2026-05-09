# Reverse Engineering

**Objective**: Determine project type (greenfield vs brownfield) and analyze existing codebase
**Focus**: Code scanning, reverse engineering, architecture understanding, technology stack identification
**Process**: Direct execution - no decisions or plans required

## Entry Point Requirements
**Can start this phase if:**
- [ ] Project directory exists
- [ ] Access to codebase (if any)
- [ ] No previous AI-DLC analysis exists OR analysis needs updating

**Missing Prerequisites Handling:**
- This is the starting phase - no prerequisites required
- **If .aidlc/context/ files exist**: Load existing analysis and compare with current codebase
- **If changes detected**: Update existing files with new findings, preserve valid existing content
- **If no changes**: Skip re-analysis, load existing context files

## Execution Process

### 0. Check Existing Analysis
- **Scan for existing files**: Check `.aidlc/context/product.md`, `tech.md`, `structure.md`
- **If files exist**:
  - Load existing analysis into context
  - Compare with current codebase state
  - Identify what has changed since last analysis
  - Decide: Update existing files OR create fresh analysis
- **If files don't exist**: Proceed with full analysis

### 1. Project Type Detection
- **Scan project directory** for existing code files
- **Identify project type**:
  - **Greenfield**: No existing code, empty directory, or only documentation
  - **Brownfield**: Existing codebase with implementation files

### 2. Brownfield Analysis (If Existing Code Found)
- **Technology Stack Identification**:
  - Programming languages used
  - Frameworks and libraries
  - Database technologies
  - Infrastructure components
  
- **Architecture Analysis**:
  - Current architecture pattern (monolith, microservices, etc.)
  - Module/service boundaries
  - Data flow patterns
  - Integration points

- **Code Structure Analysis**:
  - Directory structure and organization
  - Key components and their responsibilities
  - Business logic location
  - Data models and entities

- **Quality Assessment**:
  - Code quality indicators
  - Test coverage and testing approach
  - Documentation availability
  - Technical debt areas

### 3. Context Loading
- **Load relevant files into context**:
  - README files and documentation
  - Configuration files
  - Key source files (main entry points, models, etc.)
  - Package/dependency files
  - Database schemas (if available)

### 4. Gap Analysis
- **Identify missing components** for target functionality
- **Assess modification requirements** for existing code
- **Determine integration points** for new features
- **Evaluate refactoring needs**

## Deliverables

### Output Files Only
**Location**: `.aidlc/context/`

**Update Strategy**:
- **If files exist**: Load existing content, compare with current scan, update only changed sections
- **If files don't exist**: Create new files with full analysis
- **Preserve existing valid content**: Don't overwrite accurate existing information
- **Add new findings**: Append or update sections with new discoveries
- **Mark changes**: Note what was updated and when

#### product.md
- **Project Type**: Greenfield or Brownfield
- **Business Domain**: What the application does
- **Key Features**: Existing functionality (if brownfield)
- **User Types**: Current user roles and permissions
- **Business Rules**: Existing business logic and constraints

#### tech.md
- **Technology Stack**: Languages, frameworks, databases, tools
- **Architecture Pattern**: Current pattern (monolith, microservices, etc.)
- **Infrastructure**: Deployment, hosting, CI/CD setup
- **Dependencies**: External libraries, services, APIs
- **Quality Assessment**: Code quality, tests, documentation, technical debt

#### structure.md
- **Directory Organization**: Project folder structure
- **Code Structure**: Key components and their responsibilities
- **Data Models**: Existing entities and relationships
- **Integration Points**: Where new features will connect
- **Module Boundaries**: Current service/module separation
- **Recommendations**: Suggested approach for development

## Success Criteria
- [ ] Existing analysis files checked (if any)
- [ ] Current codebase scanned and compared with existing analysis
- [ ] Project type clearly identified
- [ ] Technology stack documented (if brownfield)
- [ ] Architecture pattern understood (if brownfield)
- [ ] Key code files loaded into context (if brownfield)
- [ ] Integration approach defined
- [ ] Context files created or updated (product.md, tech.md, structure.md)
- [ ] Changes documented (if updating existing files)
- [ ] Foundation established for requirements gathering

## Next Phase
Proceed to **1.1 Requirements Gathering** with full understanding of existing codebase context.
