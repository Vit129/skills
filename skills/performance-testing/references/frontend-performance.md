# Frontend Performance

> Measure client-side performance via Playwright — capture during functional test runs without separate browser session.
> Output: Markdown report + self-contained embedded HTML (shareable without server)

## When to Use

- Page loads slowly, unclear if rendering or API is the bottleneck
- LCP / INP / CLS fails threshold
- Need latency data from tests already running
- Need performance report to attach to PBI/Sprint

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

---

## Playwright-Based Frontend Profiling

### Workflow

```
1. page.tracing.start() → เริ่ม trace (includes screenshots, snapshots)
2. Run functional test steps (test ที่มีอยู่แล้ว — ไม่ต้อง navigate ซ้ำ)
3. Collect metrics ระหว่าง test:
   - response.timing() → per-request latency
   - Performance API → Core Web Vitals
   - HAR → full network waterfall
4. page.tracing.stop() → save trace.zip
5. Generate report (MD + HTML)
```

### Implementation Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('@Performance Frontend Profiling', () => {
  test('measure page load + API latency', async ({ page, context }) => {
    // --- Start HAR recording ---
    await context.tracing.start({ screenshots: true, snapshots: true });

    // --- Collect latencies ---
    const latencies: { url: string; method: string; duration: number; status: number }[] = [];
    page.on('response', (response) => {
      const timing = response.timing();
      if (response.url().includes('/api/')) {
        latencies.push({
          url: new URL(response.url()).pathname,
          method: response.request().method(),
          duration: timing.responseEnd,
          status: response.status(),
        });
      }
    });

    // --- Navigate + interact (your existing test steps) ---
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // --- Collect Core Web Vitals ---
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const result: Record<string, number> = {};
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') result.LCP = entry.startTime;
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              result.CLS = (result.CLS || 0) + (entry as any).value;
            }
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              result.CLS = (result.CLS || 0) + (entry as any).value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        // Give time to collect
        setTimeout(() => resolve(result), 3000);
      });
    });

    // --- Navigation timing ---
    const navTiming = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        fullLoad: nav.loadEventEnd - nav.startTime,
        ttfb: nav.responseStart - nav.requestStart,
      };
    });

    // --- Stop tracing ---
    await context.tracing.stop({ path: 'test-results/performance-trace.zip' });

    // --- Assertions (performance gates) ---
    expect(vitals.LCP, 'LCP should be < 2500ms').toBeLessThan(2500);
    expect(vitals.CLS ?? 0, 'CLS should be < 0.1').toBeLessThan(0.1);
    expect(navTiming.ttfb, 'TTFB should be < 800ms').toBeLessThan(800);

    // --- Output for report generation ---
    console.log(JSON.stringify({ vitals, navTiming, latencies }, null, 2));
  });
});
```

### Trace Viewing

```bash
# View trace locally (interactive)
npx playwright show-trace test-results/performance-trace.zip
```

---

## Report Generation (MD + Embedded HTML)

After test run → agent generates report in 2 formats:

### Output Location

```
test-results/performance/
├── performance-report.md       ← Markdown (readable in ADO/GitHub/any viewer)
└── performance-report.html     ← Self-contained HTML (embedded charts, share via link)
```

### Markdown Report Format

```markdown
# 📊 Performance Report — {Feature} ({Environment})

**Date:** {DD Month YYYY}
**URL:** {base-url}
**Branch:** {branch} ({commit_short})
**Test:** {spec-file-name}

---

## Core Web Vitals

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | {x}ms | ≤ 2500ms | ✅/❌ |
| CLS | {x} | ≤ 0.1 | ✅/❌ |
| TTFB | {x}ms | ≤ 800ms | ✅/❌ |
| DOM Content Loaded | {x}ms | ≤ 1500ms | ✅/❌ |
| Full Page Load | {x}ms | ≤ 3000ms | ✅/❌ |

## API Latency (Top 10 slowest)

| # | Method | Endpoint | Duration (ms) | Status |
|---|--------|----------|:---:|:---:|
| 1 | GET | /api/v1/orders | 580 | 200 |
| 2 | POST | /api/v1/auth/login | 420 | 200 |
| ... | | | | |

## Latency Distribution

| Percentile | Value |
|-----------|-------|
| p50 | {x}ms |
| p75 | {x}ms |
| p95 | {x}ms |
| p99 | {x}ms |

## Verdict: {PASS ✅ / FAIL ❌}

