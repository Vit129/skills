# Python Database Writer

Generate Python database config and service classes for mobile test data management.

## When to use
- Mobile tests need database connection via Python helpers
- Part of Hybrid Testing strategy (Mobile UI + API/DB)

## Steps
1. Read DB Strategy from implementation plan
2. Generate `[feature]_db_config.py` — reads from `.env` using `os.getenv`
3. Generate `[feature]_db_service.py` with methods:
   - `__init__()` — load config
   - `connect()` — open connection
   - `seed_[feature](**kwargs)` — insert test data
   - `verify_[feature](**kwargs)` — select and verify
   - `cleanup_[feature](**kwargs)` — delete by testId
   - `seed_all(params, test_id)` — if FK dependencies, orchestrate in order

## Rules
- PEP8 naming: snake_case methods, CamelCase classes
- All credentials from `.env` — never hardcode
- Parameterized queries — no f-strings for SQL
- Context managers or try-except-finally for connection safety
- Every write method must receive `test_id`
