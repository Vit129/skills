# Logical Design Template

## Instructions
Copy this template to `.aidlc/iterations/iteration-{N}-{feature}/construction/logical_design.md` and fill in all sections. Focus on technical design decisions, not implementation details.

---

# Logical Design: [Feature Name]

## 1. User Story Mapping
| User Story ID | Description | Backend Components | Frontend Components | MVP |
|---------------|-------------|-------------------|-------------------|-----|
| US-001 | As a [user], I want [goal] so that [benefit] | [API/Service names] | [Component names] | ✅/❌ |

## 2. Non-Functional Requirements
| Category | Requirement | Technical Impact | User Story |
|----------|-------------|------------------|------------|
| Performance | [Response time expectation] | [How it affects design] | [US-001] |
| Security | [Authentication/authorization needs] | [Security measures needed] | [US-002] |
| Scalability | [User load expectations] | [Scaling considerations] | [US-003] |
| Availability | [Uptime requirements] | [Reliability measures] | [US-004] |

## 3. Project Structure

### 3.1 Directory Layout
```
{Choose structure based on architecture decision}

Microservices Structure:
project-root/
├── services/
│   └── [service-name]/
│       ├── src/
│       ├── tests/
│       └── package.json
├── shared/
└── frontend/

Monolith Structure:
project-root/
├── src/
│   ├── modules/
│   │   └── [module-name]/
│   ├── shared/
│   └── ui/
└── tests/
```

### 3.2 Key Directories
- **[Primary code location]**: [Main application code]
- **[Shared code location]**: [Common utilities and types]
- **[Test location]**: [API Integration and E2E automation case]
- **[Configuration location]**: [Environment and config files]

### 3.3 Test Location
```
project-root/
├── tests/
    ├── testcase/
    │   └── test-scenario-sprint[N].md
    ├── api/
    │   ├── data_api/
    │   └── tests_api/
    ├── web_ui/
    │   ├── data_ui/
    │   └── tests_ui/
    └── mobile_ui/
        ├── data_ui/
        └── tests_ui/
```

## 4. Technical Architecture

### 4.1 Architecture Pattern
- **Choice**: [Microservices/Monolith based on domain decomposition decisions]
- **Reasoning**: [Why this pattern fits the domain complexity]

### 4.2 Technology Stack
| Category | Choice | Source |
|----------|--------|--------|
| Frontend | [Framework] | [Reference to decision record] |
| Backend | [Runtime/Framework] | [Reference to decision record] |
| Database | [Database type] | [Reference to decision record] |
| Integration | [Communication method] | [Reference to decision record] |

### 4.3 Architecture Diagram
```mermaid
{Choose diagram based on architecture pattern}

Microservices Example:
graph TD
    A[Frontend<br/>[Framework]] --> B[API Gateway<br/>[Technology]]
    B --> C[Service 1<br/>[Purpose]]
    B --> D[Service 2<br/>[Purpose]]
    C --> E[Database 1<br/>[Type]]
    D --> F[Database 2<br/>[Type]]

Monolith Example:
graph TD
    A[Frontend<br/>[Framework]] --> B[API Layer<br/>[Technology]]
    B --> C[Business Logic<br/>[Services]]
    C --> D[Data Layer<br/>[ORM/Repository]]
    D --> E[Database<br/>[Database Type]]
```

### 4.4 Component Overview
- **Frontend**: [High-level component responsibilities]
- **Backend**: [Service/module responsibilities]
- **Data Layer**: [Data management approach]
- **Integration**: [How components communicate]

### 4.5 Data Flow
1. **User Action**: [What user does]
2. **Frontend Processing**: [How UI handles it]
3. **Backend Processing**: [How API/services handle it]
4. **Data Operations**: [How data is stored/retrieved]
5. **Response Flow**: [How results return to user]


## 5. Backend Design

### 5.1 API Specification

#### 5.1.1 API Endpoints Overview
| Endpoint | Method | Purpose | User Story | MVP |
|----------|--------|---------|------------|-----|
| [/api/resource] | [GET/POST/etc] | [Business purpose] | [US-001] | ✅/❌ |
| [/api/resource/:id] | [GET] | [Get single resource] | [US-001] | ✅/❌ |
| [/api/resource/:id] | [PUT] | [Update resource] | [US-002] | ✅/❌ |
| [/api/resource/:id] | [DELETE] | [Delete resource] | [US-003] | ✅/❌ |

