---
name: backend-dev
description: >
  This skill should be used when the user asks to "design an API", "ออกแบบ API",
  "set up authentication", "ตั้งค่า authentication", "design the database schema", "ออกแบบ database schema",
  "build a backend service", "สร้าง backend service", "create a REST endpoint", "สร้าง REST endpoint",
  "dockerize the app", "ทำ Docker", "use Pydantic v2", "SQLAlchemy 2.0", "async SQLAlchemy",
  or needs guidance on Node.js, Python, Express, FastAPI, Django, or Docker.
---

# Backend Development

Build and maintain backend services and APIs.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "design API", "REST endpoint", "GraphQL", "versioning", "error handling" | `references/api-design.md` |
| "design schema", "normalization", "indexing", "migrations" | `references/database-design.md` |
| "set up auth", "JWT", "OAuth2", "RBAC", "sessions" | `references/authentication.md` |
| "Node.js", "Express", "Fastify", "NestJS" | `references/nodejs.md` |
| "Python", "FastAPI", "Django" | `references/python.md` |
| "Docker", "Dockerfile", "docker-compose", "multi-stage build" | `references/docker.md` |
| "code review", "review backend code", "check quality", "audit code" | `references/backend-code-review.md` |

## Core
- **API Design** — REST/GraphQL/gRPC conventions, versioning, error handling. (Read `references/api-design.md`)
- **Database Design** — Schema design, normalization, indexing, migrations. (Read `references/database-design.md`)
- **Authentication** — JWT, OAuth2, sessions, role-based access control. (Read `references/authentication.md`)

## Frameworks
- **Node.js** — Express, Fastify, NestJS patterns. (Read `references/nodejs.md`)
- **Python** — FastAPI, Django patterns. (Read `references/python.md`)

## Infrastructure
- **Docker** — Dockerfile, docker-compose, multi-stage builds. (Read `references/docker.md`)

## Code Quality
- **Backend Code Review** — Static audit checklist: architecture, validation, auth, DB, security, logging. (Read `references/backend-code-review.md`)

## ⚠️ Gotchas

- **Missing input validation on new endpoints** — agent adds endpoint without validation layer. Fix: every endpoint must validate input with Zod/Pydantic before processing.
- **Auth middleware skipped on new routes** — new routes added without attaching auth middleware. Fix: always check auth middleware is applied when adding any protected route.
- **N+1 query in loops** — agent writes DB queries inside loops instead of batch queries. Fix: always use `WHERE id IN (...)` or JOIN instead of per-item queries.
- **Secrets hardcoded in code** — agent puts API keys or passwords directly in source. Fix: always use environment variables; never commit secrets.
- **Migration not created for schema change** — agent edits model without creating a migration file. Fix: every schema change requires a corresponding migration.

## LLM-Friendly Code Comments

Write comments that AI agents can understand — not just humans:

```python
# ❌ Old style:
# validate input

# ✅ New style:
# Validates user input against business rules before saving to DB.
# Returns structured error dict with field-level messages on failure.
# Called by: POST /api/users endpoint handler.
```

**Principles:**
- State **what** + **why** + **who calls** — not just what
- Include context AI needs to edit correctly (dependencies, side effects, constraints)
- Add docstrings/JSDoc with params + return + raises/throws
- Complex business logic: add comment block explaining the rule before the code
