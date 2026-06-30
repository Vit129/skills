# API Documentation

## What to Document

```markdown
## POST /api/users

Create a new user account.

### Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Must be unique |
| name | string | yes | 1-200 chars |
| role | enum | no | "user" (default) or "admin" |

### Response (201)
{ "id": "uuid", "email": "...", "name": "...", "createdAt": "ISO8601" }

### Errors
| Code | When |
|------|------|
| 409 | Email already exists |
| 422 | Validation failed |

### Example
curl -X POST /api/users -d '{"email":"a@b.com","name":"Test"}'
```

## Rules

- Document every public endpoint
- Include request/response examples
- List all error codes and when they occur
- Keep in sync with code (automate if possible)