#### 5.1.2 API Request/Response Contracts

##### [Endpoint Name 1]: POST /api/resource
**Purpose**: [Create new resource]
**User Story**: [US-001]

**Diagram**: [Mermaid Diagram]

**Request:**
```json
{
  "field1": "string",
  "field2": "number",
  "field3": {
    "nestedField": "string"
  }
}
```

**Request Validation:**
- `field1`: Required, string, max length 100
- `field2`: Required, number, range 1-1000
- `field3.nestedField`: Optional, string

**Success Response (201):**
```json
{
  "id": "uuid",
  "field1": "string",
  "field2": "number",
  "field3": {
    "nestedField": "string"
  },
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp"
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
  ```json
  {
    "error": "Validation failed",
    "details": [
      {"field": "field1", "message": "Field is required"}
    ]
  }
  ```
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: System error

**API Test Case Checklist:**
| HTTP Status | Test Case | Description | Response message |
|-------------|-----------|-------------|------------------|
| [200/400/etc] | [Success] | [Get detail success] | data.message = "detail of event" |
| [200] | [Name not found] | [Name = ไม่มีในระบบ] | data.error = "name_not_found" |
| [400] | [Without required id] | [id = null] | data.error = "id_is_required" |
| [400] | [ID not found] | [id = 999999] | data.error = "id_not_found" , data.message = "Please input existing id" |


---

##### [Endpoint Name 2]: GET /api/resource/:id
**Purpose**: [Retrieve single resource]
**User Story**: [US-001]

**Diagram**: [Mermaid Diagram]

**Path Parameters:**
- `id`: Resource identifier (UUID)

**Query Parameters:**
- `include`: Optional, comma-separated list of related entities to include

**Success Response (200):**
```json
{
  "id": "uuid",
  "field1": "string",
  "field2": "number",
  "relatedData": []
}
```

**Error Responses:**
- `404 Not Found`: Resource does not exist
- `401 Unauthorized`: Authentication required

**API Test Case Checklist:**
| HTTP Status | Test Case | Description | Response message |
|-------------|-----------|-------------|------------------|
| [200/400/etc] | [Success] | [Get detail success] | data.message = "detail of event" |
| [200] | [Name not found] | [Name = ไม่มีในระบบ] | data.error = "name_not_found" |
| [400] | [Without required id] | [id = null] | data.error = "id_is_required" |
| [400] | [ID not found] | [id = 999999] | data.error = "id_not_found" , data.message = "Please input existing id" |

---

##### [Endpoint Name 3]: GET /api/resource
**Purpose**: [List resources with pagination]
**User Story**: [US-001]

**Diagram**: [Mermaid Diagram]

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: Field to sort by (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)
- `filter`: Filter criteria

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "field1": "string",
      "field2": "number"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
**API Test Case Checklist:**
| HTTP Status | Test Case | Description | Response message |
|-------------|-----------|-------------|------------------|
| [200/400/etc] | [Success] | [Get detail success] | data.message = "detail of event" |
| [200] | [Name not found] | [Name = ไม่มีในระบบ] | data.error = "name_not_found" |
| [400] | [Without required id] | [id = null] | data.error = "id_is_required" |
| [400] | [ID not found] | [id = 999999] | data.error = "id_not_found" , data.message = "Please input existing id" |


---

##### [Endpoint Name 4]: PUT /api/resource/:id
**Purpose**: [Update existing resource]
**User Story**: [US-002]

**Diagram**: [Mermaid Diagram]

**Path Parameters:**
- `id`: Resource identifier (UUID)

**Request:**
```json
{
  "field1": "string",
  "field2": "number"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "field1": "string",
  "field2": "number",
  "updatedAt": "ISO8601 timestamp"
}
```

**Error Responses:**
- `404 Not Found`: Resource does not exist
- `400 Bad Request`: Validation error
- `409 Conflict`: Optimistic locking conflict

**API Test Case Checklist:**
| HTTP Status | Test Case | Description | Response message |
|-------------|-----------|-------------|------------------|
| [200/400/etc] | [Success] | [Get detail success] | data.message = "detail of event" |
| [200] | [Name not found] | [Name = ไม่มีในระบบ] | data.error = "name_not_found" |
| [400] | [Without required id] | [id = null] | data.error = "id_is_required" |
| [400] | [ID not found] | [id = 999999] | data.error = "id_not_found" , data.message = "Please input existing id" |


---

##### [Endpoint Name 5]: DELETE /api/resource/:id
**Purpose**: [Delete resource]
**User Story**: [US-003]

**Diagram**: [Mermaid Diagram]

**Path Parameters:**
- `id`: Resource identifier (UUID)

**Success Response (204):**
No content

**Error Responses:**
- `404 Not Found`: Resource does not exist
- `409 Conflict`: Resource cannot be deleted due to dependencies

**API Test Case Checklist:**
| HTTP Status | Test Case | Description | Response message |
|-------------|-----------|-------------|------------------|
| [200/400/etc] | [Success] | [Get detail success] | data.message = "detail of event" |
| [200] | [Name not found] | [Name = ไม่มีในระบบ] | data.error = "name_not_found" |
| [400] | [Without required id] | [id = null] | data.error = "id_is_required" |
| [400] | [ID not found] | [id = 999999] | data.error = "id_not_found" , data.message = "Please input existing id" |


---

### 5.2 Data Models
| Entity | Key Attributes | Relationships | User Story |
|--------|----------------|---------------|------------|
| [EntityName] | [id, field1, field2] | [Related entities] | [US-001] |

### 5.3 Business Logic
- **[ServiceName]**: [Business responsibilities and rules]
- **[RepositoryName]**: [Data access responsibilities]
- **[ValidatorName]**: [Validation rules and constraints]

### 5.4 Error Handling
| Error Type | Handling Strategy | User Experience | User Story |
|------------|------------------|-----------------|------------|
| [Validation Error] | [How system handles it] | [What user sees] | [US-001] |
| [Authentication Error] | [How system handles it] | [What user sees] | [US-002] |
| [System Error] | [How system handles it] | [What user sees] | [All] |

## 6. Frontend Design

### 6.1 UI Components
| Component | Purpose | Key Props | User Story |
|-----------|---------|-----------|------------|
| [ComponentName] | [User interaction purpose] | [Essential props] | [US-001] |

### 6.2 User Flows
| Flow | Steps | Components Involved | User Story |
|------|-------|-------------------|------------|
| [FlowName] | [Step1 → Step2 → Step3] | [Component1, Component2] | [US-001] |

### 6.3 State Management
- **Global State**: [What data needs to be shared across components]
- **Local State**: [What data stays within individual components]
- **API Integration**: [How frontend communicates with backend]

## 7. Integration Design

### 7.1 Internal Integration
- **Service Communication**: [How services talk to each other]
- **Data Synchronization**: [How data stays consistent]
- **Error Propagation**: [How errors are handled across components]

### 7.2 External Integration
- **Third-party APIs**: [External services used]
- **Authentication**: [How external auth works]
- **Data Exchange**: [How external data is handled]

## 8. MVP Implementation Plan

### Phase 1: Core Backend (Runnable)
**User Stories**: [US-001, US-002]
- [ ] [Essential backend functionality]
- [ ] [Data persistence setup]
- [ ] [Basic API endpoints]

### Phase 2: Core Frontend (Testable)
**User Stories**: [US-001, US-002]
- [ ] [Essential UI components]
- [ ] [User interaction flows]
- [ ] [Frontend-backend integration]

### Phase 3: Integration & Polish
**User Stories**: [All MVP stories]
- [ ] [Error handling and validation]
- [ ] [User experience improvements]
- [ ] [Local development setup]


## 9. Local Development Setup
- **Prerequisites**: [Required tools and versions]
- **Environment Setup**: [Configuration needed]
- **Development Workflow**: [How to run and test locally]
- **Testing Strategy**: [How to verify functionality]

## 10. Validation Checklist
- [ ] All MVP user stories have technical specifications
- [ ] Non-functional requirements are addressed in design
- [ ] All user interactions have corresponding UI components
- [ ] All business operations have backend implementations
- [ ] Frontend and backend integration is defined
- [ ] Data models support all required operations
- [ ] Error handling is specified for all failure scenarios
- [ ] Technology choices align with architecture decisions
- [ ] Integration points are clearly defined
- [ ] MVP scope is clearly defined and achievable
- [ ] Local development approach is specified

---

## Template Usage Notes
1. Replace all `[placeholders]` with actual design decisions
2. Reference decision records for technology choices
3. Focus on **what** to build, not **how** to implement
4. Ensure every user story maps to technical components
5. Address non-functional requirements in technical design
6. Keep implementation details minimal - focus on design
7. Validate completeness before proceeding to implementation