# Database Performance

> ใช้เมื่อต้อง profile, optimize, หรือ load test ที่ระดับ database

## When to Use

- API response time สูงแต่ server CPU ไม่เต็ม → bottleneck อยู่ที่ DB
- K6 results แสดง `http_req_waiting` สูง (TTFB) → server รอ DB
- Soak test แสดง degradation ตามเวลา → possible lock contention หรือ table bloat

## Query Profiling Workflow

```
1. IDENTIFY  → หา slow queries (> 100ms)
2. EXPLAIN   → ดู execution plan
3. INDEX     → เพิ่ม/ปรับ index
4. VERIFY    → วัดอีกครั้ง ยืนยัน improvement
5. GUARD     → เพิ่ม query time threshold ใน monitoring
```

## Finding Slow Queries

### PostgreSQL

```sql
-- Enable slow query log
ALTER SYSTEM SET log_min_duration_statement = 100;  -- log queries > 100ms
SELECT pg_reload_conf();

-- Top 10 slowest queries (pg_stat_statements)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### MySQL

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.1;  -- 100ms

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;
```

### SQL Server

```sql
-- Top queries by avg elapsed time
SELECT TOP 10
  qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
  qs.execution_count,
  SUBSTRING(qt.text, 1, 200) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_elapsed_time DESC;
```

## EXPLAIN — Reading Execution Plans

### PostgreSQL

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM bookings WHERE user_id = 123 AND status = 'Active';

-- Look for:
-- Seq Scan → missing index (should be Index Scan)
-- Nested Loop with high rows → N+1 pattern
-- Sort with external merge → insufficient work_mem
-- Hash Join with high buckets → large join, consider partitioning
```

### Key indicators

| Pattern | Problem | Fix |
|---------|---------|-----|
| `Seq Scan` on large table | Missing index | Add index on filter columns |
| `Nested Loop` × 10,000 rows | N+1 query | JOIN or batch fetch |
| `Sort` with `external merge` | Insufficient memory | Increase `work_mem` or add index |
| `Hash Join` with spill to disk | Large join | Partition table or add covering index |
| `Index Scan` but still slow | Index exists but not selective | Check cardinality, consider composite index |

## Index Optimization

### When to Add Index

```sql
-- Rule: Add index when column is used in WHERE, JOIN, or ORDER BY
-- AND table has > 10,000 rows
-- AND query runs frequently (> 100 calls/min)

-- Single column
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- Composite (order matters — most selective first)
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);

-- Partial index (only index what you query)
CREATE INDEX idx_bookings_active ON bookings(user_id) WHERE status = 'Active';

-- Covering index (includes all needed columns — avoids table lookup)
CREATE INDEX idx_bookings_cover ON bookings(user_id, status) INCLUDE (created_at, total);
```

### When NOT to Add Index

- Table has < 1,000 rows (full scan is faster)
- Column has low cardinality (e.g., boolean, status with 3 values on small table)
- Write-heavy table where index maintenance cost > read benefit
- Already have 10+ indexes on the table (diminishing returns)

## Connection Pool Tuning

```
Symptom: Errors spike at high VUs in K6
         "too many connections" or connection timeout

Fix:
1. Check max_connections vs pool size
2. Pool size = (CPU cores × 2) + disk spindles (HikariCP formula)
3. Typical: 20-50 connections per service instance
4. Use PgBouncer/ProxySQL for connection multiplexing
```

| Setting | Default | Recommended |
|---------|---------|-------------|
| `max_connections` (PG) | 100 | 200-500 depending on services |
| Pool size per service | 10 | 20-50 |
| Connection timeout | 30s | 5s (fail fast) |
| Idle timeout | 600s | 300s |

## Lock Contention

```sql
-- PostgreSQL: Find blocking queries
SELECT
  blocked.pid AS blocked_pid,
  blocked_activity.query AS blocked_query,
  blocking.pid AS blocking_pid,
  blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked
JOIN pg_catalog.pg_locks blocking ON blocking.locktype = blocked.locktype
  AND blocking.database IS NOT DISTINCT FROM blocked.database
  AND blocking.relation IS NOT DISTINCT FROM blocked.relation
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking.pid
WHERE NOT blocked.granted;
```

**Common causes:**
- Long-running transactions holding row locks
- DDL operations (ALTER TABLE) blocking all queries
- Deadlocks from inconsistent lock ordering

**Fixes:**
- Keep transactions short (< 1s)
- Use `NOWAIT` or `SKIP LOCKED` for non-critical operations
- Add retry logic for deadlock errors

## K6 + Database Monitoring

```javascript
// In K6 script — tag requests to correlate with DB metrics
export default function () {
  const res = http.get('/api/bookings?user_id=123', {
    tags: { name: 'get_bookings', db_table: 'bookings' },
  })
  check(res, { 'status 200': (r) => r.status === 200 })
}
```

**During K6 run, monitor:**
- Active connections (should not hit max)
- Query execution time (should not spike)
- Lock wait time (should be near 0)
- Disk I/O (should not saturate)
- Cache hit ratio (should be > 95%)

## Decision Framework

| Observation | Root Cause | Action |
|-------------|-----------|--------|
| TTFB high, CPU low | Slow query | EXPLAIN → add index |
| TTFB spikes at high VUs | Connection pool exhausted | Increase pool or add PgBouncer |
| Gradual degradation in soak | Table bloat or memory leak | VACUUM, check for leaked connections |
| Random timeouts | Lock contention | Find blocking queries, shorten transactions |
| All queries slow | Insufficient memory | Increase shared_buffers / work_mem |
