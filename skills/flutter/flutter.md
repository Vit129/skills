# Flutter Standards

Guidelines for building Flutter applications.

## Official Flutter References

- Flutter docs: https://docs.flutter.dev/
- State management: https://docs.flutter.dev/data-and-backend/state-mgmt/intro
- Navigation: https://docs.flutter.dev/ui/navigation
- Testing: https://docs.flutter.dev/testing
- Accessibility: https://docs.flutter.dev/ui/accessibility
- DevTools: https://docs.flutter.dev/tools/devtools

## Widget Design
- Prefer `StatelessWidget` unless state is needed
- Keep `build()` methods small — extract sub-widgets as private methods or separate classes
- One widget per file for public widgets, private helpers can stay in same file
- Use `const` constructors wherever possible for performance

## State Management
- Local state: `setState` for simple widget-level state
- App state: Provider (simple), Riverpod (recommended), Bloc (complex)
- Avoid global state — scope state to the smallest widget tree possible
- Keep networking and persistence out of widgets; use repositories/services
- Model loading, success, empty, and error states explicitly

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
- Add stable `Key` values or semantics for critical dynamic UI targets
- Use Flutter accessibility guideline tests for meaningful accessibility risk

## Cross-Platform Standards

- **Testability (Semantics / Key):** `../shared/testability-standards.md`
- **UI States (Loading/Empty/Error):** `../shared/ui-states-standards.md`
- **Error Handling:** `../shared/error-handling-standards.md`
- **Environment Config:** `../shared/env-config-standards.md`
- **Logging:** `../shared/logging-standards.md`
- **Navigation & Deep Links:** `../shared/navigation-standards.md`

## Tips
- Follow effective Dart style guide
- Use `flutter analyze` before every commit
- Prefer `final` over `var` — immutability by default
- Use extensions for reusable utility methods on existing types
