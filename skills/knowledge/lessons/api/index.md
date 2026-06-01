# API Lessons Index

Updated: 2026-04-27
Version: 7.0.0 (migrated from JSON)
Total: 16 lessons

## Popular Patterns

401, 404, 500, timeout, validation, fixture, duplicate, mock, parallel-leak

## Lessons

| ID | Category | Title | File | Confidence | Applied |
|----|----------|-------|------|------------|---------|
| LESSON-AUTH-001 | auth | 401 Unauthorized — Token Expired or Incorrect | apiLesAuth.md | 1.0 | 0 |
| LESSON-DATA-001 | data | 404 Not Found — Resource Missing or Wrong Endpoint | apiLesData.md | 1.0 | 0 |
| LESSON-DATA-002 | data | 400 Bad Request — Validation Error | apiLesData.md | 1.0 | 0 |
| LESSON-DATA-003 | data | JSON Parse Error — Response is Not JSON | apiLesData.md | 1.0 | 0 |
| LESSON-DATA-004 | data | Duplicate Data Error — Static Test Data Already Exists | apiLesData.md | 1.0 | 0 |
| LESSON-DATA-005 | data | Response Structure Mismatch — Data Wrapped in payload Object | apiLesData.md | 1.0 | 0 |
| LESSON-FILE-001 | file | Multipart Upload Error — Wrong MIME Type or File Path | apiLesFile.md | 1.0 | 0 |
| LESSON-MOCK-001 | mock_strategy | APIRequestContext Does Not Support route() Interception | apiLesMockStrategy.md | 1.0 | 0 |
| LESSON-MOCK-002 | mock_strategy | Module-Level Store Causes Parallel Test Data Leakage | apiLesMockStrategy.md | 1.0 | 0 |
| LESSON-MOCK-003 | mock_strategy | In-Memory Mock DB Pattern for Tests Without Real Database | apiLesMockStrategy.md | 1.0 | 0 |
| LESSON-NET-001 | network | 500 Internal Server Error — System Failure | apiLesNetwork.md | 1.0 | 0 |
| LESSON-NET-002 | network | Request Timeout — Progressive Debugging Strategy | apiLesNetwork.md | 1.0 | 0 |
| LESSON-NET-003 | network | CORS Error — Use APIRequestContext Instead of page.request | apiLesNetwork.md | 1.0 | 0 |
| LESSON-SETUP-001 | setup | Playwright request Fixture from beforeAll Cannot Be Reused | apiLesSetup.md | 1.0 | 0 |
| LESSON-VAL-001 | validation | Mock Database for Demo/POC Environments | apiLesValidation.md | 1.0 | 0 |
| LESSON-VAL-002 | validation | Environment vs Code Logic Error — Know When NOT to Heal | apiLesValidation.md | 1.0 | 0 |

## Edges (Related Lessons)

| From | Related To |
|------|-----------|
| LESSON-AUTH-001 | LESSON-SETUP-001, LESSON-VAL-002 |
| LESSON-DATA-001 | LESSON-DATA-002, LESSON-VAL-002 |
| LESSON-DATA-003 | LESSON-DATA-005, LESSON-NET-001 |
| LESSON-DATA-004 | LESSON-MOCK-003, LESSON-VAL-001 |
| LESSON-DATA-005 | LESSON-DATA-003, LESSON-DATA-001 |
| LESSON-FILE-001 | LESSON-DATA-004 |
| LESSON-MOCK-001 | LESSON-MOCK-002, LESSON-MOCK-003 |
| LESSON-NET-001 | LESSON-NET-002 |
| LESSON-NET-003 | LESSON-SETUP-001 |
| LESSON-SETUP-001 | LESSON-AUTH-001 |
| LESSON-VAL-001 | LESSON-VAL-002 |
| LESSON-VAL-002 | LESSON-VAL-001, LESSON-NET-001 |
