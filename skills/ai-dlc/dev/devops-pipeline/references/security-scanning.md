# Security Scanning in CI/CD

Shift-left security — scan early in the pipeline, fail fast on critical issues.

## Scanning Types

| Type | Tool | What it catches |
|------|------|-----------------|
| Secret detection | Gitleaks, TruffleHog | Hardcoded tokens, API keys in code |
| SCA (dependency) | Trivy, Snyk | Known CVEs in npm/pip/go packages |
| Container image | Trivy | OS packages, misconfigs in Docker image |
| SAST (static code) | CodeQL, Semgrep | Code vulnerabilities, injection patterns |
| IaC scanning | Trivy, Checkov | Misconfigs in Dockerfile, k8s YAML |

## Recommended Pipeline Order

```
1. Secret detection (fastest — fail early)
2. Dependency scan (SCA)
3. Build
4. Image scan (after build)
5. SAST (can run in parallel with build)
```

## Gitleaks — Secret Detection

```yaml
- name: Detect secrets
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```bash
# Local pre-commit check
gitleaks detect --source . --verbose
```

## Trivy — Dependency + Image Scanning

```yaml
# Scan dependencies (no Docker needed)
- name: Dependency scan
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: fs
    scan-ref: .
    severity: CRITICAL,HIGH
    exit-code: '1'

# Scan Docker image
- name: Image scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:${{ github.sha }}
    format: sarif
    output: trivy-results.sarif
    severity: CRITICAL,HIGH
    exit-code: '1'

- name: Upload to GitHub Security
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: trivy-results.sarif
```

```bash
# Local usage
trivy fs .
trivy image myapp:latest
trivy config ./k8s/
```

## CodeQL — SAST

```yaml
name: CodeQL
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # weekly

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    strategy:
      matrix:
        language: [javascript-typescript]
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: security-extended
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
```

## Semgrep — Fast SAST (no build needed)

```yaml
- name: Semgrep scan
  uses: semgrep/semgrep-action@v1
  with:
    config: p/owasp-top-ten
```

## Full DevSecOps Pipeline

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # 1. Secrets (fastest)
      - uses: gitleaks/gitleaks-action@v2
        env: { GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} }
      # 2. Dependencies
      - uses: aquasecurity/trivy-action@master
        with: { scan-type: fs, severity: 'CRITICAL,HIGH', exit-code: '1' }

  build:
    needs: security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:${{ github.sha }} .
      # 3. Image scan
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

  sast:
    runs-on: ubuntu-latest
    permissions: { security-events: write }
    steps:
      # 4. SAST (parallel with build)
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with: { languages: javascript-typescript }
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
```

## Severity Policy

| Severity | Action |
|----------|--------|
| CRITICAL | Block pipeline — must fix before merge |
| HIGH | Block pipeline — must fix before merge |
| MEDIUM | Warn — create ticket, don't block |
| LOW | Ignore in CI — review quarterly |

## Suppressing False Positives

```
# .trivyignore
CVE-2023-XXXXX    # not exploitable in our context (expires: 2026-06-01)
```

**Rules:**
- Every suppression MUST have expiry date + justification
- Never suppress CRITICAL without security lead approval
- Review suppressions quarterly
