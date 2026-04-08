---
name: backend-dev
description: >
  This skill should be used when the user asks to "design an API", "set up authentication",
  "design the database schema", "build a backend service", "create a REST endpoint",
  "dockerize the app", or needs guidance on Node.js, Python, Express, FastAPI, Django, or Docker.
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

## Core
- **API Design** — REST/GraphQL/gRPC conventions, versioning, error handling. (Read `references/api-design.md`)
- **Database Design** — Schema design, normalization, indexing, migrations. (Read `references/database-design.md`)
- **Authentication** — JWT, OAuth2, sessions, role-based access control. (Read `references/authentication.md`)

## Frameworks
- **Node.js** — Express, Fastify, NestJS patterns. (Read `references/nodejs.md`)
- **Python** — FastAPI, Django patterns. (Read `references/python.md`)

## Infrastructure
- **Docker** — Dockerfile, docker-compose, multi-stage builds. (Read `references/docker.md`)
