# Verification Steps

Run these 5 checks in mandatory order before every commit.

## Step 1: Build Check

```bash
# TypeScript projects
npx tsc --noEmit

# Node projects
npm run build

# Python projects
python -m py_compile <file>
```

**Gate:** If build fails → fix before proceeding. Do NOT skip.

## Step 2: Lint Check

```bash
# Playwright/TS projects
npx eslint . --ext .ts --max-warnings 0

# Python projects
ruff check .
```

**Gate:** Zero warnings policy for new code. Pre-existing warnings are acceptable.

## Step 3: Test Execution

```bash
# Run only affected tests (surgical)
npx playwright test <spec-file> --reporter=list

# Run full suite if change is cross-cutting
npx playwright test --reporter=list
```

**Gate:** All tests must pass. If a test fails:
1. Is it YOUR change that broke it? → Fix it
2. Is it a pre-existing flaky test? → Document and skip with `test.fixme()`
3. Is it an environment issue? → Note in commit message

## Step 4: Coverage Check (if applicable)

```bash
npx playwright test --reporter=list,html
```

**Gate:** New features must have corresponding test cases. Bug fixes must have regression tests.

## Step 5: Security Scan (for auth/input/API code)

- No hardcoded secrets
- Input validation present
- No `eval()` or dynamic code execution
- API endpoints have auth checks

**Gate:** Only applies to code handling user input, authentication, or external data.

## Failure Handling

| Failure | Response |
|---------|----------|
| Step 1-2 (Build/Lint) | Fix immediately — always your responsibility |
| Step 3 (Tests) | Apply `debug-mantra` skill: read error → root cause → fix or document |
| Step 4 (Coverage) | Write missing tests before proceeding |
| Step 5 (Security) | Apply `security` skill |

## AIDLC Integration

```text
Phase 3: Implementation
  │
  ├── Task N: Write code
  │     │
  │     ▼
  │   verification-loop (this skill)
  │     │
  │     ├── All pass → commit + mark done
  │     └── Any fail → fix → re-run loop
  │
  └── All tasks done → Phase 3 complete
```
