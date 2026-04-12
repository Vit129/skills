# K6 Scripting

Write load test scripts with K6 — JavaScript-based, developer-friendly.

## Installation

```bash
brew install k6          # macOS
# or
docker run -i grafana/k6 run - <script.js
```

## Basic Script

```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,           // virtual users
  duration: '30s',   // test duration
}

export default function () {
  const res = http.get('https://api.example.com/flights')

  check(res, {
    'status is 200':        (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)  // think time between requests
}
```

## Thresholds — Performance Gates

```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95th percentile < 500ms
    http_req_failed:   ['rate<0.01'],                 // error rate < 1%
    checks:            ['rate>0.99'],                 // 99% checks pass
  },
}
// K6 exits with code 99 if thresholds fail — use in CI to block pipeline
```

## Scenarios

```javascript
export const options = {
  scenarios: {
    // Ramp up gradually
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },   // ramp to 50 users
        { duration: '3m', target: 50 },   // hold 50 users
        { duration: '1m', target: 0 },    // ramp down
      ],
    },

    // Constant arrival rate (more realistic)
    constant_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,              // 100 requests per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 50,
    },

    // Spike test
    spike: {
      executor: 'ramping-arrival-rate',
      stages: [
        { duration: '10s', target: 10 },
        { duration: '1m',  target: 500 },  // sudden spike
        { duration: '10s', target: 10 },
      ],
      preAllocatedVUs: 200,
    },
  },
}
```

## HTTP Requests

```javascript
import http from 'k6/http'

// GET with headers
const res = http.get('https://api.example.com/flights', {
  headers: { Authorization: `Bearer ${__ENV.API_TOKEN}` },
})

// POST JSON
const payload = JSON.stringify({ origin: 'BKK', destination: 'NRT' })
const res2 = http.post('https://api.example.com/flights/search', payload, {
  headers: { 'Content-Type': 'application/json' },
})

// Batch requests (parallel)
const responses = http.batch([
  ['GET', 'https://api.example.com/flights'],
  ['GET', 'https://api.example.com/hotels'],
])
```

## Data Parameterization

```javascript
import { SharedArray } from 'k6/data'
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js'

// Load test data from CSV
const users = new SharedArray('users', function () {
  return papaparse.parse(open('./data/users.csv'), { header: true }).data
})

export default function () {
  const user = users[Math.floor(Math.random() * users.length)]
  const res = http.post('/login', { username: user.email, password: user.password })
  check(res, { 'login success': (r) => r.status === 200 })
}
```

## Authentication Flow

```javascript
import http from 'k6/http'
import { check } from 'k6'

// Setup runs once — get token before load test
export function setup() {
  const res = http.post('https://api.example.com/auth/login', JSON.stringify({
    username: __ENV.TEST_USER,
    password: __ENV.TEST_PASS,
  }), { headers: { 'Content-Type': 'application/json' } })

  check(res, { 'login ok': (r) => r.status === 200 })
  return { token: res.json('access_token') }
}

// data = result from setup()
export default function (data) {
  const res = http.get('https://api.example.com/profile', {
    headers: { Authorization: `Bearer ${data.token}` },
  })
  check(res, { 'profile ok': (r) => r.status === 200 })
}
```

## Groups & Tags

```javascript
import { group } from 'k6'

export default function () {
  group('Flight Search Flow', () => {
    group('Search', () => {
      const res = http.get('/flights?origin=BKK&destination=NRT')
      check(res, { 'search ok': (r) => r.status === 200 })
    })

    group('Select Flight', () => {
      const res = http.post('/flights/select', JSON.stringify({ flightId: 'FL001' }))
      check(res, { 'select ok': (r) => r.status === 200 })
    })
  })
}
```

## Run Commands

```bash
# Basic run
k6 run script.js

# With env vars
k6 run -e API_TOKEN=xxx -e BASE_URL=https://api-sit.example.com script.js

# With output to file
k6 run --out json=results.json script.js

# Override options from CLI
k6 run --vus 50 --duration 60s script.js
```

## Folder Structure

```
tests/performance/
├── scenarios/
│   ├── flight-search.js
│   ├── booking-flow.js
│   └── spike-test.js
├── data/
│   └── users.csv
├── lib/
│   └── helpers.js      ← shared auth, checks
└── thresholds.js       ← shared threshold config
```

## Test Types Quick Reference

| Type | Pattern | Purpose |
|------|---------|---------|
| Smoke | 1-2 VUs, 1min | Verify script works |
| Load | Normal traffic, 30min | Baseline performance |
| Stress | 2-3x normal, ramp up | Find breaking point |
| Spike | Sudden 10x burst | Resilience check |
| Soak | Normal traffic, 4-8h | Memory leaks, degradation |
