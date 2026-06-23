# Modern Python Backend Reference

Use this reference for Python backend work with FastAPI, Django, Pydantic v2,
SQLAlchemy 2.0, asyncio, pytest, typing, packaging, and runtime configuration.

Read `python.md` first for local architecture patterns, then apply this file for
current Python runtime rules.

## Official Documentation Anchors

- Python docs: https://docs.python.org/3/
- asyncio: https://docs.python.org/3/library/asyncio.html
- typing: https://docs.python.org/3/library/typing.html
- unittest: https://docs.python.org/3/library/unittest.html
- FastAPI docs: https://fastapi.tiangolo.com/
- Pydantic docs: https://docs.pydantic.dev/
- SQLAlchemy 2.0 docs: https://docs.sqlalchemy.org/20/
- Django docs: https://docs.djangoproject.com/
- Python Packaging User Guide: https://packaging.python.org/

## Runtime Rules

- Use type hints for new code.
- Prefer Pydantic v2 models for FastAPI request and response validation.
- Use SQLAlchemy 2.0 style APIs for new SQLAlchemy code.
- Validate settings at startup and fail fast on missing required config.
- Do not use mutable defaults in function signatures or dataclasses.
- Keep framework objects out of domain logic where possible.

## Async Rules

- Use `async def` for I/O-bound FastAPI endpoints and async DB clients.
- Do not call blocking libraries from the event loop.
- Use thread/process executors only when the boundary and cancellation behavior
  are understood.
- Keep sync Django code sync unless the project has a tested async path.

## Testing

- Use the project test runner first, commonly `pytest`.
- Use `httpx.AsyncClient` or project fixtures for async API tests.
- Use factories or deterministic fixtures for data.
- Keep DB tests isolated and transactional where possible.
- Run type/lint/format checks with project commands such as `ruff`, `mypy`, or
  `pyright` when configured.

## Review Checklist

- Input validation exists at the API edge.
- Async code does not block the event loop.
- DB access is batched and avoids N+1 queries.
- Settings are validated and secrets are not committed.
- Migrations exist for schema changes.
- Tests cover validation, auth, error handling, and persistence boundaries.
