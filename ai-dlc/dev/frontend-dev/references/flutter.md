# Flutter Standards

Guidelines for building Flutter applications.

## Widget Design
- Prefer `StatelessWidget` unless state is needed
- Keep `build()` methods small — extract sub-widgets as private methods or separate classes
- One widget per file for public widgets, private helpers can stay in same file
- Use `const` constructors wherever possible for performance

## State Management
- Local state: `setState` for simple widget-level state
- App state: Provider (simple), Riverpod (recommended), Bloc (complex)
- Avoid global state — scope state to the smallest widget tree possible

## Folder Structure
```
lib/
├── core/           — shared utilities, constants, theme
├── features/       — feature-based modules
│   └── auth/
│       ├── data/       — repositories, data sources, models
│       ├── domain/     — entities, use cases (if clean arch)
│       └── presentation/ — screens, widgets, controllers
├── shared/         — shared widgets, extensions
└── main.dart
```

## Naming
- Files: snake_case (`user_card.dart`)
- Classes: PascalCase (`UserCard`)
- Variables/functions: camelCase (`getUserName()`)
- Constants: camelCase or SCREAMING_SNAKE_CASE (`maxRetry` or `MAX_RETRY`)
- Folders: snake_case (`user_management/`)

## Navigation
- Use `go_router` for declarative routing
- Named routes for deep linking support
- Pass data via route parameters, not constructor args across routes

## Networking
- Use `dio` or `http` package
- Create a base API client with interceptors (auth token, error handling, logging)
- Models with `fromJson` / `toJson` — use `json_serializable` or `freezed` for code gen

## Performance
- Use `const` widgets to avoid unnecessary rebuilds
- `ListView.builder` for long lists — never `ListView(children: [...])` with many items
- Cache images with `cached_network_image`
- Profile with Flutter DevTools — don't guess

## Testing
- Unit tests for business logic and repositories
- Widget tests for UI components
- Integration tests for critical user flows
- Use `mocktail` or `mockito` for mocking

## Cross-Platform Standards

These topics apply to all platforms — see dedicated files for full details:

- **Testability (Semantics / Key):** `testability-standards.md`
- **UI States (Loading/Empty/Error):** `ui-states-standards.md`
- **Error Handling:** `error-handling-standards.md`
- **Environment Config:** `env-config-standards.md`
- **Logging:** `logging-standards.md`
- **Navigation & Deep Links:** `navigation-standards.md`

## Tips
- Follow effective Dart style guide
- Use `flutter analyze` before every commit
- Prefer `final` over `var` — immutability by default
- Use extensions for reusable utility methods on existing types
