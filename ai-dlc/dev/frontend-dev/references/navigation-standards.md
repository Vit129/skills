# Navigation & Deep Link Standards — All Platforms

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Consistent route naming, navigation patterns, and deep link structure across all platforms so the team shares the same mental model.

---

## Route Naming Convention

Use **kebab-case path segments**, hierarchical, and noun-based:

```
/[system]/[feature]
/[system]/[feature]/[id]
/[system]/[feature]/[id]/[sub-feature]
```

### Examples

```
/flights/search
/flights/results
/flights/booking/:bookingId
/flights/booking/:bookingId/confirmation

/jr-pass/compare
/jr-pass/purchase/:passType

/trip-planner
/trip-planner/:planId
/trip-planner/:planId/tickets
```

### Rules
- Use kebab-case — no camelCase, no underscores
- Use nouns — not verbs (`/flights/search` not `/searchFlights`)
- Dynamic segments use `:paramName` convention
- Keep hierarchy max 3 levels deep

---

## Deep Link Scheme

```
[app-scheme]://[system]/[feature]/[id]
```

Example:
```
japantravel://flights/booking/BK-2026-001
japantravel://jr-pass/purchase/SEVEN_DAY
japantravel://trip-planner/PLAN-001
```

---

## Platform Implementation

### React / Web (React Router / TanStack Router)

```typescript
// routes.ts — single source of truth
export const ROUTES = {
  flightSearch:       '/flights/search',
  flightResults:      '/flights/results',
  flightBooking:      (id: string) => `/flights/booking/${id}`,
  flightConfirmation: (id: string) => `/flights/booking/${id}/confirmation`,
  jrPassCompare:      '/jr-pass/compare',
  jrPassPurchase:     (type: string) => `/jr-pass/purchase/${type}`,
  tripPlanner:        '/trip-planner',
  tripPlanDetail:     (id: string) => `/trip-planner/${id}`,
} as const

// Usage — never hardcode paths in components
navigate(ROUTES.flightBooking('BK-2026-001'))
```

---

### Flutter (go_router)

```dart
// routes.dart — single source of truth
abstract class AppRoutes {
  static const flightSearch       = '/flights/search';
  static const flightResults      = '/flights/results';
  static const flightBooking      = '/flights/booking/:bookingId';
  static const jrPassCompare      = '/jr-pass/compare';
  static const tripPlanner        = '/trip-planner';
  static const tripPlanDetail     = '/trip-planner/:planId';

  static String flightBookingPath(String id) => '/flights/booking/$id';
  static String tripPlanDetailPath(String id) => '/trip-planner/$id';
}

// router.dart
final router = GoRouter(
  routes: [
    GoRoute(path: AppRoutes.flightSearch, builder: (_, __) => const FlightSearchScreen()),
    GoRoute(
      path: AppRoutes.flightBooking,
      builder: (_, state) => FlightBookingScreen(bookingId: state.pathParameters['bookingId']!),
    ),
  ],
)

// Usage
context.go(AppRoutes.flightBookingPath('BK-2026-001'));
```

---

### Android (Kotlin — Navigation Component)

```kotlin
// NavDestinations.kt — single source of truth
object NavDestinations {
    const val FLIGHT_SEARCH       = "flights/search"
    const val FLIGHT_RESULTS      = "flights/results"
    const val FLIGHT_BOOKING      = "flights/booking/{bookingId}"
    const val JR_PASS_COMPARE     = "jr-pass/compare"
    const val TRIP_PLANNER        = "trip-planner"
    const val TRIP_PLAN_DETAIL    = "trip-planner/{planId}"

    fun flightBooking(id: String) = "flights/booking/$id"
    fun tripPlanDetail(id: String) = "trip-planner/$id"
}

// Deep link in AndroidManifest.xml
// <data android:scheme="japantravel" android:host="flights" android:pathPrefix="/booking" />

// Usage
navController.navigate(NavDestinations.flightBooking("BK-2026-001"))
```

---

### iOS (Swift — NavigationStack / Coordinator)

```swift
// AppRoutes.swift — single source of truth
enum AppRoute: Hashable {
    case flightSearch
    case flightResults
    case flightBooking(bookingId: String)
    case jrPassCompare
    case tripPlanner
    case tripPlanDetail(planId: String)
}

// NavigationCoordinator.swift
class NavigationCoordinator: ObservableObject {
    @Published var path = NavigationPath()

    func navigate(to route: AppRoute) {
        path.append(route)
    }
    func pop() { path.removeLast() }
    func popToRoot() { path.removeLast(path.count) }
}

// Deep link handler
func handleDeepLink(_ url: URL) {
    // japantravel://flights/booking/BK-2026-001
    guard url.scheme == "japantravel" else { return }
    switch url.host {
    case "flights":
        let id = url.pathComponents.last ?? ""
        coordinator.navigate(to: .flightBooking(bookingId: id))
    default: break
    }
}
```

---

## Rules

1. Route paths MUST be defined in a single constants file per platform — never hardcoded inline
2. Route naming MUST follow kebab-case and noun-based convention
3. Dynamic segments MUST use `:paramName` pattern consistently across all platforms
4. Deep link scheme MUST be agreed upon before implementation and consistent across Android and iOS
5. Navigation MUST go through the coordinator/router — never direct view instantiation across features
