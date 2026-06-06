# Android Native (Kotlin)

Guidelines for building native Android applications with Kotlin + Jetpack Compose.

## Architecture
- MVVM (Model-View-ViewModel) as default pattern
- Use Android Architecture Components: ViewModel, StateFlow, Room
- Single Activity + Compose Navigation (no Fragments for new projects)
- Clean Architecture layers: presentation → domain → data
- Expose immutable screen state from ViewModels and collect it in Compose with
  `collectAsStateWithLifecycle()`

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
│   ├── values/         — strings, colors, themes
│   └── navigation/     — nav graphs (if using XML nav)
└── AndroidManifest.xml
```

## Jetpack Compose (2025 Best Practices)
- Composable functions: small, focused, reusable
- State hoisting: state up, events down
- Hoist state to the lowest common ancestor; use ViewModel when business logic
  owns the state
- Use `remember` and `rememberSaveable` for local state
- `collectAsStateWithLifecycle()` for Flow → Compose state (lifecycle-aware)
- Preview with `@Preview` annotation — use `@PreviewParameter` for data variants
- Use `LazyColumn` / `LazyRow` for lists — never `Column` with many items
- Avoid heavy work in `remember` — use `derivedStateOf` for derived state

```kotlin
// State hoisting pattern
@Composable
fun CounterScreen() {
    var count by rememberSaveable { mutableIntStateOf(0) }
    CounterContent(count = count, onIncrement = { count++ })
}

@Composable
fun CounterContent(count: Int, onIncrement: () -> Unit) {
    Column {
        Text("Count: $count")
        Button(onClick = onIncrement) { Text("Increment") }
    }
}
```

## Compose Navigation
- Prefer centralized route definitions and pass stable IDs or small route
  values, not large mutable domain objects.

```kotlin
// NavHost setup
NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable("detail/{id}") { backStackEntry ->
        DetailScreen(id = backStackEntry.arguments?.getString("id"))
    }
}
```

## Networking
- Retrofit + OkHttp for REST APIs
- Kotlin Serialization (`kotlinx.serialization`) for JSON — preferred over Gson/Moshi
- Interceptors for auth token, logging, error handling

## Dependency Injection
- Hilt (recommended) — `@HiltAndroidApp`, `@AndroidEntryPoint`, `@Inject`
- Scope: `@Singleton` for app-wide, `@ViewModelScoped` for ViewModel

## Coroutines & Flow
- `viewModelScope.launch` for ViewModel coroutines
- `StateFlow` for UI state, `SharedFlow` for one-time events
- `Dispatchers.IO` for network/DB, `Dispatchers.Main` for UI
- Never block the main thread

## UI State Pattern
```kotlin
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}

class ProductViewModel @Inject constructor(
    private val repo: ProductRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<UiState<List<Product>>>(UiState.Loading)
    val uiState: StateFlow<UiState<List<Product>>> = _uiState.asStateFlow()

    init { loadProducts() }

    private fun loadProducts() = viewModelScope.launch {
        _uiState.value = UiState.Loading
        _uiState.value = try {
            UiState.Success(repo.getProducts())
        } catch (e: Exception) {
            UiState.Error(e.message ?: "Unknown error")
        }
    }
}
```

## Testing
- Unit tests: JUnit + MockK for ViewModels and repositories
- UI tests: Compose Testing (`composeTestRule`)
- Use fake repositories for testing — avoid mocking everything
- Use semantics and `Modifier.testTag(...)` for critical dynamic UI targets
- Cover loading, success, empty, and error states

## Official Android References

- Compose state: https://developer.android.com/develop/ui/compose/state
- State hoisting: https://developer.android.com/develop/ui/compose/state-hoisting
- Lifecycle Flow collection: https://developer.android.com/reference/kotlin/androidx/lifecycle/compose/collectAsStateWithLifecycle
- Navigation Compose: https://developer.android.com/develop/ui/compose/navigation
- Compose semantics: https://developer.android.com/jetpack/compose/semantics

## Cross-Platform Standards

- **Testability (contentDescription / testTag):** `../shared/testability-standards.md`
- **UI States (Loading/Empty/Error):** `../shared/ui-states-standards.md`
- **Error Handling:** `../shared/error-handling-standards.md`
- **Environment Config:** `../shared/env-config-standards.md`
- **Logging:** `../shared/logging-standards.md`
- **Navigation & Deep Links:** `../shared/navigation-standards.md`

## Tips
- Kotlin first — no Java for new code
- Use `sealed class` for UI states: Loading, Success, Error
- Handle configuration changes via ViewModel (survives rotation)
- Use `BuildConfig` for environment-specific values
- ProGuard/R8 rules for release builds
- Use Compose BOM for consistent dependency versions
