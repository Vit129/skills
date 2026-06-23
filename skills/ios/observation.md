# Swift Observation Reference

Use this reference for state models, view models, and migration between
`ObservableObject` and Observation.

Official docs:

- Observable protocol: https://developer.apple.com/documentation/observation/observable
- `@Observable` macro: https://developer.apple.com/documentation/Observation/Observable%28%29
- Migrating from `ObservableObject`: https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro
- SwiftUI model data: https://developer.apple.com/documentation/SwiftUI/Model-data

## Default Rule

Use `@Observable` for new iOS 17+ models. The protocol alone is not enough; the
macro adds the observation machinery and conformance.

```swift
@Observable
@MainActor
final class PortfolioViewModel {
    var state: ScreenState<[Position]> = .loading

    func load() async {
        state = .loading
        // Fetch, map, and assign state.
    }
}
```

## Property Wrapper Rules

- Owned observable model in a view: `@State private var model = Model()`.
- Binding into an observable model: `@Bindable var model: Model`.
- Plain value passed into child view: no wrapper.
- Shared framework or app context: `@Environment`.
- Older deployment targets or legacy Combine code: `ObservableObject`,
  `@StateObject`, `@ObservedObject`, and `@Published`.

## Migration Rules

- Replace `ObservableObject` + `@Published` with `@Observable` when the minimum
  OS supports Observation and the object is not required by Combine subscribers.
- Replace `@StateObject private var vm = ViewModel()` with
  `@State private var vm = ViewModel()` for owned `@Observable` models.
- Replace `@ObservedObject var vm` with a plain stored property or `@Bindable`
  only when child bindings are needed.
- Keep `ObservableObject` if the project must support iOS 16 or older.
- Do not mix `@Published` into an `@Observable` type unless the project has a
  specific Combine bridge and tests for it.

## Main Actor

- Mark models that mutate UI-visible state as `@MainActor`.
- Move expensive parsing, database work, or network mapping off the main actor
  before assigning final view state.
- Keep async model methods cancellation-aware.

## Review Checks

- Uses `@Observable` macro, not protocol conformance alone.
- Property wrappers match ownership and binding needs.
- UI-visible mutation is isolated to the main actor.
- Legacy `ObservableObject` remains only for compatibility or existing project
  contracts.
