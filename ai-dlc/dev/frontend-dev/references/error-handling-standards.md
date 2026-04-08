# Error Handling Standards — All Platforms

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Ensure errors are caught, logged, and presented to users consistently across all platforms.

---

## Error Categories

| Category | Description | Example |
|---|---|---|
| Network Error | API unreachable, timeout, 5xx | Server down, no internet |
| Business Error | API returns 4xx with error code | Invalid input, not found, unauthorized |
| Unexpected Error | Unhandled exception, null crash | NullPointerException, JS runtime error |
| Validation Error | Client-side form validation | Required field empty, invalid format |

---

## Response Convention (All Platforms)

Every error must be handled with these 3 actions:

1. **Log** — record error with context (endpoint, user action, error code)
2. **Display** — show user-friendly message (never raw stack trace)
3. **Recover** — provide a clear next action (retry, go back, contact support)

---

## Platform Implementation

### React / Web

```tsx
// Global boundary for unexpected errors
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('Unexpected error', { error, info })
  }
  render() {
    if (this.state.hasError) return <ErrorScreen onRetry={this.reset} />
    return this.props.children
  }
}

// API error handling
async function fetchFlights(params: SearchParams) {
  try {
    const res = await api.get('/flights', { params })
    return res.data
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 404) throw new NotFoundError('No flights found')
      if (err.response?.status >= 500) throw new ServerError('Service unavailable')
    }
    throw new UnexpectedError('Something went wrong')
  }
}
```

---

### Flutter

```dart
// Global error handler
void main() {
  FlutterError.onError = (details) {
    logger.error('Flutter error', details.exception, details.stack);
  };
  runApp(const MyApp());
}

// API error handling
Future<List<Flight>> fetchFlights(SearchParams params) async {
  try {
    final res = await dio.get('/flights', queryParameters: params.toJson());
    return (res.data as List).map(Flight.fromJson).toList();
  } on DioException catch (e) {
    if (e.response?.statusCode == 404) throw NotFoundException('No flights found');
    if ((e.response?.statusCode ?? 0) >= 500) throw ServerException('Service unavailable');
    throw UnexpectedException('Something went wrong');
  }
}
```

---

### Android (Kotlin)

```kotlin
// Global handler
Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
    logger.error("Uncaught exception", throwable)
}

// ViewModel error handling
fun searchFlights(params: SearchParams) {
    viewModelScope.launch {
        _uiState.value = UiState.Loading
        runCatching { flightRepository.search(params) }
            .onSuccess { _uiState.value = UiState.Success(it) }
            .onFailure { e ->
                logger.error("Search failed", e)
                _uiState.value = when (e) {
                    is NotFoundException -> UiState.Error("No flights found")
                    is ServerException   -> UiState.Error("Service unavailable")
                    else                 -> UiState.Error("Something went wrong")
                }
            }
    }
}
```

---

### iOS (Swift)

```swift
// Global handler
NSSetUncaughtExceptionHandler { exception in
    Logger.error("Uncaught exception: \(exception)")
}

// ViewModel error handling
func searchFlights(params: SearchParams) async {
    state = .loading
    do {
        let flights = try await flightService.search(params)
        state = .success(flights)
    } catch let error as APIError {
        Logger.error("Search failed", error)
        switch error {
        case .notFound:      state = .error("No flights found")
        case .serverError:   state = .error("Service unavailable")
        default:             state = .error("Something went wrong")
        }
    }
}
```

---

## Error Message Rules

- Never show raw error messages, stack traces, or technical codes to users
- Use friendly, actionable language: "No flights found. Try different dates."
- Provide retry action for network/server errors
- Log the original error internally with full context

## Rules

1. Every API call MUST have error handling — no silent failures
2. Unexpected errors MUST be caught at the global level
3. Error messages shown to users MUST be defined in a constants/strings file — not hardcoded inline
4. Sensitive data (tokens, passwords, PII) MUST NOT appear in logs
5. Error states MUST have a `data-testid` / `accessibilityIdentifier` so QA can assert on them — see `testability-standards.md`
