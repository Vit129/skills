---
name: ios
description: >
  Use this reference when building, reviewing, or refactoring native iOS code
  with Swift, SwiftUI, SwiftData, Observation, async/await, Combine, XCTest,
  or Xcode project conventions.
version: 1.0.0
last_improved: 2026-06-06
improvement_count: 0
---

# iOS Swift and SwiftUI

Build native iOS features with Swift-first, SwiftUI-first implementation. Use
UIKit only for legacy surfaces, platform gaps, or wrappers around existing code.

## Load Order

Read these references before editing iOS code:

1. `ios-swift.md` for native iOS architecture and implementation patterns.
2. `swiftui.md` for SwiftUI structure, state, layout, navigation, and previews.
3. `observation.md` for `@Observable`, `@State`, `@Bindable`, and migration rules.
4. `swiftdata.md` when persistence, offline cache, or model history is involved.
5. `testing-accessibility.md` for accessibility and UI test identifiers.
6. `../shared/testability-standards.md` for cross-platform testability rules.
7. `../shared/ui-states-standards.md` for loading, success, empty, and error states.
8. `../shared/error-handling-standards.md` for user-safe errors.
9. `../shared/navigation-standards.md` when routing or deep links are involved.
10. `../shared/logging-standards.md` when adding diagnostics.
11. `../shared/env-config-standards.md` when touching configuration or secrets.

## Default Stack

- Language: Swift.
- UI: SwiftUI for new views.
- Architecture: MVVM by feature.
- State: Observation with `@Observable` on iOS 17+, `ObservableObject` only when
  supporting older deployment targets or existing code requires it.
- Concurrency: `async/await`, `Task`, `@MainActor`, and `actor`.
- Persistence: SwiftData on iOS 17+; Core Data for existing projects or broader
  OS support.
- Testing: XCTest for unit tests, XCUITest for flows, snapshot tests only when
  the project already uses a snapshot framework.

## Architecture Rules

- Keep features grouped by domain: `Features/<Feature>/Views`,
  `ViewModels`, `Models`, and `Services` or `Repositories`.
- Keep domain logic out of SwiftUI `View` bodies.
- View models own view state and user intents; repositories own data access.
- Depend on protocols at boundaries that need tests, previews, or substitution.
- Mark view models `@MainActor` when they mutate UI state.
- Use dependency injection through initializers, environment values, or a local
  container already used by the app.

## SwiftUI Rules

- Keep `body` small and readable; extract private computed views or subviews
  when a view grows past one screen.
- Prefer value-driven `NavigationStack` and `navigationDestination` for new
  navigation. Use `NavigationSplitView` for multi-column iPad/macOS layouts.
- Use `@State` for local value state.
- Use `@State private var model = Model()` for owned `@Observable` models.
- Use `@Bindable` when a child view needs bindings into an observable model.
- Use `@Environment` for platform-provided or app-wide context.
- Avoid force unwraps in view code.
- Avoid heavy work in `body`; compute derived data in the model or a cheap
  computed property.
- Provide `#Preview` with representative loading, success, empty, and error
  states when practical.

## UI State Contract

Every user-facing screen or reusable component must handle:

- Loading: visible progress or skeleton state.
- Success: primary content.
- Empty: clear state when data is valid but absent.
- Error: recoverable message and retry path when retry is possible.

Prefer an explicit state model:

```swift
enum ScreenState<Value> {
    case loading
    case success(Value)
    case empty
    case error(ErrorDisplay)
}

struct ErrorDisplay: Equatable {
    let title: String
    let message: String
}
```

## Testability

- Add `.accessibilityIdentifier(...)` to interactive controls, critical labels,
  dynamic rows, and state containers.
- Use stable identifiers, not localized text.
- Keep identifiers namespaced by feature, for example
  `portfolio.position-row.AAPL` or `login.submit-button`.
- Keep preview fixtures and test fakes near the feature unless the app already
  has shared fixture conventions.

## Error Handling

- Convert technical failures into user-safe display models before rendering.
- Do not expose raw server errors, tokens, URLs with secrets, or stack traces.
- Keep retry behavior explicit and testable.
- Use `do/catch` with typed domain errors where the boundary is stable.
- Log diagnostics only through the app logger or `os.Logger`, never ad hoc
  `print` in production code.

## Concurrency

- Use `Task { await model.load() }` from a view only to bridge UI lifecycle into
  async model work.
- Cancel long-running work when the view or task context goes away.
- Keep mutable shared state inside an `actor`.
- Use `@MainActor` for types that publish or mutate UI state.
- Do not block the main actor with synchronous network, disk, or expensive
  parsing work.

## Navigation

- Prefer typed routes or explicit enum destinations where the app structure
  allows it.
- Use `NavigationStack(path:)` when navigation state must be observed, restored,
  deep-linked, or tested.
- Use `[Route]` for homogeneous typed routes and `NavigationPath` only when a
  stack must contain heterogeneous destination values.
- Avoid `NavigationView` for new code.
- Keep deep link parsing outside SwiftUI views.
- Validate route parameters before navigation.
- Keep sheet, popover, and alert state separate from primary navigation state
  unless the app already has a router abstraction.

## Official Documentation Anchors

- SwiftUI: https://developer.apple.com/documentation/swiftui/
- Observation `@Observable`: https://developer.apple.com/documentation/Observation/Observable%28%29
- Migrating to Observation: https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro
- SwiftData: https://developer.apple.com/documentation/swiftdata
- NavigationStack: https://developer.apple.com/documentation/SwiftUI/NavigationStack
- NavigationPath: https://developer.apple.com/documentation/swiftui/navigationpath
- Accessibility: https://developer.apple.com/documentation/accessibility/
- SwiftUI accessibility modifiers: https://developer.apple.com/documentation/swiftui/view-accessibility

## Review Checklist

- SwiftUI view handles loading, success, empty, and error states.
- Navigation uses value-driven `NavigationStack` or the project's existing
  router abstraction.
- Interactive elements and critical dynamic content have
  `accessibilityIdentifier`.
- View state is explicit and testable.
- Async UI mutations happen on the main actor.
- No force unwraps, hidden fatal errors, or swallowed errors.
- No secrets in logs, previews, fixtures, or environment configuration.
- Existing project conventions for folders, DI, routing, and tests are followed.
- Build and tests are run with the project's real command, usually
  `xcodebuild` or the configured CI script.

## Verification Commands

Use the command already present in the repo or CI first. Typical fallbacks:

```bash
xcodebuild -scheme <Scheme> -destination 'platform=iOS Simulator,name=iPhone 15' build
xcodebuild -scheme <Scheme> -destination 'platform=iOS Simulator,name=iPhone 15' test
swift test
```

If the scheme, destination, or package layout is unknown, inspect the project
before choosing a command.
