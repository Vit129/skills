# iOS Native (Swift)

Guidelines for building native iOS applications with Swift and SwiftUI.

## Architecture
- MVVM as default pattern
- SwiftUI for new projects, UIKit for legacy
- Combine or async/await for reactive data flow
- Clean Architecture layers: presentation → domain → data

## Folder Structure
```
App/
├── Features/           — feature-based modules
│   └── Auth/
│       ├── Views/      — SwiftUI views
│       ├── ViewModels/ — ObservableObject classes
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
- `@State` for local state, `@StateObject` for owned ViewModels
- `@ObservedObject` for passed ViewModels, `@EnvironmentObject` for shared
- Use `@Published` properties in ViewModels
- Preview with `#Preview` macro (Swift 5.9+)

## Networking
- URLSession + async/await for simple cases
- Alamofire for complex networking needs
- Codable for JSON parsing — use `CodingKeys` for field mapping
- Create a base API client with error handling and auth token injection

## Data Persistence
- SwiftData (iOS 17+) or CoreData for structured data
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

## Tips
- Swift first — no Objective-C for new code
- Use `enum` for finite states: `.loading`, `.success(data)`, `.error(message)`
- Handle optionals safely: `guard let`, `if let`, `??` — avoid force unwrap `!`
- Use `Result<Success, Failure>` for error handling in callbacks
- Localize all user-facing strings from day one
