# Android Native (Kotlin)

Guidelines for building native Android applications with Kotlin.

## Architecture
- MVVM (Model-View-ViewModel) as default pattern
- Use Android Architecture Components: ViewModel, LiveData/StateFlow, Room
- Single Activity + Fragments with Navigation Component
- Clean Architecture layers: presentation → domain → data

## Folder Structure
```
app/src/main/
├── java/com/example/app/
│   ├── data/           — repositories, data sources, API, DB
│   │   ├── local/      — Room database, DAOs, entities
│   │   ├── remote/     — Retrofit services, DTOs
│   │   └── repository/ — repository implementations
│   ├── domain/         — use cases, domain models, repository interfaces
│   ├── presentation/   — UI layer
│   │   ├── features/   — feature-based screens
│   │   └── common/     — shared UI components
│   ├── di/             — dependency injection (Hilt modules)
│   └── utils/          — extensions, helpers, constants
├── res/
│   ├── layout/         — XML layouts or Compose previews
│   ├── values/         — strings, colors, themes
│   └── navigation/     — nav graphs
└── AndroidManifest.xml
```

## Jetpack Compose (preferred for new projects)
- Composable functions: small, focused, reusable
- State hoisting: state up, events down
- Use `remember` and `rememberSaveable` for local state
- `collectAsStateWithLifecycle()` for Flow → Compose state
- Preview with `@Preview` annotation

## Networking
- Retrofit + OkHttp for REST APIs
- Kotlin Serialization or Moshi for JSON parsing
- Interceptors for auth token, logging, error handling

## Dependency Injection
- Hilt (recommended) — `@HiltAndroidApp`, `@AndroidEntryPoint`, `@Inject`
- Scope: `@Singleton` for app-wide, `@ViewModelScoped` for ViewModel

## Coroutines & Flow
- `viewModelScope.launch` for ViewModel coroutines
- `StateFlow` for UI state, `SharedFlow` for one-time events
- `Dispatchers.IO` for network/DB, `Dispatchers.Main` for UI
- Never block the main thread

## Testing
- Unit tests: JUnit + MockK for ViewModels and repositories
- UI tests: Espresso (XML) or Compose Testing (Compose)
- Use fake repositories for testing — avoid mocking everything

## Tips
- Kotlin first — no Java for new code
- Use `sealed class` for UI states: Loading, Success, Error
- Handle configuration changes via ViewModel (survives rotation)
- Use `BuildConfig` for environment-specific values
- ProGuard/R8 rules for release builds
