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

## Pydantic v2 (FastAPI 0.100+)

```python
from pydantic import BaseModel, Field, field_validator, model_validator

class FlightSearch(BaseModel):
    origin: str = Field(min_length=3, max_length=3, pattern=r'^[A-Z]{3}$')
    destination: str = Field(min_length=3, max_length=3, pattern=r'^[A-Z]{3}$')
    max_price: int = Field(gt=0, le=1_000_000, default=50000)

    @field_validator('origin', 'destination')
    @classmethod
    def uppercase(cls, v: str) -> str:
        return v.upper()

    @model_validator(mode='after')
    def origin_ne_destination(self) -> 'FlightSearch':
        if self.origin == self.destination:
            raise ValueError('origin and destination must be different')
        return self
```

## SQLAlchemy 2.0 Async (2025 Standard)

```python
# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

# models.py
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

class Flight(Base):
    __tablename__ = "flights"
    id: Mapped[int] = mapped_column(primary_key=True)
    origin: Mapped[str] = mapped_column(index=True)
    destination: Mapped[str] = mapped_column(index=True)
    price: Mapped[int]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

# repository.py
from sqlalchemy import select

class FlightRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def find_by_route(self, origin: str, destination: str) -> list[Flight]:
        result = await self.session.execute(
            select(Flight).where(
                Flight.origin == origin,
                Flight.destination == destination
            )
        )
        return result.scalars().all()
```

## Async
- FastAPI: `async def` for I/O-bound endpoints
- Use `asyncpg` with SQLAlchemy 2.0 for async DB access
- Django 5.x: async views and ORM support improving — use `sync_to_async` for legacy ORM calls

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
