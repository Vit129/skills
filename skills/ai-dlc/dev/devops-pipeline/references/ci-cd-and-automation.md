# CI/CD Pipeline

## GitHub Actions — Basic Structure

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

## Common Patterns

### Test + Build + Deploy

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: build }
      # deploy steps...
```

### Playwright Tests in CI

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

### Scheduled Runs

```yaml
on:
  schedule:
    # Cron: minute hour day-of-month month day-of-week (UTC)
    - cron: '0 2 * * 1-5'    # Mon-Fri 2am UTC (9am Bangkok)
    - cron: '0 6 * * 1-5'    # Mon-Fri 6am UTC (1pm Bangkok)
  workflow_dispatch:           # manual trigger button
```

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true    # cancel previous run on same branch
```

### Reusable Workflows

```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm
      - run: npm ci && npm test
```

```yaml
# Caller workflow
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
```

### Environment Variables & Secrets

```yaml
env:
  NODE_ENV: test

jobs:
  deploy:
    environment: production    # requires approval
    env:
      API_URL: ${{ vars.API_URL }}           # non-secret variable
      API_KEY: ${{ secrets.API_KEY }}         # secret
```

## Pipeline Design Principles

1. **Fail fast** — run cheapest checks first (lint → type check → unit → integration → e2e)
2. **Cache aggressively** — `actions/cache` or built-in cache in setup actions
3. **Parallelize** — independent jobs run concurrently
4. **Artifacts** — upload test reports, build outputs for debugging
5. **Concurrency** — cancel stale runs on the same branch
6. **Environments** — use GitHub environments for deployment approvals

## Cron Cheat Sheet (UTC)

| Human time (Bangkok UTC+7) | Cron (UTC) |
|---|---|
| Mon-Fri 09:00 | `0 2 * * 1-5` |
| Mon-Fri 13:00 | `0 6 * * 1-5` |
| Daily 02:00 | `0 19 * * *` (prev day) |
| Every 6 hours | `0 */6 * * *` |
| Sunday midnight | `0 17 * * 6` (Sat UTC) |