{Summary — what passed, what failed, recommendations}
```

### Embedded HTML Report Format

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Performance Report — {Feature}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 2rem; color: #333; }
    h1 { color: #0078d4; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; }
    .pass { color: #107c10; font-weight: bold; }
    .fail { color: #d13438; font-weight: bold; }
    .bar { height: 20px; background: #0078d4; border-radius: 3px; }
    .bar-container { background: #eee; border-radius: 3px; overflow: hidden; width: 200px; }
    .meta { color: #666; font-size: 0.9rem; }
    .verdict { font-size: 1.5rem; padding: 1rem; border-radius: 8px; text-align: center; margin: 2rem 0; }
    .verdict.pass { background: #dff6dd; color: #107c10; }
    .verdict.fail { background: #fde7e9; color: #d13438; }
  </style>
</head>
<body>
  <h1>📊 Performance Report — {Feature}</h1>
  <p class="meta">Date: {date} | URL: {url} | Branch: {branch} ({commit})</p>

  <h2>Core Web Vitals</h2>
  <table>
    <tr><th>Metric</th><th>Value</th><th>Target</th><th>Visual</th><th>Status</th></tr>
    <tr>
      <td>LCP</td><td>{x}ms</td><td>≤ 2500ms</td>
      <td><div class="bar-container"><div class="bar" style="width:{pct}%"></div></div></td>
      <td class="pass">✅</td>
    </tr>
    <!-- repeat for CLS, TTFB, etc. -->
  </table>

  <h2>API Latency</h2>
  <table>
    <tr><th>#</th><th>Method</th><th>Endpoint</th><th>Duration</th><th>Status</th></tr>
    <!-- rows -->
  </table>

  <div class="verdict pass">✅ PASS — All metrics within threshold</div>
</body>
</html>
```

**Rule:** HTML is self-contained — NO external CSS/JS dependencies. Can be opened in any browser or attached to ADO work item.

---

## Integration with Phase 2.5

### Updated Steps (Playwright-based)

| Step | Action |
|------|--------|
| 1 | Ask: "Frontend / Backend / Both / Skip?" |
| 2 | If Frontend: add `@Performance` tag to test → run with tracing + latency collection |
| 3 | If Backend: k6 (unchanged — load test, p95, concurrent VUs) |
| 4 | Collect results → compare vs thresholds |
| 5 | Generate report: `test-results/performance/performance-report.md` + `.html` |
| 6 | If fail → flag for optimization |
| 7 | Attach report to PBI/Sprint (optional) |

### Chrome DevTools MCP — Still Used For

| Use case | Tool |
|----------|------|
| Lighthouse audit (accessibility, SEO, best practices) | `lighthouse_audit` MCP |
| Heap snapshot (memory leak investigation) | `take_heapsnapshot` MCP |
| Live debugging (inspect element, console) | `take_snapshot` / `list_console_messages` MCP |

**NOT used for:** Performance measurement in CI/automated tests → use Playwright instead.

---

## Performance Budget (Assertions)

```typescript
// In test — these act as CI gates
expect(vitals.LCP).toBeLessThan(2500);        // LCP < 2.5s
expect(vitals.CLS ?? 0).toBeLessThan(0.1);    // CLS < 0.1
expect(navTiming.ttfb).toBeLessThan(800);     // TTFB < 800ms
expect(navTiming.fullLoad).toBeLessThan(3000); // Full load < 3s

// API latency
for (const l of latencies) {
  expect(l.duration, `${l.url} too slow`).toBeLessThan(500); // per-request < 500ms
}
```

---

## Optimization Workflow (unchanged)

```
1. MEASURE  → Playwright trace + latency capture
2. IDENTIFY → find bottleneck from report (slowest API, large bundle, CLS)
3. FIX      → code change
4. VERIFY   → re-run perf test → compare report
5. GUARD    → assertions in CI prevent regression
```

## Common Anti-Patterns + Fixes

| Pattern | Problem | Fix |
|---------|---------|-----|
| Large JS bundle blocks render | LCP > 2.5s | Code split, lazy load |
| Font loads late | CLS > 0.1 | `<link rel="preload">` + `font-display: swap` |
| LCP image no priority | LCP > 2.5s | `fetchpriority="high"` |
| Many sequential API calls | Slow page load | Parallelize or batch |
| No image optimization | Large transfer | WebP + responsive sizes |

## Performance Budget

```
JavaScript bundle: < 200KB gzipped (initial)
CSS: < 50KB gzipped
Images: < 200KB per above-fold image
Fonts: < 100KB total
Full page load: < 3s
Lighthouse Performance: ≥ 90
```
