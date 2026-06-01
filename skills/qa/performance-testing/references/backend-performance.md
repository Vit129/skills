# Backend Performance

> วัด API response time, payload, และ E2E flow — ทั้งจาก browser (Chrome DevTools MCP) และ direct API call

## When to Use

- API endpoint ช้า ต้องการ baseline
- ต้องการหา bottleneck ใน flow ที่มีหลาย API calls
- ก่อน/หลัง optimize ต้องการ compare
- ต้องการดู request/response body จริงที่ browser ส่ง

## 2 Modes

| Mode | ใช้เมื่อ | เครื่องมือ |
|------|---------|-----------|
| **Per-Endpoint** | วัด endpoint เดียว ซ้ำหลายรอบ หา p95 | Chrome DevTools MCP หรือ curl/k6 |
| **E2E Flow** | วัด flow ทั้งหมด หา bottleneck step | Chrome DevTools MCP (ทำ action แล้ว list) หรือ k6 scenario |

---

## Chrome DevTools MCP — Backend Profiling

ใช้ Chrome DevTools MCP เพื่อ capture API calls ที่เกิดจาก UI action จริง

### Workflow

```
1. navigate_page → ไปหน้าที่ต้องการ
2. ทำ action (click, fill, submit)
3. list_network_requests (resourceTypes: fetch, xhr) → ดู API calls ทั้งหมด
4. get_network_request(reqid) → drill down request/response body + timing
5. สรุป: slowest endpoint, largest payload, errors
```

### MCP Tools ที่ใช้

| Tool | วัดอะไร | มุม Backend |
|------|---------|------------|
| `list_network_requests` | API calls ทั้งหมด | response time, status, size |
| `get_network_request(reqid)` | Request/response detail | body, headers, timing breakdown |
| `navigate_page` | ไปหน้าที่ต้องการ | setup |

### Output Format (Backend Profile จาก Browser)

```markdown
## 📊 Backend Performance Profile — [Page/Action Name]

**Action:** [อธิบาย action ที่ทำ]
**Total API calls:** N
**Total time:** Xms (first → last)

| # | Method | Endpoint | Status | Time (ms) | Req Size | Res Size |
|---|--------|----------|--------|-----------|----------|----------|
| 1 | POST | /api/v1/auth/login | 200 | 245 | 120B | 1.2KB |
| 2 | GET | /api/v1/flights | 200 | 580 | — | 45KB |
| 3 | GET | /api/v1/user/profile | 200 | 120 | — | 2.1KB |

**Slowest:** #2 /api/v1/flights (580ms)
**Largest response:** #2 /api/v1/flights (45KB)
**Errors:** None

### Observations
- [สิ่งที่สังเกตเห็น เช่น duplicate calls, large payload, waterfall]
```

### What to Look For (Backend Lens)

| Pattern | Problem | Action |
|---------|---------|--------|
| Same endpoint called multiple times | Duplicate requests | Check component re-renders, debounce |
| Sequential calls ที่ทำ parallel ได้ | Waterfall | Promise.all หรือ batch endpoint |
| Response > 100KB | Over-fetching | Pagination, field selection |
| 401 → retry | Token refresh overhead | Pre-refresh ก่อน expire |
| Slow TTFB (> 300ms) | Server processing slow | Profile DB, check indexes |

---

## Running Backend Profile

### Option A: Chrome DevTools MCP (Live — จาก Browser)

```
ใช้เมื่อ: ต้องการดู API calls ที่เกิดจาก UI action จริง
ข้อดี: เห็น real payload, authenticated, ไม่ต้อง setup อะไรเพิ่ม
```

```
1. เปิด browser ไปหน้าที่ต้องการ
2. ทำ action
3. list_network_requests → get_network_request
```

### Option B: Direct API Call (curl / httpie)

```bash
# Single endpoint — วัด response time
time curl -s -o /dev/null -w "%{time_total}s %{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  https://api-sit.example.com/api/v1/flights

# With request body
time curl -s -o /dev/null -w "%{time_total}s %{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"origin":"BKK","destination":"NRT"}' \
  https://api-sit.example.com/api/v1/flights/search
```

