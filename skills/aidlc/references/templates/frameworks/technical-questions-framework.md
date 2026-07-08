# Technical Questions Framework

## When to Use
Only ask these questions if `technical-requirements.md` is missing from `/docs/` or project root.

## Question Decision Tree
```
Is this a NEW project?
├─ YES → Ask ALL categories below
└─ NO → Ask only CHANGED categories

Categories (ask only what's relevant):
1. Frontend Stack - If UI changes needed
2. Backend Stack - If new services/APIs needed  
3. Data & Persistence - If new data storage needed
4. Infrastructure - If deployment changes needed
5. Integration - If new service communication needed
6. Observability - If monitoring/logging changes needed
7. Security - If new security requirements
8. Testing - If new testing approach needed
9. CI/CD - If deployment pipeline changes needed
```

## Quick Questions by Category

### Architecture (FIRST)
- Pattern? A) Microservices B) Modular Monolith (recommended) C) Traditional Monolith
- Deployment? A) Distributed services B) Single application (recommended) C) Serverless

### Frontend
- Tech? A) React B) Vue C) Angular D) Vanilla JS (recommended)
- Real-time? A) WebSockets B) Server-Sent Events (recommended) C) Polling
- State? A) Redux B) Context API (recommended) C) Zustand D) None

### Backend
- Runtime? A) Node.js (recommended) B) Python C) Java D) .NET E) Go
- Platform? A) Containers (recommended) B) Serverless C) VMs D) Bare metal
- Auth? A) JWT (recommended) B) Sessions C) OAuth D) API keys

### Data & Persistence
- Database? A) PostgreSQL (recommended) B) MySQL C) MongoDB D) SQLite
- Consistency? A) Strong (recommended) B) Eventual C) Mixed
- Caching? A) Redis (recommended) B) In-memory C) CDN D) None

### Infrastructure
- IaC? A) Terraform (recommended) B) CloudFormation C) CDK D) Pulumi
- Environments? A) Dev/Staging/Prod (recommended) B) Feature branches C) Single
- Deployment? A) Blue-green (recommended) B) Rolling C) Canary D) Recreate

### Integration (Skip for Traditional Monolith)
- Communication? A) REST APIs (recommended) B) GraphQL C) gRPC D) Message queues
- Messaging? A) AWS SQS (recommended) B) RabbitMQ C) Kafka D) None

### Observability
- Logging? A) Structured JSON (recommended) B) Plain text C) None
- Monitoring? A) CloudWatch (recommended) B) Prometheus C) DataDog D) None
- Tracing? A) AWS X-Ray (recommended) B) Jaeger C) Zipkin D) None

### Security & Testing
- Security? A) SAST + DAST (recommended) B) SAST only C) Manual D) None
- Secrets? A) AWS Secrets Manager (recommended) B) Vault C) Env vars D) Config
- Testing? A) Unit + Integration (recommended) B) Unit only C) E2E only D) Manual

### CI/CD
- Platform? A) GitHub Actions (recommended) B) GitLab CI C) Jenkins D) CodePipeline
- Branching? A) GitFlow (recommended) B) GitHub Flow C) Trunk-based D) Feature

## Usage Notes
- For existing projects, check existing patterns first before asking questions
- Users can respond with letter (A, B, C) or full option text
- Always provide reasoning for recommendations
- Document user's choice and rationale in plan updates
