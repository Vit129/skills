# Node.js Backend

Guidelines for building Node.js backend services.

## Framework Choice
- **Express** — minimal, flexible, huge ecosystem (default choice)
- **Fastify** — faster than Express, schema-based validation, good DX
- **NestJS** — opinionated, TypeScript-first, Angular-like structure (enterprise)

## Project Structure (Express/Fastify)
```
src/
├── routes/         — route definitions
├── controllers/    — request handling (thin — delegate to services)
├── services/       — business logic
├── repositories/   — data access layer
├── middleware/      — auth, validation, error handling, logging
├── models/         — database models / schemas
├── utils/          — helpers, formatters
├── config/         — environment config, DB config
└── index.ts        — entry point
```

## NestJS Structure
```
src/
├── modules/
│   └── users/
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.repository.ts
│       └── dto/
├── common/         — guards, interceptors, pipes, filters
└── main.ts
```

## Patterns
- Controller → Service → Repository (layered architecture)
- Controllers: parse request, call service, return response — no business logic
- Services: business logic, validation, orchestration
- Repositories: database queries only

## Error Handling
```typescript
// Centralized error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: { code: err.code, message: err.message }
  });
});
```

## Validation
- Use Zod, Joi, or class-validator for request validation
- Validate at the edge (middleware/controller) — not deep in services
- Return 400 with specific field errors

## Cross-Language Standards

These topics apply to all backend languages — see dedicated files for full details:

- **Error Handling:** `error-handling-standards.md`
- **Logging:** `logging-standards.md`
- **Environment Config:** `env-config-standards.md`
- **Input Validation:** `validation-standards.md`

## Tips
- TypeScript for all new projects
- Use `async/await` — avoid callback hell
- Environment config via `dotenv` + validation at startup
- Graceful shutdown: handle SIGTERM, close DB connections
- Use `helmet` for security headers, `cors` for CORS
