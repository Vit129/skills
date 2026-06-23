# Kotlin Coroutines and Flow Reference

Use this reference for Android async work, ViewModel state, Flow collection, and
dispatcher decisions.

Official docs:

- `collectAsStateWithLifecycle`: https://developer.android.com/reference/kotlin/androidx/lifecycle/compose/collectAsStateWithLifecycle
- State hoisting with ViewModel: https://developer.android.com/develop/ui/compose/state-hoisting

## ViewModel State

- Expose immutable `StateFlow<UiState>` from ViewModels.
- Keep `MutableStateFlow` private.
- Use `viewModelScope` for ViewModel-owned work.
- Use `SharedFlow` or channels only for one-time events when the project already
  has a clear event convention.

Example:

```kotlin
private val _uiState = MutableStateFlow(AccountUiState(isLoading = true))
val uiState: StateFlow<AccountUiState> = _uiState.asStateFlow()
```

## Compose Collection

- Collect `StateFlow` in composables with `collectAsStateWithLifecycle()`.
- Do not use raw `collectAsState()` for lifecycle-bound Android screens unless
  the project has a specific reason.
- Keep minimum active lifecycle at the default unless the feature requires a
  different collection window.

## Dispatcher Rules

- Main thread: UI state assignment and fast orchestration.
- IO dispatcher: network, database, and filesystem work.
- Default dispatcher: CPU-heavy parsing or calculation.
- Never block the main thread.
- Make long-running work cancellation-aware.

## Error Handling

- Convert repository exceptions into domain or UI error models in the ViewModel
  or use case layer.
- Keep raw stack traces and server details out of rendered UI.
- Preserve enough diagnostics for logs without leaking secrets.
