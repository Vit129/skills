# C# / .NET Development Standards

> Patterns and best practices for C# and .NET backend development.
> Covers: ASP.NET Core, Entity Framework Core, Minimal APIs, Clean Architecture.

---

## Official .NET References

- .NET docs: https://learn.microsoft.com/en-us/dotnet/
- ASP.NET Core docs: https://learn.microsoft.com/en-us/aspnet/core/
- Minimal APIs: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis
- Entity Framework Core: https://learn.microsoft.com/en-us/ef/core/
- Dependency injection: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection
- Testing ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/test/

## Architecture Patterns

### Clean Architecture (Recommended)

```text
src/
├── Domain/              # Entities, Value Objects, Interfaces (no dependencies)
├── Application/         # Use Cases, DTOs, Validators (depends on Domain)
├── Infrastructure/      # EF Core, External Services (depends on Application)
└── WebAPI/              # Controllers, Middleware, DI Setup (depends on all)
```

### Key Principles
- **Dependency Inversion:** Domain/Application never reference Infrastructure
- **CQRS light:** Separate read models (queries) from write models (commands)
- **Mediator pattern:** Use MediatR for decoupling handlers from controllers
- **Cancellation:** Pass `CancellationToken` through async endpoint, service, and database calls
- **Contracts:** Use DTOs/request models instead of exposing EF entities directly

---

## ASP.NET Core Patterns

### Minimal API (Preferred for microservices)

```csharp
var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Endpoints
app.MapGet("/api/users/{id}", async (int id, IUserService service) =>
{
    var user = await service.GetByIdAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

app.MapPost("/api/users", async (CreateUserDto dto, IUserService service) =>
{
    var user = await service.CreateAsync(dto);
    return Results.Created($"/api/users/{user.Id}", user);
});

app.Run();
```

### Controller-Based (Preferred for large APIs)

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetUserQuery(id), ct);
        return result is not null ? Ok(result) : NotFound();
    }
}
```

---

## Entity Framework Core

### DbContext Configuration

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Entity Configuration (Fluent API)

```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasMany(u => u.Orders).WithOne(o => o.User).HasForeignKey(o => o.UserId);
    }
}
```

### Migrations

```bash
# Add migration
dotnet ef migrations add AddUserTable --project src/Infrastructure

# Update database
dotnet ef database update --project src/Infrastructure

# Generate SQL script (for production)
dotnet ef migrations script --idempotent --output migrations.sql
```

---

## Dependency Injection

```csharp
// Program.cs or Startup.cs
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();

// Lifetime rules:
// Scoped    → per HTTP request (DB contexts, repositories)
// Singleton → app lifetime (caches, config)
// Transient → new instance every time (stateless utilities)
```

---

## Validation (FluentValidation)

```csharp
public class CreateUserValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches("[A-Z]").WithMessage("Must contain uppercase")
            .Matches("[0-9]").WithMessage("Must contain digit");
    }
}
```

---

## Error Handling

### Global Exception Handler

```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        var response = exception switch
        {
            NotFoundException => new ProblemDetails
            {
                Status = 404, Title = "Not Found", Detail = exception.Message
            },
            ValidationException ve => new ProblemDetails
            {
                Status = 400, Title = "Validation Error",
                Extensions = { ["errors"] = ve.Errors }
            },
            _ => new ProblemDetails
            {
                Status = 500, Title = "Internal Server Error"
            }
        };
        context.Response.StatusCode = response.Status ?? 500;
        await context.Response.WriteAsJsonAsync(response);
    });
});
```

---

## Testing

### Unit Test (xUnit + Moq)

```csharp
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repoMock = new();
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _sut = new UserService(_repoMock.Object);
    }

    [Fact]
    public async Task GetById_WhenUserExists_ReturnsUser()
    {
        // Arrange
        var expected = new User { Id = 1, Email = "test@example.com" };
        _repoMock.Setup(r => r.GetByIdAsync(1, default)).ReturnsAsync(expected);

        // Act
        var result = await _sut.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test@example.com", result.Email);
    }
}
```

### Integration Test

```csharp
public class UsersEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public UsersEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace real DB with in-memory
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetUser_Returns404_WhenNotFound()
    {
        var response = await _client.GetAsync("/api/users/999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
```

---

## Performance

- Use `AsNoTracking()` for read-only queries
- Use `IQueryable` projections (`.Select()`) instead of loading full entities
- Use `CancellationToken` on all async methods
- Use `IMemoryCache` or Redis for frequently accessed data
- Use `IDbContextFactory` for background services (not scoped DbContext)

---

## Security

- Always use parameterized queries (EF Core does this by default)
- Use `[Authorize]` attribute on protected endpoints
- Validate all input with FluentValidation
- Use `IDataProtector` for encrypting sensitive data at rest
- Never log PII or secrets
- Use `HTTPS` only in production (`app.UseHsts()`)

---

## Project Templates

```bash
# Web API
dotnet new webapi -n MyApi --use-minimal-apis

# Class Library
dotnet new classlib -n MyDomain

# Solution
dotnet new sln -n MySolution
dotnet sln add src/MyApi src/MyDomain src/MyInfrastructure
```
