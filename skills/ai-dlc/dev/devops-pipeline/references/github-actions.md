# GitHub Actions

Generate and manage GitHub Actions workflows for CI/CD automation.

## Workflow File Location
- All workflows: `.github/workflows/<name>.yml`

## Basic Workflow Structure

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

## Common Triggers

```yaml
on:
  push:                        # Push to branch
  pull_request:                # PR opened/updated
  schedule:
    - cron: '0 22 * * *'       # Daily at 22:00 UTC
  workflow_dispatch:           # Manual trigger
  release:
    types: [published]         # On release
```

## Secrets & Environment Variables

```yaml
env:
  NODE_ENV: production

steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    run: npm run deploy
```

- Secrets: Settings → Secrets and variables → Actions
- Use `${{ secrets.NAME }}` — never hardcode values
- Use `${{ vars.NAME }}` for non-sensitive config variables

## Node.js / npm Project

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
- run: npm ci          # Always use ci, not install
- run: npm run lint
- run: npm run test
- run: npm run build
```

## Reusable Workflows

```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'

# Caller
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
```

## Branch Protection (via GitHub UI / gh CLI)

```bash
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}'
```

## Deploy to Vercel / Netlify

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

## Job Dependencies & Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

  deploy:
    needs: test          # Run after test passes
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
```

## Caching

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## OIDC — Keyless Cloud Authentication (2025 Best Practice)

Replace long-lived secrets with short-lived OIDC tokens for cloud deployments:

```yaml
# AWS deployment without storing AWS credentials as secrets
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # required for OIDC
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-role
          aws-region: ap-southeast-1
          # No AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY needed!

      - name: Deploy to ECS
        run: aws ecs update-service --cluster prod --service api --force-new-deployment
```

```yaml
# Azure deployment via OIDC
- name: Azure Login via OIDC
  uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    # No AZURE_CLIENT_SECRET needed!
```

## Reusable Workflows (Advanced)

```yaml
# .github/workflows/reusable-deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
    secrets:
      DEPLOY_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - name: Deploy ${{ inputs.image-tag }} to ${{ inputs.environment }}
        run: echo "Deploying ${{ inputs.image-tag }}"
```

```yaml
# Caller workflow
jobs:
  deploy-sit:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: sit
      image-tag: ${{ needs.build.outputs.image-tag }}
    secrets:
      DEPLOY_TOKEN: ${{ secrets.SIT_DEPLOY_TOKEN }}

  deploy-uat:
    needs: deploy-sit
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: uat
      image-tag: ${{ needs.build.outputs.image-tag }}
    secrets:
      DEPLOY_TOKEN: ${{ secrets.UAT_DEPLOY_TOKEN }}
```

## Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true   # cancel older runs on same branch
```

## Dynamic Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        include:
          - os: ubuntu-latest
            node: 20
          - os: ubuntu-latest
            node: 22
          - os: macos-latest
            node: 20
      fail-fast: false   # don't cancel other matrix jobs on failure
```

## Rules
- Always pin action versions (`@v4`, not `@main`) to avoid supply chain attacks
- Use `npm ci` not `npm install` in CI
- Store all credentials in GitHub Secrets, never in workflow YAML
- Add `timeout-minutes` to jobs to prevent runaway builds
- Use `concurrency` to cancel redundant runs on the same branch
- **Prefer OIDC over long-lived secrets** for cloud provider authentication
- Use reusable workflows for deploy steps shared across environments
