# Python Backend

Guidelines for building Python backend services.

## Framework Choice
- **FastAPI** — modern, async, auto-generated docs, type hints (recommended for APIs)
- **Django** — batteries-included, ORM, admin panel, auth (recommended for full-stack)
- **Flask** — minimal, flexible (for small services or microservices)

## FastAPI Structure
```
app/
├── api/
│   └── v1/
│       ├── endpoints/      — route handlers
│       └── dependencies.py — shared dependencies (auth, DB session)
├── core/
│   ├── config.py           — settings via pydantic BaseSettings
│   ├── security.py         — JWT, password hashing
│   └── database.py         — SQLAlchemy engine, session
├── models/                 — SQLAlchemy models
├── schemas/                — Pydantic request/response schemas
├── services/               — business logic
├── repositories/           — data access
└── main.py                 — FastAPI app entry point
```

## Django Structure
```
project/
├── apps/
│   └── users/
│       ├── models.py
│       ├── views.py        — or viewsets for DRF
│       ├── serializers.py  — DRF serializers
│       ├── urls.py
│       └── tests.py
├── core/                   — shared utilities, base models
├── config/                 — settings, urls, wsgi
└── manage.py
```

## Patterns
- Pydantic models for request/response validation (FastAPI)
- DRF Serializers for validation (Django)
- Repository pattern for data access — keep ORM queries out of views/endpoints
- Dependency injection via FastAPI `Depends()` or Django middleware

## Async
- FastAPI: `async def` for I/O-bound endpoints
- Use `asyncpg` or `databases` for async DB access
- Django: async views available in 4.1+ but ORM is still sync

## Testing
- `pytest` as test runner (both FastAPI and Django)
- `httpx.AsyncClient` for FastAPI endpoint tests
- `pytest-django` + `APIClient` for Django REST tests
- Use factories (`factory_boy`) for test data

## Cross-Language Standards

These topics apply to all backend languages — see dedicated files for full details:

- **Error Handling:** `error-handling-standards.md`
- **Logging:** `logging-standards.md`
- **Environment Config:** `env-config-standards.md`
- **Input Validation:** `validation-standards.md`

## Tips
- Type hints everywhere — FastAPI uses them for validation and docs
- Virtual environments: `venv` or `poetry`
- Use `alembic` for migrations (FastAPI) or Django's built-in migrations
- `black` + `ruff` for formatting and linting
- `pydantic-settings` for environment config with validation
