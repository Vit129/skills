# Jetpack Compose Reference

Use this reference for new Android UI, screen refactors, navigation, previews,
and Compose state decisions.

Official docs:

- State and Compose: https://developer.android.com/develop/ui/compose/state
- State hoisting: https://developer.android.com/develop/ui/compose/state-hoisting
- Navigation Compose: https://developer.android.com/develop/ui/compose/navigation
- Semantics: https://developer.android.com/jetpack/compose/semantics

## Composition Rules

- Keep composables small and focused.
- State flows down; events flow up.
- Keep composables side-effect light. Use `LaunchedEffect`, `DisposableEffect`,
  or `SideEffect` only for the matching lifecycle need.
- Use `remember` for local ephemeral state and `rememberSaveable` for state that
  should survive configuration changes.
- Use `derivedStateOf` only when derived calculation is expensive or changes
  more often than the UI needs.
- Use `LazyColumn`, `LazyRow`, or lazy grids for lists.

## State Hoisting

- Hoist state to the lowest common ancestor that reads and writes it.
- Hoist screen state to a `ViewModel` when business logic is involved.
- Keep animation and UI element state in composition when it depends on Compose
  frame clocks.
- Expose immutable state and event functions from state owners.

Example contract:

```kotlin
data class AccountUiState(
    val isLoading: Boolean = false,
    val accounts: List<Account> = emptyList(),
    val error: String? = null,
)
```

## Navigation

- Use Navigation Compose for new Compose apps.
- Keep route definitions centralized.
- Pass stable IDs or small route values; load full domain objects from the data
  layer after navigation.
- Keep deep link parsing and validation outside leaf composables.

## Preview Rules

- Add previews for meaningful components and screen content.
- Cover loading, success, empty, and error states when a screen owns those
  states.
- Use static fake data; do not call network, database, or DI containers in
  previews.
