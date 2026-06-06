# Modern C# and .NET Backend Reference

Use this reference for ASP.NET Core, Minimal APIs, controllers, EF Core,
dependency injection, validation, background services, testing, and deployment
readiness.

Read `csharp-dotnet.md` first for local architecture patterns, then apply this
file for current .NET runtime rules.

## Official Documentation Anchors

- .NET docs: https://learn.microsoft.com/en-us/dotnet/
- ASP.NET Core docs: https://learn.microsoft.com/en-us/aspnet/core/
- Minimal APIs: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis
- Create Minimal API tutorial: https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api
- Entity Framework Core docs: https://learn.microsoft.com/en-us/ef/core/
- Dependency injection: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection
- Testing ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/test/

## Runtime Rules

- Use the current LTS .NET runtime for production unless the project explicitly
  targets current.
- Use nullable reference types for new projects when possible.
- Keep API contracts explicit through DTOs, request models, and response models.
- Prefer `ProblemDetails` for standardized API errors.
- Pass `CancellationToken` through async request, service, and database calls.
- Validate options/config at startup.

## API Rules

- Minimal APIs are a good fit for small services and focused endpoints.
- Controllers are a good fit for larger APIs with richer conventions.
- Keep endpoint handlers thin; move business logic into services/use cases.
- Apply auth policies explicitly and mark public endpoints intentionally.
- Use endpoint filters, middleware, or validators for cross-cutting validation.

## EF Core Rules

- Create migrations for schema changes.
- Avoid lazy-loading surprises and N+1 queries.
- Use projections for read endpoints instead of loading full entity graphs.
- Keep DbContext scoped per request.
- Use idempotent migration scripts or the project's deployment migration flow for
  production.

## Testing

- Use unit tests for services, validators, and domain behavior.
- Use `WebApplicationFactory` or project integration fixtures for API tests.
- Replace external dependencies with fakes or test containers.
- Test auth, validation, error responses, and EF Core query behavior.

## Review Checklist

- Nullable and async/cancellation conventions are followed.
- Validation and auth are applied.
- Errors are standardized and user-safe.
- EF Core queries avoid N+1 and unnecessary entity loading.
- Tests cover route behavior and persistence boundaries.