### Option C: k6 (Per-Endpoint — หลายรอบ หา p95)

```javascript
// per-endpoint.js
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  vus: 1,
  iterations: 10,  // 10 runs
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
}

export function setup() {
  const res = http.post(`${__ENV.BASE_URL}/auth/login`,
    JSON.stringify({ username: __ENV.USER, password: __ENV.PASS }),
    { headers: { 'Content-Type': 'application/json' } }
  )
  return { token: res.json('access_token') }
}

export default function (data) {
  const res = http.get(`${__ENV.BASE_URL}/flights`, {
    headers: { Authorization: `Bearer ${data.token}` },
  })
  check(res, { 'status 200': (r) => r.status === 200 })
}
```

```bash
k6 run -e BASE_URL=https://api-sit.example.com -e USER=test@example.com -e PASS=secret per-endpoint.js
```

### Option D: k6 (E2E Flow — หลาย endpoints ต่อเนื่อง)

```javascript
// e2e-flow.js
import http from 'k6/http'
import { check, group } from 'k6'

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    'http_req_duration{group:::Login}': ['p(95)<500'],
    'http_req_duration{group:::Search}': ['p(95)<800'],
    'http_req_duration{group:::Book}': ['p(95)<600'],
  },
}

export default function () {
  let token

  group('Login', () => {
    const res = http.post(`${__ENV.BASE_URL}/auth/login`,
      JSON.stringify({ username: __ENV.USER, password: __ENV.PASS }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    check(res, { 'login ok': (r) => r.status === 200 })
    token = res.json('access_token')
  })

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  group('Search', () => {
    const res = http.post(`${__ENV.BASE_URL}/flights/search`,
      JSON.stringify({ origin: 'BKK', destination: 'NRT', date: '2026-07-01' }),
      { headers }
    )
    check(res, { 'search ok': (r) => r.status === 200 })
  })

  group('Book', () => {
    const res = http.post(`${__ENV.BASE_URL}/bookings`,
      JSON.stringify({ flightId: 'FL001', passengers: 1 }),
      { headers }
    )
    check(res, { 'book ok': (r) => r.status === 201 })
  })
}
```

```bash
k6 run -e BASE_URL=https://api-sit.example.com -e USER=test@example.com -e PASS=secret e2e-flow.js
```

---

## Output Format (Per-Endpoint — k6)

```markdown
## 📊 API Profile — Per-Endpoint

**Endpoint:** `GET /api/v1/flights`
**Runs:** 10 | **Auth:** Bearer JWT

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Avg | 238ms | — | — |
| Min | 210ms | — | — |
| Max | 290ms | — | — |
| p95 | 275ms | < 500ms | ✅ |
| Error rate | 0% | < 1% | ✅ |

### Verdict: ✅ PASS
```

## Output Format (E2E Flow — k6)

```markdown
## 📊 API Profile — E2E Flow

**Flow:** Login → Search → Book
**Runs:** 5

| Step | Endpoint | p95 (ms) | Threshold | Status |
|------|----------|----------|-----------|--------|
| Login | POST /auth/login | 320ms | < 500ms | ✅ |
| Search | POST /flights/search | 680ms | < 800ms | ✅ |
| Book | POST /bookings | 450ms | < 600ms | ✅ |

**Total flow p95:** 1,450ms

### Verdict: ✅ PASS
```

---

## Decision Framework

| Observation | Root Cause | Action |
|-------------|-----------|--------|
| TTFB > 300ms | Server processing slow | Profile DB, check indexes → `database-performance.md` |
| Response > 100KB | Over-fetching | Add pagination, field selection |
| Duplicate calls | Client-side issue | Fix component logic → `frontend-performance.md` |
| Errors spike at high VUs | Concurrency limit | Load test with k6 → `k6-scripting.md` |
| Gradual degradation | Memory leak / DB bloat | Soak test → `database-performance.md` |
