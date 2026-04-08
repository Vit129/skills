# UI States Standards — All Platforms

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Every screen/component that loads async data MUST handle all 4 states consistently so users always know what's happening and QA can test every state.

---

## The 4 Mandatory States

| State | When | User sees |
|---|---|---|
| **Loading** | Data is being fetched | Skeleton / spinner |
| **Success** | Data loaded successfully | Content |
| **Empty** | Request succeeded but no data | Empty state message + action |
| **Error** | Request failed | Error message + retry |

> ⚠️ Empty and Error are different states — never combine them.

---

## Test Identifier Requirements

Every state MUST have a testable element — see `testability-standards.md` for platform syntax:

| State | Required testId |
|---|---|
| Loading | `[feature]-loading` |
| Success | `[feature]-content` (or the content itself) |
| Empty | `[feature]-empty-state` |
| Error | `[feature]-error-state` |

Example: `flight-result-loading`, `flight-result-empty-state`, `flight-result-error-state`

---

## Platform Implementation

### React / Web

```tsx
// State model
type UiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string }

// Component
function FlightResultList() {
  const { state } = useFlightSearch()

  if (state.status === 'loading') return (
    <div data-testid="flight-result-loading">
      <SkeletonList />
    </div>
  )
  if (state.status === 'error') return (
    <div data-testid="flight-result-error-state">
      <p>{state.message}</p>
      <button data-testid="btn-retry-search" onClick={retry}>Try again</button>
    </div>
  )
  if (state.status === 'empty') return (
    <div data-testid="flight-result-empty-state">
      <p>No flights found. Try different dates.</p>
    </div>
  )
  return (
    <ul data-testid="flight-result-list">
      {state.data.map(f => <FlightItem key={f.id} flight={f} />)}
    </ul>
  )
}
```

---

### Flutter

```dart
// State model (using sealed class / Riverpod AsyncValue)
sealed class FlightState {}
class FlightLoading extends FlightState {}
class FlightSuccess extends FlightState { final List<Flight> data; }
class FlightEmpty extends FlightState {}
class FlightError extends FlightState { final String message; }

// Widget
Widget build(BuildContext context) {
  return switch (state) {
    FlightLoading() => Semantics(
        identifier: 'flight-result-loading',
        child: const SkeletonList(),
      ),
    FlightError(:final message) => Semantics(
        identifier: 'flight-result-error-state',
        child: ErrorView(message: message, onRetry: retry),
      ),
    FlightEmpty() => Semantics(
        identifier: 'flight-result-empty-state',
        child: const EmptyView(message: 'No flights found. Try different dates.'),
      ),
    FlightSuccess(:final data) => Semantics(
        identifier: 'flight-result-list',
        child: FlightList(flights: data),
      ),
  };
}
```

---

### Android (Kotlin)

```kotlin
// State model
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    object Empty : UiState<Nothing>()
    data class Error(val message: String) : UiState<Nothing>()
}

// Compose UI
@Composable
fun FlightResultScreen(state: UiState<List<Flight>>) {
    when (state) {
        is UiState.Loading -> Box(Modifier.testTag("flight-result-loading")) {
            SkeletonList()
        }
        is UiState.Error -> Column(Modifier.testTag("flight-result-error-state")) {
            Text(state.message)
            Button(
                onClick = { retry() },
                modifier = Modifier.testTag("btn-retry-search")
            ) { Text("Try again") }
        }
        is UiState.Empty -> Box(Modifier.testTag("flight-result-empty-state")) {
            Text("No flights found. Try different dates.")
        }
        is UiState.Success -> LazyColumn(Modifier.testTag("flight-result-list")) {
            items(state.data) { FlightItem(it) }
        }
    }
}
```

---

### iOS (Swift)

```swift
// State model
enum UiState<T> {
    case loading
    case success(T)
    case empty
    case error(String)
}

// SwiftUI View
var body: some View {
    switch viewModel.state {
    case .loading:
        SkeletonList()
            .accessibilityIdentifier("flight-result-loading")
    case .error(let message):
        ErrorView(message: message, onRetry: viewModel.retry)
            .accessibilityIdentifier("flight-result-error-state")
    case .empty:
        EmptyStateView(message: "No flights found. Try different dates.")
            .accessibilityIdentifier("flight-result-empty-state")
    case .success(let flights):
        FlightList(flights: flights)
            .accessibilityIdentifier("flight-result-list")
    }
}
```

---

## Rules

1. Every screen/component loading async data MUST implement all 4 states — no exceptions
2. Loading state MUST show skeleton or spinner — never a blank screen
3. Empty and Error states MUST be separate — different message, different testId
4. Error state MUST include a retry action where applicable
5. All 4 state containers MUST have test identifiers — see `testability-standards.md`
6. State model MUST use a typed sealed class / union type — no boolean flags like `isLoading`, `isError`
