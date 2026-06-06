# iOS Native (Swift)

Guidelines for building native iOS applications with Swift and SwiftUI.

## Architecture
- MVVM as default pattern
- SwiftUI for new projects, UIKit for legacy
- Observation with `@Observable` for iOS 17+ state models
- Combine only when the project already depends on it or older OS support
  requires it
- async/await for asynchronous data flow
- Clean Architecture layers: presentation → domain → data

## Folder Structure
```
App/
├── Features/           — feature-based modules
│   └── Auth/
│       ├── Views/      — SwiftUI views
│       ├── ViewModels/ — @Observable models or ObservableObject classes
│       └── Models/     — feature-specific models
├── Core/
│   ├── Network/        — API client, endpoints, interceptors
│   ├── Storage/        — CoreData, UserDefaults, Keychain
│   ├── DI/             — dependency container
│   └── Extensions/     — Swift extensions
├── Shared/
│   ├── Components/     — reusable UI components
│   ├── Modifiers/      — custom ViewModifiers
│   └── Utils/          — helpers, formatters
├── Resources/          — assets, localization, fonts
└── App.swift           — entry point (@main)
```

## SwiftUI
- Small, focused views — extract sub-views when >50 lines
- `@State` for local value state and owned `@Observable` models
- `@Bindable` when a child view needs bindings into an observable model
- `@StateObject` / `@ObservedObject` only for legacy `ObservableObject`
  compatibility
- Prefer value-driven `NavigationStack` and `navigationDestination`
- Preview with `#Preview` macro (Swift 5.9+)

## Swift Observation (iOS 17+)
```swift
// New @Observable macro replaces ObservableObject for iOS 17+ targets.
@Observable
@MainActor
class UserViewModel {
    var name = ""
    var isLoading = false

    func loadUser() async {
        isLoading = true
        // fetch...
        isLoading = false
    }
}

// In View — no @ObservedObject needed
struct UserView: View {
    @State private var vm = UserViewModel()
    var body: some View {
        Text(vm.name)
    }
}
```

## Networking
- URLSession + async/await for simple cases
- Alamofire for complex networking needs
- Codable for JSON parsing — use `CodingKeys` for field mapping
- Create a base API client with error handling and auth token injection

## Data Persistence
- SwiftData (iOS 17+) or CoreData for structured data
- SwiftData can also support local server-data cache and offline continuity
- Define freshness, invalidation, and conflict behavior before using SwiftData
  as cache
- Use SwiftData History when changes from widgets, app intents, or other
  processes must be tracked over time
- UserDefaults for small preferences only
- Keychain for sensitive data (tokens, passwords)

## Concurrency
- `async/await` for asynchronous operations
- `Task` for launching async work from synchronous context
- `@MainActor` for UI updates
- `actor` for thread-safe shared state

## Testing
- XCTest for unit and UI tests
- Mock protocols, not concrete classes
- Use `@testable import` for internal access
- Snapshot testing with `swift-snapshot-testing` for UI regression
- Add `.accessibilityIdentifier(...)` to interactive controls and critical
  dynamic content
- UI tests should prefer stable identifiers over visible text selectors

## Official Apple References

- SwiftUI: https://developer.apple.com/documentation/swiftui/
- Observation: https://developer.apple.com/documentation/Observation/Observable%28%29
- SwiftData: https://developer.apple.com/documentation/swiftdata
- NavigationStack: https://developer.apple.com/documentation/SwiftUI/NavigationStack
- Accessibility: https://developer.apple.com/documentation/accessibility/

## Cross-Platform Standards

- **Testability (accessibilityIdentifier):** `../shared/testability-standards.md`
- **UI States (Loading/Empty/Error):** `../shared/ui-states-standards.md`
- **Error Handling:** `../shared/error-handling-standards.md`
- **Environment Config:** `../shared/env-config-standards.md`
- **Logging:** `../shared/logging-standards.md`
- **Navigation & Deep Links:** `../shared/navigation-standards.md`

## Tips
- Swift first — no Objective-C for new code
- Use `enum` for finite states: `.loading`, `.success(data)`, `.error(message)`
- Handle optionals safely: `guard let`, `if let`, `??` — avoid force unwrap `!`
- Use `Result<Success, Failure>` for error handling in callbacks
- Localize all user-facing strings from day one
