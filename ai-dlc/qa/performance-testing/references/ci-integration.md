# K6 CI/CD Integration

Run performance tests in pipelines with automatic pass/fail gates.

## GitHub Actions

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'    # nightly
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [sit, uat]
        default: sit

jobs:
  k6-load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run K6 load test
        uses: grafana/k6-action@v0.3.1
        with:
          filename: tests/performance/scenarios/flight-search.js
          flags: --out json=results.json
        env:
          BASE_URL: ${{ vars[format('{0}_BASE_URL', inputs.environment)] }}
          API_TOKEN: ${{ secrets[format('{0}_API_TOKEN', inputs.environment)] }}

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: results.json
```

## Azure DevOps Pipeline

```yaml
# azure-pipelines-perf.yml
trigger: none   # manual or scheduled only

schedules:
  - cron: '0 2 * * *'
    displayName: Nightly performance test
    branches:
      include: [main]

pool:
  vmImage: ubuntu-latest

steps:
  - task: Bash@3
    displayName: Install K6
    inputs:
      targetType: inline
      script: |
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
          --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
          | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update && sudo apt-get install k6

  - task: Bash@3
    displayName: Run K6
    inputs:
      targetType: inline
      script: k6 run tests/performance/scenarios/flight-search.js --out json=results.json
    env:
      BASE_URL: $(SIT_BASE_URL)
      API_TOKEN: $(SIT_API_TOKEN)

  - task: PublishBuildArtifacts@1
    condition: always()
    inputs:
      pathToPublish: results.json
      artifactName: k6-results
```

## Performance Gate Pattern

```javascript
// thresholds.js — shared across all scenarios
export const defaultThresholds = {
  // API response time
  http_req_duration: [
    'p(50)<200',    // median < 200ms
    'p(95)<500',    // 95th percentile < 500ms
    'p(99)<1000',   // 99th percentile < 1s
  ],
  // Error rate
  http_req_failed: ['rate<0.01'],   // < 1% errors
  // Check pass rate
  checks: ['rate>0.99'],            // > 99% checks pass
}

// Per-endpoint custom thresholds
export const strictThresholds = {
  'http_req_duration{name:payment}': ['p(95)<300'],   // payment must be faster
  'http_req_duration{name:search}':  ['p(95)<800'],   // search can be slower
}
```

```javascript
// scenario file
import { defaultThresholds } from '../thresholds.js'

export const options = {
  thresholds: defaultThresholds,
  scenarios: { /* ... */ },
}
```

## Grafana Cloud K6 (Optional — for team dashboards)

```yaml
- name: Run K6 with Grafana Cloud output
  uses: grafana/k6-action@v0.3.1
  with:
    filename: tests/performance/scenarios/flight-search.js
    cloud: true    # streams results to Grafana Cloud
  env:
    K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
    K6_CLOUD_PROJECT_ID: ${{ vars.K6_CLOUD_PROJECT_ID }}
```

## When to Run Performance Tests

| Trigger | Scope | Threshold |
|---------|-------|-----------|
| Every PR | Smoke only (1 VU, 1min) | Basic sanity |
| Merge to main | Load test (normal traffic) | p95 < 500ms |
| Pre-release | Full suite (load + stress + spike) | All thresholds |
| Nightly | Soak test (4h) | No degradation over time |

## Rules
- Never run full load tests against production — use SIT/UAT only
- Performance tests MUST use dedicated test accounts — not real user data
- Thresholds MUST be agreed with the team before adding to pipeline
- Failed thresholds MUST block release pipeline (exit code 99)
- Store baseline results as artifacts — compare trend over time
