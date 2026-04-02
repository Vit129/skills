# API Design

Guidelines for designing consistent, maintainable APIs.

## REST Conventions
- Resources as nouns: `/users`, `/orders`, `/products`
- HTTP methods: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove)
- Plural nouns: `/users/123` not `/user/123`
- Nested resources for relationships: `/users/123/orders`
- Query params for filtering/sorting: `?status=active&sort=-createdAt&limit=20`

## Versioning
- URL prefix: `/api/v1/users` (recommended for simplicity)
- Header: `Accept: application/vnd.api+json;version=1` (alternative)
- Never break existing clients — add new fields, don't remove old ones

## Response Format
```json
{
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 },
  "errors": null
}
```

## Error Handling
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "must not be empty" }
    ]
  }
}
```

Standard HTTP status codes:
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable
- 500 Internal Server Error

## GraphQL (when applicable)
- Use for complex, nested data requirements
- Queries for reads, Mutations for writes
- Pagination: cursor-based (recommended) or offset-based
- Error handling via `errors` array in response

## Tips
- Always validate input — never trust client data
- Use pagination for list endpoints — never return unbounded results
- Include `createdAt` and `updatedAt` on all resources
- Log request ID for traceability across services
- Rate limiting on public endpoints

## gRPC (when applicable)
- Use for service-to-service communication where performance matters
- Define contracts in `.proto` files — single source of truth
- Unary (request/response), Server streaming, Client streaming, Bidirectional streaming
- Use Protocol Buffers for serialization — smaller and faster than JSON
- Error handling via gRPC status codes: OK, NOT_FOUND, INVALID_ARGUMENT, INTERNAL
- Generate client/server code from `.proto` using `protoc` compiler
- Use gRPC-Gateway to expose REST endpoints alongside gRPC
