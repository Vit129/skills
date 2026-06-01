# Frontend Performance

> วัดและ optimize client-side performance — rendering, bundle, Web Vitals, API waterfall จาก browser perspective

## When to Use

- หน้าโหลดช้า ไม่รู้ว่าเพราะ rendering หรือ API
- LCP / INP / CLS ไม่ผ่าน threshold
- Bundle ใหญ่เกิน
- ต้องการดู API calls ที่เกิดจาก UI action (มุม browser)

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

---

## Chrome DevTools MCP — Frontend Profiling

ใช้ Chrome DevTools MCP เพื่อวัด frontend performance จาก browser จริง

### Workflow

```
1. navigate_page → ไปหน้าที่ต้องการ
2. performance_start_trace (reload: true) → เริ่ม trace + reload หน้า
3. รอหน้า load เสร็จ
4. performance_stop_trace → ดูผล Core Web Vitals + insights
5. list_network_requests (resourceTypes: fetch, xhr) → ดู API waterfall
6. take_screenshot → capture visual state
```

### MCP Tools ที่ใช้

| Tool | วัดอะไร | มุม Frontend |
|------|---------|-------------|
| `performance_start_trace` | LCP, INP, CLS, rendering timeline | Core Web Vitals |
| `performance_stop_trace` | Insights, bottleneck summary | ดูผลรวม |
| `performance_analyze_insight` | Drill down insight เฉพาะ (LCPBreakdown, DocumentLatency) | หา root cause |
| `list_network_requests` | Resource loading waterfall | ดูว่า resource ไหน block rendering |
| `take_screenshot` | Visual state | ยืนยัน layout shift |

### Output Format (Frontend Profile)

```markdown
## 📊 Frontend Performance Profile — [Page Name]

**URL:** [url]
**Device:** Desktop / Mobile

### Core Web Vitals
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | 2.1s | ≤ 2.5s | ✅ |
| INP | 180ms | ≤ 200ms | ✅ |
| CLS | 0.05 | ≤ 0.1 | ✅ |

### Resource Waterfall (Top 5 slowest)
| Resource | Type | Size | Time (ms) | Blocks Render? |
|----------|------|------|-----------|----------------|
| /api/v1/flights | fetch | 45KB | 580ms | No |
| /static/main.bundle.js | script | 1.2MB | 420ms | Yes |
| /fonts/inter.woff2 | font | 80KB | 210ms | Yes |

### Observations
- [สิ่งที่สังเกตเห็น]

### Verdict: [PASS/FAIL]
```

### What to Look For (Frontend Lens)

| Pattern | Problem | Action |
|---------|---------|--------|
| Large JS bundle blocks render | Render-blocking script | Defer/async, code split |
| Font loads late → CLS | Font not preloaded | Add `<link rel="preload">` |
| LCP image loads slow | No priority hint | Add `fetchpriority="high"` |
| Many small API calls in waterfall | Request waterfall | Batch or parallelize |
| API calls before page interactive | Blocking data fetch | Lazy load non-critical data |

---

## Running Frontend Profile

### Option A: Chrome DevTools MCP (Live)

```
ใช้เมื่อ: ต้องการ profile หน้าจริงใน browser ที่เปิดอยู่
ข้อดี: เห็น real user experience, ใช้ได้กับ authenticated pages
```

```
1. เปิด browser ไปหน้าที่ต้องการ
2. ใช้ MCP tools ตาม workflow ด้านบน
3. ดูผลทันที
```

### Option B: Lighthouse CLI (Automated)

```bash
# Single run
npx lighthouse https://example.com --output json --output-path report.json

# CI mode
npx lhci autorun

# Mobile simulation
npx lighthouse https://example.com --emulated-form-factor mobile
```

### Option C: Web Vitals in Code (RUM)

```typescript
import { onLCP, onINP, onCLS } from 'web-vitals'

onLCP(({ value }) => console.log('LCP:', value))
onINP(({ value }) => console.log('INP:', value))
onCLS(({ value }) => console.log('CLS:', value))
```

### Option D: Bundle Analysis

```bash
# Vite
npx vite-bundle-visualizer

# Webpack
npx webpack-bundle-analyzer stats.json
```

---

## Optimization Workflow

```
1. MEASURE  → Chrome DevTools MCP trace หรือ Lighthouse
2. IDENTIFY → หา bottleneck จาก insights (LCPBreakdown, render-blocking)
3. FIX      → แก้ตาม anti-patterns ด้านล่าง
4. VERIFY   → วัดอีกครั้ง ยืนยัน improvement
5. GUARD    → เพิ่ม CI budget หรือ Lighthouse threshold
```

## Common Anti-Patterns + Fixes

### Large Bundle Size

```typescript
// Lazy load heavy features
const ChartLibrary = lazy(() => import('./ChartLibrary'))
const SettingsPage = lazy(() => import('./pages/Settings'))
```

### Unnecessary Re-renders (React)

```typescript
// BAD: New object every render
<TaskFilters options={{ sortBy: 'date', order: 'desc' }} />

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const
<TaskFilters options={DEFAULT_OPTIONS} />

const TaskItem = React.memo(function TaskItem({ task }) { ... })
const stats = useMemo(() => calculateStats(tasks), [tasks])
```

### Missing Image Optimization

```html
<!-- LCP image: high priority -->
<img src="/hero.webp" width="1200" height="600" fetchpriority="high" alt="..." />

<!-- Below fold: lazy -->
<img src="/card.webp" width="400" height="300" loading="lazy" decoding="async" alt="..." />
```

## Performance Budget

```
JavaScript bundle: < 200KB gzipped (initial)
CSS: < 50KB gzipped
Images: < 200KB per above-fold image
Fonts: < 100KB total
TTI: < 3.5s on 4G
Lighthouse Performance: ≥ 90
```

## Rule: Measure Before Optimizing

Profile first → identify bottleneck → fix → measure again. อย่า optimize โดยไม่มี evidence.
