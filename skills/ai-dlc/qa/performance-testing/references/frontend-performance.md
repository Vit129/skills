# Frontend Performance Optimization

> เสริม k6 load testing ที่มีอยู่ — ใช้เมื่อต้อง optimize client-side performance

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## Optimization Workflow

```
1. MEASURE  → Establish baseline (Lighthouse + RUM)
2. IDENTIFY → Find actual bottleneck (not assumed)
3. FIX      → Address specific bottleneck
4. VERIFY   → Measure again, confirm improvement
5. GUARD    → Add CI budget or monitoring
```

## Where to Start (Symptom → Action)

```
What is slow?
├── First page load
│   ├── Large bundle? → Code splitting, lazy loading
│   ├── Slow TTFB? → Check server, caching, CDN
│   └── Render-blocking? → Defer non-critical CSS/JS
├── Interaction feels sluggish
│   ├── UI freezes? → Profile main thread, find long tasks (>50ms)
│   ├── Form input lag? → Check re-renders
│   └── Animation jank? → Check layout thrashing
├── Page after navigation
│   ├── Data loading? → API response times, request waterfalls
│   └── Client rendering? → Component render time
└── Backend / API
    ├── Single endpoint slow? → Profile DB queries, check indexes
    ├── All endpoints slow? → Connection pool, memory, CPU
    └── Intermittent? → Lock contention, GC pauses
```

## Common Anti-Patterns + Fixes

### N+1 Queries

```typescript
// BAD
const tasks = await db.tasks.findMany();
for (const task of tasks) {
  task.owner = await db.users.findUnique({ where: { id: task.ownerId } });
}

// GOOD
const tasks = await db.tasks.findMany({ include: { owner: true } });
```

### Unbounded Data Fetching

```typescript
// BAD
const allTasks = await db.tasks.findMany();

// GOOD
const tasks = await db.tasks.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

### Large Bundle Size

```typescript
// Lazy load heavy features
const ChartLibrary = lazy(() => import('./ChartLibrary'));
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <SettingsPage />
    </Suspense>
  );
}
```

### Unnecessary Re-renders (React)

```typescript
// BAD: New object every render
<TaskFilters options={{ sortBy: 'date', order: 'desc' }} />

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
<TaskFilters options={DEFAULT_OPTIONS} />

// Expensive components
const TaskItem = React.memo(function TaskItem({ task }) { ... });

// Expensive computations
const stats = useMemo(() => calculateStats(tasks), [tasks]);
```

### Missing Image Optimization

```html
<!-- BAD -->
<img src="/hero.jpg" />

<!-- GOOD: Responsive + lazy -->
<img
  src="/hero.webp"
  width="1200" height="600"
  loading="lazy"
  decoding="async"
  alt="Description"
/>

<!-- LCP image: high priority, no lazy -->
<img src="/hero.webp" width="1200" height="600" fetchpriority="high" alt="..." />
```

## Performance Budget

```
JavaScript bundle: < 200KB gzipped (initial)
CSS: < 50KB gzipped
Images: < 200KB per above-fold image
Fonts: < 100KB total
API response: < 200ms (p95)
TTI: < 3.5s on 4G
Lighthouse Performance: ≥ 90
```

## Measurement Tools

```bash
# Lighthouse CI
npx lhci autorun

# Bundle analysis
npx vite-bundle-visualizer
# or
npx webpack-bundle-analyzer

# Web Vitals in code
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

## Rule: Measure Before Optimizing

Don't optimize without evidence. Premature optimization adds complexity without improving what matters. Profile first → identify bottleneck → fix → measure again.
