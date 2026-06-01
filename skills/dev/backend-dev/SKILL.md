---
name: backend-dev
description: >
  This skill should be used when the user asks to "design an API",
  "set up authentication", "design the database schema",
  "build a backend service", "create a REST endpoint",
  "dockerize the app", "use Pydantic v2", "SQLAlchemy 2.0", "async SQLAlchemy",
  "C# API", "ASP.NET Core", ".NET", "Entity Framework", "EF Core", "Minimal API",
  "C++ project", "CMake", "RAII", "smart pointer", "GoogleTest", "C project",
  or needs guidance on Node.js, Python, Express, FastAPI, Django, C#/.NET, C/C++, or Docker.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Backend Development

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


Build and maintain backend services and APIs.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "design API", "REST endpoint", "GraphQL", "versioning", "error handling" | `references/api-design.md` |
| "design schema", "normalization", "indexing", "migrations" | `references/database-design.md` |
| "set up auth", "JWT", "OAuth2", "RBAC", "sessions" | `references/authentication.md` |
| "Node.js", "Express", "Fastify", "NestJS" | `references/nodejs.md` |
| "Python", "FastAPI", "Django" | `references/python.md` |
| "C#", ".NET", "ASP.NET", "Entity Framework", "EF Core", "Minimal API" | `references/csharp-dotnet.md` |
| "C", "C++", "CMake", "RAII", "smart pointer", "GoogleTest" | `references/cpp.md` |
| "Docker", "Dockerfile", "docker-compose", "multi-stage build" | `references/docker.md` |
| "code review", "review backend code", "check quality", "audit code" | `references/backend-code-review.md` |

## Core
- **API Design** — REST/GraphQL/gRPC conventions, versioning, error handling. (Read `references/api-design.md`)
- **Database Design** — Schema design, normalization, indexing, migrations. (Read `references/database-design.md`)
- **Authentication** — JWT, OAuth2, sessions, role-based access control. (Read `references/authentication.md`)

## Frameworks
- **Node.js** — Express, Fastify, NestJS patterns. (Read `references/nodejs.md`)
- **Python** — FastAPI, Django patterns. (Read `references/python.md`)
- **C# / .NET** — ASP.NET Core, Entity Framework Core, Minimal APIs, Clean Architecture. (Read `references/csharp-dotnet.md`)
- **C / C++** — Modern C++ (17/20/23), CMake, RAII, memory safety, GoogleTest. (Read `references/cpp.md`)

## Infrastructure
- **Docker** — Dockerfile, docker-compose, multi-stage builds. (Read `references/docker.md`)

## Code Quality
- **Backend Code Review** — Static audit checklist: architecture, validation, auth, DB, security, logging. (Read `references/backend-code-review.md`)

## Inline Process

1. **Identify the concern** — Match to ONE area: API Design, Database Design, Authentication, Framework-specific (Node.js/Python/C#/.NET/C++), or Docker. Load the corresponding reference.
2. **Design contract first (API)** — Define resource schemas (request + response), error codes, pagination, versioning, and auth requirements per endpoint BEFORE writing implementation.
3. **Implement with validation** — Every endpoint MUST validate input (Zod/Pydantic/FluentValidation) before processing. Apply auth middleware on all routes. No secrets in source code.
4. **Database discipline** — Create migration files for EVERY schema change. Use batch queries (WHERE IN, JOIN) — never DB calls inside loops. Include timestamps on all resources.
5. **Write LLM-friendly comments** — Every non-trivial function gets: what + why + who calls + params/return/throws.
6. **Framework patterns** — Node.js: Express/Fastify/NestJS. Python: FastAPI/Django. C#: ASP.NET Core + EF Core + Clean Architecture. C++: Modern C++17/20, CMake, RAII.
7. **Code review** — Static audit: validation present, auth applied, no N+1, no secrets, migrations exist, comments present.
8. **Verify build** — `npm run build` / `dotnet build` / `python -m py_compile` passes clean.

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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll add input validation later — let me get the endpoint working first" | Every endpoint must validate input BEFORE processing. "Working" without validation means working for happy path only — any malformed input causes crashes or security holes. |
| "Auth middleware isn't needed for this route — it's internal" | Internal routes get exposed through misconfiguration, API gateways, or future refactoring. Apply auth middleware by default; explicitly mark routes as public only when intentional. |
| "I'll write the query inside the loop — it's only a few items" | N+1 queries are the #1 backend performance killer. Even "a few items" becomes hundreds in production. Always use batch queries (WHERE IN, JOIN) from the start. |
| "I'll put the API key in the code for now and move it to env vars before deploy" | Secrets committed to git persist in history forever. Use environment variables from the first line of code — there is no "temporary" for secrets in source control. |
| "The schema change is small — I don't need a migration file" | Every schema change without a migration is a deployment landmine. Other developers and CI/CD pipelines depend on migrations to sync database state. No exceptions. |

---

## Red Flags

- 🚩 New endpoint added without corresponding Zod/Pydantic validation schema → Input validation skipped; add validation layer before the handler logic.
- 🚩 Route file has no auth middleware import or explicit `@public` annotation → Auth was forgotten, not intentionally skipped; verify and add middleware.
- 🚩 Database query appears inside a `.map()`, `.forEach()`, or `for` loop → N+1 query pattern; refactor to batch query outside the loop.
- 🚩 Code comments say only "// validate input" without explaining what/why/who-calls → LLM-friendly comment standard not followed; expand to include context for future AI edits.
- 🚩 Model file changed but no new migration file in the migrations folder → Schema change will break other environments; create the migration immediately.

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring backend implementation complete, confirm:

- [ ] Input validation present on all new endpoints (Zod/Pydantic/FluentValidation)
- [ ] Auth middleware applied (or explicitly marked `@public`)
- [ ] No N+1 queries (no DB calls inside loops)
- [ ] No secrets in source code (all in env vars)
- [ ] Migration file created for any schema change
- [ ] LLM-friendly comments on non-trivial functions (what + why + who calls)
- [ ] Build passes: `npm run build` / `dotnet build` / `python -m py_compile`


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Framework docs (Express/FastAPI/ASP.NET) | Official documentation | Verify API patterns against current version |
| Existing API patterns in codebase | Source code | Match conventions, avoid inconsistency |
| DB schema / migrations folder | Database | Understand current data model |
| `references/*.md` (one per concern) | Skill reference | API design, DB, auth, framework-specific |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After API design (endpoints + schemas) | Checkbox (confirm contract) | Before writing implementation code |
| After implementation approach selection | Single select (framework/pattern choice) | When multiple valid approaches exist |
| After security review | Open field | Before deploying auth/data changes |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/backend/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
